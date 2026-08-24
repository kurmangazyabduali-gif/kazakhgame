'use client'

interface MapProps {
  selectedRegionId: string | null
  discoveredRegions: string[]
  onRegionSelect: (id: string) => void
}

export function KazakhstanMap({ selectedRegionId, discoveredRegions, onRegionSelect }: MapProps) {
  // Abstract/geometric representation of Kazakhstan's 5 macro regions
  // using stylized paths that fit a modern premium UI.
  // The viewBox is generic (0 0 1000 600) to keep paths manageable.
  
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRegionSelect(id)
    }
  }

  const getRegionClass = (id: string) => {
    const isSelected = selectedRegionId === id
    const isDiscovered = discoveredRegions.includes(id)

    let baseClass = "transition-all duration-300 cursor-pointer outline-none focus:stroke-primary focus:stroke-2 "
    
    if (isSelected) {
      baseClass += "fill-primary/80 stroke-primary stroke-2"
    } else if (isDiscovered) {
      baseClass += "fill-primary/20 stroke-primary/50 hover:fill-primary/40 hover:stroke-primary"
    } else {
      baseClass += "fill-secondary stroke-border hover:fill-secondary/80 hover:stroke-primary/50"
    }

    return baseClass
  }

  return (
    <div className="relative w-full aspect-[5/3] max-h-[70vh] flex items-center justify-center p-4">
      {/* Background glow for premium feel */}
      <div className="absolute inset-0 from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, var(--tw-gradient-stops))' }} />

      <svg 
        viewBox="0 0 1000 600" 
        className="w-full h-full drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Қазақстанның интерактивті картасы"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* West Region */}
        <path
          d="M 50,320 C 60,240 110,200 130,200 C 180,200 240,230 300,190 C 320,210 330,240 350,270 C 370,290 380,320 360,350 C 320,370 290,430 250,490 C 200,490 130,510 90,470 C 70,440 110,420 110,390 C 110,360 40,340 50,320 Z"
          className={getRegionClass('west')}
          onClick={() => onRegionSelect('west')}
          onKeyDown={(e) => handleKeyDown(e, 'west')}
          role="button"
          tabIndex={0}
          aria-label="Батыс Қазақстан"
          aria-pressed={selectedRegionId === 'west'}
        />
        
        {/* North Region */}
        <path
          d="M 300,190 C 330,150 350,100 390,100 C 440,100 460,80 520,40 C 580,60 650,80 700,90 C 710,130 680,200 660,240 C 580,250 520,260 450,270 C 400,270 340,240 300,190 Z"
          className={getRegionClass('north')}
          onClick={() => onRegionSelect('north')}
          onKeyDown={(e) => handleKeyDown(e, 'north')}
          role="button"
          tabIndex={0}
          aria-label="Солтүстік Қазақстан"
          aria-pressed={selectedRegionId === 'north'}
        />

        {/* Central Region */}
        <path
          d="M 350,270 C 400,270 450,270 450,270 C 520,260 580,250 660,240 C 680,270 720,300 750,340 C 730,380 680,400 600,440 C 520,440 460,440 400,440 C 370,400 370,370 350,270 Z"
          className={getRegionClass('central')}
          onClick={() => onRegionSelect('central')}
          onKeyDown={(e) => handleKeyDown(e, 'central')}
          role="button"
          tabIndex={0}
          aria-label="Орталық Қазақстан"
          aria-pressed={selectedRegionId === 'central'}
        />

        {/* South Region */}
        <path
          d="M 250,490 C 290,430 320,370 360,350 C 370,370 370,400 400,440 C 460,440 520,440 600,440 C 620,470 640,510 650,540 C 600,560 560,570 540,570 C 480,540 420,510 320,470 C 280,470 260,490 250,490 Z"
          className={getRegionClass('south')}
          onClick={() => onRegionSelect('south')}
          onKeyDown={(e) => handleKeyDown(e, 'south')}
          role="button"
          tabIndex={0}
          aria-label="Оңтүстік Қазақстан"
          aria-pressed={selectedRegionId === 'south'}
        />

        {/* East Region */}
        <path
          d="M 700,90 C 780,90 830,110 880,130 C 930,140 960,170 980,150 C 970,210 940,310 920,370 C 850,370 780,370 750,340 C 720,300 680,270 660,240 C 680,200 710,130 700,90 Z"
          className={getRegionClass('east')}
          onClick={() => onRegionSelect('east')}
          onKeyDown={(e) => handleKeyDown(e, 'east')}
          role="button"
          tabIndex={0}
          aria-label="Шығыс Қазақстан"
          aria-pressed={selectedRegionId === 'east'}
        />

        {/* Region Labels */}
        <g className="pointer-events-none fill-current font-bold text-[12px] tracking-widest uppercase">
          <text x="180" y="340" textAnchor="middle" className={selectedRegionId === 'west' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Батыс</text>
          <text x="500" y="160" textAnchor="middle" className={selectedRegionId === 'north' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Солтүстік</text>
          <text x="530" y="350" textAnchor="middle" className={selectedRegionId === 'central' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Орталық</text>
          <text x="475" y="490" textAnchor="middle" className={selectedRegionId === 'south' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Оңтүстік</text>
          <text x="790" y="240" textAnchor="middle" className={selectedRegionId === 'east' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Шығыс</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground pointer-events-none bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/50"></div>
          <span>Зерттелген</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary border-2 border-primary"></div>
          <span className="text-foreground font-bold">Таңдалған</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border"></div>
          <span>Зерттелмеген</span>
        </div>
      </div>
    </div>
  )
}
