'use client'

import dynamic from 'next/dynamic'

// We dynamically import the actual Phaser game component so it doesn't run on the server
// Phaser requires the 'window' and 'document' objects to exist
const PhaserGame = dynamic(
  () => import('@/games/zhamby-atu/ZhambyAtuGame'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-black text-amber-500 font-sans tracking-widest animate-pulse">
        ЖҮКТЕЛУДЕ...
      </div>
    ),
  }
)

export default function GameClientWrapper() {
  return (
    <div className="relative w-full h-full">
      <PhaserGame />
    </div>
  )
}
