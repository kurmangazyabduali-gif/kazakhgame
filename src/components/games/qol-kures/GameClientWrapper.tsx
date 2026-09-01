'use client'

import dynamic from 'next/dynamic'

const QolKuresGame = dynamic(
  () => import('@/games/qol-kures/QolKuresGameComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#120904] text-[#ffe5b4] font-serif tracking-widest animate-pulse">
        ЖҮКТЕЛУДЕ...
      </div>
    )
  }
)

export default function GameClientWrapper() {
  return (
    <div className="relative w-full h-full">
      <QolKuresGame />
    </div>
  )
}
