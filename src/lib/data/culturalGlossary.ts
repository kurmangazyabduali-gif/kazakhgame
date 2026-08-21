export interface GlossaryTerm {
  term: string
  language: 'kk' | 'ru'
  transliteration: string
  meaning: string
  gameSlug: string | null
  sourceIds: string[]
}

export const GLOSSARY: GlossaryTerm[] = [
  // Асық ату
  {
    term: 'Асық',
    language: 'kk',
    transliteration: 'Asyq',
    meaning: 'Кость надпяточного сустава овцы или барана, используемая как основной игровой снаряд.',
    gameSlug: 'asyk-atu',
    sourceIds: ['unesco-asyk']
  },
  {
    term: 'Сақа',
    language: 'kk',
    transliteration: 'Saqa',
    meaning: 'Крупный, утяжелённый асык, используемый в качестве битка для выбивания других асыков.',
    gameSlug: 'asyk-atu',
    sourceIds: ['kaz-national-sports-assoc']
  },
  {
    term: 'Алшы',
    language: 'kk',
    transliteration: 'Alshy',
    meaning: 'Наивысшее положение асыка (на ребре, выемкой вверх). Символ удачи.',
    gameSlug: 'asyk-atu',
    sourceIds: ['unesco-asyk']
  },
  // Тоғызқұмалақ
  {
    term: 'Құмалақ',
    language: 'kk',
    transliteration: 'Qumalaq',
    meaning: 'Игровой шарик. Изначально использовался овечий помёт, позже — деревянные, каменные или пластиковые шарики.',
    gameSlug: 'togyzqumalak',
    sourceIds: ['unesco-togyzqumalak']
  },
  {
    term: 'Отау',
    language: 'kk',
    transliteration: 'Otau',
    meaning: 'Игровая лунка на доске. Символизирует "юрту" или "очаг". На доске 18 таких лунок (по 9 у каждого игрока).',
    gameSlug: 'togyzqumalak',
    sourceIds: ['unesco-togyzqumalak']
  },
  {
    term: 'Қазан',
    language: 'kk',
    transliteration: 'Qazan',
    meaning: 'Большая накопительная лунка, куда игрок собирает выигранные құмалақ. Символизирует "котёл".',
    gameSlug: 'togyzqumalak',
    sourceIds: ['unesco-togyzqumalak']
  },
  // Құсбегілік
  {
    term: 'Бүркіт',
    language: 'kk',
    transliteration: 'Bürkit',
    meaning: 'Беркут. Крупный хищный орёл, используемый для охоты на лисиц и волков.',
    gameSlug: 'kusbegilik',
    sourceIds: ['unesco-qusbegilik']
  },
  {
    term: 'Томаға',
    language: 'kk',
    transliteration: 'Tomağa',
    meaning: 'Специальный кожаный колпачок, надеваемый на голову ловчей птице для сохранения её спокойствия.',
    gameSlug: 'kusbegilik',
    sourceIds: ['enc-nomadic-games']
  },
  // Жамбы ату
  {
    term: 'Жамбы',
    language: 'kk',
    transliteration: 'Jamby',
    meaning: 'Мишень. Изначально — слиток серебра, подвешенный на волосяной веревке.',
    gameSlug: 'jamby-atu',
    sourceIds: ['enc-nomadic-games']
  },
  // Келін шай
  {
    term: 'Келін',
    language: 'kk',
    transliteration: 'Kelin',
    meaning: 'Невестка. Молодая жена, вошедшая в семью мужа.',
    gameSlug: 'kelin-shai',
    sourceIds: ['enc-nomadic-games']
  }
]
