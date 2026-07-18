// docs/PRD-user-push-notifications-and-mobile-app-flows.md بخش ۵.۳/۵.۴ — پل بین اپ اندروید
// (android-app/) و این SPA. دو چیز جداست:
// - isInAndroidApp: بر اساس User-Agent سفارشی (MainActivity.kt) — برای تشخیص نمایش لندینگ اختصاصی
// - getAndroidDeviceUuid: از addJavascriptInterface — فقط برای وصل‌کردن توکن پوش ناشناس به لاگین

declare global {
  interface Window {
    NivoAndroidBridge?: {
      getDeviceUuid?: () => string
    }
  }
}

export function isInAndroidApp(): boolean {
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('NivoAndroidApp')
}

export function getAndroidDeviceUuid(): string | undefined {
  return window.NivoAndroidBridge?.getDeviceUuid?.()
}
