import { useState, useRef, type KeyboardEvent } from 'react'
import { clsx } from 'clsx'
import { fa } from '@/locales/fa'

interface MessageInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const onInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }

  return (
    <div className="border-t border-slate-700/50 p-4">
      <div
        className={clsx(
          'flex items-end gap-3 rounded-2xl border bg-slate-800/80 px-4 py-3 transition-colors',
          disabled ? 'border-slate-700/30' : 'border-slate-600/60 focus-within:border-emerald-500/50',
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          disabled={disabled}
          placeholder={fa.chat.placeholder}
          rows={1}
          className={clsx(
            'flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500',
            'focus:outline-none leading-relaxed',
          )}
          style={{ minHeight: '24px' }}
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          className={clsx(
            'shrink-0 size-9 rounded-xl flex items-center justify-center transition-all',
            value.trim() && !disabled
              ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed',
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4 rotate-180">
            <path d="M12 4l8 8-8 8M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-slate-600">
        Enter برای ارسال · Shift+Enter برای خط جدید
      </p>
    </div>
  )
}
