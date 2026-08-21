'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EagleProfile, useKusbegilikEngine } from '../engine'
import { Activity, Target, Shield, Zap, TrendingUp, Play, Crosshair, type LucideIcon } from 'lucide-react'
import { KusbegilikMissionScene } from '../components/KusbegilikMissionScene'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

function StatBar({ label, value, icon: Icon, color }: { label: string, value: number, icon: LucideIcon, color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="flex items-center gap-2 font-medium">
          <Icon className={`w-4 h-4 ${color}`} />
          {label}
        </span>
        <span className="font-mono">{value}/100</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')} transition-all`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  )
}

export function EagleProfileView() {
  const [profile, setProfileState] = useState<EagleProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const gameState = useKusbegilikEngine(s => s.gameState)
  const setProfile = useKusbegilikEngine(s => s.setProfile)
  const startMission = useKusbegilikEngine(s => s.startMission)

  useEffect(() => {
    async function loadProfile() {
      const mockProfile: EagleProfile = {
        name: 'Мұзбалақ',
        level: 1,
        experience: 0,
        trust: 50,
        speed: 20,
        stamina: 20,
        turning: 20,
        reaction: 20,
        focus: 20,
        divePower: 20,
        accuracy: 20,
        missions_completed: 0
      }
      setProfileState(mockProfile)
      setProfile(mockProfile)
      setLoading(false)
    }
    
    loadProfile()
  }, [setProfile])

  if (gameState === 'PLAYING') {
    return <div className="absolute inset-0 z-50 bg-background"><KusbegilikMissionScene /></div>
  }

  if (loading) return <div>Загрузка профиля бүркіта...</div>
  if (!profile) return <div>Ошибка загрузки</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Profile Stats */}
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Бүркіт: {profile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🦅</div>
              <div className="text-xl font-bold">Деңгей {profile.level}</div>
              <div className="text-sm text-muted-foreground">Тәжірибе: {profile.experience} XP</div>
            </div>

            <StatBar label="Сенім (Trust)" value={profile.trust} icon={Shield} color="text-yellow-500" />
            <StatBar label="Жылдамдық (Speed)" value={profile.speed} icon={Activity} color="text-blue-500" />
            <StatBar label="Төзімділік (Stamina)" value={profile.stamina} icon={Zap} color="text-green-500" />
            <StatBar label="Дәлдік (Accuracy)" value={profile.accuracy} icon={Target} color="text-red-500" />
            <StatBar label="Назар (Focus)" value={profile.focus} icon={Crosshair} color="text-purple-500" />
            <StatBar label="Пикирование (Dive)" value={profile.divePower} icon={TrendingUp} color="text-orange-500" />
          </CardContent>
        </Card>
      </div>

      {/* Missions Hub */}
      <div className="md:col-span-2 space-y-6">
        <Alert>
          <AlertTitle>Келесі қадам</AlertTitle>
          <AlertDescription>
            Бүркіт дайын. Онымен жаттығу жасаңыз немесе аңға шығыңыз.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => startMission('training_1')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Жаттығу 1: Басқару</span>
                <Play className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Үйрену үшін шеңберлерден өтіңіз. (Қолмен басқару)</p>
            </CardContent>
          </Card>

          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => startMission('hunt_1')}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Охота 1: Түлкі</span>
                <Play className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Жердегі нысананы тауып, пикирование жасаңыз.</p>
            </CardContent>
          </Card>
          
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Охота 2: Қасқыр</span>
                <span>🔒</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Қасқыр аулау (Деңгей 3 қажет).</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
