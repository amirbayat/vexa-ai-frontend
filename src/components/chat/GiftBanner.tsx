import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGiftStatus, useClaimGift } from '@/queries/growth.queries'

// docs/PRD-growth-traction-features.md بخش ۴.۳ — فقط برای کاربر رایگانِ داخل دوره‌ی
// آزمایشی نشون داده می‌شه (چک واجدشرایط‌بودن سمت سرور، نه اینجا)
export function GiftBanner() {
  const { data: status } = useGiftStatus()
  const [open, setOpen] = useState(false)

  if (!status?.eligible || !status.gift) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mx-4 mb-2 flex w-[calc(100%-2rem)] items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-right hover:bg-emerald-500/15 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
          <span>🎁</span>
          هدیه ویژه نیوو به کاربران تازه
        </span>
        <svg viewBox="0 0 16 16" fill="none" className="size-4 text-emerald-400 rotate-180">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && <GiftModal title={status.gift.title} description={status.gift.description} audioUrl={status.gift.audioUrl} onClose={() => setOpen(false)} />}
    </>
  )
}

function GiftModal({
  title, description, audioUrl, onClose,
}: {
  title: string
  description: string
  audioUrl: string | null
  onClose: () => void
}) {
  const claimGift = useClaimGift()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  function copyCode() {
    if (!claimGift.data) return
    void navigator.clipboard.writeText(claimGift.data.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-slate-600 hover:text-slate-400 transition-colors"
          aria-label="بستن"
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 text-3xl">🎁</div>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
        </div>

        {audioUrl && (
          <a
            href={audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-600 py-3 text-sm font-medium text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-4">
              <path d="M8 1v9m0 0l-3-3m3 3l3-3M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            دانلود آموزش صوتی
          </a>
        )}

        <div className="mt-3">
          {!claimGift.data ? (
            <button
              onClick={() => claimGift.mutate()}
              disabled={claimGift.isPending}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {claimGift.isPending ? 'در حال ساخت کد...' : 'دریافت کد تخفیف'}
            </button>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <p className="text-xs text-emerald-300">
                {claimGift.data.discountPercent}٪ تخفیف برای اولین خرید — کدت رو موقع خرید وارد کن
              </p>
              <button
                onClick={copyCode}
                dir="ltr"
                className="mt-2 w-full rounded-lg bg-slate-800 border border-slate-600 py-2 text-sm font-mono text-emerald-300 hover:border-emerald-500/50 transition-colors"
              >
                {copied ? 'کپی شد ✓' : claimGift.data.code}
              </button>
              {claimGift.data.expiresAt && (
                <p className="mt-2 text-[11px] text-slate-500">
                  اعتبار تا {new Date(claimGift.data.expiresAt).toLocaleString('fa-IR')}
                </p>
              )}
              <button
                onClick={() => navigate('/pricing')}
                className="mt-3 w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 active:scale-[0.98] transition-all"
              >
                ارتقا پلن
              </button>
            </div>
          )}
          {claimGift.isError && (
            <p className="mt-2 text-center text-xs text-red-400">مشکلی پیش آمد، دوباره امتحان کن</p>
          )}
        </div>
      </div>
    </div>
  )
}
