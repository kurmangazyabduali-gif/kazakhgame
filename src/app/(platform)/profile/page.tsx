import { createClient } from '@/lib/supabase/server'
import { LevelService } from '@/lib/services/LevelService'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { ProgressCard } from '@/components/heritage/ProgressCard'
import { Trophy, Medal, Star, Target } from 'lucide-react'
import Image from 'next/image'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Handled by middleware
  }

  const { data: profile } = (await supabase.from('profiles').select('*').eq('id', user.id).single()) as unknown as { data: { xp: number, total_score: number, level: number, display_name: string, username: string, avatar_url: string, region_id?: string | null } | null }
  const { data: scores } = (await supabase.from('game_scores').select('score, game_id, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)) as unknown as { data: { score: number, game_id: string, created_at: string }[] | null }
  const { data: userAchievements } = (await supabase.from('user_achievements').select('achievements(*)').eq('user_id', user.id)) as unknown as { data: { achievements: Record<string, unknown> }[] | null }

  const currentXp = profile?.xp || 0
  const totalScore = profile?.total_score || 0
  const currentLevel = LevelService.calculateLevel(currentXp)
  const displayName = profile?.display_name || profile?.username || user.email?.split('@')[0] || 'User'
  const regionName = profile?.region_id ? 'Регион выбран' : 'Регион не указан'

  return (
    <div className="w-full flex flex-col min-h-screen bg-background relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/textures/sand.png')] mix-blend-overlay z-0" />

      {/* Header Area */}
      <MaterialSurface material="nightSky" className="pt-24 pb-16 border-b border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
           <KazakhOrnament variant="tumar" animate="spin" className="w-[600px] h-[600px] text-gold" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-5 transform -translate-x-1/4 translate-y-1/4 pointer-events-none">
           <KazakhOrnament variant="su" animate="float" className="w-[800px] h-[800px] text-primary" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <KazakhOrnament variant="tumar" animate="float" className="w-12 h-12 text-gold mx-auto mb-6 opacity-60" />
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground uppercase tracking-widest drop-shadow-lg">
            Жеке кабинет
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg font-heading tracking-widest">
            THE NOMAD&apos;S PATH
          </p>
        </div>
      </MaterialSurface>

      <div className="w-full max-w-7xl mx-auto p-6 pt-12 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <MaterialSurface material="felt" className="p-10 rounded-3xl text-center border border-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                 <KazakhOrnament variant="geometric" className="w-48 h-48 text-gold" />
              </div>
              
              <div className="relative z-10">
                <div className="w-40 h-40 mx-auto bg-background border-4 border-gold/40 rounded-full flex items-center justify-center overflow-hidden mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:border-gold/80 transition-colors duration-700 relative">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt={displayName} fill sizes="160px" className="object-cover" />
                  ) : (
                    <span className="text-gold font-display text-5xl uppercase tracking-widest drop-shadow-md">{displayName.slice(0, 2)}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h2 className="text-4xl font-bold font-display text-foreground mb-2 drop-shadow-md">{displayName}</h2>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-8">{regionName}</p>
                
                <div className="mt-8 flex flex-col gap-4 border-t border-border/20 pt-8">
                  <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl border border-border/10 backdrop-blur-sm">
                    <span className="text-text-muted text-xs font-heading font-bold uppercase tracking-widest">Уровень</span>
                    <span className="text-3xl font-display font-bold text-foreground drop-shadow-sm">{currentLevel}</span>
                  </div>
                  <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl border border-border/10 backdrop-blur-sm">
                    <span className="text-text-muted text-xs font-heading font-bold uppercase tracking-widest">Звание</span>
                    <span className="text-gold text-lg font-bold font-heading">{LevelService.getLevelTitle(currentLevel)}</span>
                  </div>
                </div>
              </div>
            </MaterialSurface>

            <div className="grid grid-cols-2 gap-6">
               <ProgressCard title="Барлық XP" value={currentXp} icon={<Star className="w-6 h-6 text-gold" />} />
               <ProgressCard title="Ұпайлар" value={totalScore} icon={<Target className="w-6 h-6 text-primary" />} />
            </div>
          </div>

          {/* Right Column: Achievements & History */}
          <div className="lg:col-span-2 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            
            <section>
              <h3 className="font-display text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
                <Trophy className="w-8 h-8 text-gold" />
                Жетістіктер
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userAchievements && userAchievements.length > 0 ? userAchievements.map((ua: { achievements?: { icon?: string, title?: string, description?: string } }, i: number) => (
                  <div key={i} className="group bg-surface hover:bg-surface-elevated border border-border/20 hover:border-gold/30 rounded-2xl p-6 flex gap-5 items-center transition-all duration-500 shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] cursor-pointer">
                    <div className="w-16 h-16 bg-background text-3xl flex items-center justify-center rounded-xl border border-gold/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {ua.achievements?.icon || '🏅'}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg mb-1">{ua.achievements?.title}</div>
                      <div className="text-sm text-text-muted font-heading">{ua.achievements?.description}</div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 text-center p-12 border border-dashed border-gold/20 rounded-3xl bg-surface/30">
                    <KazakhOrnament variant="tumar" className="w-10 h-10 text-gold/50 mx-auto mb-4" />
                    <p className="text-text-muted font-heading text-lg">У вас пока нет достижений. Играйте, чтобы заработать первые награды!</p>
                  </div>
                )}
              </div>
            </section>
            
            <OrnamentDivider level="subtle" className="opacity-50" />

            <section>
              <h3 className="font-display text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
                <Medal className="w-8 h-8 text-gold" />
                Соңғы ойындар
              </h3>
              <div className="space-y-4">
                {scores && scores.length > 0 ? scores.map((score: { score: number, game_id: string, created_at: string }, i: number) => (
                  <div key={i} className="group bg-surface hover:bg-surface-elevated border border-border/20 hover:border-gold/20 rounded-2xl p-6 flex justify-between items-center transition-all duration-500 shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                    <div className="flex items-center gap-6">
                      <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] group-hover:animate-pulse-glow" />
                      <div>
                        <div className="font-bold font-display text-2xl text-foreground mb-1">{score.score} <span className="text-sm font-heading font-normal text-text-muted">ұпай</span></div>
                        <div className="text-xs text-text-muted font-heading tracking-widest">{new Date(score.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-gold font-bold font-heading bg-background border border-gold/20 px-4 py-2 rounded-xl text-xs uppercase tracking-widest shadow-inner group-hover:bg-gold/10 transition-colors">
                      {score.game_id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-12 border border-dashed border-gold/20 rounded-3xl bg-surface/30">
                    <p className="text-text-muted font-heading text-lg">История игр пуста.</p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
