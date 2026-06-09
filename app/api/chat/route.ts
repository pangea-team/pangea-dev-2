import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import { createTraceTool } from '@/lib/ai/tools'
import { createClient } from '@/lib/supabase/server'
import { google } from '@ai-sdk/google'
import { type UIMessage, convertToModelMessages, stepCountIs, streamText } from 'ai'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, conversation_id }: { messages: UIMessage[]; conversation_id: string } =
    await request.json()

  if (!conversation_id) return new Response('conversation_id required', { status: 400 })

  // 소유권 검증
  const { data: conversation } = await supabase
    .from('conversations')
    .select('user_id, book_id, books(title, author, publisher)')
    .eq('id', conversation_id)
    .single()

  if (!conversation || conversation.user_id !== user.id) {
    return new Response('Forbidden', { status: 403 })
  }

  // 프로필 닉네임 로드 (full_name은 컨텍스트에 절대 포함하지 않음)
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single()

  const book = conversation.books as { title: string; author: string; publisher: string } | null
  const systemPrompt = buildSystemPrompt({
    nickname: profile?.nickname ?? '독자',
    bookTitle: book?.title ?? '',
    bookAuthor: book?.author ?? '',
    bookPublisher: book?.publisher ?? '',
  })

  // 스트리밍 전 마지막 사용자 메시지 저장
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
  if (lastUserMsg) {
    const textContent =
      lastUserMsg.parts
        .filter((p) => p.type === 'text')
        .map((p) => (p.type === 'text' ? p.text : ''))
        .join('') ?? ''

    const attachments = lastUserMsg.parts
      .filter((p) => p.type === 'file')
      .map((p) => (p.type === 'file' ? { url: p.url, mediaType: p.mediaType } : null))
      .filter(Boolean)

    await supabase.from('messages').insert({
      conversation_id,
      role: 'user',
      content: textContent,
      attachments,
    })
  }

  // Resolve file part URLs to inline base64 before convertToModelMessages,
  // which calls validateDownloadUrl and blocks loopback IPs (127.0.0.1).
  // The server can fetch the signed URL directly since it runs on the same host.
  const resolvedMessages = await Promise.all(
    messages.map(async (msg) => {
      const parts = await Promise.all(
        msg.parts.map(async (part) => {
          if (part.type !== 'file') return part
          if (part.url.startsWith('data:')) return part
          const res = await fetch(part.url)
          const buf = await res.arrayBuffer()
          const b64 = Buffer.from(buf).toString('base64')
          return { ...part, url: `data:${part.mediaType};base64,${b64}` }
        }),
      )
      return { ...msg, parts }
    }),
  )

  const modelMessages = await convertToModelMessages(resolvedMessages as UIMessage[])

  const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

  const result = streamText({
    model: google(GEMINI_MODEL),
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      create_trace: createTraceTool({
        supabase,
        userId: user.id,
        conversationId: conversation_id,
        bookId: conversation.book_id,
        nickname: profile?.nickname ?? '독자',
      }),
    },
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 512,
        },
      },
    },
    stopWhen: stepCountIs(3),
    onFinish: async ({ text }) => {
      if (!text) return
      await supabase.from('messages').insert({
        conversation_id,
        role: 'assistant',
        content: text,
        attachments: [],
      })
    },
  })

  return result.toUIMessageStreamResponse()
}
