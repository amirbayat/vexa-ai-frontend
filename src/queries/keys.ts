export const keys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  conv: {
    list: () => ['conversations', 'list'] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
  },
  usage: {
    today: () => ['usage', 'today'] as const,
    history: (month: string) => ['usage', 'history', month] as const,
  },
  plans: {
    list: () => ['plans', 'list'] as const,
  },
  sub: {
    current: () => ['subscription', 'current'] as const,
  },
  pay: {
    history: () => ['payments', 'history'] as const,
  },
  profile: {
    update: () => ['profile', 'update'] as const,
  },
} as const
