import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from '@/queries/keys'
import { getAnonSessionId, hasInitializedAnonSession, markAnonSessionInitialized } from '@/lib/anonSession'
import { track } from '@/lib/events'
import type { AnonChatStatus, AnonConversation, AnonConversationDetail } from '@/types/api'

function anonHeaders() {
  return { 'X-Anon-Session-Id': getAnonSessionId() }
}

// بار اول یک سشن مهمان (که POST /anon-chat/session هنوز صدا زده نشده) UTM/referrer را با
// /anon-chat/session ثبت می‌کند؛ دفعات بعد فقط GET /anon-chat/status صدا زده می‌شود —
// هر دو دقیقاً همان شکل خروجی (وضعیت بنر/سقف پیام رایگان) را برمی‌گردانند
export function useAnonStatus() {
  return useQuery({
    queryKey: keys.anon.status(),
    queryFn: async () => {
      if (!hasInitializedAnonSession()) {
        const params = new URLSearchParams(window.location.search)
        const { data } = await api.post<AnonChatStatus>(
          '/anon-chat/session',
          {
            utmSource: params.get('utm_source') ?? undefined,
            utmMedium: params.get('utm_medium') ?? undefined,
            utmCampaign: params.get('utm_campaign') ?? undefined,
            utmContent: params.get('utm_content') ?? undefined,
            utmTerm: params.get('utm_term') ?? undefined,
            referrer: document.referrer || undefined,
            landingPath: window.location.pathname,
          },
          { headers: anonHeaders() },
        )
        markAnonSessionInitialized()
        return data
      }
      const { data } = await api.get<AnonChatStatus>('/anon-chat/status', { headers: anonHeaders() })
      return data
    },
    staleTime: 20_000,
    refetchInterval: 30_000,
  })
}

export function useAnonConversation(id: string | null) {
  return useQuery({
    queryKey: keys.anon.conversation(id ?? ''),
    queryFn: () =>
      api.get<AnonConversationDetail>(`/anon-chat/conversations/${id}`, { headers: anonHeaders() }).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateAnonConversation() {
  return useMutation({
    mutationFn: () =>
      api.post<AnonConversation>('/anon-chat/conversations', {}, { headers: anonHeaders() }).then(r => r.data),
    onSuccess: () => track('anon_conversation_created'),
  })
}

// فایر-اند-فورگت — هیچ‌وقت نباید ناوبری به صفحه‌ی لاگین را قفل کند، خطای احتمالی بی‌صدا نادیده گرفته می‌شود
export function fireAnonCtaClick(): void {
  track('anon_signup_cta_clicked')
  void api.post('/anon-chat/events/cta-click', {}, { headers: anonHeaders() }).catch(() => {})
}
