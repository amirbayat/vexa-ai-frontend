import type { Plan } from '@/types/api'

// متن‌های بازاریابی کارت‌های پلن — به ترتیب پلن (۰=رایگان، ۱=اکو، ۲=پلاس).
// این‌ها فقط توضیح کیفی مدل‌ها هستند؛ اعداد واقعی (محدودیت پیام، پشتیبانی) از خودِ Plan خوانده می‌شوند.
export const PLAN_TIER_MODEL_DESCRIPTIONS = [
  'آخرین و ساده‌ترین مدل‌های هوش مصنوعی',
  'آخرین و به‌روزترین مدل‌های هوش مصنوعی از خانواده‌ی ChatGPT، Claude، Gemini، Grok و ...',
  'آخرین و به‌روزترین و قوی‌ترین مدل‌های هوش مصنوعی دنیا از خانواده‌ی GPT، Claude، Gemini، Grok و ...',
]

// محدودیت پیام به‌صورت ساعتی، مستقیم از دیتابیس (Plan.rollingWindowLimit/rollingWindowHours) —
// همان عددی که واقعاً در chat.service.ts اعمال می‌شود، نه یک متن بازاریابی جدا.
export function hourlyLimitText(plan: Plan): string | null {
  if (plan.rollingWindowLimit === null) return null
  return `${plan.rollingWindowLimit.toLocaleString('fa-IR')} پیام هر ${plan.rollingWindowHours.toLocaleString('fa-IR')} ساعت`
}

const SUPPORT_LABELS: Record<string, string> = {
  email: 'پشتیبانی ایمیلی',
  priority: 'پشتیبانی اولویت‌دار',
}

// فقط برای پلن‌های پولی معنا دارد — پلن رایگان (community) عمداً چیزی برنمی‌گرداند.
export function supportText(plan: Plan): string | null {
  const support = (plan.features as { support?: string } | undefined)?.support
  return support ? (SUPPORT_LABELS[support] ?? null) : null
}
