import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, durationMs?: number) => void
  removeToast: (id: number) => void
}

let nextId = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (message, durationMs = 6000) => {
    const id = nextId++
    set(s => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => get().removeToast(id), durationMs)
  },
  removeToast: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
