import Link from 'next/link'
import { LevelService } from '@/lib/services/LevelService'
import { GameCard } from '@/components/games/GameCard'
import { Play, Trophy, Activity, ArrowRight, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { GuestMigrationPrompt } from '@/components/auth/GuestMigrationPrompt'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentXp = 0
  let displayName = 'Қонақ (Гость)'
  let gamesPlayed = 0

  if (user) {
    const { data: profile } = (await supabase.from('profiles').select('*').eq('id', user.id).single()) as unknown as { data: { xp: number, username?: string, display_name?: string } | null }
    if (profile) {
      currentXp = profile.xp || 0
      displayName = profile.username || profile.display_name || user.email?.split('@')[0] || 'User'
    }
    const { count } = (await supabase.from('game_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)) as unknown as { count: number | null }
    gamesPlayed = count || 0
  }

  const currentLevel = LevelService.calculateLevel(currentXp)
  const xpForNextLevel = LevelService.getXpForNextLevel(currentLevel)
  const prevLevelXp = LevelService.getXpForNextLevel(currentLevel - 1)
  const xpProgress = Math.max(0, Math.min(100, ((currentXp - prevLevelXp) / (xpForNextLevel - prevLevelXp)) * 100))

  return (
    <div className="w-full flex flex-col min-h-screen bg-background relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/textures/sand.png')] mix-blend-overlay z-0" />

      {/* Hero Section */}
      <MaterialSurface material="felt" className="pt-24 pb-16 border-b border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
           <KazakhOrnament variant="qoshqar-muiiz" animate="spin" className="w-[600px] h-[600px] text-gold" />
        </div>

        <div className="max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-16 h-16 rounded-full border border-gold/30 bg-surface flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)]">
               <KazakhOrnament variant="tumar" className="w-8 h-8 text-gold" />
            </div>
            <div>
              <p className="text-gold font-heading text-xs font-bold uppercase tracking-widest mb-1">Сенің жолың</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-wide">
                Қош келдіңіз, {displayName}
              </h1>
            </div>
          </div>
          <p className="text-text-muted text-lg font-heading tracking-wider max-w-2xl mt-4">
            ULY DALA платформасындағы саяхатыңызды жалғастырыңыз. Ойнаңыз, үйреніңіз, мұраны сақтаңыз.
          </p>
        </div>
      </MaterialSurface>

      <div className="w-full max-w-7xl mx-auto p-6 pt-12 pb-32 relative z-10">
        {user && <GuestMigrationPrompt />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* 1. Current Level Path */}
          <div className="lg:col-span-2 p-10 rounded-3xl border border-border/20 bg-surface shadow-xl flex flex-col justify-center relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <KazakhOrnament variant="geometric" className="w-32 h-32 text-gold" />
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2 font-heading">Ағымдағы деңгей</div>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground flex items-end gap-3">
                  {currentLevel} <span className="text-xl font-heading font-normal text-text-muted uppercase tracking-widest mb-1">| {LevelService.getLevelTitle(currentLevel)}</span>
                </h3>
              </div>
              <div className="w-20 h-20 bg-background border border-gold/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <Shield className="w-10 h-10 text-gold" />
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-xs font-heading tracking-widest font-bold">
                <span className="text-gold">{currentXp} XP</span>
                <span className="text-text-muted">{xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-background border border-border/20 rounded-full h-2 overflow-hidden shadow-inner">
                <div 
                  className="bg-gold h-2 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(212,175,55,0.8)] relative" 
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/40 blur-sm"></div>
                </div>
              </div>
              <p className="text-xs text-text-muted mt-4 font-heading tracking-wider">
                Келесі деңгейге дейін <span className="text-gold font-bold">{xpForNextLevel - currentXp} XP</span> қалды
              </p>
            </div>
          </div>

          {/* 2. Continue Playing CTA */}
          <div className="p-10 rounded-3xl border border-gold/30 bg-background shadow-[0_0_40px_rgba(212,175,55,0.05)] flex flex-col justify-between relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <h3 className="font-display font-bold text-3xl mb-4 text-foreground flex items-center gap-3">
                Жалғастыру
              </h3>
              <p className="text-text-muted text-sm font-heading tracking-wider leading-relaxed mb-8">
                Соңғы тоқтаған жерден мұраны зерттеуді жалғастырыңыз.
              </p>
            </div>
            
            <Link href="/games" className="relative z-10 w-full">
              <HeritageButton variant="gold" className="w-full shadow-lg group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Play className="w-4 h-4 mr-2" fill="currentColor" /> ОЙНАУ
              </HeritageButton>
            </Link>
          </div>
        </div>

        <OrnamentDivider level="subtle" className="my-12 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          
          {/* 3. Recommended / Atlas Shortcut */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold text-foreground">Ұсынылған ойындар</h2>
              <Link href="/games" className="text-gold text-xs font-heading font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                Барлығын көру <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="max-w-md">
              <GameCard
                slug="asyk-atu"
                title="Асық ату"
                category="Спорт"
                description="Классическая игра кочевников. Развивайте меткость."
                imageUrl="/images/games/asyk-atu.jpg"
                status="available"
              />
            </div>
          </div>

          {/* 4. Recent Activity Sidebar */}
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-foreground flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-gold" />
              Белсенділік
            </h2>
            
            <div className="p-8 rounded-2xl border border-border/20 bg-surface shadow-sm">
              <div className="text-center">
                <span className="block text-[10px] text-text-muted font-heading uppercase tracking-widest mb-2">Ойналған ойындар</span>
                <span className="block font-display text-5xl font-bold text-gold drop-shadow-sm mb-6">{gamesPlayed}</span>
              </div>
              
              <div className="pt-6 border-t border-border/20">
                <Link href="/profile" className="w-full flex items-center justify-center gap-2 text-xs font-heading font-bold uppercase tracking-widest text-text-muted hover:text-gold transition-colors">
                  Толық статистика <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
