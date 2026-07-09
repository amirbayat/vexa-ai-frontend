export const OPTIMAL_MODE = 'optimal'

export const OPTIMAL_DESCRIPTION =
  'بر اساس سوال شما، در خانواده مدل‌های GPT-5، Gemini، Grok و DeepSeek، بهترین مدل برای بهترین پاسخ انتخاب می‌شود.'

export interface ModelCatalogEntry {
  id: string
  displayName: string
  provider: 'openai'
  shortDesc: string
}

export const MODEL_CATALOG: ModelCatalogEntry[] = [
  {
    id: 'openai/gpt-4o-mini',
    displayName: 'GPT-4o mini',
    provider: 'openai',
    shortDesc: 'سریع و به‌صرفه — مناسب سوال‌های روزمره، خلاصه‌سازی و کارهای ساده.',
  },
  {
    id: 'openai/gpt-4o',
    displayName: 'GPT-4o',
    provider: 'openai',
    shortDesc: 'تحلیل دقیق‌تر، خلاقیت بیشتر — مناسب نوشتن، تحلیل داده و کارهای روزانه حرفه‌ای.',
  },
  {
    id: 'openai/gpt-4.1',
    displayName: 'GPT-4.1',
    provider: 'openai',
    shortDesc: 'درک عمیق‌تر متن‌های بلند — مناسب اسناد فنی و کارهای پیچیده‌تر.',
  },
  {
    id: 'openai/gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    provider: 'openai',
    shortDesc: 'قوی‌ترین مدل — مناسب سخت‌ترین سوالات و کارهای تخصصی سنگین.',
  },
]

export function findModelInCatalog(id: string): ModelCatalogEntry | undefined {
  return MODEL_CATALOG.find(m => m.id === id)
}
