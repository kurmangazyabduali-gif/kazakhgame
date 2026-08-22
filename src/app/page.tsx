import { HomeHero } from '@/components/home/HomeHero'
import { HomeStatement } from '@/components/home/HomeStatement'
import { HomeWorldSection } from '@/components/home/HomeWorldSection'
import { HomeGameShowcase } from '@/components/home/HomeGameShowcase'
import { HomeKazakhstanMap } from '@/components/home/HomeKazakhstanMap'
import { HomeFinalCTA } from '@/components/home/HomeFinalCTA'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background relative selection:bg-gold/30 selection:text-gold-muted">
      <HomeHero />
      <OrnamentDivider variant="light" />
      <HomeStatement />
      <OrnamentDivider variant="gold" />
      <HomeWorldSection />
      <OrnamentDivider variant="light" />
      <HomeGameShowcase />
      <OrnamentDivider variant="gold" />
      <HomeKazakhstanMap />
      <OrnamentDivider variant="light" />
      <HomeFinalCTA />
    </div>
  )
}
