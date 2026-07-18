import { Link } from 'react-router-dom'

// docs/PRD-user-push-notifications-and-mobile-app-flows.md بخش ۵.۴ — لندینگ مینیمال مخصوص
// WebView اپ اندروید (تشخیص با NivoAndroidApp/1.0 در LandingPage.tsx). بدون بخش‌های مارکتینگ/SEO
// سنگین لندینگ دسکتاپ (مقایسه‌ی رقبا، آمار، FAQ و ...) — فقط hero + CTA لاگین + معرفی خیلی کوتاه،
// چون کاربر از Play Store آمده و اپ را نصب کرده، نه از موتور جست‌وجو
const FEATURES = [
  'دسترسی یک‌جا به ChatGPT، Claude، Gemini و Grok',
  'بدون نیاز به VPN یا کارت بانکی خارجی',
  'شروع رایگان، بدون نیاز به کارت بانکی',
]

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
          className="btn-cta-glow mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-7 py-4 text-base font-semibold text-white active:scale-95 transition-all"
        >
          {isLoggedIn ? 'رفتن به چت' : 'شروع رایگان'}
        </Link>
        {!isLoggedIn && (
          <Link to="/login" className="mt-4 text-sm text-slate-400 underline underline-offset-4">
            حساب دارم، وارد می‌شوم
          </Link>
        )}

        <ul className="mt-10 w-full max-w-xs space-y-3 text-right">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
              <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-5 shrink-0 text-emerald-400">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
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
