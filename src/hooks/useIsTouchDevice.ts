import { useState } from 'react'

// کیبورد مجازی موبایل/تبلت کلید Shift مستقل ندارد که همزمان با Enter نگه داشته شود؛
// روی این دستگاه‌ها Enter باید رفتار پیش‌فرض (خط جدید) داشته باشد و ارسال فقط با دکمه‌ی
// ارسال انجام شود. نوع pointer در طول یک session عوض نمی‌شود، پس نیازی به effect/listener نیست.
export function useIsTouchDevice() {
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  return isTouch
}
