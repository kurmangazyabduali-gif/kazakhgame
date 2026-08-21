'use client'

import { useState, useEffect } from 'react'
import { guestStorage } from '@/lib/guestStorage'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { useRouter } from 'next/navigation'

export function GuestMigrationPrompt() {
  const [hasProgress, setHasProgress] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const progress = guestStorage.get()
    if (progress.xp > 0 || progress.gamesPlayed > 0) {
      setTimeout(() => setHasProgress(true), 0)
    }
  }, [])

  if (!hasProgress) return null

  const handleMigrate = async () => {
    setIsMigrating(true)
    try {
      const progress = guestStorage.get()
      const res = await fetch('/api/auth/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress })
      })

      if (res.ok) {
        guestStorage.clear()
        setHasProgress(false)
        router.refresh()
      } else {
        console.error('Migration failed')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsMigrating(false)
    }
  }

  const handleDismiss = () => {
    // Just clear it so it doesn't bother them again
    guestStorage.clear()
    setHasProgress(false)
  }

  return (
    <div className="bg-surface-elevated border border-gold/50 rounded-2xl p-6 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4">
      <div>
        <h3 className="font-display text-xl text-gold mb-2">Найден гостевой прогресс!</h3>
        <p className="text-sm text-text-muted">
          Мы нашли ваши сохраненные результаты. Хотите привязать их к вашему новому аккаунту?
        </p>
      </div>
      <div className="flex gap-4 shrink-0 w-full md:w-auto">
        <HeritageButton variant="secondary" size="sm" onClick={handleDismiss} disabled={isMigrating} className="flex-1 md:flex-none">
          Не сейчас
        </HeritageButton>
        <HeritageButton variant="primary" size="sm" onClick={handleMigrate} disabled={isMigrating} className="flex-1 md:flex-none">
          {isMigrating ? 'Импорт...' : 'Сохранить'}
        </HeritageButton>
      </div>
    </div>
  )
}
