import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import type { Conversation, ConversationDetail, ConversationsPage } from '@/types/api'

export function useConversations() {
  return useInfiniteQuery({
    queryKey: keys.conv.list(),
    queryFn: ({ pageParam }) =>
      api.get<ConversationsPage>('/conversations', {
        params: { cursor: pageParam, limit: 20 },
      }).then(r => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: last => last.nextCursor ?? undefined,
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: keys.conv.detail(id),
    queryFn: () => api.get<ConversationDetail>(`/conversations/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateConversation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (model: string) =>
      api.post<Conversation>('/conversations', { model }).then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.conv.list() })
    },
  })
}

export function useUpdateConversation(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title?: string; systemPrompt?: string }) =>
      api.patch<{ conversation: Conversation }>(`/conversations/${id}`, data).then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.conv.detail(id) })
      void qc.invalidateQueries({ queryKey: keys.conv.list() })
    },
  })
}

export function useArchiveConversation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/conversations/${id}`).then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.conv.list() })
    },
  })
}
