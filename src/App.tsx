import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/router'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { env } from '@/env'
import { initEvents, pageView, track } from '@/lib/events'
import { initClarity } from '@/lib/clarity'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
})

// docs/PRD-growth-traction-features.md بخش ۶.۳ — کاربر ممکن است از لینک معرفی
// (nivoai.ir/?ref=CODE) وارد شود ولی تا لحظه‌ی ثبت‌نام واقعی (تایید OTP) خیلی بعدتر
// اتفاق بیفتد؛ پس همین ابتدا (یک‌بار، در بارگذاری اپ) در localStorage نگه می‌داریم
function captureReferralCode() {
  const ref = new URLSearchParams(window.location.search).get('ref')
  if (ref) {
    localStorage.setItem('nivo:referralCode', ref)
    track('referral_code_captured', { hasReferralCode: true })
  }
}

// events-backend یک سرویس کاملاً مجزا و اختیاری است — بدون این envها فقط تراکینگ خاموش می‌ماند
if (env.VITE_EVENTS_API_URL && env.VITE_EVENTS_WRITE_KEY) {
  initEvents({ endpoint: `${env.VITE_EVENTS_API_URL}/ingest/events`, writeKey: env.VITE_EVENTS_WRITE_KEY })
}

// باید بعد از initEvents صدا زده شود — وگرنه track() داخلش no-op می‌ماند (config هنوز null است)
captureReferralCode()

// Microsoft Clarity — بدون این env فقط heatmap/session-recording غیرفعال می‌ماند
if (env.VITE_CLARITY_PROJECT_ID) {
  initClarity(env.VITE_CLARITY_PROJECT_ID)
}

function EventsPageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    pageView()
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EventsPageViewTracker />
        <AppRouter />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
