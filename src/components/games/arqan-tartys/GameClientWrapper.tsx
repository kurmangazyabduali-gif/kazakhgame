'use client'

import dynamic from 'next/dynamic'

// Dynamically import the 3D Canvas component
const ArqanTartys3D = dynamic(
  () => import('@/games/arqan-tartys/3d/ArqanTartys3D'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-[#e8b978] text-[#3a2a10] font-serif tracking-widest animate-pulse">
        ЖҮКТЕЛУДЕ... 3D
      </div>
    ),
  }
)

const ArqanHUD = dynamic(
  () => import('@/games/arqan-tartys/ui/ArqanHUD'),
  { ssr: false }
)

export default function GameClientWrapper() {
  return (
    <div className="relative w-full h-full bg-[#e8b978]">
      <div className="absolute inset-0 z-0">
        <ArqanTartys3D />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <ArqanHUD />
      </div>
    </div>
  )
}
