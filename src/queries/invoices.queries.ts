import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import type { Invoice } from '@/types/api'

export function useInvoices() {
  return useQuery({
    queryKey: keys.invoices.list(),
    queryFn: () => api.get<Invoice[]>('/invoices').then(r => r.data),
    staleTime: 5 * 60_000,
  })
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: keys.invoices.detail(id ?? ''),
    queryFn: () => api.get<Invoice>(`/invoices/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export async function downloadInvoicePdf(id: string, fileName: string) {
  const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
