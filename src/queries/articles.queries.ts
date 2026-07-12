import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'

export interface PinnedArticle {
  slug: string
  title: string
}

// برای ردیف تبلیغاتی لندینگ — docs/PRD-articles-seo-blog.md بخش ۸
export function usePinnedArticle() {
  return useQuery({
    queryKey: keys.articles.pinned(),
    queryFn: () => api.get<PinnedArticle | null>('/articles/pinned').then(r => r.data),
    staleTime: 5 * 60_000,
  })
}
