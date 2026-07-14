import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'

export interface CampaignStatus {
  active: boolean
  campaignId: string | null
  campaignName: string | null
  initial: number | null
  floor: number | null
  decrementMin: number | null
  decrementMax: number | null
  animationTickMs: number | null
}

const CACHE_KEY = 'nivo:campaignCounter'

interface CachedCounter {
  campaignId: string
  finalNumber: number
}

export function useCampaignStatus() {
  return useQuery({
    queryKey: keys.campaign.status(),
    queryFn: () => api.get<CampaignStatus>('/campaign/status').then((r) => r.data),
    retry: false,
  })
}

/**
 * شمارنده‌ی نمایشی ظرفیت ثبت‌نام — یک‌بار مصرف (بخش ۱۸.۲۰). عدد اولیه/سرعت کاهش را سرور
 * تعیین می‌کند، ولی خودِ انیمیشن و توقفش کاملاً سمت فرانت است تا هر refetch شمارنده را
 * ری‌است نکند. نتیجه‌ی نهایی در localStorage به‌ازای campaignId کش می‌شود — بازدید بعدی از
 * همان کمپین فقط عدد نهایی (بدون انیمیشن) را نشان می‌دهد؛ کمپین جدید دوباره انیمیشن می‌گیرد.
 */
export function useCampaignDisplayCounter(status: CampaignStatus | undefined) {
  const [displayNumber, setDisplayNumber] = useState<number | null>(null)

  useEffect(() => {
    if (!status?.active || status.initial === null || status.floor === null || status.campaignId === null) {
      setDisplayNumber(null)
      return
    }

    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as CachedCounter | null
    if (cached && cached.campaignId === status.campaignId) {
      setDisplayNumber(cached.finalNumber)
      return
    }

    let current = status.initial
    setDisplayNumber(current)
    const interval = setInterval(() => {
      const dec =
        status.decrementMin! + Math.floor(Math.random() * (status.decrementMax! - status.decrementMin! + 1))
      current = Math.max(status.floor!, current - dec)
      setDisplayNumber(current)
      if (current <= status.floor!) {
        clearInterval(interval)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ campaignId: status.campaignId, finalNumber: status.floor }))
      }
    }, status.animationTickMs!)

    return () => clearInterval(interval)
  }, [status])

  return displayNumber
}

export function useActivateWaitlist() {
  return useMutation({
    mutationFn: (token: string) => api.post('/waitlist/activate', { token }).then((r) => r.data),
  })
}
