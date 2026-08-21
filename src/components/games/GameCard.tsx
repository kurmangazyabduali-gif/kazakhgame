import Link from 'next/link'
import Image from 'next/image'

export type GameStatus = 'available' | 'in-progress' | 'completed' | 'locked' | 'coming-soon'

export interface GameCardProps {
  slug: string
  title: string
  category: string
  description: string
  imageUrl: string
  status: GameStatus
  progress?: number
  bestScore?: number
}

export function GameCard({
  slug,
  title,
  category,
  description,
  imageUrl,
  status,
  progress,
  bestScore
}: GameCardProps) {
  const isPlayable = status === 'available' || status === 'in-progress' || status === 'completed'

  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 ${status === 'locked' || status === 'coming-soon' ? 'opacity-70 grayscale' : ''}`}>
      <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-muted-foreground font-semibold uppercase tracking-widest">{title}</span>
        )}
        
        {/* Status Badge */}
        {status === 'coming-soon' && (
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md font-semibold">
            Жақында
          </div>
        )}
        {status === 'completed' && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-semibold flex items-center gap-1">
            <span>✓</span> Аяқталды
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold text-primary uppercase tracking-wider">{category}</div>
          {bestScore !== undefined && (
            <div className="text-xs font-bold text-muted-foreground">Рекорд: {bestScore}</div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        {progress !== undefined && status === 'in-progress' && (
          <div className="w-full bg-secondary rounded-full h-1.5 mb-4">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        )}

        {isPlayable ? (
          <Link href={`/games/info/${slug}`} className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors inline-block text-center">
            {status === 'in-progress' ? 'Жалғастыру' : 'Ойнау'}
          </Link>
        ) : (
          <button disabled className="w-full py-2 bg-secondary text-secondary-foreground font-medium rounded-md opacity-50 cursor-not-allowed">
            Қолжетімсіз
          </button>
        )}
      </div>
    </div>
  )
}
