import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useSettingsSubscription, useCancelSubscription } from '@/queries/settings.queries'
import { Button } from '@/components/ui/Button'
import { fa } from '@/locales/fa'

export function SubscriptionPage() {
  const { data: sub, isLoading } = useSettingsSubscription()
  const cancel = useCancelSubscription()
  const [confirming, setConfirming] = useState(false)
  const [cancelDone, setCancelDone] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-7 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 text-center">
        <p className="text-slate-400">{fa.settings.noSubYet}</p>
        <Link
          to="/pricing"
          className="mt-4 inline-block rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
        >
          {fa.settings.upgradePlan}
        </Link>
      </div>
    )
  }

  const isActive = sub.status === 'ACTIVE'

  function handleCancel() {
    cancel.mutate(undefined, {
      onSuccess: () => {
        setCancelDone(true)
        setConfirming(false)
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">{fa.settings.currentPlan}</p>
            <p className="mt-0.5 text-lg font-bold text-slate-100">{sub.plan.name}</p>
          </div>
          <span
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-medium',
              isActive
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-slate-700/60 text-slate-400',
            )}
          >
            {sub.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">توکن رایگان روزانه</p>
            <p className="mt-0.5 text-sm text-slate-200">
              {sub.plan.dailyFreeTokens.toLocaleString('fa-IR')}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">{fa.settings.periodEnd}</p>
            <p className="mt-0.5 text-sm text-slate-200">
              {new Date(sub.periodEnd).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>

        {sub.cancelAtPeriodEnd && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <p className="text-sm text-amber-400">{fa.settings.cancelAtEnd}</p>
          </div>
        )}

        {cancelDone && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <p className="text-sm text-emerald-400">{fa.settings.cancelDone}</p>
          </div>
        )}

        {isActive && !sub.cancelAtPeriodEnd && !cancelDone && (
          <div>
            {!confirming ? (
              <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
                {fa.settings.cancelSub}
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">{fa.settings.cancelConfirm}</p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    loading={cancel.isPending}
                    onClick={handleCancel}
                  >
                    {fa.common.confirm}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirming(false)}
                  >
                    {fa.common.cancel}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
