'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Map as MapIcon, User, Gamepad2, Compass, BookOpen, Target, Crosshair } from 'lucide-react'
import { ShanyraqMark } from '@/components/ui/heritage/ShanyraqMark'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { CulturalBadge } from '@/components/ui/heritage/CulturalBadge'

// Slide Types
type SlideType = 'native' | 'iframe'

interface SlideDef {
  id: string
  title: string
  type: SlideType
  url?: string
}

const SHOWCASE_SEQUENCE: SlideDef[] = [
  { id: 'intro', title: 'Введение', type: 'native' },
  { id: 'kazakhstan-map', title: 'Казахстан', type: 'iframe', url: '/map?showcase=true' },
  { id: 'cultural-context', title: 'Культурный Контекст', type: 'native' },
  { id: 'asyk-atu', title: 'Асық ату', type: 'iframe', url: '/games/asyk-atu?showcase=true' },
  { id: 'kelin-shai', title: 'Келін шай', type: 'iframe', url: '/games/kelin-shai?showcase=true' },
  { id: 'togyzqumalak', title: 'Тоғызқұмалақ', type: 'iframe', url: '/games/togyzqumalak?showcase=true' },
  { id: 'jamby-atu', title: 'Жамбы ату', type: 'iframe', url: '/games/jamby-atu?showcase=true' },
  { id: 'kusbegilik', title: 'Құсбегілік', type: 'iframe', url: '/games/kusbegilik?showcase=true' },
  { id: 'learning', title: 'Обучение', type: 'native' },
  { id: 'cultural-map', title: 'Культурная Карта', type: 'iframe', url: '/map?showcase=true&discovered=true' },
  { id: 'profile', title: 'Профиль', type: 'iframe', url: '/profile?showcase=true' },
  { id: 'final', title: 'Финал', type: 'native' }
]

export default function ShowcasePage() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = useCallback(() => {
    if (currentIndex < SHOWCASE_SEQUENCE.length - 1) {
      setCurrentIndex(curr => curr + 1)
    }
  }, [currentIndex])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1)
    }
  }, [currentIndex])

  const handleSkip = useCallback(() => {
    setCurrentIndex(SHOWCASE_SEQUENCE.length - 1)
  }, [])

  const handleReplay = useCallback(() => {
    setCurrentIndex(0)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
        e.preventDefault()
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.code === 'Escape') {
        e.preventDefault()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, handleSkip])

  const currentStep = SHOWCASE_SEQUENCE[currentIndex]
  const nextStep = SHOWCASE_SEQUENCE[currentIndex + 1]

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden text-foreground">
      {/* Top Progress Bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gold/20 bg-primary shadow-lg z-50">
        <div className="flex items-center gap-4">
          <ShanyraqMark size="sm" className="text-gold" />
          <div className="font-display font-black text-xl tracking-widest uppercase text-primary-foreground">ULY DALA</div>
          <div className="h-6 w-px bg-gold/20 mx-2" />
          <div className="text-xs font-bold text-gold uppercase tracking-widest hidden md:block font-heading">
            Showcase Mode
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-xs font-bold text-primary-foreground/50 uppercase tracking-widest font-heading" aria-live="polite">
            {currentIndex + 1} / {SHOWCASE_SEQUENCE.length}
          </div>
          <button 
            aria-label="Пропустить Showcase" 
            onClick={handleSkip} 
            className="text-primary-foreground/50 hover:text-gold transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded font-heading"
          >
            <X className="w-4 h-4" /> ПРОПУСТИТЬ
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="w-full bg-primary h-1 relative overflow-hidden border-b border-gold/10">
        <div 
          className="bg-gold h-1 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--color-gold),0.8)]" 
          style={{ width: `${((currentIndex + 1) / SHOWCASE_SEQUENCE.length) * 100}%` }}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-black">
        {currentStep.type === 'native' ? (
          <NativeSlide step={currentStep} onNext={handleNext} onReplay={handleReplay} />
        ) : (
          <IframeSlide step={currentStep} onNext={handleNext} />
        )}
        
        {/* Preload Next Slide if it's an iframe */}
        {nextStep && nextStep.type === 'iframe' && (
          <iframe 
            key={`preload-${nextStep.id}`}
            src={nextStep.url}
            className="absolute opacity-0 pointer-events-none w-px h-px"
            title={`preload-${nextStep.id}`}
          />
        )}
      </div>
    </div>
  )
}

