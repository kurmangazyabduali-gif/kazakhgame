export type SourceType = 'government' | 'unesco' | 'federation' | 'academic' | 'secondary'
export type ClaimCategory = 'history' | 'rules' | 'cultural_context' | 'skills' | 'terminology' | 'modern_sport' | 'tradition' | 'cultural_practice'

export interface CulturalSource {
  id: string
  title: string
  publisher: string
  url: string | null
  type: SourceType
  language: 'kk' | 'ru' | 'en'
  accessedAt: string
}

export interface CulturalClaim {
  id: string
  gameSlug: string
  category: ClaimCategory
  claim: string
  sourceIds: string[]
  verified: boolean
  confidence: 'high' | 'medium' | 'low'
}

export const SOURCES: Record<string, CulturalSource> = {
  'unesco-asyk': {
    id: 'unesco-asyk',
    title: 'Kazakh traditional Assyk games',
    publisher: 'UNESCO Intangible Cultural Heritage',
    url: 'https://ich.unesco.org/en/RL/kazakh-traditional-assyk-games-01184',
    type: 'unesco',
    language: 'en',
    accessedAt: '2026-08-15'
  },
  'unesco-qusbegilik': {
    id: 'unesco-qusbegilik',
    title: 'Falconry, a living human heritage',
    publisher: 'UNESCO Intangible Cultural Heritage',
    url: 'https://ich.unesco.org/en/RL/falconry-a-living-human-heritage-01708',
    type: 'unesco',
    language: 'en',
    accessedAt: '2026-08-15'
  },
  'unesco-togyzqumalak': {
    id: 'unesco-togyzqumalak',
    title: 'Traditional intelligence and strategy game: Togyzqumalak',
    publisher: 'UNESCO Intangible Cultural Heritage',
    url: 'https://ich.unesco.org/en/RL/traditional-intelligence-and-strategy-game-togyzqumalak-toguz-korgool-mangala-gcer-01597',
    type: 'unesco',
    language: 'en',
    accessedAt: '2026-08-15'
  },
  'kaz-national-sports-assoc': {
    id: 'kaz-national-sports-assoc',
    title: 'Официальные правила национальных видов спорта',
    publisher: 'Ассоциация национальных видов спорта Республики Казахстан',
    url: null, // Exact deep link is not verified
    type: 'federation',
    language: 'ru',
    accessedAt: '2026-08-15'
  },
  'enc-nomadic-games': {
    id: 'enc-nomadic-games',
    title: 'Энциклопедия кочевых игр',
    publisher: 'Министерство культуры и спорта РК',
    url: null,
    type: 'government',
    language: 'ru',
    accessedAt: '2026-08-15'
  }
}

export const CLAIMS: CulturalClaim[] = [
  // АСЫҚ АТУ
  {
    id: 'asyk-history-1',
    gameSlug: 'asyk-atu',
    category: 'history',
    claim: 'Асық ату — древняя казахская игра, направленная на развитие ловкости, точности и глазомера. Традиционно передаётся из поколения в поколение.',
    sourceIds: ['unesco-asyk'],
    verified: true,
    confidence: 'high'
  },
  {
    id: 'asyk-rules-1',
    gameSlug: 'asyk-atu',
    category: 'modern_sport',
    claim: 'В современном спортивном формате асық ату участники должны выбить асыки из круга (отау) с помощью специального битка (сақа).',
    sourceIds: ['kaz-national-sports-assoc'],
    verified: true,
    confidence: 'high'
  },
  // ТОҒЫЗҚҰМАЛАҚ
  {
    id: 'togyz-history-1',
    gameSlug: 'togyz-kumalak',
    category: 'history',
    claim: 'Тоғызқұмалақ — интеллектуальная стратегическая игра, основанная на математическом расчёте, известная как «дала математикасы» (алгебра кочевников).',
    sourceIds: ['unesco-togyzqumalak'],
    verified: true,
    confidence: 'high'
  },
  {
    id: 'togyz-rules-1',
    gameSlug: 'togyz-kumalak',
    category: 'rules',
    claim: 'Игра ведётся на доске с 18 лунками (отау) и 2 казанами. Для победы необходимо собрать 82 құмалақ (шарика) в свой казан.',
    sourceIds: ['kaz-national-sports-assoc'],
    verified: true,
    confidence: 'high'
  },
  // ЖАМБЫ АТУ
  {
    id: 'jamby-sport-1',
    gameSlug: 'jamby-atu',
    category: 'modern_sport',
    claim: 'Жамбы ату — национальный вид конного спорта, где наездник должен на полном скаку поразить мишень из лука на установленной дистанции.',
    sourceIds: ['kaz-national-sports-assoc'],
    verified: true,
    confidence: 'high'
  },
  // ҚҰСБЕГІЛІК
  {
    id: 'qusbegilik-tradition-1',
    gameSlug: 'kusbegilik',
    category: 'tradition',
    claim: 'Құсбегілік (саятшылық) — искусство охоты с ловчими птицами (бүркіт, ителгі, қаршыға), требующее глубокой духовной связи между человеком и природой.',
    sourceIds: ['unesco-qusbegilik'],
    verified: true,
    confidence: 'high'
  },
  // КЕЛІН ШАЙ
  {
    id: 'kelinshai-context-1',
    gameSlug: 'kelin-shai',
    category: 'cultural_practice',
    claim: 'Келін шай — социальная традиция и проявление гостеприимства. Символизирует уважение невестки (келін) к родственникам мужа и гостям через ритуал подачи чая.',
    sourceIds: ['enc-nomadic-games'],
    verified: true,
    confidence: 'high'
  }
]

// Validation Utility
export function validateCulturalClaims(claims: CulturalClaim[], sources: Record<string, CulturalSource>): void {
  const errors: string[] = []

  claims.forEach(claim => {
    // 1. Claim requires at least one source if verified
    if (claim.verified && claim.sourceIds.length === 0) {
      errors.push(`Claim "${claim.id}" is verified but has no sources.`)
    }

    // 2. Sources must exist in registry
    claim.sourceIds.forEach(sourceId => {
      if (!sources[sourceId]) {
        errors.push(`Claim "${claim.id}" references non-existent source: "${sourceId}".`)
      }
    })

    // 3. Kelin Shai cannot be classified as a sport
    if (claim.gameSlug === 'kelin-shai' && (claim.category === 'modern_sport' || claim.category === 'rules')) {
      errors.push(`Claim "${claim.id}" invalid: Kelin Shai is a cultural_practice, not a sport.`)
    }
  })

  if (errors.length > 0) {
    throw new Error('Cultural Validation Failed:\n' + errors.join('\n'))
  }
}
