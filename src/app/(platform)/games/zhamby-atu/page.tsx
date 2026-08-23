import { Metadata } from 'next'
import GameClientWrapper from '@/components/games/zhamby-atu/GameClientWrapper'

export const metadata: Metadata = {
  title: 'Жамбы Ату | ULY DALA',
  description: 'Дәстүрлі қазақ садақ ату өнері',
}

export default function ZhambyAtuPage() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white">
      <GameClientWrapper />
    </div>
  )
}
