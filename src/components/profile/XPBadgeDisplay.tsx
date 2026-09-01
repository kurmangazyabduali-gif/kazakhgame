'use client'

import React, { useState, useEffect } from 'react'
import { getUserXp, getCurrentRank, getUnlockedBadges, Badge } from '@/lib/progression/userProgression'

export default function XPBadgeDisplay() {
  const [xp, setXp] = useState(350)
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    setXp(getUserXp())
    setBadges(getUnlockedBadges())
  }, [])

  const rank = getCurrentRank(xp)
  const progressPercent = Math.min(
    100,
    Math.round(((xp - rank.minXp) / (rank.maxXp - rank.minXp)) * 100)
  )

  return (
    <div className="bg-gradient-to-br from-amber-950/80 via-gray-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-white">
      {/* Header Rank Badge */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-2xl font-black text-black shadow-lg">
            {rank.level}
          </div>
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              ШЕН / РАНГ
            </div>
            <div className="text-lg font-black text-white">
              {rank.titleKz} <span className="text-gray-400 text-xs font-normal">({rank.title})</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-black text-yellow-400 drop-shadow">
            {xp} <span className="text-sm font-normal text-amber-200">XP</span>
          </div>
          <div className="text-xs text-gray-400">
            Келесі шенге: {rank.maxXp - xp} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-amber-900/50 mb-5 relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Badges Grid */}
      <div>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <span>🏅</span> АШЫЛҒАН БЕЛГІЛЕР (БЕЙДЖИ)
        </div>
        <div className="grid grid-cols-5 gap-2">
          {badges.map((b) => (
            <div
              key={b.id}
              title={`${b.nameKz} - ${b.description}`}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                b.unlocked
                  ? 'bg-amber-950/40 border-yellow-500/50 text-white shadow-md hover:scale-105'
                  : 'bg-gray-900/40 border-gray-800 text-gray-600 opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl mb-1">{b.icon}</span>
              <span className="text-[10px] font-bold text-center truncate w-full">
                {b.nameKz}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
