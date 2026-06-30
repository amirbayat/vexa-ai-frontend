import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useVerifyOtp, useSendOtp } from '@/queries/auth.queries'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fa } from '@/locales/fa'

const RESEND_SECONDS = 120

export function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string })?.phone ?? ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(RESEND_SECONDS)

  const verifyOtp = useVerifyOtp()
  const sendOtp = useSendOtp()

  useEffect(() => {
    if (!phone) {
      navigate('/login', { replace: true })
      return
    }
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [phone, navigate])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await verifyOtp.mutateAsync({ phone, code })
      navigate('/chat', { replace: true })
    } catch {
      setError(fa.common.error)
    }
  }

  const onResend = async () => {
    if (countdown > 0) return
    try {
      await sendOtp.mutateAsync(phone)
      setCountdown(RESEND_SECONDS)
      setCode('')
      setError('')
    } catch {
      setError(fa.common.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="size-7 text-emerald-400">
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-100">{fa.auth.enterOtp}</h1>
          <p className="mt-1 text-sm text-slate-500">{fa.auth.otpSentTo(phone)}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="● ● ● ● ● ●"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            error={error}
            autoFocus
            dir="ltr"
            className="text-center text-2xl tracking-[0.5em] font-mono"
          />
          <Button type="submit" className="w-full" loading={verifyOtp.isPending} disabled={code.length < 6}>
            {fa.auth.verifyOtp}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {countdown > 0 ? (
            <p className="text-sm text-slate-500">{fa.auth.resendIn(countdown)}</p>
          ) : (
            <button
              onClick={onResend}
              disabled={sendOtp.isPending}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {fa.auth.resendOtp}
            </button>
          )}
        </div>
        <button
          onClick={() => navigate('/login')}
          className="mt-2 w-full text-center text-sm text-slate-600 hover:text-slate-400 transition-colors"
        >
          {fa.common.back}
        </button>
      </div>
    </div>
  )
}
