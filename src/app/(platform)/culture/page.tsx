'use client'

import React from 'react'
import { Spectral, Golos_Text } from 'next/font/google'
import { GAMES_METADATA } from '@/lib/data/games'
import { CLAIMS, SOURCES } from '@/lib/data/culturalSources'
import { GLOSSARY } from '@/lib/data/culturalGlossary'
import { CheckCircle, ExternalLink, Info, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'

const spectral = Spectral({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
})

export default function CulturePage() {
  const games = Object.values(GAMES_METADATA)

  return (
    <div className={`${spectral.className} ${golos.className} uly-home w-full flex flex-col min-h-screen bg-[#FBF9F3] text-[#211C15] relative overflow-hidden home-grain`}>
      {/* Background Ambience / Dotgrid */}
      <div className="absolute inset-0 pointer-events-none home-dotgrid opacity-75 z-0" />
      
      {/* Header Area */}
      <section className="relative py-28 border-b border-[rgba(33,28,21,0.1)] z-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <BookOpen className="w-12 h-12 text-[var(--home-terracotta)] mx-auto mb-6 opacity-80" />
          <h1 className="font-display-premium text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Мәдени Мұра
          </h1>
          <p className="text-[var(--home-ink-soft)] max-w-2xl mx-auto text-base font-body-premium uppercase tracking-widest leading-relaxed">
            CULTURAL HERITAGE ATLAS
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="w-full max-w-5xl mx-auto p-6 py-20 space-y-32 relative z-10">
        {games.map((game, index) => {
          const gameClaims = CLAIMS.filter(c => c.gameSlug === game.slug)
          const gameTerms = GLOSSARY.filter(g => g.gameSlug === game.slug)
          
          if (gameClaims.length === 0) return null

          return (
            <div key={game.slug} id={game.slug} className="relative animate-in fade-in duration-700">
              
              {/* Divider if not first */}
              {index > 0 && <OrnamentDivider className="mb-24 opacity-20" />}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                
                {/* Left sidebar - Title & Description */}
                <div className="md:col-span-4 flex flex-col md:sticky md:top-28">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-[var(--home-turquoise-soft)] text-[var(--home-turquoise)] self-start mb-4">
                    {game.category === 'Ұлттық дәстүр' ? 'Дәстүр' : 'Спорт'}
                  </span>
                  
                  <h2 className="font-display-premium text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
                    {game.title}
                  </h2>
                  
                  <p className="text-[var(--home-ink-soft)] mb-8 font-body-premium leading-relaxed text-sm md:text-base">
                    {game.description}
                  </p>
                  
                  <Link href={`/games/info/${game.slug}`} className="block">
                    <button className="w-full px-6 py-3 bg-[var(--home-terracotta)] hover:bg-[var(--home-terracotta)]/90 text-white font-body-premium font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(193,80,46,0.2)] hover:scale-[1.02]">
                      Ойынға көшу
                    </button>
                  </Link>
                </div>

                {/* Right content - Museum Data */}
                <div className="md:col-span-8">
                  <div className="bg-white border border-[rgba(33,28,21,0.1)] rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(33,28,21,0.04)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                      <KazakhOrnament variant="geometric" className="w-48 h-48 text-[var(--home-ink)]" />
                    </div>
                    
                    {/* Claims */}
                    <div className="space-y-12">
                      {gameClaims.map(claim => (
                        <div key={claim.id} className="relative">
                          <div className="flex items-center gap-3 mb-4 border-b border-[rgba(33,28,21,0.08)] pb-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--home-saffron)] font-body-premium">
                              {claim.category === 'history' ? 'Тарих' : 
                               claim.category === 'modern_sport' ? 'Қазіргі спорт' : 
                               claim.category === 'tradition' || claim.category === 'cultural_practice' ? 'Дәстүр' : 
                               claim.category === 'rules' ? 'Ережелер' : claim.category}
                            </h3>
                            {claim.verified && (
                              <span className="px-2 py-0.5 bg-[var(--home-turquoise-soft)] text-[var(--home-turquoise)] rounded border border-[var(--home-turquoise)]/20 text-[9px] font-bold uppercase flex items-center gap-1 font-body-premium">
                                <CheckCircle className="w-3 h-3" /> Мақұлданған
                              </span>
                            )}
                          </div>
                          
                          <p className="text-lg leading-relaxed mb-6 font-display-premium text-[var(--home-ink)]/90">{claim.claim}</p>
                          
                          {/* Sources */}
                          <div className="flex flex-wrap gap-2">
                            {claim.sourceIds.map(sourceId => {
                              const source = SOURCES[sourceId]
                              return source ? (
                                <div key={sourceId} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FBF9F3] border border-[rgba(33,28,21,0.08)] rounded-xl text-[10px] font-medium transition-colors hover:border-[var(--home-saffron)] font-body-premium">
                                  <span className="opacity-50 uppercase tracking-wider text-xs">{source.type}</span>
                                  <span className="w-px h-3 bg-border/20"></span>
                                  <span className="font-bold text-[var(--home-ink-soft)]">{source.publisher}</span>
                                  {source.url && (
                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="ml-1 opacity-45 hover:opacity-100 hover:text-[var(--home-terracotta)] transition-opacity">
                                      <ExternalLink className="w-3 h-3" />
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
                        <div className="pt-10 mt-12 border-t border-[rgba(33,28,21,0.08)]">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--home-saffron)] mb-6 font-body-premium">Терминология</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gameTerms.map(term => (
                              <div key={term.term} className="bg-[#FBF9F3]/60 hover:bg-[#FBF9F3] p-5 rounded-2xl border border-[rgba(33,28,21,0.06)] transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-display-premium font-bold text-xl text-[var(--home-ink)]">{term.term}</span>
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--home-ink-soft)] px-2 py-0.5 border border-[rgba(33,28,21,0.1)] rounded font-body-premium">{term.transliteration}</span>
                                </div>
                                <p className="text-sm text-[var(--home-ink-soft)] leading-relaxed font-body-premium">{term.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Digital disclaimer */}
                      <div className="pt-8 mt-12 border-t border-[rgba(33,28,21,0.08)] flex items-start gap-4">
                        <Info className="w-5 h-5 text-[var(--home-saffron)] shrink-0 mt-0.5" />
                        <p className="text-[10px] text-[var(--home-ink-soft)] uppercase tracking-wider leading-relaxed font-body-premium">
                          Платформада ұсынылған ойын механикасы цифрлық адаптация болып табылады және шынайы мәдени дәстүрлерді алмастырмайды.
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
