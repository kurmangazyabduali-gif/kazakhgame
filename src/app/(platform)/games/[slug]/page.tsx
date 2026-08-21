import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Play, Trophy, Star } from 'lucide-react'

interface GameDetailsProps {
  params: Promise<{ slug: string }>
}

export default async function GameDetailsPage({ params }: GameDetailsProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch game
  const { data: game } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!game && !['asyk-atu', 'kelin-shai', 'togyzqumalak'].includes(slug)) {
    notFound()
  }

  // Fallbacks
  const gameData = game || {
    slug,
    name: slug === 'asyk-atu' ? 'Асық ату' : slug === 'kelin-shai' ? 'Келін шай' : 'Тоғызқұмалақ',
    category: slug === 'togyzqumalak' ? 'Стратегия' : 'Ұлттық дәстүр',
    description: 'Ойын сипаттамасы',
    image_url: `/images/games/${slug}.jpg`
  }

  // Stats will be fetched by a client component later, or just default to 0 for now
  const bestScore = 0
  const gamesPlayed = 0

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pt-12 animate-in fade-in duration-500">
      <Link href="/games" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Ойындар жинағына қайту
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Image & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          <div className="aspect-[4/5] rounded-3xl bg-muted relative overflow-hidden border shadow-xl">
            {gameData.image_url ? (
              <Image src={gameData.image_url} alt={gameData.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase font-bold tracking-widest text-sm">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{gameData.category}</div>
              <div className="text-2xl font-black">{gameData.name}</div>
            </div>
          </div>

          <Link href={`/games/${slug}/play`} className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-2xl hover:bg-primary/90 transition-all shadow-[0_0_30px_-10px_rgba(var(--primary),0.8)] hover:scale-[1.02]">
            <Play className="w-6 h-6 fill-current" />
            Ойнау
          </Link>

          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-6 border-b pb-4 text-muted-foreground">Жеке рекордтар</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3 font-medium"><Trophy className="w-5 h-5 text-yellow-500"/> Үздік нәтиже</span>
                <span className="font-black text-xl">{bestScore}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-3 font-medium"><Star className="w-5 h-5 text-blue-500"/> Ойналды</span>
                <span className="font-black text-xl">{gamesPlayed} <span className="text-sm font-normal text-muted-foreground">рет</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Header Description */}
          <div>
            <div className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {gameData.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight">{gameData.name}</h1>
            <p className="text-2xl text-muted-foreground leading-relaxed font-light">
              {gameData.description}
            </p>
          </div>

          {/* Cultural Context */}
          <div className="bg-secondary/30 rounded-3xl p-8 border">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Ойын туралы (Cultural Context)</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                {slug === 'asyk-atu' && 'Асық ату – қазақ халқының ең көне әрі кең тараған ұлттық ойындарының бірі. Ол көшпелі өмір салтымен тығыз байланысты және балалардың ептілігін, мергендігін, дәлдігі мен көз мөлшерін дамытуға бағытталған.'}
                {slug === 'kelin-shai' && 'Келін шай – қазақ халқының қонақжайлылық дәстүрінің ең маңызды әрі нәзік көрінісі. Шай құю өнері тек сусын ұсыну емес, бұл отбасындағы сыйластық, үйлесімділік және әдептілік мектебі.'}
                {slug === 'togyzqumalak' && 'Тоғызқұмалақ – төрт мың жылдық тарихы бар, «дала математикасы» аталған зияткерлік ұлттық ойын. Ойын логикалық ойлауды, математикалық есептеуді және стратегиялық жоспарлауды талап етеді.'}
                {slug === 'jamby-atu' && 'Жамбы ату — садақ ату өнерінің шыңы. Шауып келе жатқан ат үстінен нысанаға дәл тигізу үлкен шеберлікті, тепе-теңдікті және мінсіз координацияны қажет етеді.'}
                {slug === 'kusbegilik' && 'Құсбегілік (саятшылық) — қыран құстарды (бүркіт, ителгі, қаршыға) қолға үйретіп, аңға салу өнері. Бұл тек аңшылық емес, адам мен табиғаттың, құстың арасындағы терең рухани байланыс.'}
              </p>
            </div>
            
            {/* Metadata / Source Mock */}
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Verified Cultural Data</span>
              <span>•</span>
              <span>Source: Encyclopedia of Nomadic Games</span>
            </div>
          </div>

          {/* Learning Loop & Rules */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Ережелер</h2>
              <ul className="space-y-4">
                {slug === 'asyk-atu' && (
                  <>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div> <span className="pt-1 leading-relaxed">Асықтарды шеңберден (отаудан) атып шығару қажет.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div> <span className="pt-1 leading-relaxed">Әрбір сәтті соққы ұпай әкеледі.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div> <span className="pt-1 leading-relaxed">Комбо жасап, көбірек ұпай жинаңыз.</span></li>
                  </>
                )}
                {slug === 'kelin-shai' && (
                  <>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div> <span className="pt-1 leading-relaxed">Қонақтардың тілегіне (сүт, қант) қарай шай құю.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div> <span className="pt-1 leading-relaxed">Кесеге шайдың мөлшерін дұрыс (орташа) құю (сарқыт емес, толтырып емес).</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div> <span className="pt-1 leading-relaxed">Дәстүрлі этикетті сақтау арқылы құрмет көрсету.</span></li>
                  </>
                )}
                {slug === 'togyzqumalak' && (
                  <>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div> <span className="pt-1 leading-relaxed">Әр ойыншының 9 отауы және 1 қазаны бар.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div> <span className="pt-1 leading-relaxed">Құмалақтарды сағат тіліне қарсы таратады (егер отауда бірден көп болса).</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div> <span className="pt-1 leading-relaxed">82 құмалақ жинаған ойыншы жеңіске жетеді.</span></li>
                  </>
                )}
                {slug === 'jamby-atu' && (
                  <>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div> <span className="pt-1 leading-relaxed">Атты басқарып, трасса бойымен шабу.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div> <span className="pt-1 leading-relaxed">Садақты керіп, нысананы (жамбыны) көздеу.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div> <span className="pt-1 leading-relaxed">Уақыт пен жылдамдықты ескеріп оқ ату.</span></li>
                  </>
                )}
                {slug === 'kusbegilik' && (
                  <>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div> <span className="pt-1 leading-relaxed">Бүркіттің ұшуын және қуатын (stamina) басқару.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div> <span className="pt-1 leading-relaxed">Жемтікті (түлкі, қоян) биіктен іздеп табу.</span></li>
                    <li className="flex items-start gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div> <span className="pt-1 leading-relaxed">Дәл пикирование жасап, жемтікті ұстау.</span></li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-muted/50 rounded-3xl p-8 border flex flex-col justify-center">
              <h3 className="font-black uppercase tracking-wider mb-6 text-center">Оқыту циклі</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><div className="w-1/3 text-right font-bold text-primary">PLAY</div><div className="w-2/3 text-sm text-muted-foreground">Сынап көру</div></div>
                <div className="flex items-center gap-4"><div className="w-1/3 text-right font-bold text-primary">LEARN</div><div className="w-2/3 text-sm text-muted-foreground">Ережені түсіну</div></div>
                <div className="flex items-center gap-4"><div className="w-1/3 text-right font-bold text-primary">PRACTICE</div><div className="w-2/3 text-sm text-muted-foreground">Дағдыны шыңдау</div></div>
                <div className="flex items-center gap-4"><div className="w-1/3 text-right font-bold text-primary">MASTER</div><div className="w-2/3 text-sm text-muted-foreground">Шебер атану</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
