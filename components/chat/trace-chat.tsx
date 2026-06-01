'use client'

import { createClient } from '@/lib/supabase/client'
import { useChat } from '@ai-sdk/react'
import { isFileUIPart, isTextUIPart } from 'ai'
import { DefaultChatTransport } from 'ai'
import { ImageIcon, Loader2, Send, X } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

interface TraceChatProps {
  conversationId: string
}

export function TraceChat({ conversationId }: TraceChatProps) {
  const [text, setText] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { conversation_id: conversationId },
    }),
  })

  const isStreaming = status === 'streaming' || status === 'submitted'
  const hasImage = messages.some((m) => m.role === 'user' && m.parts.some((p) => p.type === 'file'))
  const canSend = (text.trim() || pendingFile) && !isStreaming && !isUploading

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('이미지 파일만 첨부할 수 있어요.')
      return
    }
    setPendingFile(file)
    setUploadError(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    e.target.value = ''
  }

  const clearPendingFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(null)
    setPreviewUrl(null)
  }

  const handleSend = async () => {
    if (!canSend) return
    setUploadError(null)

    let files: { type: 'file'; mediaType: string; url: string; filename?: string }[] = []

    if (pendingFile) {
      setIsUploading(true)
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('로그인이 필요해요.')

        const ext = pendingFile.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/${conversationId}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('book-pages')
          .upload(path, pendingFile, { contentType: pendingFile.type })
        if (uploadError) throw new Error(uploadError.message)

        const { data: signed } = await supabase.storage
          .from('book-pages')
          .createSignedUrl(path, 60 * 60 * 24 * 7)
        if (!signed?.signedUrl) throw new Error('URL 생성 실패')

        files = [{ type: 'file', mediaType: pendingFile.type, url: signed.signedUrl }]
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : '업로드에 실패했어요. 다시 시도해 주세요.',
        )
        setIsUploading(false)
        return
      }
      setIsUploading(false)
      clearPendingFile()
    }

    sendMessage({ text: text.trim(), files })
    setText('')

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 이미지 미첨부 안내 */}
      {!hasImage && messages.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-6 text-center space-y-2">
          <ImageIcon className="size-8 mx-auto text-muted-foreground" />
          <p className="text-body-sm text-foreground">책 페이지 사진을 첨부해 주세요</p>
          <p className="text-caption text-muted-foreground">
            사진을 보내야 trace 대화를 시작할 수 있어요
          </p>
        </div>
      )}

      {/* 메시지 목록 */}
      {messages.length > 0 && (
        <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.parts.map((part, i) => {
                const key = `${msg.id}-${i}`
                if (isFileUIPart(part)) {
                  return (
                    <div key={key} className="rounded-xl overflow-hidden max-w-[60%]">
                      <Image
                        src={part.url}
                        alt="첨부 이미지"
                        width={200}
                        height={200}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )
                }
                if (isTextUIPart(part) && part.text) {
                  return (
                    <div
                      key={key}
                      className={`rounded-2xl px-4 py-2.5 text-body-sm max-w-[85%] whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {part.text}
                    </div>
                  )
                }
                if (part.type === 'tool-create_trace') {
                  const isDone =
                    part.state === 'output-available' &&
                    (part.output as { success?: boolean } | undefined)?.success
                  return (
                    <div
                      key={key}
                      className="rounded-2xl px-4 py-2.5 text-caption bg-muted text-muted-foreground max-w-[85%]"
                    >
                      {isDone ? '✓ trace가 저장됐어요!' : 'trace 저장 중...'}
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}

          {isStreaming && (
            <div className="flex items-start">
              <div className="rounded-2xl px-4 py-2.5 bg-muted text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 이미지 미리보기 */}
      {previewUrl && (
        <div className="relative w-20 h-20">
          <Image
            src={previewUrl}
            alt="첨부 미리보기"
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
          <button
            type="button"
            onClick={clearPendingFile}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background flex items-center justify-center"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      {uploadError && <p className="text-caption text-destructive">{uploadError}</p>}

      {/* 입력 영역 */}
      <div className="flex gap-2 items-end">
        <button
          type="button"
          aria-label="사진 첨부"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming || isUploading}
          className="shrink-0 size-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <ImageIcon className="size-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hasImage || pendingFile ? '메시지를 입력하세요' : '사진을 먼저 첨부해 주세요'
          }
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-2.5 text-body-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring min-h-10 max-h-32"
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="전송"
          className="shrink-0 size-10 rounded-full bg-foreground text-background flex items-center justify-center transition-opacity disabled:opacity-40"
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
      </div>
    </div>
  )
}
