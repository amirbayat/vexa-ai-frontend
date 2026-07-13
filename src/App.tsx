import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/router'

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
  if (ref) localStorage.setItem('nivo:referralCode', ref)
}
captureReferralCode()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
