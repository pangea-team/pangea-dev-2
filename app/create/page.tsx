'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { RequireAuth } from '@/components/require-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { CreateTraceCardForm, TraceLayer } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight, Globe, Lock, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Step = 'book' | 'quote' | 'layers' | 'preview'

const steps: { id: Step; title: string; subtitle: string }[] = [
  { id: 'book', title: '어떤 책인가요?', subtitle: '제목과 작가를 입력해주세요' },
  { id: 'quote', title: '밑줄 친 문장', subtitle: '마음에 남은 문장을 입력해주세요' },
  { id: 'layers', title: '나의 흔적', subtitle: '이 문장에 대한 생각을 남겨주세요' },
  { id: 'preview', title: '미리보기', subtitle: '작성한 Trace Card를 확인해주세요' },
]

const layerTypeOptions: { type: TraceLayer['type']; label: string; description: string }[] = [
  { type: 'me', label: '나의 생각', description: '이 문장을 읽고 든 나의 생각' },
  { type: 'from-book', label: '책에서', description: '책의 맥락에서 이 문장의 의미' },
  { type: 'context', label: '맥락', description: '작가나 시대적 배경' },
]

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('book')
  const [form, setForm] = useState<CreateTraceCardForm>({
    book: { title: '', author: '' },
    quote: '',
    layers: [{ type: 'me', content: '', order: 0 }],
    isPublic: true,
  })

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const currentStepInfo = steps[currentStepIndex]

  const canGoNext = () => {
    switch (currentStep) {
      case 'book':
        return form.book.title.trim() && form.book.author.trim()
      case 'quote':
        return form.quote.trim()
      case 'layers':
        return form.layers.some((l) => l.content.trim())
      case 'preview':
        return true
      default:
        return false
    }
  }

  const goNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const addLayer = () => {
    setForm({
      ...form,
      layers: [...form.layers, { type: 'me', content: '', order: form.layers.length }],
    })
  }

  const removeLayer = (index: number) => {
    if (form.layers.length > 1) {
      setForm({
        ...form,
        layers: form.layers.filter((_, i) => i !== index),
      })
    }
  }

  const updateLayer = (index: number, updates: Partial<Omit<TraceLayer, 'id'>>) => {
    setForm({
      ...form,
      layers: form.layers.map((layer, i) => (i === index ? { ...layer, ...updates } : layer)),
    })
  }

  const handleSubmit = () => {
    // In a real app, this would save to Supabase
    // For now, just redirect to the feed
    router.push('/')
  }

  return (
    <RequireAuth redirectTo="/create">
      <div className="min-h-screen bg-background pb-16">
        <Header title="새 Trace Card" />

        <main className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="py-3 border-b">
            <div className="flex items-center gap-1">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    index <= currentStepIndex ? 'bg-foreground' : 'bg-muted',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Step Header */}
          <div className="py-6 border-b">
            <h2 className="text-heading-lg text-foreground mb-1">{currentStepInfo.title}</h2>
            <p className="text-body-sm text-muted-foreground">{currentStepInfo.subtitle}</p>
          </div>

          {/* Step Content */}
          <div className="py-6">
            {currentStep === 'book' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">책 제목</Label>
                  <Input
                    id="title"
                    placeholder="예: 데미안"
                    value={form.book.title}
                    onChange={(e) =>
                      setForm({ ...form, book: { ...form.book, title: e.target.value } })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">작가</Label>
                  <Input
                    id="author"
                    placeholder="예: 헤르만 헤세"
                    value={form.book.author}
                    onChange={(e) =>
                      setForm({ ...form, book: { ...form.book, author: e.target.value } })
                    }
                  />
                </div>
              </div>
            )}

            {currentStep === 'quote' && (
              <div className="space-y-2">
                <Label htmlFor="quote">밑줄 친 문장</Label>
                <Textarea
                  id="quote"
                  placeholder="책에서 마음에 남은 문장을 입력해주세요..."
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className="min-h-32"
                />
              </div>
            )}

            {currentStep === 'layers' && (
              <div className="space-y-6">
                {form.layers.map((layer, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>레이어 {index + 1}</Label>
                      {form.layers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeLayer(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {layerTypeOptions.map((option) => (
                        <button
                          key={option.type}
                          type="button"
                          onClick={() => updateLayer(index, { type: option.type })}
                          className={cn(
                            'flex-1 py-2 px-3 text-body-sm rounded-lg border transition-colors',
                            layer.type === option.type
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-border hover:bg-muted',
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <Textarea
                      placeholder={layerTypeOptions.find((o) => o.type === layer.type)?.description}
                      value={layer.content}
                      onChange={(e) => updateLayer(index, { content: e.target.value })}
                      className="min-h-24"
                    />
                  </div>
                ))}

                <Button variant="outline" className="w-full" onClick={addLayer}>
                  <Plus className="size-4 mr-2" />
                  레이어 추가
                </Button>
              </div>
            )}

            {currentStep === 'preview' && (
              <div className="space-y-6">
                {/* Preview Card */}
                <div className="border rounded-xl p-4 space-y-4">
                  {/* Book Info */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-heading-sm">{form.book.title}</p>
                    <p className="text-body-sm text-muted-foreground">{form.book.author}</p>
                  </div>

                  {/* Quote */}
                  <blockquote className="border-l-2 border-primary pl-4">
                    <p className="text-foreground">{`"${form.quote}"`}</p>
                  </blockquote>

                  {/* Layers */}
                  <div className="space-y-3">
                    {form.layers
                      .filter((l) => l.content.trim())
                      .map((layer, index) => (
                        <div
                          key={index}
                          className={cn(
                            'rounded-lg p-3',
                            layer.type === 'me' && 'bg-primary/5',
                            layer.type === 'from-book' && 'bg-muted/50',
                            layer.type === 'context' && 'bg-accent/50',
                          )}
                        >
                          <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                            {layerTypeOptions.find((o) => o.type === layer.type)?.label}
                          </p>
                          <p className="text-body-sm">{layer.content}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between py-3 border-t border-b">
                  <div className="flex items-center gap-2">
                    {form.isPublic ? (
                      <Globe className="size-4 text-muted-foreground" />
                    ) : (
                      <Lock className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-body-sm">
                      {form.isPublic ? 'World에 공개' : '나만 보기'}
                    </span>
                  </div>
                  <Switch
                    checked={form.isPublic}
                    onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="fixed bottom-14 left-0 right-0 border-t bg-background p-4">
            <div className="flex gap-3 max-w-2xl mx-auto">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={goPrev} className="flex-1">
                  <ArrowLeft className="size-4 mr-2" />
                  이전
                </Button>
              )}

              {currentStep === 'preview' ? (
                <Button onClick={handleSubmit} className="flex-1" disabled={!canGoNext()}>
                  저장하기
                </Button>
              ) : (
                <Button onClick={goNext} className="flex-1" disabled={!canGoNext()}>
                  다음
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </RequireAuth>
  )
}
