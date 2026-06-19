import type { Route } from 'next'

export const PATH = {
  HOME: '/',
  ACTIVITY: '/activity',
  CREATE: '/create',
  DISCOVER: '/discover',
  SHARED: '/shared' as Route,
  SHARED_DETAIL: (id: string) => `/shared/${id}` as Route,
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PROFILE: '/profile',
  PROFILE_DETAIL: (id: string) => `/profile/${id}` as Route,
  TRACE: (id: string) => `/trace/${id}` as Route,
  TRACE_WITH_FROM: (id: string, from: string) =>
    `/trace/${id}?from=${encodeURIComponent(from)}` as Route,
  PROFILE_WITH_FROM: (id: string, from: string) =>
    `/profile/${id}?from=${encodeURIComponent(from)}` as Route,
  LOGIN_WITH_REDIRECT: (redirect: string) =>
    `/login?redirect=${encodeURIComponent(redirect)}` as Route,
  SHARED_DETAIL_INDEX_DETAIL: (id: string, indexId: string) =>
    `/shared/${id}/index/${indexId}` as Route,
} as const
