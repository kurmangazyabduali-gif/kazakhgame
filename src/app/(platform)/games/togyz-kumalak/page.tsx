import { Metadata } from 'next';
import { randomUUID } from 'crypto';
import GameClientWrapper from '@/components/games/togyz-kumalak/GameClientWrapper';

export const metadata: Metadata = {
  title: 'Тоғызқұмалақ | ULY DALA',
  description: 'Национальная казахская стратегическая настольная игра Тоғызқұмалақ',
};

export default function TogyzKumalakPage() {
  const sessionId = randomUUID();
  return <GameClientWrapper sessionId={sessionId} />;
}
