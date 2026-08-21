'use client'

import dynamic from 'next/dynamic'

const AsykAtuWrapper = dynamic(() => import('@/components/games/AsykAtuWrapper'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-gold/60 animate-pulse">ЖҮКТЕЛУДЕ...</p>
      </div>
    </div>
  )
})

export default function GameClientWrapper({ sessionId }: { sessionId: string }) {
  return <AsykAtuWrapper sessionId={sessionId} />
}
