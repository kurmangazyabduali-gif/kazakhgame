import { GAMES_METADATA } from '@/lib/data/games'
import { CLAIMS, SOURCES } from '@/lib/data/culturalSources'
import { GLOSSARY } from '@/lib/data/culturalGlossary'
import { CheckCircle, ExternalLink, Info, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'
import { CulturalBadge } from '@/components/ui/heritage/CulturalBadge'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'

export const metadata = {
  title: 'ULY DALA — Культурный контекст',
  description: 'История, правила, культурный контекст и цифровые адаптации национальных игр и традиций Казахстана.',
}

export default function CulturePage() {
  const games = Object.values(GAMES_METADATA)

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      
      {/* 1. Header Area */}
      <MaterialSurface material="felt" className="py-20 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 text-gold mx-auto mb-6 opacity-60" />
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground uppercase">
            Культурный контекст
          </h1>
          <p className="text-text-muted max-w-3xl mx-auto text-lg md:text-xl font-heading tracking-widest">
            Истоки игровых механик, традиций и навыков, представленных в ULY DALA. 
            Все данные верифицированы историками и исследователями.
          </p>
        </div>
      </MaterialSurface>

      {/* 2. Content */}
      <div className="w-full max-w-5xl mx-auto p-6 py-16 space-y-24">
        {games.map((game, index) => {
          const gameClaims = CLAIMS.filter(c => c.gameSlug === game.slug)
          const gameTerms = GLOSSARY.filter(g => g.gameSlug === game.slug)
          
          if (gameClaims.length === 0) return null

          return (
            <div key={game.slug} id={game.slug} className="relative">
              
              {/* Divider if not first */}
              {index > 0 && <OrnamentDivider className="mb-24 opacity-50" />}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                
                {/* Left sidebar - Title & Description */}
                <div className="md:col-span-4 flex flex-col">
                  <div className="sticky top-24">
                    <CulturalBadge variant="gold" className="mb-4">
                      {game.slug === 'kelin-shai' ? 'Традиция' : 'Спорт'}
                    </CulturalBadge>
                    
                    <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-foreground">
                      {game.title}
                    </h2>
                    
                    <p className="text-text-muted mb-8 font-serif leading-relaxed text-lg">
                      {game.description}
                    </p>
                    
                    <Link href={`/games/info/${game.slug}`} className="block">
                      <HeritageButton variant="primary" className="w-full">
                        Перейти к игре
                      </HeritageButton>
                    </Link>
                  </div>
                </div>

                {/* Right content - Museum Data */}
                <div className="md:col-span-8">
                  <MaterialSurface material="none" className="bg-surface border border-border/40 rounded-3xl p-8 shadow-sm">
                    
                    {/* Claims */}
                    <div className="space-y-12">
                      {gameClaims.map(claim => (
                        <div key={claim.id} className="relative">
                          <div className="flex items-center gap-3 mb-4 border-b border-border/40 pb-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gold">
                              {claim.category === 'history' ? 'История' : 
                               claim.category === 'modern_sport' ? 'Современный Спорт' : 
                               claim.category === 'tradition' || claim.category === 'cultural_practice' ? 'Традиция' : 
                               claim.category === 'rules' ? 'Правила' : claim.category}
                            </h3>
                            {claim.verified && (
                              <span className="px-2 py-0.5 bg-gold/10 text-gold rounded border border-gold/20 text-[10px] font-bold uppercase flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Верифицировано
                              </span>
                            )}
                          </div>
                          
                          <p className="text-lg leading-relaxed mb-6 font-serif text-foreground/90">{claim.claim}</p>
                          
                          {/* Sources */}
                          <div className="flex flex-wrap gap-2">
                            {claim.sourceIds.map(sourceId => {
                              const source = SOURCES[sourceId]
                              return source ? (
                                <div key={sourceId} className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border/50 rounded text-xs font-medium group hover:border-gold/30 transition-colors">
                                  <span className="opacity-50 uppercase tracking-wider">{source.type}</span>
                                  <span className="w-px h-3 bg-border"></span>
                                  <span className="font-bold text-foreground/80">{source.publisher}</span>
                                  {source.url && (
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="ml-1 opacity-40 hover:opacity-100 hover:text-gold transition-opacity">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Glossary terms */}
                      {gameTerms.length > 0 && (
                        <div className="pt-8 mt-12 border-t border-border/40">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6">Терминология</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gameTerms.map(term => (
                              <div key={term.term} className="bg-background/50 p-5 rounded-xl border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-display font-bold text-2xl text-foreground">{term.term}</span>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted px-2 py-0.5 border border-border rounded">{term.language}</span>
                                </div>
                                <div className="text-sm text-gold font-medium mb-3">{term.transliteration}</div>
                                <p className="text-sm text-text-muted leading-relaxed">{term.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Digital disclaimer */}
                      <div className="pt-8 mt-12 border-t border-border/40 flex items-start gap-4">
                        <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                        <p className="text-xs text-text-muted uppercase tracking-wider leading-relaxed">
                          Представленная на платформе игровая механика является цифровой адаптацией 
                          и не заменяет реальные правила или культурную практику.
                        </p>
                      </div>

                    </div>
                  </MaterialSurface>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
