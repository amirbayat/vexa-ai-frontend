import { usePinnedArticle } from '@/queries/articles.queries'
import { env } from '@/env'

// آدرس واقعی مقاله همیشه روی بک‌اند رندر می‌شود (docs/PRD-articles-seo-blog.md بخش ۳) —
// یک لینک <a> معمولی (نه Link روتر) چون این صفحه بیرون از SPA است.
const BLOG_ORIGIN = env.VITE_API_URL.replace(/\/api\/v1\/?$/, '')

export function PromoBanner() {
  const { data: pinned } = usePinnedArticle()

  if (!pinned) return null

  return (
    <a
      href={`${BLOG_ORIGIN}/blog/${pinned.slug}`}
      className="flex items-center justify-center gap-2 bg-emerald-500/10 border-b border-emerald-500/20
        px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors"
    >
      <span className="truncate">{pinned.title}</span>
      <span className="shrink-0">بخوانید ←</span>
    </a>
  )
}
