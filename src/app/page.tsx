import { HomeHero } from '@/components/home/HomeHero'
import { HomeStatement } from '@/components/home/HomeStatement'
import { HomeWorldSection } from '@/components/home/HomeWorldSection'
import { HomeGameShowcase } from '@/components/home/HomeGameShowcase'
import { HomeKazakhstanMap } from '@/components/home/HomeKazakhstanMap'
import { HomeFinalCTA } from '@/components/home/HomeFinalCTA'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FAF7F0] relative selection:bg-gold/30 selection:text-gold-muted">
      <HomeHero />
      <OrnamentDivider variant={1} height={52} />
      <HomeStatement />
      <OrnamentDivider variant={3} height={64} />
      <HomeWorldSection />
      <OrnamentDivider variant={2} height={70} />
      <HomeGameShowcase />
      <OrnamentDivider variant={4} height={52} />
      <HomeKazakhstanMap />
      <OrnamentDivider variant={5} height={64} />
      <HomeFinalCTA />
    </div>
  )
}
