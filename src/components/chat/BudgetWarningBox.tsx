import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useBudgetStatus } from '@/queries/usage.queries'
import type { BudgetStatus } from '@/types/api'

const LEVEL_CONFIG = {
  none:          { bg: '', border: '', text: '', show: false },
  warning:       { bg: 'bg-amber-500/10',  border: 'border-amber-500/40',  text: 'text-amber-400',  show: true },
  critical:      { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400', show: true },
  session_limit: { bg: 'bg-red-500/10',    border: 'border-red-500/40',    text: 'text-red-400',    show: true },
  exceeded:      { bg: 'bg-red-600/15',    border: 'border-red-500/60',    text: 'text-red-300',    show: true },
} as const

function pct(spent: number, total: number) {
  if (!total) return 0
  return Math.min(100, Math.round((spent / total) * 100))
}

function ProgressBar({ value, level }: { value: number; level: BudgetStatus['warningLevel'] }) {
  const color = level === 'none' || level === 'warning'
    ? 'bg-amber-400'
    : level === 'critical' || level === 'session_limit'
    ? 'bg-orange-400'
    : 'bg-red-400'

  return (
    <div className="h-1.5 w-full rounded-full bg-slate-700/60 overflow-hidden">
      <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${value}%` }} />
    </div>
  )
}

export function BudgetWarningBox() {
  const [dismissed, setDismissed] = useState(false)
  const { data } = useBudgetStatus()

  if (!data || dismissed) return null

  const config = LEVEL_CONFIG[data.warningLevel]
  if (!config.show) return null

  const usedPct = pct(data.spentTodayRial, data.dailyBudgetRial)
  const spentToman = Math.round(data.spentTodayRial / 10).toLocaleString('fa-IR')
  const budgetToman = Math.round(data.dailyBudgetRial / 10).toLocaleString('fa-IR')
  const walletToman = Math.round(data.walletBalanceRial / 10).toLocaleString('fa-IR')

  const levelLabel = {
    warning:       'مصرف بالا',
    critical:      'نزدیک به محدودیت',
    session_limit: 'محدودیت فعال',
    exceeded:      'بودجه تمام شد',
  }[data.warningLevel] ?? ''

  return (
    <div
      className={clsx(
        'fixed bottom-6 left-6 z-50 w-72 rounded-2xl border p-4 shadow-xl backdrop-blur-sm',
        config.bg, config.border,
      )}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className={clsx('text-sm font-semibold', config.text)}>{levelLabel}</div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 text-lg leading-none -mt-0.5"
          aria-label="بستن"
        >
          ×
        </button>
      </div>

      {/* progress */}
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>مصرف امروز</span>
          <span dir="ltr">{spentToman} / {budgetToman} ت</span>
        </div>
        <ProgressBar value={usedPct} level={data.warningLevel} />
      </div>

      {/* wallet */}
      {data.walletBalanceRial > 0 && (
        <p className="mt-2 text-xs text-emerald-400">کیف پول: {walletToman} تومان</p>
      )}

      {/* cascade info */}
      {data.cascadeModel && (
        <p className="mt-1.5 text-xs text-slate-400">مدل فعلی: {data.cascadeModel}</p>
      )}

      {/* upsell message */}
      {data.upsellSuggestion && (
        <p className={clsx('mt-2 text-xs', config.text)}>{data.upsellSuggestion}</p>
      )}

      {/* actions */}
      <div className="mt-3 flex gap-2">
        <Link
          to="/settings/subscription"
          className="flex-1 rounded-xl bg-emerald-500 py-1.5 text-center text-xs font-medium text-white hover:bg-emerald-600 transition-colors"
        >
          ارتقاء پلن
        </Link>
        <Link
          to="/settings/profile"
          className="rounded-xl border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
        >
          پروفایل
        </Link>
      </div>
    </div>
  )
}
