export interface LevelConfig {
  id: number
  title: string
  subtitle: string
  difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'
  aiName: string
  description: string
  startPosition: number // starting offset, e.g. -0.5 for disadvantage
  xpReward: number
  staminaMultiplier: number // AI stamina multiplier
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'Оқу-жаттығу',
    subtitle: 'Бастау қадамдары',
    difficulty: 'BALDYRGAN',
    aiName: 'Ербол (Нұсқаушы)',
    description: 'Қол күрес негіздерін үйреніңіз. Қарсыласыңыз әлсіз әрі баяу әрекет етеді.',
    startPosition: 0,
    xpReward: 100,
    staminaMultiplier: 0.8
  },
  {
    id: 2,
    title: 'Бірінші сын',
    subtitle: 'Жас батыр',
    difficulty: 'BALDYRGAN',
    aiName: 'Әлихан',
    description: 'Жас және тәжірибесіз батырмен алғашқы шынайы белдесу.',
    startPosition: 0,
    xpReward: 150,
    staminaMultiplier: 1.0
  },
  {
    id: 3,
    title: 'Шыдамдылық сыны',
    subtitle: 'Төзімділікке күрес',
    difficulty: 'SHAKIRT',
    aiName: 'Марат',
    description: 'Марат шаршауды білмейді. Күшті үнемдеп, қысымды дұрыс бөлуді үйреніңіз.',
    startPosition: 0,
    xpReward: 200,
    staminaMultiplier: 1.2
  },
  {
    id: 4,
    title: 'Қарсы шабуыл',
    subtitle: 'Тактикалық белдесу',
    difficulty: 'SHAKIRT',
    aiName: 'Серік',
    description: 'Серік қарсыластың шаршауын күтіп, кенеттен шабуыл жасауды ұнатады.',
    startPosition: 0,
    xpReward: 250,
    staminaMultiplier: 1.0
  },
  {
    id: 5,
    title: 'Жылдамдық үстемдігі',
    subtitle: 'Ракция мен тайминг',
    difficulty: 'SHAKIRT',
    aiName: 'Бауыржан',
    description: 'Бауыржанның реакциясы өте жылдам. PERFECT WINDOW сәттерін мүлт жібермеңіз.',
    startPosition: 0,
    xpReward: 300,
    staminaMultiplier: 1.1
  },
  {
    id: 6,
    title: 'Камбек мектебі',
    subtitle: 'Төменнен көтерілу',
    difficulty: 'SHAKIRT',
    aiName: 'Дәурен',
    description: 'Белдесуді тиімсіз позициядан бастайсыз. COMEBACK механикасын қолданып, жеңіске жетіңіз.',
    startPosition: -0.5,
    xpReward: 350,
    staminaMultiplier: 1.0
  },
  {
    id: 7,
    title: 'Азулы қарсылас',
    subtitle: 'Шеберлік шыңы',
    difficulty: 'SHEBER',
    aiName: 'Асқар',
    description: 'Асқар — кәсіби спортшы. Ол сіздің әрбір қателігіңізді өз пайдасына шешеді.',
    startPosition: 0,
    xpReward: 400,
    staminaMultiplier: 1.2
  },
  {
    id: 8,
    title: 'Қол күрес шебері',
    subtitle: 'Алыптар айқасы',
    difficulty: 'MAJSTER',
    aiName: 'Тараз Алыптарынан Нұрлан',
    description: 'Даланың абсолютті чемпионы. Ешқандай қателік жібермеу керек!',
    startPosition: 0,
    xpReward: 500,
    staminaMultiplier: 1.5
  }
]

export function getLevelConfig(levelId: number): LevelConfig {
  return LEVELS.find(l => l.id === levelId) || LEVELS[0]
}
