import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Vote = 'UP' | 'DOWN'

export function useSubmitMessageFeedback() {
  return useMutation({
    mutationFn: ({ messageId, vote, comment }: { messageId: string; vote: Vote; comment?: string }) =>
      api.post(`/messages/${messageId}/feedback`, { vote, comment }).then(r => r.data),
  })
}
