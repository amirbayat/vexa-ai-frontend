import { useState, useRef, useMemo, type KeyboardEvent } from 'react'
import { clsx } from 'clsx'
import { useFeatureFlags } from '@/queries/config.queries'
import { useModelCatalog } from '@/queries/plans.queries'
import { useMe } from '@/queries/auth.queries'
import { useChatStore } from '@/store/chat.store'
import { fa } from '@/locales/fa'
import { track } from '@/lib/events'

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const MAX_DIM = 1024
      let { width, height } = img
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) { height = Math.round(height * MAX_DIM / width); width = MAX_DIM }
        else { width = Math.round(width * MAX_DIM / height); height = MAX_DIM }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = reject
    img.src = url
  })
}

interface MessageInputProps {
  onSend: (content: string, images?: string[], model?: string, generateImage?: boolean) => void
  disabled?: boolean
  // برخلاف disabled، فقط دکمه‌ی ارسال (و Enter) را غیرفعال می‌کند — کاربر همچنان می‌تواند
  // در حین تولید پاسخ هوش مصنوعی تایپ کند و پیام بعدی‌اش را آماده کند
  sending?: boolean
}

export function MessageInput({ onSend, disabled, sending }: MessageInputProps) {
  const { data: flags } = useFeatureFlags()
  const MAX_IMAGES = flags?.maxImagesPerMessage ?? 4
  const MAX_SIZE_BYTES = (flags?.maxImageSizeMb ?? 8) * 1024 * 1024

  const { data: catalog } = useModelCatalog()
  const { data: me } = useMe()
  const { selectedImageGenModel } = useChatStore()
  // docs/PRD-chat-images.md بخش ۵.۵/۶.۲ — فقط مدل‌هایی که هم supportsImageGen دارند هم
  // در allowedModels پلن کاربرند؛ اگر هیچ‌کدام نبود، دکمه‌ی حالت تولید عکس اصلاً نشان داده نمی‌شود.
  // پیش‌فرض: کیفیت/اندازه بر اساس متن پیام و (برای Pay-as-you-go) موجودی کیف‌پول خودکار
  // انتخاب می‌شود — اما اگر کاربر از صفحه‌ی «انتخاب مدل» یک مدل تولید عکس مشخص pin کرده باشد
  // (selectedImageGenModel) و هنوز هم مجاز باشد، همان صریح فرستاده می‌شود
  const imageGenModels = useMemo(() => {
    const allowed = me?.plan?.allowedModels ?? []
    return (catalog ?? []).filter(m => m.supportsImageGen && allowed.includes(m.name))
  }, [catalog, me])
  const hasImageGenModels = imageGenModels.length > 0
  const pinnedImageGenModel = imageGenModels.find(m => m.name === selectedImageGenModel)

  const [value, setValue] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imageMode, setImageMode] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleImageMode() {
    if (!hasImageGenModels) return
    setImageMode(v => {
      const next = !v
      track('image_gen_mode_toggled', { enabled: next })
      return next
    })
    // عکس‌های پیوست‌شده نگه داشته می‌شوند — اگر کاربر قبلاً عکس آپلود کرده و بعد حالت تولید عکس
    // را فعال کند، یعنی می‌خواهد همون عکس‌ها ویرایش/ترکیب شوند (images/edits)، نه یک تولید از صفر
  }

  const submit = () => {
    const trimmed = value.trim()
    if (disabled || sending) return
    if (imageMode) {
      if (!trimmed) return
      track('image_gen_requested', { model: pinnedImageGenModel?.name, hasSourceImages: images.length > 0 })
      onSend(trimmed, images.length ? images : undefined, pinnedImageGenModel?.name, true)
    } else {
      if (!trimmed && !images.length) return
      onSend(trimmed, images.length ? images : undefined)
    }
    setValue('')
    setImages([])
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

  const onFocus = () => {
    // iOS Safari doesn't reliably scroll the focused field above the keyboard on its own
    setTimeout(() => textareaRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 300)
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return
    const remaining = MAX_IMAGES - images.length
    const toProcess = Array.from(files).slice(0, remaining)
    const results: string[] = []
    for (const file of toProcess) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_SIZE_BYTES) continue
      try {
        results.push(await resizeImage(file))
      } catch { /* skip */ }
    }
    setImages(prev => [...prev, ...results].slice(0, MAX_IMAGES))
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const canSend = imageMode
    ? Boolean(value.trim()) && !disabled && !sending
    : (value.trim() || images.length > 0) && !disabled && !sending

  return (
    <div className="border-t border-slate-700/50 p-4">
      {imageMode && (
        <div className="mb-2 flex items-center gap-1.5 px-1 text-xs text-fuchsia-300/80">
          <svg viewBox="0 0 24 24" fill="none" className="size-3.5 shrink-0">
            <path
              d="M12 3l1.8 4.6L18 9.5l-4.2 1.4L12 16l-1.8-5.1L6 9.5l4.2-1.9L12 3z"
              fill="currentColor"
            />
          </svg>
          <span>
            {images.length > 0
              ? `ویرایش/ترکیب همین ${images.length} عکس بر اساس توصیفت`
              : pinnedImageGenModel
                ? `با مدل «${pinnedImageGenModel.displayName}» ساخته می‌شود`
                : 'کیفیت و ابعاد بر اساس توصیفت و اعتبار حسابت خودکار انتخاب می‌شود'}
          </span>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((src, idx) => (
            <div key={idx} className="relative group">
              <img
                src={src}
                className="h-20 w-20 rounded-xl object-cover border border-slate-600"
                alt={`پیش‌نمایش عکس پیوست‌شده، شماره ${idx + 1}`}
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-slate-900 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center text-xs leading-none"
                aria-label="حذف تصویر"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={clsx(
          'flex items-end gap-3 rounded-2xl border bg-slate-800/80 px-4 py-3 transition-colors',
          disabled ? 'border-slate-700/30' : 'border-slate-600/60 focus-within:border-emerald-500/50',
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => void handleFiles(e.target.files)}
        />

        <button
          type="button"
          disabled={disabled || images.length >= MAX_IMAGES}
          onClick={() => fileRef.current?.click()}
          className={clsx(
            'shrink-0 size-7 rounded-lg flex items-center justify-center transition-colors',
            images.length >= MAX_IMAGES || disabled
              ? 'text-slate-600 cursor-not-allowed'
              : imageMode
                ? 'text-fuchsia-300/70 hover:text-fuchsia-300 hover:bg-slate-700'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-700',
          )}
          aria-label={imageMode ? 'پیوست عکس برای ویرایش/ترکیب' : 'پیوست تصویر'}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path d="m3 15 5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {hasImageGenModels && (
          <button
            type="button"
            disabled={disabled}
            onClick={toggleImageMode}
            className={clsx(
              'shrink-0 size-7 rounded-lg flex items-center justify-center transition-all duration-200',
              imageMode
                ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]'
                : 'text-slate-400 hover:text-fuchsia-400 hover:bg-slate-700',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-label="حالت تولید عکس"
            aria-pressed={imageMode}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5">
              <path
                d="M12 3l1.8 4.6L18 9.5l-4.2 1.4L12 16l-1.8-5.1L6 9.5l4.2-1.9L12 3z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onInput={onInput}
          onFocus={onFocus}
          disabled={disabled}
          placeholder={
            imageMode
              ? images.length > 0 ? 'چی می‌خوای با این عکس(ها) درست کنم؟' : 'چی می‌خوای برات بسازم؟'
              : fa.chat.placeholder
          }
          rows={1}
          className={clsx(
            'flex-1 resize-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500',
            'focus:outline-none leading-relaxed',
          )}
          style={{ minHeight: '24px' }}
        />

        <button
          onClick={submit}
          disabled={!canSend}
          className={clsx(
            'shrink-0 size-9 rounded-xl flex items-center justify-center transition-all',
            canSend && imageMode
              ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white hover:brightness-110 active:scale-95'
              : canSend
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
