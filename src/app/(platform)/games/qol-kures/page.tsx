import { Metadata } from 'next'
import GameClientWrapper from '@/components/games/qol-kures/GameClientWrapper'

export const metadata: Metadata = {
  title: 'Қол күрес | ULY DALA',
  description: 'Қазақтың дәстүрлі қол күрес ойыны — күш, төзімділік және тактикалық белдесу',
}

export default function QolKuresPage() {
  return (
    // Fixed viewport container sitting below platform navbar (64px)
    <div
      className="w-full overflow-hidden bg-[#120904]"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <GameClientWrapper />
    </div>
  )
}
