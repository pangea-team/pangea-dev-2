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
import { getCommentsByTraceCardId, mockTraceCards } from '@/lib/mock-data'
import type { Comment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowLeftRight, Bookmark, Heart, MessageCircle, Send } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { use, useState } from 'react'

interface TracePageProps {
  params: Promise<{ id: string }>
}

export default function TracePage({ params }: TracePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPage = searchParams.get('from') || '/'

  const card = mockTraceCards.find((c) => c.id === id)
  const initialComments = card ? getCommentsByTraceCardId(card.id) : []

  const [hearted, setHearted] = useState(card?.userReaction?.hearted ?? false)
  const [bookmarked, setBookmarked] = useState(card?.userReaction?.bookmarked ?? false)
  const [heartCount, setHeartCount] = useState(card?.reactions.heart ?? 0)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Trace Card를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleUserClick = () => {
    router.push(`/profile/${card.user.id}?from=/trace/${id}`)
  }

  const handleCommentUserClick = (userId: string) => {
    router.push(`/profile/${userId}?from=/trace/${id}`)
  }

  const handleExchangeRequest = () => {
    setShowExchangeDialog(true)
  }

  const handleConfirmExchange = () => {
    // TODO: 교환 요청 API 호출
    setShowExchangeDialog(false)
  }

  const handleHeart = () => {
    setHearted(!hearted)
    setHeartCount(hearted ? heartCount - 1 : heartCount + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment-new-${Date.now()}`,
      userId: 'user-1',
      user: {
        id: 'user-1',
        username: 'bookworm_kim',
        displayName: '김독서',
        avatarUrl: undefined,
        bio: '책과 함께 성장하는 중',
        createdAt: new Date('2024-01-15'),
      },
      traceCardId: card.id,
      content: newComment,
      createdAt: new Date(),
    }

    setComments([...comments, comment])
    setNewComment('')
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
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push(fromPage)}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-semibold">TRACE CARD</h1>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto text-muted-foreground hover:text-primary"
            onClick={handleExchangeRequest}
          >
            <ArrowLeftRight className="size-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Trace Card */}
        <article className="bg-card rounded-2xl border border-border px-6 py-6 mb-4">
          {/* User Info */}
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleUserClick}
          >
            <Avatar className="size-10">
              <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
              <AvatarFallback className="text-sm font-medium">
                {card.user.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{card.user.displayName}</p>
              <p className="text-sm text-muted-foreground">@{card.user.username}</p>
            </div>
          </div>

          {/* Me Section */}
          <section className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Me</p>
            <p className="text-heading-sm text-foreground">{card.meThought}</p>
          </section>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* From the Book Section */}
          <section className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
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
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Cover
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-medium text-foreground">{card.book.title}</p>
                <p className="text-sm text-muted-foreground">{card.book.author}</p>
                {card.book.publisher && (
                  <p className="text-xs text-muted-foreground mt-1">{card.book.publisher}</p>
                )}
              </div>
            </div>

            <blockquote className="mb-4">
              <p className="text-quote text-foreground">{`"${card.quote}"`}</p>
            </blockquote>
          </section>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Trace Expanded Section */}
          <section className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Trace Expanded
            </p>
            <div className="text-foreground leading-loose whitespace-pre-line">
              {card.traceExpanded}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-border">
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

            <Button
              variant="ghost"
              size="sm"
              className={cn(bookmarked ? 'text-primary' : 'text-muted-foreground')}
              onClick={handleBookmark}
            >
              <Bookmark className={cn('size-5', bookmarked && 'fill-current')} />
            </Button>
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-8 px-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            댓글 {comments.length}개
          </p>

          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar
                    className="size-8 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleCommentUserClick(comment.user.id)}
                  >
                    <AvatarImage src={comment.user.avatarUrl} alt={comment.user.displayName} />
                    <AvatarFallback className="text-xs font-medium">
                      {comment.user.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-sm font-medium text-foreground cursor-pointer hover:underline"
                        onClick={() => handleCommentUserClick(comment.user.id)}
                      >
                        {comment.user.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
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
              {card.user.displayName}님에게 《{card.book.title}》 교환을 요청하시겠습니까?
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
