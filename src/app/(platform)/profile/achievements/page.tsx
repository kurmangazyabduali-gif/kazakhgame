'use client'

import { useGuestProgress } from '@/lib/useGuestProgress'
import Link from 'next/link'
import { ArrowLeft, Trophy, Lock } from 'lucide-react'

// Hardcoded achievements for guest mode since DB is disconnected from user
const allAchievements = [
  { id: 'first_win', title: 'Алғашқы жеңіс', description: 'Кез келген ойында бірінші рет жеңіске жету', icon: '🥇', xp_reward: 50 },
  { id: 'sharpshooter', title: 'Мерген', description: 'Жамбы атуда 3 нысанаға дәл тигізу', icon: '🏹', xp_reward: 100 },
  { id: 'strategy_master', title: 'Стратегия шебері', description: 'Тоғызқұмалақта AI-ді жеңу', icon: '🧠', xp_reward: 150 },
  { id: 'hospitality', title: 'Қонақжай', description: 'Келін шайда барлық қонақтарды риза ету', icon: '🫖', xp_reward: 80 },
  { id: 'eagle_tamer', title: 'Құсбегі', description: 'Құсбегілікте жемтікті сәтті ұстау', icon: '🦅', xp_reward: 120 }
]

export default function AchievementsPage() {
  const progress = useGuestProgress()

  if (!progress) return null

  const unlockedIds = new Set(progress.achievements || [])
  const categories = ['Барлығы', 'Ойын', 'Прогресс', 'Мастерлік']

  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <Link href="/profile" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Профильге қайту
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-500" />
          Жетістіктер
        </h1>
        <p className="text-muted-foreground text-lg">
          Барлық ашылған ({unlockedIds.size} / {allAchievements.length}) және қолжетімді жетістіктер (жергілікті сақталған).
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map(ach => {
          const isUnlocked = unlockedIds.has(ach.id)
          
          return (
            <div 
              key={ach.id} 
              className={`p-6 rounded-2xl border transition-all ${isUnlocked ? 'bg-card shadow-sm border-primary/20' : 'bg-secondary/20 grayscale opacity-70'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${isUnlocked ? 'bg-primary/10 shadow-inner' : 'bg-secondary'}`}>
                  {isUnlocked ? ach.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                </div>
                {isUnlocked && (
                  <div className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Ашылды</div>
                )}
              </div>
              
              <h3 className="font-bold text-lg mb-1">{ach.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ach.description}</p>
              
              <div className="text-xs font-semibold text-primary uppercase">
                {ach.xp_reward ? `+${ach.xp_reward} XP` : 'Сыйлық жоқ'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
