import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'

interface FeatureFlags {
  showDailyBudget: boolean
  showMonthlyTokenUsage: boolean
}

export function useFeatureFlags() {
  return useQuery({
    queryKey: keys.config.features(),
    queryFn: () => api.get<FeatureFlags>('/config/features').then(r => r.data),
    staleTime: 10 * 60_000,
    // اگر بک‌اند لحظه‌ای در دسترس نبود، پیش‌فرض «نمایش بده» تا چیزی به‌غلط قایم نشه
    placeholderData: { showDailyBudget: true, showMonthlyTokenUsage: true },
  })
}
