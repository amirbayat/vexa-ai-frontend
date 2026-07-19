import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

// docs/PRD-user-push-notifications-and-mobile-app-flows.md بخش ۵.۴ — لندینگ مینیمال مخصوص
// WebView اپ اندروید (تشخیص با NivoAndroidApp/1.0 در LandingPage.tsx). بدون بخش‌های مارکتینگ/SEO
// سنگین لندینگ دسکتاپ (مقایسه‌ی رقبا، آمار، FAQ و ...) — فقط hero + CTA لاگین + کاروسل معرفی کوتاه،
// چون کاربر از Play Store آمده و اپ را نصب کرده، نه از موتور جست‌وجو

function IconModels() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7">
      <path d="M12 2.5l2.4 5.1 5.6.6-4.2 3.8 1.2 5.5-4.6-2.8-4.6 2.8 1.2-5.5-4.2-3.8 5.6-.6z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconNoVpn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7">
      <path d="M12 21s7-4 7-10V5l-7-2-7 2v6c0 6 7 10 7 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7">
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconGift() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7">
      <path d="M20 8H4v13h16V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M2 8h20v4H2zM12 8v13M12 8c-1.5-3-5-4-5-1.5S9 8 12 8zM12 8c1.5-3 5-4 5-1.5S15 8 12 8z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

const SLIDES = [
  {
    icon: <IconModels />,
    title: 'دسترسی یک‌جا به بهترین هوش مصنوعی‌ها',
    desc: 'ChatGPT، Claude، Gemini و Grok، همه در یک اپ و یک اشتراک',
  },
  {
    icon: <IconNoVpn />,
    title: 'بدون دردسر VPN یا کارت خارجی',
    desc: 'مستقیم از ایران، بدون نیاز به کارت بانکی خارجی',
  },
  {
    icon: <IconBolt />,
    title: 'پاسخ سریع، ۲۴ ساعته',
    desc: 'دستیار هوش مصنوعی فارسی، همیشه در دسترس',
  },
  {
    icon: <IconGift />,
    title: 'شروع رایگان',
    desc: 'بدون نیاز به کارت بانکی، همین الان امتحان کن',
  },
]

const AUTO_ADVANCE_MS = 3500
const RESUME_AFTER_INTERACTION_MS = 4000

function FeatureCarousel() {
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % SLIDES.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    const slide = track?.children[active] as HTMLElement | undefined
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [active])

  function pauseThenResume() {
    pausedRef.current = true
    clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false }, RESUME_AFTER_INTERACTION_MS)
  }

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    const idx = Math.round(Math.abs(track.scrollLeft) / track.clientWidth)
    setActive(Math.min(SLIDES.length - 1, Math.max(0, idx)))
  }

  return (
    <div className="mt-10 w-full max-w-xs">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={pauseThenResume}
        onPointerDown={pauseThenResume}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide) => (
          <div key={slide.title} className="w-full shrink-0 snap-center px-1.5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-6 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                {slide.icon}
              </div>
              <h3 className="mt-4 text-base font-bold text-white">{slide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`اسلاید ${i + 1}`}
            onClick={() => { pauseThenResume(); setActive(i) }}
            className={clsx(
              'h-1.5 rounded-full transition-all duration-300',
              i === active ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-700',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function MobileAppLandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#020C18] text-slate-100" dir="rtl">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-3xl font-extrabold tracking-tight text-white">
          <span className="text-emerald-400">ni</span>vo
        </div>
        <h1 className="mt-6 text-2xl font-extrabold leading-relaxed text-white">
          همه چیز با یه سوال شروع می‌شه
        </h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
          دستیار هوش مصنوعی فارسی نیوو — دسترسی آسون و یک‌جا به بهترین هوش مصنوعی‌های دنیا.
        </p>

        <Link
          to={isLoggedIn ? '/chat' : '/login'}
          data-track="mobile_landing_cta_click"
          data-track-variant="primary"
          className="btn-cta-glow mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-4 text-base font-semibold text-white active:scale-95 transition-all"
        >
          {isLoggedIn ? 'رفتن به چت' : 'شروع رایگان'}
        </Link>
        {!isLoggedIn && (
          <Link
            to="/login"
            data-track="mobile_landing_cta_click"
            data-track-variant="existing_account"
            className="mt-4 text-sm text-slate-400 underline underline-offset-4"
          >
            حساب دارم، وارد می‌شوم
          </Link>
        )}

        <FeatureCarousel />
      </div>

      <style>{`
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(16,185,129,0.35); }
          50%       { box-shadow: 0 0 35px rgba(16,185,129,0.65); }
        }
        .btn-cta-glow { animation: ctaGlow 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
