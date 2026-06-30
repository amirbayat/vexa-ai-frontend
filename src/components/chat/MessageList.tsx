import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { useChatStore } from '@/store/chat.store'
import type { Message } from '@/types/api'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const { streamingContent, isStreaming } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map(msg => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {isStreaming && streamingContent && (
        <MessageBubble role="ASSISTANT" content={streamingContent} streaming />
      )}

      {isStreaming && !streamingContent && (
        <div className="flex gap-1 items-center px-2">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="size-2 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: Message['role']
  content: string
  streaming?: boolean
}) {
  const isUser = role === 'USER'
  return (
    <div className={clsx('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'size-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold',
          isUser ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300',
        )}
      >
        {isUser ? 'ش' : 'AI'}
      </div>
      <div
        className={clsx(
          'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-emerald-600/20 text-emerald-50 rounded-tl-sm'
            : 'bg-slate-800 text-slate-100 rounded-tr-sm',
          streaming && 'border border-emerald-500/30',
        )}
      >
        {content}
        {streaming && <span className="inline-block w-0.5 h-4 bg-emerald-400 animate-pulse mr-0.5" />}
      </div>
    </div>
  )
}