function NativeSlide({ step, onNext, onReplay }: { step: SlideDef, onNext: () => void, onReplay: () => void }) {
  if (step.id === 'intro') {
    return (
      <MaterialSurface material="nightSky" className="w-full h-full flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
           <KazakhOrnament variant="tumar" className="w-[80vw] h-[80vw] md:w-[800px] md:h-[800px] text-gold" />
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="font-display text-7xl md:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gold/80 mb-6 drop-shadow-2xl">
            ULY DALA
          </h1>
          <p className="text-xl md:text-3xl text-gold/80 font-serif tracking-wide text-center max-w-2xl mb-12">
            Национальные игры Казахстана в новом цифровом формате.
          </p>
          
          <HeritageButton 
            variant="gold" 
            size="lg" 
            onClick={onNext}
            className="min-w-[250px] shadow-[0_0_50px_-10px_rgba(var(--color-gold),0.6)] animate-pulse-glow"
          >
            НАЧАТЬ <ArrowRight className="w-5 h-5 ml-2" />
          </HeritageButton>
        </div>
      </MaterialSurface>
    )
  }

  if (step.id === 'cultural-context') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in slide-in-from-right-8 duration-500 bg-background relative overflow-hidden">
        
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <KazakhOrnament variant="qoshqar-muiiz" className="w-[600px] h-[600px] text-gold transform translate-x-1/4 -translate-y-1/4" />
        </div>
        
        <h2 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight mb-12 text-center text-foreground z-10 relative">
          Культурный Контекст
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full z-10 relative">
          {/* Card 1 */}
          <MaterialSurface material="felt" className="p-8 rounded-3xl border border-border/40 flex flex-col gap-6">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20"><Target className="w-7 h-7" /></div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase text-foreground mb-2">Асық ату</h3>
              <CulturalBadge variant="navy" className="mb-4">Спорт</CulturalBadge>
              <p className="text-text-muted font-serif">Координация, меткость и тактика.</p>
            </div>
          </MaterialSurface>
          {/* Card 2 */}
          <MaterialSurface material="felt" className="p-8 rounded-3xl border border-border/40 flex flex-col gap-6">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20"><Compass className="w-7 h-7" /></div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase text-foreground mb-2">Келін шай</h3>
              <CulturalBadge variant="gold" className="mb-4">Традиция</CulturalBadge>
              <p className="text-text-muted font-serif">Гостеприимство и социальный этикет.</p>
            </div>
          </MaterialSurface>
          {/* Card 3 */}
          <MaterialSurface material="felt" className="p-8 rounded-3xl border border-border/40 flex flex-col gap-6">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20"><BookOpen className="w-7 h-7" /></div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase text-foreground mb-2">Тоғызқұмалақ</h3>
              <CulturalBadge variant="navy" className="mb-4">Спорт</CulturalBadge>
              <p className="text-text-muted font-serif">Алгебра кочевников и математический расчет.</p>
            </div>
          </MaterialSurface>
          {/* Card 4 */}
          <MaterialSurface material="felt" className="p-8 rounded-3xl border border-border/40 flex flex-col gap-6">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20"><Crosshair className="w-7 h-7" /></div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase text-foreground mb-2">Жамбы ату</h3>
              <CulturalBadge variant="navy" className="mb-4">Спорт</CulturalBadge>
              <p className="text-text-muted font-serif">Верховая езда и меткая стрельба.</p>
            </div>
          </MaterialSurface>
          {/* Card 5 */}
          <MaterialSurface material="felt" className="p-8 rounded-3xl border border-border/40 flex flex-col gap-6 md:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-gold/10 text-gold rounded-2xl flex items-center justify-center border border-gold/20"><Compass className="w-7 h-7" /></div>
            <div>
              <h3 className="font-display text-3xl font-bold uppercase text-foreground mb-2">Құсбегілік</h3>
              <CulturalBadge variant="gold" className="mb-4">Традиция</CulturalBadge>
              <p className="text-text-muted font-serif">Искусство охоты с ловчими птицами.</p>
            </div>
          </MaterialSurface>
        </div>

        <HeritageButton variant="primary" onClick={onNext} className="mt-16 z-10 relative">
          ДАЛЕЕ <ArrowRight className="w-5 h-5 ml-2" />
        </HeritageButton>
      </div>
    )
  }

  if (step.id === 'learning') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-8 duration-500 bg-background text-center relative overflow-hidden">
        <h2 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 text-foreground z-10">
          LEARN → PRACTICE → MASTER
        </h2>
        <p className="font-serif text-xl text-text-muted max-w-2xl mb-16 z-10 leading-relaxed">
          Каждый модуль предлагает постепенное погружение: от изучения истории до освоения сложных механик.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full z-10">
          <MaterialSurface material="none" className="flex-1 bg-surface-elevated p-10 rounded-3xl border border-border/50 text-center space-y-6 relative overflow-hidden">
            <div className="font-display text-8xl font-black text-border absolute -top-4 -right-4 opacity-30 select-none">01</div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-widest text-gold relative z-10">LEARN</h3>
            <p className="font-serif text-text-muted relative z-10">Изучение правил, культурного контекста и инвентаря.</p>
          </MaterialSurface>
          
          <MaterialSurface material="none" className="flex-1 bg-surface-elevated p-10 rounded-3xl border border-border/50 text-center space-y-6 relative overflow-hidden">
            <div className="font-display text-8xl font-black text-border absolute -top-4 -right-4 opacity-30 select-none">02</div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-widest text-gold relative z-10">PRACTICE</h3>
            <p className="font-serif text-text-muted relative z-10">Тренировочные миссии с динамической сложностью.</p>
          </MaterialSurface>
          
          <MaterialSurface material="none" className="flex-1 bg-surface-elevated p-10 rounded-3xl border border-border/50 text-center space-y-6 relative overflow-hidden">
            <div className="font-display text-8xl font-black text-border absolute -top-4 -right-4 opacity-30 select-none">03</div>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-widest text-gold relative z-10">MASTER</h3>
            <p className="font-serif text-text-muted relative z-10">Соревнования, достижения и полное освоение навыка.</p>
          </MaterialSurface>
        </div>

        <HeritageButton variant="primary" onClick={onNext} className="mt-16 z-10 relative">
          ПРОДОЛЖИТЬ <ArrowRight className="w-5 h-5 ml-2" />
        </HeritageButton>
      </div>
    )
  }

  if (step.id === 'final') {
    return (
      <MaterialSurface material="nightSky" className="w-full h-full flex flex-col items-center justify-center p-6 animate-in zoom-in duration-700 relative overflow-hidden text-center">
        
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
           <KazakhOrnament variant="tumar" className="w-[80vw] h-[80vw] md:w-[800px] md:h-[800px] text-gold" />
        </div>

        <div className="relative z-10">
          <h1 className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gold/80 mb-6 drop-shadow-2xl">
            ULY DALA
          </h1>
          <p className="font-heading text-2xl md:text-3xl text-gold/80 tracking-widest uppercase mb-20 font-bold">
            Традиция становится интерактивной.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/">
              <HeritageButton variant="gold" size="lg">
                ИССЛЕДОВАТЬ ПЛАТФОРМУ
              </HeritageButton>
            </Link>
            <Link href="/map">
              <HeritageButton variant="cultural" size="lg">
                <MapIcon className="w-5 h-5 mr-2" /> ОТКРЫТЬ КАРТУ
              </HeritageButton>
            </Link>
            <Link href="/games">
              <HeritageButton variant="cultural" size="lg">
                <Gamepad2 className="w-5 h-5 mr-2" /> ИГРЫ
              </HeritageButton>
            </Link>
            <Link href="/profile">
              <HeritageButton variant="cultural" size="lg">
                <User className="w-5 h-5 mr-2" /> ПРОФИЛЬ
              </HeritageButton>
            </Link>
          </div>

          <button 
            onClick={onReplay}
            className="mt-24 text-gold/50 hover:text-gold transition-colors font-bold uppercase tracking-widest text-sm flex items-center justify-center w-full focus:outline-none focus:underline font-heading"
          >
            Повторить Showcase
          </button>
        </div>
      </MaterialSurface>
    )
  }

  return null
}

