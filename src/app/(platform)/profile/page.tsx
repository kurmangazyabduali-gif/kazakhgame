import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database'
import Image from 'next/image'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  const profile = profileData as unknown as Database['public']['Tables']['profiles']['Row'] | null

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-8">Профиль</h1>
      
      <div className="bg-card text-card-foreground rounded-xl border p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl overflow-hidden shrink-0 relative">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
          ) : (
            <span>{profile?.display_name?.charAt(0) || user.email?.charAt(0)}</span>
          )}
        </div>
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold">{profile?.display_name || user.email}</h2>
            <p className="text-muted-foreground">{profile?.username ? `@${profile.username}` : ''}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-secondary px-4 py-2 rounded-md">
              <span className="block text-sm text-muted-foreground">Уровень</span>
              <span className="font-bold">{profile?.level || 1}</span>
            </div>
            <div className="bg-secondary px-4 py-2 rounded-md">
              <span className="block text-sm text-muted-foreground">Опыт</span>
              <span className="font-bold">{profile?.xp || 0} XP</span>
            </div>
            <div className="bg-secondary px-4 py-2 rounded-md">
              <span className="block text-sm text-muted-foreground">Общий счет</span>
              <span className="font-bold">{profile?.total_score || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
