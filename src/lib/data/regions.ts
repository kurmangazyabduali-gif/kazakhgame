export interface Region {
  id: string
  name: string
  nameKk: string
  nameRu: string
  nameEn: string
  games: string[] // slugs matching GameMetadata
  traditions: string[]
  description: string
  verified: boolean
  sourceIds: string[]
}

export const REGIONS: Record<string, Region> = {
  'north': {
    id: 'north',
    name: 'Солтүстік Қазақстан',
    nameKk: 'Солтүстік Қазақстан',
    nameRu: 'Северный Казахстан',
    nameEn: 'Northern Kazakhstan',
    games: ['kusbegilik'],
    traditions: ['Охота с собаками (тазы)', 'Зимние виды конного спорта'],
    description: 'Культурная зона исследования: Северный макро-регион. Известен зимними видами конного спорта и охоты.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'south': {
    id: 'south',
    name: 'Оңтүстік Қазақстан',
    nameKk: 'Оңтүстік Қазақстан',
    nameRu: 'Южный Казахстан',
    nameEn: 'Southern Kazakhstan',
    games: ['asyk-atu', 'kelin-shai'],
    traditions: ['Празднование Наурыз', 'Традиционное гостеприимство'],
    description: 'Культурная зона исследования: Южный макро-регион. Центр весенних традиций и обрядов гостеприимства.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'west': {
    id: 'west',
    name: 'Батыс Қазақстан',
    nameKk: 'Батыс Қазақстан',
    nameRu: 'Западный Казахстан',
    nameEn: 'Western Kazakhstan',
    games: ['jamby-atu'],
    traditions: ['Суровые степные игры', 'Конно-спортивные состязания'],
    description: 'Культурная зона исследования: Западный макро-регион. Известен выдающимися мастерами верховой езды и стрельбы.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'east': {
    id: 'east',
    name: 'Шығыс Қазақстан',
    nameKk: 'Шығыс Қазақстан',
    nameRu: 'Восточный Казахстан',
    nameEn: 'Eastern Kazakhstan',
    games: ['togyzqumalak'],
    traditions: ['Алтайские традиции', 'Лесные и горные промыслы'],
    description: 'Культурная зона исследования: Восточный макро-регион. Место развития интеллектуальных игр и глубоких философских традиций Алтая.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'central': {
    id: 'central',
    name: 'Орталық Қазақстан',
    nameKk: 'Орталық Қазақстан',
    nameRu: 'Центральный Казахстан',
    nameEn: 'Central Kazakhstan',
    games: [],
    traditions: ['Степные курултаи', 'Песенные состязания (айтыс)'],
    description: 'Культурная зона исследования: Центральный макро-регион. Сарыарка — сердце Великой Степи.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  }
}
