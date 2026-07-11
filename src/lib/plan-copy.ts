// متن‌های بازاریابی کارت‌های پلن — به ترتیب پلن (۰=رایگان، ۱=اکو، ۲=پلاس).
// عمداً جدا از داده‌ی واقعی allowedModels/dailyMessageLimit نگه داشته شده — این‌ها متن نمایشی‌اند،
// نه محدودیت واقعی اعمال‌شده (که همچنان از Plan.rollingWindowLimit و مشابه در بک‌اند کنترل می‌شود).
export const PLAN_TIER_MODEL_DESCRIPTIONS = [
  'آخرین و ساده‌ترین مدل‌های هوش مصنوعی',
  'آخرین و به‌روزترین مدل‌های هوش مصنوعی از خانواده‌ی ChatGPT، Claude، Gemini، Grok و ...',
  'آخرین و به‌روزترین و قوی‌ترین مدل‌های هوش مصنوعی دنیا از خانواده‌ی GPT، Claude، Gemini، Grok و ...',
]

export const PLAN_TIER_DAILY_MESSAGE_LIMITS = [5, 70, 200]

export function dailyMessageLimitText(index: number): string | null {
  const n = PLAN_TIER_DAILY_MESSAGE_LIMITS[index]
  if (n === undefined) return null
  return `${n.toLocaleString('fa-IR')} پیام در روز`
}