function IframeSlide({ step, onNext }: { step: SlideDef, onNext: () => void }) {
  const [hasError, setHasError] = useState(false)

  // Focus management text for accessibility
  let focusLabel = ''
  if (step.id === 'asyk-atu') focusLabel = 'Учись → практикуй → совершенствуй'
  if (step.id === 'kelin-shai') focusLabel = 'Культурная интерактивная симуляция'

  return (
    <div className="w-full h-full flex flex-col relative bg-black animate-in fade-in duration-500">
      {/* Decorative Title Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none text-center">
        <div className="bg-primary/80 backdrop-blur-md border border-gold/30 text-gold px-8 py-3 rounded-full font-heading font-bold uppercase tracking-widest shadow-2xl">
          {step.title}
        </div>
        {focusLabel && (
          <div className="mt-4 bg-background/80 border border-border/50 text-text-muted text-xs px-6 py-2 rounded-full tracking-wider font-heading uppercase font-bold shadow-xl">
            {focusLabel}
          </div>
        )}
      </div>
      
      {hasError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-foreground space-y-4">
          <p className="font-heading text-xl font-bold uppercase tracking-widest text-terracotta">Experience временно недоступен</p>
          <p className="font-serif text-sm text-text-muted">Техническая неполадка или отсутствие модуля.</p>
        </div>
      ) : (
        <iframe 
          key={step.id} // Enforces full unmount/mount cycle when step changes
          src={step.url}
          className="w-full h-full border-none"
          allow="autoplay; fullscreen"
          onError={() => setHasError(true)}
          title={`Showcase: ${step.title}`}
        />
      )}

      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4">
        <div className="text-gold/50 text-xs hidden sm:block uppercase tracking-widest font-bold font-heading bg-primary/80 px-4 py-2 rounded-full border border-gold/10 backdrop-blur">
          [Space] / [→]
        </div>
        <HeritageButton variant="gold" onClick={onNext} className="shadow-2xl">
          ДАЛЕЕ <ArrowRight className="w-5 h-5 ml-2" />
        </HeritageButton>
      </div>
    </div>
  )
}
