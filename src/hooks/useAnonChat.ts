import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { env } from '@/env'
import { keys } from '@/queries/keys'
import { getAnonSessionId } from '@/lib/anonSession'
import { fa } from '@/locales/fa'
import type { AnonConversationDetail, AnonMessage } from '@/types/api'

// خواهر ساده‌شده‌ی useChat.ts برای چت مهمان (بدون ثبت‌نام) — بدون reasoning/title/تولید عکس؛
// فقط chunk متنی، [DONE] و error. وضعیت استریم اینجا لوکال نگه داشته می‌شود (نه یک استور
// سراسری) چون کاربر مهمان همیشه دقیقاً یک مکالمه‌ی در حال انجام دارد.
export function useAnonChat(conversationId: string | null) {
  const qc = useQueryClient()
  const abortRef = useRef<AbortController | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) return
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl

      setError(null)
      setStreamingContent('')
      setIsStreaming(true)

      // خوش‌بینانه: پیام کاربر را فوراً در کش نشان بده تا قبل از شروع استریم دیده شود
      qc.setQueryData<AnonConversationDetail>(keys.anon.conversation(conversationId), old => {
        if (!old) return old
        const optimistic: AnonMessage = {
          id: `opt-${Date.now()}`,
          conversationId,
          role: 'USER',
          content,
          tokensInput: 0,
          tokensOutput: 0,
          model: null,
          createdAt: new Date().toISOString(),
        }
        return { ...old, messages: [...old.messages, optimistic] }
      })

      let full = ''
      try {
        const res = await fetch(
          `${env.VITE_API_URL}/anon-chat/${conversationId}/stream`,
          {
            method: 'POST',
            signal: ctrl.signal,
            headers: {
              'Content-Type': 'application/json',
              'X-Anon-Session-Id': getAnonSessionId(),
            },
            body: JSON.stringify({ content }),
          },
        )

        if (!res.ok) {
          let msg: string = fa.common.error
          let stage: string | undefined
          try {
            const body = await res.json() as { message?: string; stage?: string }
            if (body.message) msg = body.message
            stage = body.stage
          } catch { /* ignore */ }
          // 429 با stage=anon_blocked یعنی محدودیت روزانه همین الان فعال شده — بنر بالای
          // اینپوت با رفرش status خودش این را نشان می‌دهد، دوباره اینجا تکرار نمی‌کنیم
          if (stage === 'anon_blocked') {
            void qc.invalidateQueries({ queryKey: keys.anon.status() })
          } else {
            setError(msg)
          }
          setIsStreaming(false)
          return
        }
        if (!res.body) throw new Error('no body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value, { stream: true })
          for (const line of text.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') break
            try {
              const parsed = JSON.parse(raw) as { chunk?: string; error?: string }
              if (parsed.chunk) {
                full += parsed.chunk
                setStreamingContent(c => c + parsed.chunk)
              }
              if (parsed.error) setError(parsed.error)
            } catch {
              // ignore malformed lines
            }
          }
        }

        // پیام نهایی assistant را همین الان در کش بنشان تا بین پایان استریم (isStreaming=false)
        // و رفرچ بعدی، محتوا لحظه‌ای از صفحه ناپدید نشود
        if (full) {
          qc.setQueryData<AnonConversationDetail>(keys.anon.conversation(conversationId), old => {
            if (!old) return old
            const assistantMessage: AnonMessage = {
              id: `asst-${Date.now()}`,
              conversationId,
              role: 'ASSISTANT',
              content: full,
              tokensInput: 0,
              tokensOutput: 0,
              model: null,
              createdAt: new Date().toISOString(),
            }
            return { ...old, messages: [...old.messages, assistantMessage] }
          })
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('[useAnonChat]', err)
          setError('خطا در ارتباط با سرور. دوباره تلاش کنید.')
        }
      } finally {
        setIsStreaming(false)
        // پیام روزانه/سقف رایگان ممکن است دقیقاً با همین پیام تمام شده باشد — بنر باید فوری به‌روز شود
        void qc.invalidateQueries({ queryKey: keys.anon.status() })
        void qc.invalidateQueries({ queryKey: keys.anon.conversation(conversationId) })
      }
    },
    [conversationId, qc],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
    setStreamingContent('')
  }, [])

  return { sendMessage, abort, isStreaming, streamingContent, error }
}
