import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { UsageGuideModal } from '@/components/chat/UsageGuideModal'
import { useVisualViewportHeight } from '@/hooks/useVisualViewportHeight'
import { fa } from '@/locales/fa'
import logoUrl from '@/assets/brand/horizontal-dark.svg'

interface AnonChatLayoutProps {
  children: ReactNode
}

// لایوت سبک برای کاربر مهمان (بدون ثبت‌نام) — بدون سایدبار، چون کاربر مهمان همیشه دقیقاً
// یک مکالمه‌ی در حال انجام دارد و نیازی به لیست/جابه‌جایی بین مکالمات نیست
export function AnonChatLayout({ children }: AnonChatLayoutProps) {
  const [guideOpen, setGuideOpen] = useState(false)
  const viewportHeight = useVisualViewportHeight()

  return (
    <div className="flex flex-col overflow-hidden bg-slate-900" style={{ height: viewportHeight }}>
      <header className="flex items-center gap-3 border-b border-slate-700/50 px-4 py-3 sm:px-6">
        <img src={logoUrl} alt="نیوو" className="w-28 h-auto" />

        <div className="ms-auto flex items-center gap-2">
          <button
            onClick={() => setGuideOpen(true)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700/60 hover:text-emerald-400 transition-colors"
          >
            {fa.anonChat.usageGuide}
          </button>
          <Link
            to="/login"
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400 transition-colors"
          >
            {fa.anonChat.loginSignup}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>

      <UsageGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  )
}
