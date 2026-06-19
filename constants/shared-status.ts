import type { Shared } from '@/lib/types'

type ExchangeStatus = Shared['exchangeStatus']

export type ExchangeStatusConfig = {
  subtext: (readerName: string) => string
  badge?: { label: string; variant: 'outline' | 'secondary' }
  actionLabel?: string
}

export const EXCHANGE_STATUS_CONFIG: Record<ExchangeStatus, ExchangeStatusConfig> = {
  reading: {
    subtext: (name) => `${name}이 읽는 중`,
    badge: { label: '읽는 중', variant: 'outline' },
  },
  returning: {
    subtext: (name) => `${name}이 다 읽었어요`,
    badge: { label: 'hub 반환 중', variant: 'outline' },
  },
  arrived: {
    subtext: (name) => `${name}이 Hub에 반납했어요`,
    actionLabel: '가져왔어요',
  },
  done: {
    subtext: (name) => `${name}이 남긴 trace 보기`,
    badge: { label: '완료', variant: 'secondary' },
  },
}
