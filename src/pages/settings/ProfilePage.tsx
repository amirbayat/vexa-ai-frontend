import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useMe } from '@/queries/auth.queries'
import { useUpdateProfile } from '@/queries/settings.queries'
import { useBudgetStatus } from '@/queries/usage.queries'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { fa } from '@/locales/fa'

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-700/40 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={clsx('text-sm font-medium', highlight ? 'text-emerald-400' : 'text-slate-200')}>{value}</span>
    </div>
  )
}

function BudgetBar({ spent, total }: { spent: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0
  const color = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-orange-400' : 'bg-emerald-400'
  return (
    <div className="mt-1 h-2 w-full rounded-full bg-slate-700/60 overflow-hidden">
      <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function ProfilePage() {
  const { data: me } = useMe()
  const update = useUpdateProfile()
  const { data: budget } = useBudgetStatus()
  const [name, setName] = useState(me?.name ?? '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (me?.name) setName(me.name)
  }, [me?.name])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    update.mutate(name, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      },
    })
  }

  const planName = me?.subscription?.plan.name ?? 'رایگان'
  const planPrice = me?.subscription?.plan.priceMonthly
    ? Math.round(me.subscription.plan.priceMonthly / 10).toLocaleString('fa-IR') + ' تومان/ماه'
    : 'رایگان'

  return (
    <div className="space-y-5">
      {/* profile form */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400">{fa.settings.phone}</label>
            <p className="mt-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-400" dir="ltr">
              {me?.phone ?? '—'}
            </p>
          </div>
          <Input
            label={fa.settings.name}
            placeholder={fa.settings.namePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" loading={update.isPending}>{fa.settings.saveProfile}</Button>
            {saved && <span className="text-sm text-emerald-400">{fa.settings.profileSaved}</span>}
            {update.isError && <span className="text-sm text-red-400">{fa.common.error}</span>}
          </div>
        </form>
      </div>

      {/* plan + upgrade */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">{fa.settings.currentPlan}</h3>
          <Link
            to="/pricing"
            className="rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors"
          >
            {fa.settings.upgradePlan}
          </Link>
        </div>
        <InfoRow label="نوع پلن" value={planName} highlight />
        <InfoRow label="قیمت" value={planPrice} />
        {me?.subscription?.periodEnd && (
          <InfoRow
            label={fa.settings.periodEnd}
            value={new Date(me.subscription.periodEnd).toLocaleDateString('fa-IR')}
          />
        )}
      </div>

      {/* budget status */}
      {budget && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">{fa.settings.budgetSection}</h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{fa.settings.spentToday}</span>
                <span dir="ltr">
                  {Math.round(budget.spentTodayRial / 10).toLocaleString('fa-IR')} / {Math.round(budget.dailyBudgetRial / 10).toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <BudgetBar spent={budget.spentTodayRial} total={budget.dailyBudgetRial} />
            </div>

            <InfoRow
              label={fa.settings.remaining}
              value={`${Math.round(budget.remainingTodayRial / 10).toLocaleString('fa-IR')} تومان`}
              highlight={budget.remainingTodayRial > 0}
            />

            {budget.walletBalanceRial > 0 && (
              <InfoRow
                label={fa.settings.walletBalance}
                value={`${Math.round(budget.walletBalanceRial / 10).toLocaleString('fa-IR')} تومان`}
                highlight
              />
            )}

            <InfoRow
              label={fa.settings.usdtRate}
              value={budget.usdtRial.toLocaleString('fa-IR')}
            />
          </div>

          {budget.warningLevel !== 'none' && budget.upsellSuggestion && (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p className="text-sm text-amber-300">{budget.upsellSuggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
