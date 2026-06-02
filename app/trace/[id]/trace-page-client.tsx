'use client'

import { StoneAvatar } from '@/components/stone-avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PATH } from '@/constants/path'
import { useAuth } from '@/lib/auth-context'
import { addComment } from '@/lib/supabase/actions/comments'
import { toggleHeart } from '@/lib/supabase/actions/reactions'
import { requestShare } from '@/lib/supabase/actions/share'
import { createClient } from '@/lib/supabase/client'
import type { Comment, TraceCard } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowLeftRight, Heart, ImageIcon, MessageCircle, Send, X } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'

interface TracePageClientProps {
  card: TraceCard
  initialComments: Comment[]
  currentUserId?: string
}

export function TracePageClient({ card, initialComments, currentUserId }: TracePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPage = (searchParams.get('from') || PATH.HOME) as Route

  const { user: currentUser } = useAuth()
  const isOwner = currentUserId ? card.user.id === currentUserId : false
  const [hearted, setHearted] = useState(card.userReaction?.hearted ?? false)
  const [heartCount, setHeartCount] = useState(card.reactions.heart)
  const [shareStatus, setShareStatus] = useState(card.shareStatus)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [commentError, setCommentError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)

  const handleUserClick = () => {
    router.push(PATH.PROFILE_WITH_FROM(card.user.id, PATH.TRACE(card.id)))
  }

  const handleCommentUserClick = (userId: string) => {
    router.push(PATH.PROFILE_WITH_FROM(userId, PATH.TRACE(card.id)))
  }

  const handleExchangeRequest = () => {
    setShowExchangeDialog(true)
  }

  const handleConfirmExchange = async () => {
    const prevStatus = shareStatus
    setShareStatus('pending')
    setShowExchangeDialog(false)
    try {
      await requestShare(card.id, card.user.id)
    } catch (err) {
      console.error('거래 신청 실패:', err)
      setShareStatus(prevStatus)
    }
  }

  const handleHeart = async () => {
    const wasHearted = hearted
    setHearted(!wasHearted)
    setHeartCount((prev) => (wasHearted ? prev - 1 : prev + 1))

    try {
      const result = await toggleHeart(card.id)
      setHearted(result.hearted)
    } catch (err) {
      console.error('좋아요 실패:', err)
      setHearted(wasHearted)
      setHeartCount((prev) => (wasHearted ? prev + 1 : prev - 1))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCommentError('이미지 파일만 첨부할 수 있어요.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setCommentError('이미지 크기는 5MB 이하여야 해요.')
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCommentError(null)
    e.target.value = ''
  }

  const clearPendingFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(null)
    setPreviewUrl(null)
  }

  const canSubmitComment = Boolean((newComment.trim() || pendingFile) && !isSubmitting)

  const handleSubmitComment = async () => {
    if (!newComment.trim() && !pendingFile) return

    setIsSubmitting(true)
    setCommentError(null)

    let uploadedImageUrl: string | undefined

    if (pendingFile) {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setCommentError('로그인이 필요합니다.')
          setIsSubmitting(false)
          return
        }

        const ext = pendingFile.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/${Date.now()}.${ext}`

        const { error: uploadErr } = await supabase.storage
          .from('comment-images')
          .upload(path, pendingFile, { contentType: pendingFile.type })
        if (uploadErr) {
          setCommentError('이미지 업로드에 실패했어요. 다시 시도해 주세요.')
          setIsSubmitting(false)
          return
        }

        const { data: urlData } = supabase.storage.from('comment-images').getPublicUrl(path)
        uploadedImageUrl = urlData.publicUrl
      } catch {
        setCommentError('이미지 업로드 중 오류가 발생했어요.')
        setIsSubmitting(false)
        return
      }
    }

    // 업로드 성공 후 blob URL 해제 (실제 public URL로 대체되므로 안전)
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    const tempId = `temp-${Date.now()}`
    const content = newComment.trim()

    const optimistic: Comment = {
      id: tempId,
      userId: currentUser?.id ?? '',
      user: {
        id: currentUser?.id ?? '',
        nickname: currentUser?.nickname ?? '',
        avatarUrl: currentUser?.avatarUrl,
        createdAt: currentUser?.createdAt ?? new Date(),
      },
      traceCardId: card.id,
      content,
      imageUrl: uploadedImageUrl,
      createdAt: new Date(),
    }

    setComments((prev) => [...prev, optimistic])
    setNewComment('')
    setPendingFile(null)
    setPreviewUrl(null)

    try {
      const saved = await addComment(card.id, content, uploadedImageUrl)
      setComments((prev) => prev.map((c) => (c.id === tempId ? saved : c)))
    } catch (err) {
      console.error('댓글 저장 실패:', err)
      setComments((prev) => prev.filter((c) => c.id !== tempId))
      setNewComment(content)
      // orphan: uploadedImageUrl이 있다면 Storage 파일은 남음 (추후 cron으로 정리)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center h-12">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => router.push(fromPage)}
            >
              <ArrowLeft className="size-5" />
              <span className="text-heading-sm">TRACE</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto py-4">
        {/* Trace Content */}
        <article className="px-4 py-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleUserClick}
            >
              <StoneAvatar seed={card.user.id} alt={card.user.nickname} className="size-10" />
              <div>
                <p className="text-heading-sm text-foreground">{card.user.nickname}</p>
              </div>
            </div>
            {!(shareStatus === 'none' && isOwner) && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'text-muted-foreground gap-1.5',
                  shareStatus === 'none' && 'hover:text-primary',
                )}
                onClick={handleExchangeRequest}
                disabled={shareStatus !== 'none'}
              >
                {shareStatus === 'accepted' ? (
                  <>
                    <span className="text-body-sm">Shared</span>
                    <Users className="size-4" />
                  </>
                ) : shareStatus === 'pending' ? (
                  <span className="text-body-sm">요청중</span>
                ) : (
                  <>
                    <span className="text-body-sm">Share</span>
                    <ArrowLeftRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Me Section */}
          <section className="mb-10">
            <p className="text-heading-sm text-foreground">{card.meThought}</p>
          </section>

          {/* Divider */}
          <div className="-mx-4 border-t border-border my-6" />

          {/* From the Book Section */}
          <section className="mb-10">
            <p className="text-caption uppercase tracking-wider text-muted-foreground mb-4">
              From the Book
            </p>

            {/* Book Cover */}
            <div className="flex gap-4 mb-6">
              <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                {card.book.coverUrl ? (
                  <Image
                    src={card.book.coverUrl}
                    alt={card.book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-caption text-muted-foreground">
                    No Cover
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-heading-sm text-foreground">{card.book.title}</p>
                <p className="text-body-sm text-muted-foreground">{card.book.author}</p>
              </div>
            </div>

            <blockquote className="mb-4">
              <p className="text-quote text-foreground">{`"${card.quote}"`}</p>
            </blockquote>
          </section>

          {/* Divider */}
          <div className="-mx-4 border-t border-border my-6" />

          {/* Trace Expanded Section */}
          <section className="mb-8">
            <p className="text-caption uppercase tracking-wider text-muted-foreground mb-4">
              Trace Expanded
            </p>
            <div className="text-body-lg text-foreground whitespace-pre-line">
              {card.traceExpanded}
            </div>
          </section>

          {/* Actions */}
          <div className="-mx-4 px-4 flex items-center gap-2 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className={cn('gap-1.5', hearted ? 'text-primary' : 'text-muted-foreground')}
              onClick={handleHeart}
            >
              <Heart className={cn('size-5', hearted && 'fill-current')} />
              <span className="tabular-nums">{heartCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
              <MessageCircle className="size-5" />
              <span className="tabular-nums">{comments.length}</span>
            </Button>
          </div>
        </article>

        {/* Comments Section */}
        <section className="px-4 border-t border-border pt-6">
          <p className="text-caption uppercase tracking-wider text-muted-foreground mb-4">
            댓글 {comments.length}개
          </p>

          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-body-sm text-muted-foreground text-center py-8">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <StoneAvatar
                    seed={comment.user.id}
                    alt={comment.user.nickname}
                    className="size-8 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleCommentUserClick(comment.user.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-label-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => handleCommentUserClick(comment.user.id)}
                      >
                        {comment.user.nickname}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    {comment.content && (
                      <p className="text-body-sm text-foreground">{comment.content}</p>
                    )}
                    {comment.imageUrl && (
                      <div className="mt-2 relative w-40 h-40 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={comment.imageUrl}
                          alt="댓글 이미지"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
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

            {commentError && <p className="text-caption text-destructive">{commentError}</p>}

            <div className="flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="outline"
                aria-label="사진 첨부"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="size-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <Input
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitComment()
                  }
                }}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSubmitComment} disabled={!canSubmitComment}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Exchange Request Dialog */}
      <AlertDialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share 요청</AlertDialogTitle>
            <AlertDialogDescription>
              {card.user.nickname}님의 흔적이 담긴 책 《{card.book.title}》을 함께 읽어보시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExchange}>요청하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
