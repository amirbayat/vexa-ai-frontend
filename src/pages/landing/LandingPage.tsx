import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { usePlans } from '@/queries/plans.queries'
import { fa } from '@/locales/fa'

const features = [
  { title: fa.landing.feature1Title, desc: fa.landing.feature1Desc },
  { title: fa.landing.feature2Title, desc: fa.landing.feature2Desc },
  { title: fa.landing.feature3Title, desc: fa.landing.feature3Desc },
  { title: fa.landing.feature4Title, desc: fa.landing.feature4Desc },
]

const faqs = [
  { q: fa.landing.faq1Q, a: fa.landing.faq1A },
  { q: fa.landing.faq2Q, a: fa.landing.faq2A },
  { q: fa.landing.faq3Q, a: fa.landing.faq3A },
  { q: fa.landing.faq4Q, a: fa.landing.faq4A },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
      <Hero />
      <Features />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-slate-100 sm:text-5xl md:text-6xl">
          {fa.landing.heroTitle}
        </h1>
        <p className="mt-4 text-xl font-semibold text-emerald-400 sm:text-2xl">
          {fa.landing.heroSubtitle}
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          {fa.landing.heroDesc}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-xl bg-emerald-500 px-8 py-3 text-base font-medium text-white hover:bg-emerald-600 active:scale-95 transition-all"
          >
            {fa.landing.startFree}
          </Link>
          <a
            href="#pricing"
            className="rounded-xl border border-slate-600 px-8 py-3 text-base font-medium text-slate-300 hover:border-slate-500 hover:text-slate-100 transition-all"
          >
            {fa.landing.viewPlans}
          </a>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 transition-colors hover:border-slate-600"
            >
              <div className="mb-3 size-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <div className="size-4 rounded-full bg-emerald-500" />
              </div>
              <h3 className="font-semibold text-slate-100">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  const { data: plans, isLoading } = usePlans()

  return (
    <section id="pricing" className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-100">
          {fa.landing.pricingTitle}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="size-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans?.map(plan => {
              const isFree = plan.priceMonthly === 0
              return (
                <div
                  key={plan.id}
                  className="relative flex flex-col rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 transition-all hover:border-slate-600"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      {isFree ? (
                        <span className="text-3xl font-bold text-emerald-400">{fa.plans.free}</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-slate-100">
                            {(plan.priceMonthly / 10).toLocaleString('fa-IR')}
                          </span>
                          <span className="text-sm text-slate-500">{fa.plans.perMonth}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckIcon />
                      {fa.plans.dailyFree(plan.dailyFreeTokens)}
                    </li>
                    {plan.monthlyTotalTokens > 0 && (
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckIcon />
                        {fa.plans.monthly(plan.monthlyTotalTokens)}
                      </li>
                    )}
                  </ul>

                  <Link
                    to="/login"
                    className="block rounded-xl bg-emerald-500 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-600 active:scale-95 transition-all"
                  >
                    {isFree ? fa.landing.startFree : fa.plans.buy}
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-100">
          {fa.landing.faqTitle}
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-700/60 bg-slate-800/40 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-right text-sm font-medium text-slate-200 hover:text-slate-100 transition-colors"
              >
                <span>{faq.q}</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={clsx('size-4 shrink-0 text-slate-500 transition-transform', open === i && 'rotate-180')}
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {open === i && (
                <div className="border-t border-slate-700/40 px-5 pb-4 pt-3">
                  <p className="text-sm leading-relaxed text-slate-400">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-100">{fa.landing.ctaTitle}</h2>
        <p className="mt-2 text-slate-400">{fa.landing.ctaDesc}</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-emerald-500 px-8 py-3 text-base font-medium text-white hover:bg-emerald-600 active:scale-95 transition-all"
        >
          {fa.landing.startFree}
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 px-4 py-8 text-center">
      <p className="text-sm text-slate-600">{fa.landing.footer}</p>
    </footer>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-emerald-500">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
