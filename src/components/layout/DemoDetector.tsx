'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function DetectorInner() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true' || searchParams.get('showcase') === 'true'

  if (!isDemo) return null

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      nav, footer { display: none !important; }
      main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
      body { overflow: hidden !important; }
      /* Hide specific back buttons or platform UI that games might have */
      .demo-hide { display: none !important; }
    ` }} />
  )
}

export function DemoDetector() {
  return (
    <Suspense fallback={null}>
      <DetectorInner />
    </Suspense>
  )
}

