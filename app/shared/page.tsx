import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { LibraryContent } from './_components/LibraryContent'

export default function SharedPage() {
  return (
    <div className="min-h-screen pb-16">
      <Header title="Shared" align="left" />

      <LibraryContent />

      <BottomNav />
    </div>
  )
}
