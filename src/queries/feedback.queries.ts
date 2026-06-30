import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

type FeedbackCategory = 'FEATURE_REQUEST' | 'BUG' | 'UX' | 'PRICING' | 'GENERAL'

interface SubmitFeedbackDto {
  content: string
  category: FeedbackCategory
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (dto: SubmitFeedbackDto) =>
      api.post('/feedback', dto).then(r => r.data),
  })
}
