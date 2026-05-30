import type { Book } from '@/lib/types'
import { NextResponse } from 'next/server'

interface AladinItem {
  itemId: number
  title: string
  author: string
  cover: string
  isbn13: string
  publisher: string
  pubDate: string
}

interface AladinResponse {
  item?: AladinItem[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json([])
  }

  const ttbKey = process.env.ALADIN_TTB_KEY
  if (!ttbKey) {
    return NextResponse.json({ error: 'ALADIN_TTB_KEY not configured' }, { status: 500 })
  }

  const url = new URL('https://www.aladin.co.kr/ttb/api/ItemSearch.aspx')
  url.searchParams.set('TTBKey', ttbKey)
  url.searchParams.set('Query', q)
  url.searchParams.set('QueryType', 'Keyword')
  url.searchParams.set('MaxResults', '10')
  url.searchParams.set('start', '1')
  url.searchParams.set('SearchTarget', 'Book')
  url.searchParams.set('output', 'js')
  url.searchParams.set('Version', '20131101')

  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      return NextResponse.json({ error: 'Aladin API error' }, { status: 502 })
    }
    const data: AladinResponse = await res.json()
    const books: Book[] = (data.item ?? []).map((item) => ({
      id: String(item.itemId),
      title: item.title,
      author: item.author,
      coverUrl: item.cover || undefined,
      isbn: item.isbn13 || undefined,
      publisher: item.publisher || undefined,
      publishedDate: item.pubDate || undefined,
    }))
    return NextResponse.json(books)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 502 })
  }
}
