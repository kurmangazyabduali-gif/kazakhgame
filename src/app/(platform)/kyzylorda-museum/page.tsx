import { Metadata } from 'next'
import KyzylordaMuseum from '@/components/heritage/KyzylordaMuseum'

export const metadata: Metadata = {
  title: 'Қызылорда Мұражайы | ULY DALA',
  description: 'Қызылорда өңірінің тарихи-мәдени мұралары — Қорқыт Ата, Байқоңыр, Сығанақ және Жанкент виртуалды галереясы',
}

export default function KyzylordaMuseumPage() {
  return <KyzylordaMuseum />
}
