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
    games: [],
    traditions: ['Тазымен аңшылық', 'Қысқы ат спорты түрлері'],
    description: 'Зерттеудің мәдени аймағы: Солтүстік макро-аймақ. Ат спортының қысқы түрлерімен және аңшылықпен танымал.',
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
    traditions: ['Наурыз мейрамы', 'Дәстүрлі қонақжайлылық'],
    description: 'Зерттеудің мәдени аймағы: Оңтүстік макро-аймақ. Көктемгі дәстүрлер мен қонақжайлылық салт-жоралғыларының орталығы.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'west': {
    id: 'west',
    name: 'Батыс Қазақстан',
    nameKk: 'Батыс Қазақстан',
    nameRu: 'Западный Казахстан',
    nameEn: 'Western Kazakhstan',
    games: ['zhamby-atu'],
    traditions: ['Сұрапыл дала ойындары', 'Ат спорты жарыстары'],
    description: 'Зерттеудің мәдени аймағы: Батыс макро-аймақ. Атқа міну мен садақ атудың көрнекті шеберлерімен танымал.',
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
    traditions: ['Алтай дәстүрлері', 'Орман және тау кәсіпшілігі'],
    description: 'Зерттеудің мәдени аймағы: Шығыс макро-аймақ. Зияткерлік ойындар мен Алтайдың терең философиялық дәстүрлері дамыған мекен.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  },
  'central': {
    id: 'central',
    name: 'Орталық Қазақстан',
    nameKk: 'Орталық Қазақстан',
    nameRu: 'Центральный Казахстан',
    nameEn: 'Central Kazakhstan',
    games: ['arqan-tartys'],
    traditions: ['Дала құрылтайлары', 'Айтыс өнері'],
    description: 'Зерттеудің мәдени аймағы: Орталық макро-аймақ. Сарыарқа — Ұлы Даланың жүрегі.',
    verified: true,
    sourceIds: ['enc-nomadic-games']
  }
}
