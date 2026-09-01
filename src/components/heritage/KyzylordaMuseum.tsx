'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HomeHeroMapBackground } from '../home/HomeHeroMapBackground'
import { QoshqarMuiz } from '../home/ornaments/QoshqarMuiz'

export interface HeritageItem {
  id: string
  titleKz: string
  titleRu: string
  subtitle: string
  category: string
  categoryKz: string
  image: string
  innerImages?: string[]
  innerCaptions?: string[]
  youtubeUrl: string
  youtubeTitle: string
  descriptionKz: string
  descriptionRu: string
  facts: string[]
  year: string
  location: string
}

export const KYZYLORDA_HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: 'aral-sea',
    titleKz: 'Арал Теңізінің Тарихи Мұрасы',
    titleRu: 'Историко-экологическое Наследие Арала',
    subtitle: 'Теңіз кемелерінің зираты және өлке тарихы',
    category: 'ТАБИҒИ МҰРА',
    categoryKz: 'Табиғи және Тарихи Мұра',
    image: '/images/heritage/aral-cover.png',
    innerImages: [
      '/images/heritage/aral-inner-1.jpg',
      '/images/heritage/aral-inner-2.webp',
    ],
    innerCaptions: [
      '🌊 Солтүстік Арал теңізінің жағалауы мен Солтүстік Арал су айдыны',
      '⚓ Арал қаласындағы шөлде қалған кемелер зираты мен Солтүстік Арал тарихы',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=5k8uT0mY456',
    youtubeTitle: 'Арал теңізінің қайта жандануы',
    year: 'Тарихи дәуір',
    location: 'Арал ауданы, Жалаңаш',
    descriptionKz:
      'Арал теңізі — Қызылорда өңірінің ең үлкен табиғи-тарихи мұрасы. Арал қаласындағы кемелер зираты, Балықшылар мұражайы және Көкарал бөгеті арқылы Солтүстік Аралдың қайта жандануы — әлемдік тарихи құбылыс.',
    descriptionRu:
      'Аральское море — уникальное естественное и культурно-историческое наследие Кызылординского края. Кладбище кораблей в Аральске, музей рыбаков и возрождение Малого Арала через Кокаральскую плотину — мировое наследие.',
    facts: [
      'Арал балықшылар қаласының бай тарихы',
      'Көкарал бөгеті Солтүстік Аралды аман алып қалды',
      'Кемелер зираты — халықаралық туризм нысаны',
    ],
  },
  {
    id: 'korkyt-ata',
    titleKz: 'Қорқыт Ата Кесенесі',
    titleRu: 'Мемориальный комплекс Коркыт Ата',
    subtitle: 'Қобыздан шыққан ұлы саз және дала философтың мұрасы',
    category: 'СӘУЛЕТ МҰРАСЫ',
    categoryKz: 'Сәулет және музыка мұрасы',
    image: '/images/heritage/korkyt-cover.jpg',
    innerImages: [
      '/images/heritage/korkyt-inner-1.jpg',
      '/images/heritage/korkyt-inner-2.webp',
    ],
    innerCaptions: [
      '🏛️ Қорқыт Ата кешенінің аркалы кіреберісі',
      '🎭 Комплекс Коркыт Ата и амфитеатр под открытым небом',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=J8aX5O_7rK0',
    youtubeTitle: 'Қорқыт Ата туралы деректі фильм',
    year: '1980 ж.',
    location: 'Қармақшы ауданы, Жосалы',
    descriptionKz:
      'Қорқыт Ата мемориалы — Сырдария бойында орналасқан, түркі халықтарының ортақ рухани ұстазы, қобыз аспабының негізін қалаушы Қорқыт Атаға арналған сәулеттік кешен. Стела 4 қобыз сияқты соғылып, жел соққанда қобыз үні шығады.',
    descriptionRu:
      'Мемориальный комплекс Коркыт Ата — величественный архитектурный памятник на берегу Сырдарьи, посвященный основателю музыкального инструмента Кобыз, философу и сказителю Коркыт Ата. Памятник выполнен в форме 4 кобызов, издающих музыкальные звуки при порывах ветра.',
    facts: [
      'Архитектор: Бек Ибраев және физик Акустиктер (1980 ж.)',
      'Ескерткіш 4 қобыз бейнесінде соғылған органикалық стела',
      'ЮНЕСКО-ның адамзаттың стенографиялық мұралар тізіміне енгізілген',
    ],
  },
  {
    id: 'baikonur',
    titleKz: 'Байқоңыр Ғарыш Айлағы',
    titleRu: 'Космодром Байконур',
    subtitle: 'Адамзаттың ғарышқа тұңғыш жол салған қасиетті мекені',
    category: 'ҒАРЫШ МҰРАСЫ',
    categoryKz: 'Ғылым және Ғарыш Мұрасы',
    image: '/images/heritage/baikonur-cover.jpg',
    innerImages: [
      '/images/heritage/baikonur-inner-1.jpg',
      '/images/heritage/baikonur-inner-2.jpg',
    ],
    innerCaptions: [
      '🚀 «Союз» ракетасын Байқоңыр старт алаңында дайындау жүйесі',
      '🌌 Гагарин старттық кешені және кабельдік мұнара кешкі уақытта',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=R9j0sT8mX18',
    youtubeTitle: 'Байқоңыр ғарыш айлағының тарихы',
    year: '1955 ж.',
    location: 'Байқоңыр қаласы',
    descriptionKz:
      'Байқоңыр — Қызылорда облысында орналасқан әлемдегі тұңғыш және ең ірі ғарыш айлағы. 1957 жылы Жердің тұңғыш жасанды серігі және 1961 жылы Юрий Гагарин ғарышқа осы жерден ұшты.',
    descriptionRu:
      'Байконур — первый и крупнейший в мире действующий космодром, расположенный в Кызылординской области. Отсюда был запущен первый искусственный спутник Земли (1957) и осуществлен первый полет человека в космос (Юрий Гагарин, 1961).',
    facts: [
      'Тұңғыш ғарыш айлағы (1955 жылы іргесі қаланды)',
      'Гагарин старттық кешені осы жерде орналасқан',
      'Аумағы 6717 шаршы километрді құрайды',
    ],
  },
  {
    id: 'syganak',
    titleKz: 'Сығанақ Ежелгі Қаласы',
    titleRu: 'Древнее городище Сыганак',
    subtitle: 'Қазақ Хандығының ортағасырлық Астанасы',
    category: 'АРХЕОЛОГИЯ',
    categoryKz: 'Археология және Хандық Мұрасы',
    image: '/images/heritage/syganak-cover.jpg',
    innerImages: [
      '/images/heritage/syganak-inner-1.webp',
      '/images/heritage/syganak-inner-2.jpg',
    ],
    innerCaptions: [
      '🏰 Сығанақ қаласының тарихи археологиялық панорамасы мен сызбалары',
      '🏺 Ортағасырлық Сығанақ қалашығындағы археологиялық қазба жұмыстары',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=3R4X7Q9yH10',
    youtubeTitle: 'Сығанақ қаласының құпиялары',
    year: 'VI-XVIII ғасырлар',
    location: 'Жаңақорған ауданы, Сунақата',
    descriptionKz:
      'Сығанақ — VI-XVIII ғасырлардағы ірі сауда және саяси орталық, Қазақ хандығының ең алғашқы астаналарының бірі. Жібек жолы бойында орналасқан бұл қала Сырдария бойындағы басты бекініс болған.',
    descriptionRu:
      'Сыганак — крупный средневековый торговый и политический центр VI-XVIII веков, одна из первых столиц Казахского ханства. Город на Великом Шелковом пути являлся главной крепостью в нижнем течении Сырдарьи.',
    facts: [
      'Қазақ Хандығының алғашқы астаналарының бірі',
      'Ұлы Жібек жолының тоғысқан торғын орталығы',
      'Қалада өзіндік теңге соғатын сарай болған',
    ],
  },
  {
    id: 'jankent',
    titleKz: 'Жанкент Ежелгі Қалашығы',
    titleRu: 'Древнее городище Жанкент (Янгикент)',
    subtitle: 'Оғыз Мемлекетінің аты аңызға айналған астанасы',
    category: 'АРХЕОЛОГИЯ',
    categoryKz: 'Көне Археология',
    image: '/images/heritage/jankent-cover.jpg',
    innerImages: [
      '/images/heritage/jankent-inner-1.jpg',
      '/images/heritage/jankent-inner-2.webp',
    ],
    innerCaptions: [
      '🦅 Жанкент оғыздар шаһарының әуеден түсірілген цитадель дуалдары',
      '🏺 Оғыз қалашығындағы тұрғын үйлердің археологиялық қазба орны',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=9g0sT7mX890',
    youtubeTitle: 'Жанкент оғыздар шаһары',
    year: 'IX-XI ғасырлар',
    location: 'Қазалы ауданы, Өркендеу',
    descriptionKz:
      'Жанкент (Янгикент) — ІX-XI ғасырлардағы Оғыз хандығының ордасы болған ежелгі қала. Аңыз бойынша бұл қалада Қорқыт Ата өмір сүрген. Сырдарияның Арал теңізіне құяр тұсында орналасқан.',
    descriptionRu:
      'Жанкент (Янгикент) — легендарная столица Огузского государства IX-XI веков. По преданиям, именно здесь жил Коркыт Ата. Город находился на стыке Сырдарьи и Аральского моря.',
    facts: [
      'Оғыз мемлекетінің бас қаласы болған',
      'Қорқыт Ата дастандарында жиі аталады',
      'Қаланың биік дуалдары мен мұнаралары жақсы сақталған',
    ],
  },
  {
    id: 'okshy-ata',
    titleKz: 'Оқшы Ата Кесенесі',
    titleRu: 'Мавзолей Окшы Ата',
    subtitle: 'Қару-жарақ соққан шебер және рухани әулие',
    category: 'СӘУЛЕТ МҰРАСЫ',
    categoryKz: 'Рухани Мұра мен Кесенелер',
    image: '/images/heritage/okshy-cover.jpg',
    innerImages: [
      '/images/heritage/okshy-cover.jpg',
    ],
    innerCaptions: [
      '🕌 XI-XII ғасырлардағы Оқшы Атаның ортағасырлық күйдірілген кірпіш кесенесі',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=7h8uT9mY123',
    youtubeTitle: 'Оқшы Ата мазарының аңызы',
    year: 'XI-XII ғасырлар',
    location: 'Шиелі ауданы, Бәйгеқұм',
    descriptionKz:
      'Оқшы Ата кесенесі — XI-XII ғасырларда өмір сүрген, халық арасында жебе жасаушы шебер және әулие ретінде танылған Ибраһим Оқшы Атаның мазары. Шиелі ауданында орналасқан.',
    descriptionRu:
      'Мавзолей Окшы Ата — святилище оружейника и духоносного святого Ибрахима Окшы Ата (XI-XII вв.), который изготавливал стрелы для воинов. Мавзолей расположен в Шиелийском районе.',
    facts: [
      'Батырларға жебе мен қару соққан ұста',
      'Ортағасырлық күйдірілген кірпіш сәулеті',
      'Қасиетті зиярат ету орындарының бірі',
    ],
  },
]

export default function KyzylordaMuseum() {
  const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('БАРЛЫҒЫ')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = ['БАРЛЫҒЫ', 'СӘУЛЕТ МҰРАСЫ', 'ҒАРЫШ МҰРАСЫ', 'АРХЕОЛОГИЯ', 'ТАБИҒИ МҰРА']

  const filteredItems = useMemo(() => {
    return KYZYLORDA_HERITAGE_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'БАРЛЫҒЫ' || item.category === activeCategory
      const matchesSearch =
        item.titleKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="uly-home w-full min-h-screen bg-[#FAF7F2] text-[#2A2621] font-sans pb-24 select-none relative overflow-x-clip">
      
      {/* HERO SECTION WITH ANIMATED KAZAKHSTAN MAP & ROTATING ORNAMENTS */}
      <div className="relative w-full py-24 sm:py-36 px-6 flex items-center justify-center border-b border-[#2A2621]/10 bg-[var(--home-sand)] home-grain home-vignette home-dotgrid overflow-hidden">
        
        {/* ANIMATED KAZAKHSTAN MAP BACKGROUND */}
        <HomeHeroMapBackground className="absolute inset-0 w-full h-full text-[#B85D36] pointer-events-none opacity-20" />

        {/* ROTATING GOLD KAZAKH ORNAMENTS (QoshqarMuiz) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-12 -left-12 text-[#D4AF37] opacity-25 w-72 h-72 pointer-events-none hidden md:block"
        >
          <QoshqarMuiz className="w-full h-full" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-12 -right-12 text-[#D4AF37] opacity-25 w-80 h-80 pointer-events-none hidden md:block"
        >
          <QoshqarMuiz className="w-full h-full" />
        </motion.div>

        {/* Corner Ribbon */}
        <div className="absolute top-8 -right-16 z-20 rotate-45 bg-[#2A2621] text-[#FAF7F2] px-20 py-2 shadow-lg hidden sm:block">
          <span className="font-bold tracking-[0.3em] uppercase text-[11px]">2026 · Сыр Мұражайы</span>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#B85D36]/10 border border-[#B85D36]/30 text-[#B85D36] text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm"
          >
            <span>🏛️</span> СЫР ӨҢІРІНІҢ КҮМБЕЗДІ МҰРАЖАЙЫ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-7xl font-serif font-bold text-[#2A2621] tracking-wider drop-shadow-sm"
          >
            ҚЫЗЫЛОРДА МҰРАЖАЙЫ
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-[#2A2621]/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Сырдария бойының мыңжылдық тарихи фотосуреттері, Қорқыт Ата сазы, хандық астаналар мен Байқоңыр ғарыш айлағының ресми сандық галереясы.
          </motion.p>

          {/* SEARCH BAR IN HOME STYLE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-md mx-auto relative pt-4"
          >
            <input
              type="text"
              placeholder="Экспонат немесе тарихи орынды іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-[#2A2621]/15 focus:border-[#B85D36] rounded-full text-[#2A2621] placeholder-[#2A2621]/40 text-sm focus:outline-none focus:ring-4 focus:ring-[#B85D36]/10 shadow-lg transition-all"
            />
            <span className="absolute right-5 top-8 text-[#B85D36] text-lg">🔍</span>
          </motion.div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-[#B85D36] text-white border-[#B85D36] shadow-md scale-105'
                  : 'bg-white text-[#2A2621]/70 border-[#2A2621]/15 hover:text-[#2A2621] hover:border-[#B85D36]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID WITH REAL ACCURATE PHOTOGRAPHS & FRAMER MOTION */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-white border border-[#2A2621]/10 hover:border-[#B85D36]/60 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* REAL PHOTO CONTAINER USING STANDARD <img> */}
              <div className="relative h-64 w-full overflow-hidden bg-[#2A2621]">
                <img
                  src={item.image}
                  alt={item.titleKz}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                />
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
                  {item.category}
                </span>

                {/* Location Badge */}
                <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-[#2A2621] text-xs font-bold px-3.5 py-1 rounded-full shadow flex items-center gap-1">
                  <span>📍</span> {item.location}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#2A2621] group-hover:text-[#B85D36] transition-colors mb-1">
                    {item.titleKz}
                  </h3>
                  <div className="text-xs text-[#B85D36] font-bold mb-3">
                    {item.titleRu}
                  </div>
                  <p className="text-xs text-[#2A2621]/70 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2621]/10 flex items-center justify-between text-xs font-bold text-[#B85D36] group-hover:text-[#944422]">
                  <span className="flex items-center gap-1.5">
                    <span>📖</span> ТОЛЫҚ АҚПАРАТ МЕН ЮТУБ
                  </span>
                  <span className="group-hover:translate-x-1.5 transition-transform text-base">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE MODAL WINDOW IN HOME PAGE STYLE */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF7F2] border-2 border-[#B85D36] rounded-3xl overflow-y-auto shadow-2xl text-[#2A2621] p-6 sm:p-8 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 text-gray-600 hover:text-black bg-white hover:bg-gray-200 border border-gray-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors z-30 shadow"
              >
                ✕
              </button>

              {/* Modal Cover Image Header */}
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-[#2A2621]/15 shadow-inner bg-[#2A2621]">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.titleKz}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="bg-[#B85D36] text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow">
                    {selectedItem.categoryKz}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white drop-shadow-md">
                    {selectedItem.titleKz}
                  </h2>
                  <p className="text-sm text-amber-200 font-medium drop-shadow">
                    {selectedItem.titleRu} • <span className="text-gray-200">{selectedItem.location}</span>
                  </p>
                </div>
              </div>

              {/* Descriptions & Inner Photos */}
              <div className="space-y-6">
                
                {/* Kazakh Section with Inner Photo 1 */}
                <div className="bg-[#B85D36]/10 border-l-4 border-[#B85D36] p-5 rounded-r-2xl space-y-3">
                  <h4 className="text-xs font-bold text-[#B85D36] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🇰🇿</span> ҚАЗАҚША СИПАТТАМАСЫ
                  </h4>
                  <p className="text-sm text-[#2A2621] leading-relaxed font-normal">
                    {selectedItem.descriptionKz}
                  </p>
                  
                  {/* Inner Photo 1 */}
                  {selectedItem.innerImages && selectedItem.innerImages[0] && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-[#B85D36]/30 shadow-md">
                      <img
                        src={selectedItem.innerImages[0]}
                        alt={selectedItem.titleKz}
                        className="w-full h-52 sm:h-64 object-cover"
                      />
                      <div className="p-2.5 bg-[#B85D36]/20 text-[#B85D36] text-xs font-bold text-center">
                        {selectedItem.innerCaptions?.[0] || `🏛️ ${selectedItem.titleKz}`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Russian Section with Inner Photo 2 */}
                <div className="bg-white border-l-4 border-amber-700 p-5 rounded-r-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🇷🇺</span> ОПИСАНИЕ НА РУССКОМ
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-normal">
                    {selectedItem.descriptionRu}
                  </p>

                  {/* Inner Photo 2 */}
                  {selectedItem.innerImages && selectedItem.innerImages[1] && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-amber-300 shadow-md">
                      <img
                        src={selectedItem.innerImages[1]}
                        alt={selectedItem.titleRu}
                        className="w-full h-52 sm:h-64 object-cover"
                      />
                      <div className="p-2.5 bg-amber-100 text-amber-900 text-xs font-bold text-center">
                        {selectedItem.innerCaptions?.[1] || `🎭 ${selectedItem.titleRu}`}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Historical Facts */}
              <div className="bg-white border border-[#2A2621]/15 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-[#B85D36] mb-3 flex items-center gap-2">
                  <span>📌</span> МАҢЫЗДЫ ДЕРЕКТЕР МЕН ДӘЛЕЙЛДЕР
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[#2A2621]/80">
                  {selectedItem.facts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#B85D36] font-bold">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* YOUTUBE VIDEO LINK BUTTON */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2A2621]/10">
                <div className="text-xs text-gray-500 font-medium">
                  🎬 Ютубтағы ресми бейнематериал:
                </div>
                <a
                  href={selectedItem.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 active:scale-95 border border-red-400/40"
                >
                  <span className="text-lg">▶</span> ЮТУБТЕ БЕЙНЕ КӨРУ (YOUTUBE)
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
