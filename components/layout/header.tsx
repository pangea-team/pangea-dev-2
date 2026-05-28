import { cn } from '@/lib/utils'

export function Header({ title, align = 'center' }: { title: string; align?: 'left' | 'center' }) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className={cn(
        'flex items-center h-12 px-4 max-w-lg mx-auto',
        align === 'center' ? 'justify-center' : 'justify-start'
      )}>
        <h1 className="font-semibold text-lg tracking-tight">{title}</h1>
      </div>
    </header>
  )
}
