import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import type { Subscription, UsageHistory, PaymentRecord } from '@/types/api'

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) =>
      api.patch<{ name: string }>('/users/me', { name }).then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.auth.me() })
    },
  })
}

export function useSettingsSubscription() {
  return useQuery({
    queryKey: keys.sub.current(),
    queryFn: () => api.get<Subscription>('/subscriptions/me').then(r => r.data),
    retry: false,
  })
}

export function useCancelSubscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('/subscriptions/me').then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.sub.current() })
    },
  })
}

export function useUsageHistory(month: string) {
  return useQuery({
    queryKey: keys.usage.history(month),
    queryFn: () =>
      api.get<UsageHistory[]>(`/usage/history?month=${month}`).then(r => r.data),
    staleTime: 5 * 60_000,
  })
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: keys.pay.history(),
    queryFn: () =>
      api.get<PaymentRecord[]>('/payments/history').then(r => r.data),
    staleTime: 5 * 60_000,
  })
}
