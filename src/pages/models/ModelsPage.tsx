import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { useMe } from '@/queries/auth.queries'
import { useChatStore } from '@/store/chat.store'
import { env } from '@/env'
import { MODEL_CATALOG, OPTIMAL_MODE, OPTIMAL_DESCRIPTION } from '@/lib/model-catalog'

const STORAGE_KEY = 'nivo:selectedModel'

function OptimalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-400 shrink-0">
      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2z" fill="currentColor" />
    </svg>
  )
}

function OpenAIIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 shrink-0">
      <path d="M22.28 9.28a5.76 5.76 0 0 0-.49-4.73 5.83 5.83 0 0 0-6.27-2.8A5.76 5.76 0 0 0 11.19 0a5.82 5.82 0 0 0-5.55 4.04 5.76 5.76 0 0 0-3.84 2.79 5.83 5.83 0 0 0 .72 6.84 5.76 5.76 0 0 0 .49 4.73 5.83 5.83 0 0 0 6.27 2.8A5.76 5.76 0 0 0 12.81 24a5.82 5.82 0 0 0 5.55-4.04 5.76 5.76 0 0 0 3.84-2.79 5.83 5.83 0 0 0-.72-6.84zm-8.47 11.88a4.31 4.31 0 0 1-2.77-1 .5.5 0 0 0 .05-.03l4.6-2.66a.74.74 0 0 0 .38-.65v-6.5l1.95 1.12a.07.07 0 0 1 .04.05v5.38a4.33 4.33 0 0 1-4.25 4.29zM3.42 17.57a4.3 4.3 0 0 1-.52-2.89.5.5 0 0 0 .05.03l4.6 2.66a.76.76 0 0 0 .75 0l5.62-3.24v2.24a.07.07 0 0 1-.03.06l-4.65 2.69a4.34 4.34 0 0 1-5.82-1.55zm-1.39-9.49a4.3 4.3 0 0 1 2.24-1.9v5.47a.75.75 0 0 0 .38.65l5.62 3.24-1.95 1.12a.07.07 0 0 1-.07 0L3.6 13.97a4.33 4.33 0 0 1-1.57-5.89zm16.03 3.72-5.62-3.24 1.95-1.13a.07.07 0 0 1 .07 0l4.65 2.68a4.32 4.32 0 0 1-.67 7.8v-5.47a.74.74 0 0 0-.38-.64zM19.9 8.1a.5.5 0 0 0-.05-.03l-4.6-2.66a.76.76 0 0 0-.76 0L8.88 8.65V6.41a.07.07 0 0 1 .03-.06l4.65-2.68a4.32 4.32 0 0 1 6.34 4.43zm-12.22 4-1.95-1.12a.07.07 0 0 1-.04-.05V5.54a4.32 4.32 0 0 1 7.08-3.32.5.5 0 0 0-.05.03L8.13 4.9a.74.74 0 0 0-.38.65zm1.06-2.28 2.5-1.44 2.5 1.44v2.87l-2.5 1.44-2.5-1.44z" />
    </svg>
  )
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-emerald-500">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ModelsPage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { selectedModel, setSelectedModel } = useChatStore()

  const allowedModels: string[] = me?.subscription?.plan?.allowedModels ?? [env.VITE_DEFAULT_MODEL]

  function select(model: string) {
    setSelectedModel(model)
    localStorage.setItem(STORAGE_KEY, model)
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← بازگشت
          </button>
          <h1 className="text-2xl font-bold text-slate-100">انتخاب مدل</h1>
          <p className="mt-2 text-slate-500">مدلی که می‌خوای پاسخ‌هات باهاش ساخته شه رو انتخاب کن</p>
        </div>

        <div className="space-y-4">
          {/* بهینه — همیشه اول و در دسترس */}
          <button
            onClick={() => select(OPTIMAL_MODE)}
            className={clsx(
              'flex w-full items-start gap-4 rounded-2xl border p-5 text-right transition-all',
              selectedModel === OPTIMAL_MODE
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600',
            )}
          >
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
              <OptimalIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100">مدل بهینه</h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-400">پیشنهادی</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{OPTIMAL_DESCRIPTION}</p>
            </div>
            {selectedModel === OPTIMAL_MODE && <Check />}
          </button>

          <div className="flex items-center gap-3 pt-2 pb-1">
            <span className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-600">یا یک مدل مشخص رو انتخاب کن</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          {MODEL_CATALOG.map(model => {
            const isAllowed = allowedModels.includes(model.id)
            const isActive = selectedModel === model.id

            return (
              <button
                key={model.id}
                onClick={() => isAllowed && select(model.id)}
                disabled={!isAllowed}
                className={clsx(
                  'flex w-full items-start gap-4 rounded-2xl border p-5 text-right transition-all',
                  !isAllowed && 'cursor-not-allowed opacity-50',
                  isActive
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600',
                )}
              >
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <OpenAIIcon />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-100">{model.displayName}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{model.shortDesc}</p>
                  {!isAllowed && (
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/pricing') }}
                      className="mt-2.5 text-xs font-medium text-emerald-400 hover:underline"
                    >
                      نیاز به ارتقا پلن ←
                    </button>
                  )}
                </div>
                {isActive && <Check />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
