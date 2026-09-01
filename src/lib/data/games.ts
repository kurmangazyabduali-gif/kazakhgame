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
  'hantalapay': {
    id: 'hantalapay',
    slug: 'hantalapay',
    title: 'Ханталапай',
    description: 'Асықтарды шашып, Ханды бірінші болып іліп кет! Шапшаңдық пен реакция ойыны.',
    category: 'Ұлттық ойын',
    difficulty: 'Medium',
    skills: ['Реакция', 'Шапшаңдық', 'Көру зейіні'],
    imageUrl: '/images/games/hantalapay-bg.jpg'
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
  'zhamby-atu': {
    id: 'zhamby-atu',
    slug: 'zhamby-atu',
    title: 'Жамбы ату',
    description: 'Стрельба из лука на скаку',
    category: 'Спорт',
    difficulty: 'Hard',
    skills: ['Координация', 'Реакция', 'Тайминг'],
    imageUrl: '/images/games/jamby-atu.jpg'
  },
  'arqan-tartys': {
    id: 'arqan-tartys',
    slug: 'arqan-tartys',
    title: 'Арқан тартыс',
    description: 'Күш пен ырғаққа құрылған дәстүрлі арқан тартыс',
    category: 'Спорт',
    difficulty: 'Medium',
    skills: ['Ырғақ', 'Күш', 'Команда рухы'],
    imageUrl: '/images/games/arqan-tartys-bg.jpg'
  },
  'qol-kures': {
    id: 'qol-kures',
    slug: 'qol-kures',
    title: 'Қол күрес',
    description: 'Күш, шыдамдылық пен дұрыс тактикаға негізделген дәстүрлі қол күрес белдесуі',
    category: 'Ұлттық спорт',
    difficulty: 'Medium',
    skills: ['Күш', 'Төзімділік', 'Ракция және Тайминг'],
    imageUrl: '/images/games/qol-kures.jpg'
  }
}
