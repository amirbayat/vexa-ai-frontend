import { useState, useEffect } from 'react'
import { useMe } from '@/queries/auth.queries'
import { useUpdateProfile } from '@/queries/settings.queries'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { fa } from '@/locales/fa'

export function ProfilePage() {
  const { data: me } = useMe()
  const update = useUpdateProfile()
  const [name, setName] = useState(me?.name ?? '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (me?.name) setName(me.name)
  }, [me?.name])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    update.mutate(name, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      },
    })
  }

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-slate-400">{fa.settings.phone}</label>
          <p className="mt-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-400">
            {me?.phone ?? '—'}
          </p>
        </div>

        <Input
          label={fa.settings.name}
          placeholder={fa.settings.namePlaceholder}
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" loading={update.isPending}>
            {fa.settings.saveProfile}
          </Button>
          {saved && (
            <span className="text-sm text-emerald-400">{fa.settings.profileSaved}</span>
          )}
          {update.isError && (
            <span className="text-sm text-red-400">{fa.common.error}</span>
          )}
        </div>
      </form>
    </div>
  )
}
