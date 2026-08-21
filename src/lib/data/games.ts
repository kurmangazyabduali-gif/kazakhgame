export type GameDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface GameMetadata {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: GameDifficulty
  skills: string[]
  imageUrl: string
}

export const GAMES_METADATA: Record<string, GameMetadata> = {
  'asyk-atu': {
    id: 'asyk-atu',
    slug: 'asyk-atu',
    title: 'Асық ату',
    description: 'Ойын сипаттамасы',
    category: 'Ұлттық дәстүр',
    difficulty: 'Easy',
    skills: ['Точность', 'Глазомер', 'Расчет силы'],
    imageUrl: '/images/games/asyk-atu.jpg'
  },
  'kelin-shai': {
    id: 'kelin-shai',
    slug: 'kelin-shai',
    title: 'Келін шай',
    description: 'Традиционное чаепитие',
    category: 'Ұлттық дәстүр',
    difficulty: 'Medium',
    skills: ['Внимательность', 'Память', 'Этикет'],
    imageUrl: '/images/games/kelin-shai.jpg'
  },
  'togyz-kumalak': {
    id: 'togyz-kumalak',
    slug: 'togyz-kumalak',
    title: 'Тоғызқұмалақ',
    description: 'Интеллектуальная настольная игра',
    category: 'Стратегия',
    difficulty: 'Hard',
    skills: ['Логика', 'Стратегия', 'Математический счет'],
    imageUrl: '/images/games/togyzqumalak.jpg'
  },
  'jamby-atu': {
    id: 'jamby-atu',
    slug: 'jamby-atu',
    title: 'Жамбы ату',
    description: 'Стрельба из лука на скаку',
    category: 'Спорт',
    difficulty: 'Hard',
    skills: ['Координация', 'Реакция', 'Тайминг'],
    imageUrl: '/images/games/jamby-atu.jpg'
  },
  'kusbegilik': {
    id: 'kusbegilik',
    slug: 'kusbegilik',
    title: 'Құсбегілік',
    description: 'Искусство охоты с беркутом',
    category: 'Ұлттық дәстүр',
    difficulty: 'Medium',
    skills: ['Наблюдение', 'Пространственное мышление', 'Фокус'],
    imageUrl: '/images/games/kusbegilik.jpg'
  }
}
