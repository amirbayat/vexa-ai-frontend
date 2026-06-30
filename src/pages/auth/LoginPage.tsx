import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSendOtp } from '@/queries/auth.queries'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fa } from '@/locales/fa'

export function LoginPage() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const sendOtp = useSendOtp()

  const validate = (val: string) => /^(\+98|0)?9[0-9]{9}$/.test(val)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate(phone)) {
      setError(fa.auth.invalidPhone)
      return
    }
    try {
      await sendOtp.mutateAsync(phone)
      navigate('/otp', { state: { phone } })
    } catch {
      setError(fa.common.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-sm">
        {/* logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="size-7 text-emerald-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-100">دستیار هوش مصنوعی</h1>
          <p className="mt-1 text-sm text-slate-500">با شماره موبایل وارد شوید</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="tel"
            placeholder={fa.auth.phonePlaceholder}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            error={error}
            autoFocus
            inputMode="numeric"
            dir="ltr"
            className="text-center tracking-widest"
          />
          <Button
            type="submit"
            className="w-full"
            loading={sendOtp.isPending}
          >
            {fa.auth.sendOtp}
          </Button>
        </form>
      </div>
    </div>
  )
}
