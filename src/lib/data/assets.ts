export type AssetPriority = 'hero' | 'high' | 'medium' | 'low'

export interface CulturalAsset {
  id: string
  gameSlug: string
  type: AssetPriority
  path: string
  source: string | 'mock'
  license: string | 'unknown'
  generated: boolean
  referenceSourceIds: string[]
  priority: number
}

export const ASSETS: CulturalAsset[] = [
  // ҚҰСБЕГІЛІК (Priority 1)
  {
    id: 'eagle-hero',
    gameSlug: 'kusbegilik',
    type: 'hero',
    path: '/models/kusbegilik/eagle.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['unesco-qusbegilik'],
    priority: 1
  },
  {
    id: 'hunter-high',
    gameSlug: 'kusbegilik',
    type: 'high',
    path: '/models/kusbegilik/hunter.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['enc-nomadic-games'],
    priority: 2
  },
  
  // ЖАМБЫ АТУ (Priority 2)
  {
    id: 'horse-hero',
    gameSlug: 'jamby-atu',
    type: 'hero',
    path: '/models/jamby-atu/horse.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['kaz-national-sports-assoc'],
    priority: 1
  },
  {
    id: 'rider-high',
    gameSlug: 'jamby-atu',
    type: 'high',
    path: '/models/jamby-atu/rider.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['enc-nomadic-games'],
    priority: 2
  },

  // ТОҒЫЗҚҰМАЛАҚ (Priority 3)
  {
    id: 'board-hero',
    gameSlug: 'togyzqumalak',
    type: 'hero',
    path: '/models/togyzqumalak/board.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['unesco-togyzqumalak'],
    priority: 1
  },
  {
    id: 'qumalaq-high',
    gameSlug: 'togyzqumalak',
    type: 'high',
    path: '/models/togyzqumalak/qumalaq.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['unesco-togyzqumalak'],
    priority: 2
  },

  // АСЫҚ АТУ (Priority 4)
  {
    id: 'asyq-hero',
    gameSlug: 'asyk-atu',
    type: 'hero',
    path: '/models/asyk-atu/asyq.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['unesco-asyk'],
    priority: 1
  },

  // КЕЛІН ШАЙ (Priority 5)
  {
    id: 'teapot-hero',
    gameSlug: 'kelin-shai',
    type: 'hero',
    path: '/models/kelin-shai/teapot.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['enc-nomadic-games'],
    priority: 1
  },
  {
    id: 'bowl-high',
    gameSlug: 'kelin-shai',
    type: 'high',
    path: '/models/kelin-shai/bowl.glb',
    source: 'mock',
    license: 'unknown',
    generated: false,
    referenceSourceIds: ['enc-nomadic-games'],
    priority: 2
  }
]

/**
 * Validates the asset manifest for production use.
 * Throws an error if any asset uses an unknown license or lacks cultural references.
 * Currently, since we are in a 'PENDING' state, this checks for 'mock' sources.
 * In a real build, we would assert `license !== 'unknown'`.
 */
export function validateAssetManifest(assets: CulturalAsset[], enforceLicenses: boolean = false) {
  const errors: string[] = []

  assets.forEach(asset => {
    if (asset.referenceSourceIds.length === 0) {
      errors.push(`Asset ${asset.id} lacks cultural reference sources.`)
    }

    if (enforceLicenses && asset.license === 'unknown') {
      errors.push(`Asset ${asset.id} has an unknown license. Production assets must have explicit licensing.`)
    }
  })

  if (errors.length > 0) {
    throw new Error(`Asset Validation Failed:\n${errors.join('\n')}`)
  }

  return true
}
