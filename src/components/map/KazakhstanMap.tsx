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
        aria-label="Интерактивная карта Казахстана"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* West Region */}
        <path
          d="M 50,300 L 150,150 L 300,200 L 350,350 L 250,500 L 100,450 Z"
          className={getRegionClass('west')}
          onClick={() => onRegionSelect('west')}
          onKeyDown={(e) => handleKeyDown(e, 'west')}
          role="button"
          tabIndex={0}
          aria-label="Западный Казахстан"
          aria-pressed={selectedRegionId === 'west'}
        />
        
        {/* North Region */}
        <path
          d="M 300,200 L 500,50 L 700,100 L 650,250 L 450,280 Z"
          className={getRegionClass('north')}
          onClick={() => onRegionSelect('north')}
          onKeyDown={(e) => handleKeyDown(e, 'north')}
          role="button"
          tabIndex={0}
          aria-label="Северный Казахстан"
          aria-pressed={selectedRegionId === 'north'}
        />

        {/* Central Region */}
        <path
          d="M 350,350 L 450,280 L 650,250 L 750,350 L 600,450 L 400,450 Z"
          className={getRegionClass('central')}
          onClick={() => onRegionSelect('central')}
          onKeyDown={(e) => handleKeyDown(e, 'central')}
          role="button"
          tabIndex={0}
          aria-label="Центральный Казахстан"
          aria-pressed={selectedRegionId === 'central'}
        />

        {/* South Region */}
        <path
          d="M 250,500 L 350,350 L 400,450 L 600,450 L 650,550 L 400,580 Z"
          className={getRegionClass('south')}
          onClick={() => onRegionSelect('south')}
          onKeyDown={(e) => handleKeyDown(e, 'south')}
          role="button"
          tabIndex={0}
          aria-label="Южный Казахстан"
          aria-pressed={selectedRegionId === 'south'}
        />

        {/* East Region */}
        <path
          d="M 700,100 L 950,150 L 900,400 L 750,350 L 650,250 Z"
          className={getRegionClass('east')}
          onClick={() => onRegionSelect('east')}
          onKeyDown={(e) => handleKeyDown(e, 'east')}
          role="button"
          tabIndex={0}
          aria-label="Восточный Казахстан"
          aria-pressed={selectedRegionId === 'east'}
        />

        {/* Region Labels (Rendered on top) */}
        <g className="pointer-events-none fill-current font-bold text-[10px] tracking-widest uppercase">
          <text x="200" y="325" textAnchor="middle" className={selectedRegionId === 'west' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Батыс</text>
          <text x="500" y="165" textAnchor="middle" className={selectedRegionId === 'north' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Солтүстік</text>
          <text x="530" y="360" textAnchor="middle" className={selectedRegionId === 'central' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Орталық</text>
          <text x="475" y="480" textAnchor="middle" className={selectedRegionId === 'south' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Оңтүстік</text>
          <text x="790" y="250" textAnchor="middle" className={selectedRegionId === 'east' ? 'fill-primary-foreground' : 'fill-muted-foreground'}>Шығыс</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground pointer-events-none bg-background/80 backdrop-blur-sm p-3 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/50"></div>
          <span>Исследованный</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary border-2 border-primary"></div>
          <span className="text-foreground font-bold">Выбранный</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border"></div>
          <span>Неизведанный</span>
        </div>
      </div>
    </div>
  )
}
