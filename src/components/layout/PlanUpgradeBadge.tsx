import { useNavigate } from 'react-router-dom'
import { useMe } from '@/queries/auth.queries'
import { fa } from '@/locales/fa'
import { track } from '@/lib/events'

export function PlanUpgradeBadge() {
  const navigate = useNavigate()
  const { data: me } = useMe()

  const planName = me?.subscription?.plan?.name ?? fa.plans.free
  const isFree = !me?.subscription || me.subscription.plan.priceMonthly === 0

  function goToPricing() {
    track('plan_upgrade_badge_clicked', { isFree })
    navigate('/pricing')
  }

  if (isFree) {
    return (
      <>
        <button onClick={goToPricing} className="nivo-shiny-upgrade">
          <span className="nivo-shiny-upgrade__inner">
            <span className="text-slate-300">{fa.plans.currentPlanLabel(planName)}</span>
            <span className="font-semibold text-emerald-300">{fa.plans.upgradeCta}</span>
          </span>
        </button>
        <style>{`
          .nivo-shiny-upgrade {
            position: relative;
            border-radius: 9999px;
            padding: 1.5px;
            background: linear-gradient(90deg, #10b981, #8b5cf6, #10b981);
            background-size: 200% 100%;
            animation: nivo-shine 3s linear infinite;
            cursor: pointer;
          }
          .nivo-shiny-upgrade__inner {
            display: flex;
            align-items: center;
            gap: 6px;
            border-radius: 9999px;
            background: #0f172a;
            padding: 5px 12px;
            font-size: 11px;
            white-space: nowrap;
          }
          @keyframes nivo-shine {
            to { background-position: -200% 0; }
          }
        `}</style>
      </>
    )
  }

  return (
    <button
      onClick={goToPricing}
      className="rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-500 hover:border-slate-600 hover:text-slate-300 transition-colors whitespace-nowrap"
    >
      {fa.plans.currentPlanLabel(planName)}
    </button>
  )
}
