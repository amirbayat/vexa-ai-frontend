import { useUsageToday } from '@/queries/usage.queries'
import { fa } from '@/locales/fa'

export function TokenUsageBar() {
  const { data } = useUsageToday()
  if (!data) return null

  const freePct = Math.min((data.freeUsed / Math.max(data.freeLimit, 1)) * 100, 100)
  const isLow = freePct >= 80

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{fa.usage.free}</span>
        <span className={`text-xs ${isLow ? 'text-amber-400' : 'text-slate-400'}`}>
          {data.freeUsed.toLocaleString('fa-IR')} / {data.freeLimit.toLocaleString('fa-IR')}
        </span>
      </div>
      <div className="h-1 rounded-full bg-slate-700/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-400' : 'bg-emerald-500'}`}
          style={{ width: `${freePct}%` }}
        />
      </div>
      {data.paidLimit > 0 && (
        <>
          <div className="flex items-center justify-between mt-1.5 mb-1">
            <span className="text-xs text-slate-500">{fa.usage.paid}</span>
            <span className="text-xs text-slate-400">
              {data.paidUsed.toLocaleString('fa-IR')} / {data.paidLimit.toLocaleString('fa-IR')}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${Math.min((data.paidUsed / data.paidLimit) * 100, 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}
