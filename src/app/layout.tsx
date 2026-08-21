import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { NotificationProvider } from '@/components/layout/NotificationProvider'
import { DemoDetector } from '@/components/layout/DemoDetector'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'ULY DALA — Национальные игры Казахстана',
  description: 'Интерактивная цифровая платформа, посвящённая национальным играм и культурному наследию Казахстана.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Cpath d='M40 0l40 40-40 40L0 40zM20 40l20-20 20 20-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <div className="min-h-[100dvh] flex flex-col relative">
          <DemoDetector />
          <Navbar />
          <main className="flex-1 flex flex-col items-center w-full">
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
