// Microsoft Clarity (heatmap/session-recording) — سرویس کاملاً مستقل و اختیاری،
// هیچ‌وقت نباید به‌خاطر خطای آن اپ اصلی بشکند (fail-silent).
import Clarity from '@microsoft/clarity'

let initialized = false

export function initClarity(projectId: string) {
  if (initialized) return
  try {
    Clarity.init(projectId)
    initialized = true
  } catch {
    // fail-silent
  }
}

export function identifyClarity(userId: string) {
  if (!initialized) return
  try {
    Clarity.identify(userId)
  } catch {
    // fail-silent
  }
}
