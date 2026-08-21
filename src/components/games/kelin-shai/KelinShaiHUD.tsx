'use client'

import { ScenarioState, ScenarioStep } from '@/games/engine/scenario/types'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'
import { Button } from '@/components/ui/button'

interface HUDProps {
  state: ScenarioState | null
  currentStep: ScenarioStep | null
  feedbackMessage: string | null
  engine: ScenarioEngine | null
}

export default function KelinShaiHUD({ state, currentStep, feedbackMessage, engine }: HUDProps) {
  if (!state) return null

  // Calculate progress safely based on completed actions (mock)
  const steps = 4
  const progress = Math.min(Math.floor(state.completedActions.length / 2), steps)

  const handleGreet = () => {
    if (engine) {
      engine.performAction({
        id: 'act_' + Date.now(),
        type: 'greet',
        targetId: 'guest',
      })
    }
  }

  // Define clear contextual instructions
  let instructionText = ''
  if (currentStep?.id === 'step1_greet') instructionText = 'Нажмите кнопку "Сәлемдесу", чтобы поприветствовать гостя.'
  else if (currentStep?.id === 'step2_prepare_table') instructionText = 'Перетащите бауырсаки, курт и сладости на дастархан (стол).'
  else if (currentStep?.id?.startsWith('step3') || currentStep?.id?.startsWith('step4') || currentStep?.id?.startsWith('step5')) {
    instructionText = 'Наведите чайник на пустую пиалу, чтобы налить чай, затем перетащите её нужному гостю.'
  }

  return (
    <div className="absolute top-[64px] left-0 w-full h-[calc(100%-64px)] pointer-events-none p-4 md:p-8 flex flex-col justify-between z-20">
      
      {/* Top Center Minimal Premium HUD */}
      <div className="w-full flex justify-center mt-4">
        <div className="flex flex-col items-center pointer-events-auto">
          <div className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1 drop-shadow-md">
            КЕЛІН ШАЙ
          </div>
          <div className="text-xl font-display font-bold text-white drop-shadow-lg mb-2 uppercase tracking-widest text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {currentStep ? currentStep.title : 'Аяқталуда'}
          </div>
          <div className="text-sm font-heading text-white/90 mb-2 text-center max-w-md drop-shadow-md" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>
            {instructionText}
          </div>
          
          {/* Action Buttons for non-physical interactions */}
          {currentStep?.id === 'step1_greet' && (
            <Button onClick={handleGreet} className="mt-4 bg-[#D4AF37] hover:bg-[#b08d29] text-[#1a110a] px-8 py-2 rounded-full font-bold shadow-2xl border border-white/20 transform transition active:scale-95">
              Сәлемдесу
            </Button>
          )}

          <div className="flex gap-2 mt-4">
            {Array.from({ length: steps }).map((_, i) => (
              <span 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i < progress ? 'bg-gold' : 'bg-gold/20'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Screen Feedback (e.g. Guest reaction) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-40">
        {feedbackMessage && (
          <div className="text-[#D4AF37] font-display text-2xl font-bold tracking-[0.1em] text-center drop-shadow-2xl animate-in fade-in duration-500" style={{ textShadow: '0 2px 15px rgba(0,0,0,1)' }}>
            {feedbackMessage}
          </div>
        )}
      </div>
    </div>
  )
}
