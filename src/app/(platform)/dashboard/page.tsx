import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  const profile = profileData as unknown as Database['public']['Tables']['profiles']['Row'] | null

  return (
    <div className="w-full max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Приветствие</h3>
          <p className="text-muted-foreground">Қош келдіңіз, {profile?.display_name || user.email}!</p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Текущий уровень</h3>
          <p className="text-4xl font-bold text-primary">{profile?.level || 1}</p>
          <p className="text-sm text-muted-foreground mt-2">{profile?.xp || 0} XP</p>
        </div>
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg mb-2">Достижения</h3>
          <p className="text-muted-foreground">У вас пока нет достижений. Сыграйте в свою первую игру!</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Популярные игры</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Skeleton cards for games */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-video rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}
