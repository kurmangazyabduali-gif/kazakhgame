'use client'

import { useGuestProgress } from '@/lib/useGuestProgress'
import type { GameHistoryEntry } from '@/lib/guestStorage'
import Link from 'next/link'
import { ArrowLeft, Activity, Gamepad2 } from 'lucide-react'

export default function ActivityPage() {
  const progress = useGuestProgress()

  if (!progress) return null

  const history = progress.gameHistory || []

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Профильге қайту
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Activity className="w-10 h-10 text-blue-500" />
          Белсенділік тарихы
        </h1>
        <p className="text-muted-foreground text-lg">
          Сіздің соңғы ойнаған ойындарыңыз бен нәтижелеріңіз хронологиялық ретпен (жергілікті сақталған).
        </p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {history.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Әзірге белсенділік жоқ.
          </div>
        )}

        {history.map((session: GameHistoryEntry, index: number) => {
          const date = new Date(session.timestamp)
          const dateString = date.toLocaleDateString('kk-KZ', { month: 'long', day: 'numeric' })
          const timeString = date.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })

          return (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-semibold text-primary uppercase">{session.gameId}</div>
                  <div className="text-xs text-muted-foreground text-right">
                    <span className="block font-medium text-foreground">{dateString}</span>
                    {timeString}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <div className="bg-secondary/50 rounded-lg px-3 py-2 text-sm flex-1">
                    <span className="block text-muted-foreground text-xs">Ұпай</span>
                    <span className="font-bold">{session.score || 0}</span>
                  </div>
                  <div className="bg-secondary/50 rounded-lg px-3 py-2 text-sm flex-1">
                    <span className="block text-muted-foreground text-xs">Тәжірибе</span>
                    <span className="font-bold text-green-500">+{session.xpEarned || 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
