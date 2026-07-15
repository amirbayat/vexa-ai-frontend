import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface NetworkOutageStatus {
  active: boolean
}

export function useNetworkOutageStatus() {
  return useQuery({
    queryKey: ['network-outage', 'status'],
    queryFn: () => api.get<NetworkOutageStatus>('/network-outage/status').then((r) => r.data),
    refetchInterval: 30_000,
    retry: false,
  })
}
