import { Metadata } from 'next'
import GameClientWrapper from '@/components/games/zhamby-atu/GameClientWrapper'

export const metadata: Metadata = {
  title: 'Жамбы Ату | ULY DALA',
  description: 'Дәстүрлі қазақ садақ ату өнері',
}

export default function ZhambyAtuPage() {
  return (
    // Fixed to full viewport, sits below platform navbar (which is ~64px)
    <div
      className="w-full overflow-hidden bg-[#1a78c8]"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <GameClientWrapper />
    </div>
  )
}
