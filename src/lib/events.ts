// SDK سبک ایونت‌تراکینگ سمت کلاینت — به سرویس مستقل events-backend می‌فرستد (نه back-end اصلی).
// بدون کتابخانه‌ی خارجی. هیچ‌وقت نباید اپ اصلی را به‌خاطر خطای analytics بشکند (fail-silent).

const ANONYMOUS_ID_KEY = 'nivo:events:anonymousId'
const SESSION_KEY = 'nivo:events:session'
const UTM_KEY = 'nivo:events:utm'
const SESSION_TIMEOUT_MS = 30 * 60_000
const FLUSH_INTERVAL_MS = 5000
const MAX_BATCH_SIZE = 20
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

interface EventsConfig {
  writeKey: string
  endpoint: string
}

interface QueuedEvent {
  eventName: string
  anonymousId: string
  userId?: string
  sessionId: string
  ts: string
  url?: string
  referrer?: string
  properties?: Record<string, unknown>
}

let config: EventsConfig | null = null
let currentUserId: string | undefined
let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null

function getAnonymousId(): string {
  let id = localStorage.getItem(ANONYMOUS_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(ANONYMOUS_ID_KEY, id)
  }
  return id
}

function getSessionId(): string {
  const now = Date.now()
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    const parsed = raw ? (JSON.parse(raw) as { id: string; lastActivity: number }) : null
    if (parsed && now - parsed.lastActivity < SESSION_TIMEOUT_MS) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: parsed.id, lastActivity: now }))
      return parsed.id
    }
  } catch {
    // localStorage خراب/غیرقابل‌پارس — یک سشن جدید می‌سازیم
  }
  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id, lastActivity: now }))
  return id
}

// first-touch attribution: فقط بار اول که utm_* توی URL باشد ذخیره می‌شود و دیگر
// override نمی‌شود — تا «کدوم کمپین این کاربر رو آورده» پایدار بماند، نه آخرین لینکی
// که باز کرده. روی هر ایونتی (نه فقط page_view اول) attach می‌شود تا فیلتر فانل بر اساس
// کمپین روی هر مرحله‌ای کار کند (events-backend فیلتر عمومی properties->>key را از قبل دارد)
function captureUtm() {
  try {
    if (localStorage.getItem(UTM_KEY)) return
    const params = new URLSearchParams(location.search)
    const utm: Record<string, string> = {}
    for (const key of UTM_PARAMS) {
      const value = params.get(key)
      if (value) utm[key] = value
    }
    if (Object.keys(utm).length > 0) {
      localStorage.setItem(UTM_KEY, JSON.stringify(utm))
    }
  } catch {
    // fail-silent
  }
}

function getUtm(): Record<string, string> {
  try {
    const raw = localStorage.getItem(UTM_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function enqueue(event: QueuedEvent) {
  queue.push(event)
  if (queue.length >= MAX_BATCH_SIZE) flush()
}

function flush(useBeacon = false) {
  if (!config || queue.length === 0) return
  const events = queue
  queue = []

  const body = JSON.stringify({ writeKey: config.writeKey, events })

  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(config.endpoint, new Blob([body], { type: 'application/json' }))
      return
    }
    void fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // ارسال ایونت هیچ‌وقت نباید اپ اصلی را بشکند
  }
}

export function initEvents(cfg: EventsConfig) {
  config = cfg
  captureUtm()

  if (flushTimer) clearInterval(flushTimer)
  flushTimer = setInterval(() => flush(), FLUSH_INTERVAL_MS)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })
  window.addEventListener('pagehide', () => flush(true))

  document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement | null
    if (!el) return

    const tracked = el.closest('[data-track]')
    if (tracked instanceof HTMLElement) {
      // هر data-track-x دیگر روی همان عنصر هم به‌عنوان property اضافه می‌شود
      // (مثلاً data-track-plan="pro" -> { plan: "pro" })، برای CTAهای لندینگ که
      // بدون هندلر جدا فقط با attribute نصب می‌شوند
      const extra: Record<string, string> = {}
      for (const [key, value] of Object.entries(tracked.dataset)) {
        if (key === 'track' || !key.startsWith('track')) continue
        const propName = key.slice('track'.length)
        extra[propName.charAt(0).toLowerCase() + propName.slice(1)] = value ?? ''
      }
      track(tracked.dataset.track!, { label: tracked.textContent?.trim()?.slice(0, 100), ...extra })
      return
    }

    // safety-net عمومی: هر عنصر تعاملی دیگر (بدون data-track اختصاصی) هم با یک ایونت عمومی
    // "ui_click" ثبت می‌شود — تا کل مسیر کلیک‌های کاربر پوشش داده شود، نه فقط اکشن‌های
    // بیزنسی که صریحاً track() برایشان صدا زده شده. به div/span بی‌نقش گسترش داده نمی‌شود
    // تا نویز/حجم بی‌مورد تولید نشود
    const interactive = el.closest('button, a, [role="button"], input[type="submit"], input[type="button"], summary')
    if (interactive instanceof HTMLElement) {
      track('ui_click', {
        tag: interactive.tagName.toLowerCase(),
        label: interactive.textContent?.trim()?.slice(0, 100),
        href: interactive instanceof HTMLAnchorElement ? interactive.href : undefined,
        id: interactive.id || undefined,
        className: interactive.className ? String(interactive.className).slice(0, 100) : undefined,
      })
    }
  })
}

export function track(eventName: string, properties?: Record<string, unknown>) {
  if (!config) return
  try {
    enqueue({
      eventName,
      anonymousId: getAnonymousId(),
      userId: currentUserId,
      sessionId: getSessionId(),
      ts: new Date().toISOString(),
      url: location.href,
      referrer: document.referrer || undefined,
      properties: { ...getUtm(), ...properties },
    })
  } catch {
    // fail-silent
  }
}

export function pageView() {
  track('page_view')
}

// شناسه‌ی anonymous را به userId واقعی وصل می‌کند (بعد از لاگین) تا فعالیت قبل/بعد از لاگین
// در journey/funnel یک actor واحد دیده شود — سمت سرور با eventName رزرو‌شده‌ی "$identify" پردازش می‌شود
export function identify(userId: string) {
  currentUserId = userId
  track('$identify')
}

export function resetIdentity() {
  currentUserId = undefined
}
