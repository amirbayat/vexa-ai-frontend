export const OPTIMAL_MODE = 'optimal'

export const OPTIMAL_DESCRIPTION =
  'بر اساس سوال شما، در خانواده مدل‌های GPT-5، Gemini، Grok و DeepSeek، بهترین مدل برای بهترین پاسخ انتخاب می‌شود.'

export type ModelTier = 'SIMPLE' | 'MEDIUM' | 'COMPLEX'

const TIER_DESCRIPTIONS: Record<ModelTier, string> = {
  SIMPLE: 'سریع و مقرون‌به‌صرفه — مناسب سوال‌های روزمره، ترجمه و خلاصه‌سازی کوتاه.',
  MEDIUM: 'تعادل خوب بین سرعت و کیفیت — مناسب نوشتن حرفه‌ای، تحلیل و کدنویسی متوسط.',
  COMPLEX: 'قوی‌ترین سطح — مناسب استدلال پیچیده، کد چندفایلی و تحلیل عمیق.',
}

export function tierDescription(tier: ModelTier): string {
  return TIER_DESCRIPTIONS[tier] ?? TIER_DESCRIPTIONS.MEDIUM
}

const TIER_LABELS: Record<ModelTier, string> = {
  SIMPLE: 'ساده',
  MEDIUM: 'متوسط',
  COMPLEX: 'پیشرفته',
}

export function tierLabel(tier: ModelTier): string {
  return TIER_LABELS[tier] ?? tier
}
