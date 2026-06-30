import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { keys } from '@/queries/keys'
import { fa } from '@/locales/fa'

export function CallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [status, setStatus] = useState<'success' | 'failed' | null>(null)
  const refId = params.get('refId')

  useEffect(() => {
    const s = params.get('status')
    if (s === 'success') {
      setStatus('success')
      void qc.invalidateQueries({ queryKey: keys.auth.me() })
      void qc.invalidateQueries({ queryKey: keys.sub.current() })
    } else {
      setStatus('failed')
    }
  }, [params, qc])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        {status === 'success' ? (
          <>
            <div className="mx-auto size-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="size-10 text-emerald-400">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{fa.payment.success}</h2>
              {refId && <p className="mt-1 text-sm text-slate-500">کد پیگیری: {refId}</p>}
            </div>
            <button
              onClick={() => navigate('/chat', { replace: true })}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
            >
              {fa.payment.goToChat}
            </button>
          </>
        ) : status === 'failed' ? (
          <>
            <div className="mx-auto size-20 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="size-10 text-red-400">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-100">{fa.payment.failed}</h2>
            <button
              onClick={() => navigate('/pricing', { replace: true })}
              className="w-full rounded-xl border border-slate-600 py-3 text-sm text-slate-300 hover:border-slate-500 transition-colors"
            >
              {fa.payment.tryAgain}
            </button>
          </>
        ) : (
          <div className="size-8 mx-auto rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  )
}
