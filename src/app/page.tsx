import { Spectral, Golos_Text } from 'next/font/google'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeStats } from '@/components/home/HomeStats'
import { HomeStatement } from '@/components/home/HomeStatement'
import { HomeWorldSection } from '@/components/home/HomeWorldSection'
import { HomeProverbs } from '@/components/home/HomeProverbs'
import { HomeGameShowcase } from '@/components/home/HomeGameShowcase'
import { HomeKazakhstanMap } from '@/components/home/HomeKazakhstanMap'
import { HomeFinalCTA } from '@/components/home/HomeFinalCTA'
import { HomeProgressBar } from '@/components/home/HomeProgressBar'
import { HomeCursor } from '@/components/home/HomeCursor'

// Warm literary serif for headings, a Cyrillic-native geometric sans for
// body — scoped to the homepage only via the `uly-home` wrapper below, so
// the rest of the platform keeps its existing Cormorant/Montserrat type.
const spectral = Spectral({
  variable: '--font-spectral',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const golos = Golos_Text({
  variable: '--font-golos',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
})

export default function Home() {
  return (
    <div
      className={`${spectral.variable} ${golos.variable} uly-home w-full flex flex-col min-h-screen relative overflow-x-clip selection:bg-[var(--home-terracotta)]/20 selection:text-[var(--home-terracotta)]`}
    >
      <HomeProgressBar />
      <HomeCursor />
      <HomeHero />
      <HomeStats />
      <HomeStatement />
      <HomeWorldSection />
      <HomeProverbs />
      <HomeGameShowcase />
      <HomeKazakhstanMap />
      <HomeFinalCTA />
    </div>
  )
}
