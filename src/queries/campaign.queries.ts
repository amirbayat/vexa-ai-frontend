import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'

export interface CampaignStatus {
  active: boolean
  campaignName: string | null
  displayedRemaining: number | null
}

export function useCampaignStatus() {
  return useQuery({
    queryKey: keys.campaign.status(),
    queryFn: () => api.get<CampaignStatus>('/campaign/status').then((r) => r.data),
    refetchInterval: 15_000, // شمارنده‌ی نمایشی زنده بماند بدون نیاز به رفرش دستی
    retry: false,
  })
}

export function useActivateWaitlist() {
  return useMutation({
    mutationFn: (token: string) => api.post('/waitlist/activate', { token }).then((r) => r.data),
  })
}
