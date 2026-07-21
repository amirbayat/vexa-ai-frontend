// مدیریت هویت «کاربر مهمان» (چت بدون ثبت‌نام) — سراسر روی localStorage، بدون کوکی/سرور.
// شناسه‌ی سشن یک‌بار ساخته می‌شود و تا لاگین موفق (که با clearAnonSession پاک می‌شود) باقی می‌ماند.

const SESSION_ID_KEY = 'anon_session_id'
const CONVERSATION_ID_KEY = 'anon_conversation_id'
const INITIALIZED_KEY = 'anon_session_initialized'

export function getAnonSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, id)
  }
  return id
}

// برخلاف getAnonSessionId، اگر سشنی وجود نداشته باشد یکی نمی‌سازد — برای جاهایی
// (مثل verify-otp) که فقط می‌خواهیم بدانیم آیا اصلاً سشن مهمانی وجود داشته یا نه
export function peekAnonSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY)
}

export function getAnonConversationId(): string | null {
  return localStorage.getItem(CONVERSATION_ID_KEY)
}

export function setAnonConversationId(id: string): void {
  localStorage.setItem(CONVERSATION_ID_KEY, id)
}

// POST /anon-chat/session (که UTM/referrer را ثبت می‌کند) فقط یک‌بار در طول عمر یک سشن
// مهمان باید صدا زده شود — این پرچم مانع فراخوانی مجدد آن در بازدیدهای بعدی همان سشن می‌شود
export function hasInitializedAnonSession(): boolean {
  return localStorage.getItem(INITIALIZED_KEY) === '1'
}

export function markAnonSessionInitialized(): void {
  localStorage.setItem(INITIALIZED_KEY, '1')
}

// بعد از لاگین موفق (migrate شدن مکالمه‌ی مهمان به حساب واقعی) صدا زده می‌شود تا اگر کاربر
// بعداً logout کرد، یک سشن مهمان کاملاً تازه شروع شود
export function clearAnonSession(): void {
  localStorage.removeItem(SESSION_ID_KEY)
  localStorage.removeItem(CONVERSATION_ID_KEY)
  localStorage.removeItem(INITIALIZED_KEY)
}
