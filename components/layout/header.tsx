export function Header({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-center h-12 px-4 max-w-lg mx-auto">
        <h1 className="font-semibold text-lg tracking-tight">{title}</h1>
      </div>
    </header>
  )
}
