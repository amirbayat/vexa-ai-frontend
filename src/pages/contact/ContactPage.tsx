import { Link } from 'react-router-dom'

const ADDRESS = 'کوهک، بلوار علیمرادی، مجتمع رونیکا پالاس، بلوک D2'
const PHONE = '09032334441'

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4">
      <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-emerald-400">
      <path
        d="M12 21s7-6.1 7-11.5S16.4 3 12 3 5 5.6 5 9.5 12 21 12 21Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-emerald-400">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.9c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
    </svg>
  )
}

export function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#020C18] text-slate-100" dir="rtl">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-1 text-lg">
          <span className="text-emerald-400/70 font-bold">ni</span>
          <span className="font-bold">vo</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <BackIcon />
          بازگشت به صفحه اصلی
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-8 sm:pt-16">
        <h1 className="text-3xl font-bold text-slate-100 sm:text-4xl">تماس با ما</h1>
        <p className="mt-3 max-w-lg text-slate-500">
          برای هرگونه سوال، پیشنهاد یا مشکل، از طریق راه‌های زیر با تیم نیوو در ارتباط باشید.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
            <PinIcon />
            <h2 className="mt-4 text-sm font-medium text-slate-400">آدرس</h2>
            <p className="mt-1 leading-7 text-slate-100">{ADDRESS}</p>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
            <PhoneIcon />
            <h2 className="mt-4 text-sm font-medium text-slate-400">شماره تماس</h2>
            <a
              href={`tel:${PHONE}`}
              dir="ltr"
              className="mt-1 block text-left text-lg font-bold text-slate-100 hover:text-emerald-400 transition-colors"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
