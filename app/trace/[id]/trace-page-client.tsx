'use client'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PATH } from '@/constants/path'
import { useAuth } from '@/lib/auth-context'
import { addComment } from '@/lib/supabase/actions/comments'
import { toggleHeart } from '@/lib/supabase/actions/reactions'
import type { Comment, TraceCard } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowLeftRight, Heart, MessageCircle, Send } from 'lucide-react'
import type { Route } from 'next'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface CurrentProfile {
  id: string
  nickname: string | null
  avatar_url: string | null
}

interface TracePageClientProps {
  card: TraceCard
  initialComments: Comment[]
  currentProfile: CurrentProfile | null
}

export function TracePageClient({ card, initialComments, currentProfile }: TracePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPage = (searchParams.get('from') || PATH.HOME) as Route

  const { user: currentUser } = useAuth()
  const [hearted, setHearted] = useState(card.userReaction?.hearted ?? false)
  const [heartCount, setHeartCount] = useState(card.reactions.heart)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
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

  const handleConfirmExchange = () => {
    // TODO: 교환 요청 API 호출
    setShowExchangeDialog(false)
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

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

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
      createdAt: new Date(),
    }

    setComments((prev) => [...prev, optimistic])
    setNewComment('')

    try {
      const saved = await addComment(card.id, content)
      setComments((prev) => prev.map((c) => (c.id === tempId ? saved : c)))
    } catch (err) {
      console.error('댓글 저장 실패:', err)
      setComments((prev) => prev.filter((c) => c.id !== tempId))
      setNewComment(content)
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
              <Avatar className="size-10">
                <AvatarImage src={card.user.avatarUrl} alt={card.user.nickname} />
                <AvatarFallback className="text-label-sm">
                  {card.user.nickname?.[0] ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-heading-sm text-foreground">{card.user.nickname}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-primary"
              onClick={handleExchangeRequest}
            >
              <ArrowLeftRight className="size-4" />
            </Button>
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
                  <Avatar
                    className="size-8 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleCommentUserClick(comment.user.id)}
                  >
                    <AvatarImage src={comment.user.avatarUrl} alt={comment.user.nickname} />
                    <AvatarFallback className="text-caption">
                      {comment.user.nickname?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
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
                    <p className="text-body-sm text-foreground">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="flex gap-2">
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
            <Button size="icon" onClick={handleSubmitComment} disabled={!newComment.trim()}>
              <Send className="size-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Exchange Request Dialog */}
      <AlertDialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>교환 요청</AlertDialogTitle>
            <AlertDialogDescription>
              {card.user.nickname}님에게 《{card.book.title}》 교환을 요청하시겠습니까?
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
