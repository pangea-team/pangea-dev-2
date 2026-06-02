const template = (process.env.TRACE_GUIDE_SYSTEM_PROMPT || '').replace(/\\n/g, '\n')

export function buildSystemPrompt({
  nickname,
  bookTitle,
  bookAuthor,
  bookPublisher,
}: {
  nickname: string
  bookTitle: string
  bookAuthor: string
  bookPublisher: string
}): string {
  if (!template) throw new Error('TRACE_GUIDE_SYSTEM_PROMPT is not set')

  return template
    .replace(/{{nickname}}/g, nickname)
    .replace(/{{book_title}}/g, bookTitle)
    .replace(/{{book_author}}/g, bookAuthor)
    .replace(/{{book_publisher}}/g, bookPublisher)
}
