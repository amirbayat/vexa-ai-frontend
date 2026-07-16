import { useToastStore } from '@/store/toast.store'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  if (!toasts.length) return null

  return (
    <div
      dir="rtl"
      className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          role="alert"
          onClick={() => removeToast(toast.id)}
          className="w-full max-w-sm cursor-pointer rounded-xl border border-amber-500/30 bg-slate-800/95 px-4 py-3 text-right text-sm font-medium text-amber-300 shadow-lg backdrop-blur"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
