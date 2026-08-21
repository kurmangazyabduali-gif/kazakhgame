import { HomeHero } from '@/components/home/HomeHero'
import { HomeStatement } from '@/components/home/HomeStatement'
import { HomeWorldSection } from '@/components/home/HomeWorldSection'
import { HomeGameShowcase } from '@/components/home/HomeGameShowcase'
import { HomeKazakhstanMap } from '@/components/home/HomeKazakhstanMap'
import { HomeFinalCTA } from '@/components/home/HomeFinalCTA'

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background relative selection:bg-gold/30 selection:text-gold-muted">
      <HomeHero />
      <HomeStatement />
      <HomeWorldSection />
      <HomeGameShowcase />
      <HomeKazakhstanMap />
      <HomeFinalCTA />
    </div>
  )
}
