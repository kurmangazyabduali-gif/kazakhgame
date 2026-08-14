import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full text-center px-4 relative overflow-hidden">
      {/* Decorative gradient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      
      <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-4 text-foreground/90 font-serif">
        ULY DALA
      </h1>
      <h2 className="text-xl md:text-3xl font-semibold mb-6 text-foreground/70">
        Digital National Games & Culture
      </h2>
      <p className="max-w-2xl text-lg text-muted-foreground mb-10">
        Play the heritage. Experience the culture. Discover the Great Steppe.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/register"
          className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
        >
          Начать путешествие
        </Link>
        <Link
          href="/games"
          className="px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg text-lg hover:bg-secondary/80 transition-colors"
        >
          Библиотека игр
        </Link>
      </div>
    </div>
  )
}
