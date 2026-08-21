'use client'

import { useKusbegilikEngine } from '../engine'
import { Activity, Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FlightUI() {
  const { 
    gameState, missionState, currentMissionId,
    speed, altitude, pitch, currentStamina,
    controlMode, setControlMode, activeCommand, setCommand,
    targetLocated, targetDistance,
    reset, setGameState
  } = useKusbegilikEngine()

  const isHunt = currentMissionId?.startsWith('hunt')

  if (gameState === 'HUB') return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top HUD */}
      <div className="p-4 flex justify-between items-start">
        {/* Telemetry & Stamina */}
        <div className="bg-background/80 backdrop-blur border p-4 rounded-xl shadow-md space-y-2 pointer-events-auto">
          <div className="text-sm font-bold text-muted-foreground uppercase">Eagle Telemetry</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>SPD: {speed}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>ALT: {altitude}</span>
            </div>
            <div>PTC: {pitch}°</div>
          </div>
          <div className="pt-2 border-t mt-2">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>ЭНЕРГИЯ (Stamina)</span>
              <span>{Math.round(currentStamina)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${currentStamina > 20 ? 'bg-green-500' : 'bg-red-500'}`} 
                style={{ width: `${currentStamina}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Mission Status */}
        <div className="bg-background/80 backdrop-blur border p-4 rounded-xl shadow-md text-right min-w-[200px]">
          <div className="text-sm font-bold text-muted-foreground uppercase mb-1">Mission State</div>
          <div className="text-2xl font-black text-primary uppercase">{missionState}</div>
          {isHunt && targetLocated && (
            <div className="text-sm font-bold text-orange-500 mt-2 flex justify-end items-center gap-1">
              <Target className="w-4 h-4" />
              Дистанция: {Math.round(targetDistance)}m
            </div>
          )}
        </div>
      </div>

      {/* Control Modes and Commands (Bottom) */}
      <div className="p-6 pointer-events-auto flex flex-col items-center gap-4">
        
        {/* Commands Panel */}
        {controlMode === 'COMMAND' && (
          <div className="flex gap-2 bg-black/50 p-2 rounded-xl backdrop-blur">
            <Button size="sm" variant={activeCommand === 'FOLLOW' ? 'default' : 'secondary'} onClick={() => setCommand('FOLLOW')}>
              Follow Target
            </Button>
            <Button size="sm" variant={activeCommand === 'DIVE' ? 'default' : 'secondary'} onClick={() => setCommand('DIVE')}>
              Execute Dive
            </Button>
            <Button size="sm" variant={activeCommand === 'RETURN' ? 'default' : 'secondary'} onClick={() => setCommand('RETURN')}>
              Return to Master
            </Button>
          </div>
        )}

        {/* Toggle Direct/Command */}
        <div className="bg-background/80 backdrop-blur border p-2 rounded-full flex gap-2">
          <Button 
            variant={controlMode === 'DIRECT' ? 'default' : 'ghost'} 
            className="rounded-full px-6"
            onClick={() => setControlMode('DIRECT')}
          >
            Direct Control
          </Button>
          <Button 
            variant={controlMode === 'COMMAND' ? 'default' : 'ghost'} 
            className="rounded-full px-6"
            onClick={() => setControlMode('COMMAND')}
          >
            Command Mode
          </Button>
        </div>

        {controlMode === 'DIRECT' && (
          <div className="text-xs text-white bg-black/60 px-4 py-2 rounded-full">
            <strong>W/S</strong>: Pitch | <strong>A/D</strong>: Turn | <strong>Shift</strong>: Boost
          </div>
        )}
      </div>

      {/* Finished Modal */}
      {gameState === 'FINISHED' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
          <div className="bg-card p-8 rounded-2xl max-w-sm w-full text-center border">
            <h2 className="text-3xl font-black mb-2 uppercase">Миссия завершена</h2>
            <div className="text-4xl font-mono font-bold text-primary mb-8">+250 XP</div>
            <button 
              onClick={() => {
                reset()
                setGameState('HUB')
              }}
              className="w-full py-3 mt-3 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-md"
            >
              Вернуться в Хаб
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
