import { Metadata } from 'next'
import GameClientWrapper from '@/components/games/arqan-tartys/GameClientWrapper'

export const metadata: Metadata = {
  title: 'Арқан тартыс | ULY DALA',
  description: 'Қазақтың дәстүрлі арқан тартыс ойыны — күш, ырғақ және команда рухы',
}

export default function ArqanTartysPage() {
  return (
    // Fixed to full viewport, sits below platform navbar (which is ~64px) —
    // matching Zhamby Atu's page shell so the game canvas fills the screen.
    <div
      className="w-full overflow-hidden bg-[#e8b978]"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <GameClientWrapper />
    </div>
  )
}
