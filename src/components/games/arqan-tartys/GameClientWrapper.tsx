'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Phaser game component so it never runs on the
// server — Phaser requires 'window'/'document' at module init.
const PhaserGame = dynamic(
  () => import('@/games/arqan-tartys/ArqanTartysPhaser'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-[#e8b978] text-[#3a2a10] font-serif tracking-widest animate-pulse">
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
