import type { Book } from '@/lib/types'

export type LibraryBook = Book & {
  sharedId: string | null
  status: 'reading' | 'shared' | 'done'
  indexCount?: number
}

export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'farewell',
    title: '작별인사',
    author: '김영하',
    sharedId: 'shared-1',
    status: 'reading',
  },
  {
    id: 'gaze',
    title: '시선으로부터,',
    author: '정세랑',
    sharedId: null,
    status: 'reading',
    indexCount: 4,
  },
  {
    id: 'pachinko',
    title: '파친코 1',
    author: '이민진',
    sharedId: 'shared-2',
    status: 'shared',
    indexCount: 12,
  },
  {
    id: 'summer-villa',
    title: '여름의 빌라',
    author: '백수린',
    sharedId: null,
    status: 'done',
    indexCount: 0,
  },
]
