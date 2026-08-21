'use client'

import dynamic from 'next/dynamic'

const GameWrapper = dynamic(
  () => import('@/components/games/togyz-kumalak/GameWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0704' }}>
        <div className="text-amber-600/60 text-sm animate-pulse">Загрузка игры...</div>
      </div>
    ),
  }
)

export default function GameClientWrapper({ sessionId }: { sessionId: string }) {
  return <GameWrapper sessionId={sessionId} />
}
