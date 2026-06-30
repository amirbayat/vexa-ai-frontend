import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget'

interface ChatLayoutProps {
  children: ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <FeedbackWidget />
    </div>
  )
}
