import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import { getAndroidDeviceUuid } from '@/lib/android-bridge'
import type { User } from '@/types/api'

export interface WaitlistedInfo {
  message: string
  queuePosition: number
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
  waitlisted: WaitlistedInfo | null
}

export function useMe() {
  return useQuery({
    queryKey: keys.auth.me(),
    queryFn: () => api.get<User>('/auth/me').then(r => r.data),
    enabled: !!localStorage.getItem('access_token'),
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      api.post('/auth/send-otp', { phone }).then(r => r.data),
  })
}

export function useVerifyOtp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ phone, code, referralCode }: { phone: string; code: string; referralCode?: string }) =>
      api.post<AuthTokens>('/auth/verify-otp', { phone, code, referralCode, deviceUuid: getAndroidDeviceUuid() }).then(r => r.data),
    onSuccess: data => {
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      void qc.invalidateQueries({ queryKey: keys.auth.me() })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/auth/logout').then(r => r.data),
    onSettled: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      qc.clear()
      window.location.href = '/login'
    },
  })
}
