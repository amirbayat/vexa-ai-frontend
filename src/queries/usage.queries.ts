import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import type { UsageToday } from '@/types/api'

export function useUsageToday() {
  return useQuery({
    queryKey: keys.usage.today(),
    queryFn: () => api.get<UsageToday>('/usage/today').then(r => r.data),
    refetchInterval: 30_000,
  })
}
