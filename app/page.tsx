import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { WorldFeed } from '@/components/world-feed'

export default function WorldPage() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="PANGEA" align="center" showLoginButton />
      <main className="max-w-2xl mx-auto">
        <WorldFeed />
      </main>
      <BottomNav />
    </div>
  )
}
