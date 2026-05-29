export const PATH = {
  HOME: '/',
  ACTIVITY: '/activity',
  CREATE: '/create',
  DISCOVER: '/discover',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PROFILE: '/profile',
  PROFILE_DETAIL: (id: string) => `/profile/${id}`,
  TRACE: (id: string) => `/trace/${id}`,
  TRACE_WITH_FROM: (id: string, from: string) => `/trace/${id}?from=${encodeURIComponent(from)}`,
  PROFILE_WITH_FROM: (id: string, from: string) =>
    `/profile/${id}?from=${encodeURIComponent(from)}`,
  LOGIN_WITH_REDIRECT: (redirect: string) => `/login?redirect=${encodeURIComponent(redirect)}`,
} as const
