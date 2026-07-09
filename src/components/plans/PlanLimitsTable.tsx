import type { Plan } from '@/types/api'

function fmt(n: number): string {
  return n.toLocaleString('fa-IR')
}

interface Row {
  label: string
  render: (plan: Plan) => string
}

const ROWS: Row[] = [
  {
    label: 'قیمت ماهانه',
    render: p => (p.priceMonthly === 0 ? 'رایگان' : `${fmt(p.priceMonthly)} تومان`),
  },
  {
    label: 'توکن رایگان روزانه',
    render: p => (p.dailyFreeTokens > 0 ? fmt(p.dailyFreeTokens) : '—'),
  },
  {
    label: 'توکن ماهانه',
    render: p => (p.monthlyTotalTokens > 0 ? fmt(p.monthlyTotalTokens) : '—'),
  },
  {
    label: 'تعداد مدل‌های مجاز',
    render: p => `${p.allowedModels.length} مدل`,
  },
  {
    label: 'سقف پیام روزانه (عادی)',
    render: p => (p.dailyMessageLimit != null ? `${fmt(p.dailyMessageLimit)} پیام` : 'نامحدود'),
  },
  {
    label: 'ناحیه محدود بعد از سقف',
    render: p => (p.throttledMessageCount != null && p.throttledMessageCount > 0
      ? `${fmt(p.throttledMessageCount)} پیام دیگر با ظرفیت کمتر`
      : '—'),
  },
  {
    label: 'سقف توکن ورودی (حالت عادی)',
    render: p => fmt(p.maxInputTokens),
  },
  {
    label: 'سقف توکن ورودی (ناحیه محدود)',
    render: p => (p.throttledInputTokens != null ? fmt(p.throttledInputTokens) : '—'),
  },
  {
    label: 'سقف توکن خروجی (ناحیه محدود)',
    render: p => (p.throttledOutputTokens != null ? fmt(p.throttledOutputTokens) : '—'),
  },
  {
    label: 'کاهش پله‌ای خروجی',
    render: p => (p.outputThrottleSteps?.length
      ? p.outputThrottleSteps.map(s => `بعد از ${fmt(s.afterMessages)} پیام → ${fmt(s.maxOutputTokens)} توکن`).join(' | ')
      : '—'),
  },
  {
    label: 'محدودیت پنجره‌ی لغزان',
    render: p => (p.rollingWindowLimit != null
      ? `${fmt(p.rollingWindowLimit)} پیام / ${fmt(p.rollingWindowHours)} ساعت`
      : 'غیرفعال'),
  },
]

export function PlanLimitsTable({ plans }: { plans: Plan[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800" dir="rtl">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-800/60">
            <th className="p-4 text-right font-medium text-slate-400">ویژگی</th>
            {plans.map(p => (
              <th key={p.id} className="p-4 text-right font-bold text-slate-100">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-slate-900/40' : 'bg-transparent'}>
              <td className="p-4 text-right text-slate-400">{row.label}</td>
              {plans.map(p => (
                <td key={p.id} className="p-4 text-right text-slate-200">{row.render(p)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
