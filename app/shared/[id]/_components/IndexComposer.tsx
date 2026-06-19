'use client'

import { ImagePlus, Send } from 'lucide-react'

export function IndexComposer() {
  return (
    <div className="shrink-0 border-t border-border bg-background">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
        <input
          type="text"
          placeholder="인덱스 남기기…"
          className="flex-1 bg-transparent text-body-sm text-foreground placeholder:text-(--color-text-tertiary) outline-none"
        />
        <button type="button" aria-label="이미지 첨부" className="text-muted-foreground shrink-0">
          <ImagePlus className="size-5" />
        </button>
        <button type="button" aria-label="전송" className="text-primary shrink-0">
          <Send className="size-5" />
        </button>
      </div>
    </div>
  )
}
