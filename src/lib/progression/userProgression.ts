/**
 * ULY DALA Global User Progression & Badge System.
 */

export interface Badge {
  id: string;
  name: string;
  nameKz: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserRank {
  level: number;
  title: string;
  titleKz: string;
  minXp: number;
  maxXp: number;
}

export const RANKS: UserRank[] = [
  { level: 1, title: 'Новичок', titleKz: 'Балақай', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Ученик', titleKz: 'Шәкірт', minXp: 100, maxXp: 300 },
  { level: 3, title: 'Молодой Батыр', titleKz: 'Жас Батыр', minXp: 300, maxXp: 600 },
  { level: 4, title: 'Ловкий Стрелок', titleKz: 'Сұрмерген', minXp: 600, maxXp: 1000 },
  { level: 5, title: 'Мастер Игр', titleKz: 'Ойын Шебері', minXp: 1000, maxXp: 1500 },
  { level: 6, title: 'Силач Степи', titleKz: 'Дала Алып', minXp: 1500, maxXp: 2200 },
  { level: 7, title: 'Заслуженный Батыр', titleKz: 'Ардақты Батыр', minXp: 2200, maxXp: 3000 },
  { level: 8, title: 'Народный Чемпион', titleKz: 'Эл Чемпионы', minXp: 3000, maxXp: 4000 },
  { level: 9, title: 'Легенда Великого Поля', titleKz: 'Ұлы Дала Аңызы', minXp: 4000, maxXp: 5500 },
  { level: 10, title: 'Великий Хан Игр', titleKz: 'Ұлы Батыр Хан', minXp: 5500, maxXp: 10000 },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_win',
    name: 'Первая Победа',
    nameKz: 'Аралас Жеңіс',
    description: 'Победите в любой национальной игре',
    icon: '🏆',
    unlocked: true,
  },
  {
    id: 'qol_kures_master',
    name: 'Железный Бицепс',
    nameKz: 'Қол күрес шебері',
    description: 'Победите соперника в Қол күрес',
    icon: '💪',
    unlocked: true,
  },
  {
    id: 'mergen',
    name: 'Снайпер Жамбы Ату',
    nameKz: 'Мерген',
    description: 'Поразите мишень Жамбы Ату',
    icon: '🏹',
    unlocked: true,
  },
  {
    id: 'arqan_hero',
    name: 'Богатырь Арқан Тартыс',
    nameKz: 'Арқан Батыры',
    description: 'Победите в перетягивании каната 3D',
    icon: '⚡',
    unlocked: true,
  },
  {
    id: 'steppe_legend',
    name: 'Дух Великой Степи',
    nameKz: 'Ұлы Дала Аңызы',
    description: 'Наберите 1000 XP на платформе ULY DALA',
    icon: '🦅',
    unlocked: false,
  },
];

const STORAGE_KEY = 'ulydala_user_xp';
const BADGES_KEY = 'ulydala_user_badges';

export function getUserXp(): number {
  if (typeof window === 'undefined') return 350;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 350; // Default starter XP
}

export function getCurrentRank(xp: number): UserRank {
  return (
    RANKS.find((r) => xp >= r.minXp && xp < r.maxXp) ||
    RANKS[RANKS.length - 1]
  );
}

export function addXp(amount: number): { newXp: number; levelUp: boolean } {
  if (typeof window === 'undefined') return { newXp: 350, levelUp: false };

  const currentXp = getUserXp();
  const oldRank = getCurrentRank(currentXp);
  const newXp = currentXp + amount;

  localStorage.setItem(STORAGE_KEY, newXp.toString());
  const newRank = getCurrentRank(newXp);

  return { newXp, levelUp: newRank.level > oldRank.level };
}

export function getUnlockedBadges(): Badge[] {
  if (typeof window === 'undefined') return INITIAL_BADGES;
  const saved = localStorage.getItem(BADGES_KEY);
  if (!saved) return INITIAL_BADGES;

  try {
    const unlockedIds: string[] = JSON.parse(saved);
    return INITIAL_BADGES.map((b) => ({
      ...b,
      unlocked: b.unlocked || unlockedIds.includes(b.id),
    }));
  } catch (e) {
    return INITIAL_BADGES;
  }
}
