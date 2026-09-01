import { createClient } from "@/lib/supabase/server";
import { RankingService } from "@/lib/services/RankingService";
import { Trophy, Star, Crown } from "lucide-react";
import { MaterialSurface } from "@/components/ui/heritage/MaterialSurface";
import { KazakhOrnament } from "@/components/ui/heritage/KazakhOrnament";

type ProfileLeaderboardRow = {
  id: string;
  display_name: string | null;
  username: string | null;
  total_score: number | null;
  xp: number | null;
};

type ScoreLeaderboardRow = {
  score: number;
  user_id: string;
  profiles: {
    display_name: string | null;
    username: string | null;
  } | null;
};

function getPlayerName(profile: ScoreLeaderboardRow["profiles"]): string {
  return profile?.display_name || profile?.username || "Жасырын ойыншы";
}

export default async function ChampionshipPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "global" } = await searchParams;
  const supabase = await createClient();

  // Define tabs
  const tabs = [
    { id: "global", label: "Жалпы" },
    { id: "asyk-atu", label: "Асық ату" },
    { id: "togyz-kumalak", label: "Тоғызқұмалақ" },
    { id: "qol-kures", label: "Қол күрес" },
  ];

  let leaderboardData: { id: string; name: string; rankScore: number }[] = [];

  if (tab === "global") {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, total_score, xp")
      .order("total_score", { ascending: false })
      .limit(100);

    if (profiles) {
      leaderboardData = (profiles as ProfileLeaderboardRow[]).map((p) => ({
        id: p.id,
        name: p.display_name || p.username || "Жасырын ойыншы",
        rankScore: RankingService.calculateGlobalRankScore(
          p.total_score || 0,
          p.xp || 0,
        ),
      }));
      leaderboardData.sort((a, b) => b.rankScore - a.rankScore);
    }
  } else {
    let gameId = null;
    const { data: gameData } = (await supabase.from('games').select('id').eq('slug', tab).maybeSingle()) as unknown as { data: { id: string } | null }
    if (gameData) gameId = gameData.id;
    else if (tab === 'togyz-kumalak') {
      const { data: gameDataAlt } = (await supabase.from('games').select('id').eq('slug', 'togyzqumalak').maybeSingle()) as unknown as { data: { id: string } | null }
      if (gameDataAlt) gameId = gameDataAlt.id;
    }

    if (gameId) {
      const { data: scoresData } = await supabase
        .from("game_scores")
        .select("score, user_id, profiles(display_name, username)")
        .eq("game_id", gameId)
        .order("score", { ascending: false })
        .limit(100);
      const scores = (scoresData ?? []) as unknown as ScoreLeaderboardRow[];

      if (scores) {
        const userBest = new Map<string, ScoreLeaderboardRow>();
        for (const s of scores) {
          if (!userBest.has(s.user_id)) {
            userBest.set(s.user_id, s);
          }
        }

        leaderboardData = Array.from(userBest.values())
          .map((s) => ({
            id: s.user_id,
            name: getPlayerName(s.profiles),
            rankScore: s.score,
          }))
          .sort((a, b) => b.rankScore - a.rankScore);
      }
    }
  }

  // Split top 3 and others for beautiful podium styling
  const topThree = leaderboardData.slice(0, 3);
  const otherPlayers = leaderboardData.slice(3);

  return (
    <div className="w-full flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/textures/sand.png')] mix-blend-overlay z-0" />

      {/* Header Area */}
      <MaterialSurface material="nightSky" className="pt-24 pb-16 border-b border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
           <KazakhOrnament variant="su" animate="spin" className="w-[600px] h-[600px] text-gold" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="w-16 h-16 rounded-full border border-gold/30 bg-surface flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground uppercase tracking-widest drop-shadow-lg">
            Ұлттық Чемпионат
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg font-heading tracking-widest">
            Қазақстанның барлық аймағындағы ойыншылармен жарысыңыз
          </p>
        </div>
      </MaterialSurface>

      <div className="w-full max-w-5xl mx-auto p-6 pt-12 pb-32 relative z-10">
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          {tabs.map((t) => (
            <a
              key={t.id}
              href={`/championship?tab=${t.id}`}
              className={`px-8 py-3 font-heading text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 border ${
                tab === t.id
                  ? "bg-gold text-primary border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "bg-surface text-text-muted border-border/50 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>

        {/* Podium visualization for top 3 */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="bg-surface/50 border border-border/10 rounded-3xl p-6 text-center order-2 md:order-1 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-xl mb-4 shadow">2</div>
                <div className="font-bold text-xl text-foreground mb-1">{topThree[1].name}</div>
                <div className="text-sm font-heading font-medium text-text-muted uppercase tracking-wider">Екінші орын</div>
                <div className="text-2xl font-display font-black text-slate-400 mt-4">{topThree[1].rankScore.toLocaleString()}</div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="bg-gradient-to-b from-gold/10 to-surface/80 border-2 border-gold/40 rounded-3xl p-8 text-center order-1 md:order-2 flex flex-col items-center shadow-2xl relative">
                <Crown className="w-8 h-8 text-gold animate-bounce mb-2" />
                <div className="w-16 h-16 rounded-full bg-gold text-primary flex items-center justify-center font-bold text-2xl mb-4 shadow-[0_0_20px_rgba(212,175,55,0.5)]">1</div>
                <div className="font-bold text-2xl text-foreground mb-1">{topThree[0].name}</div>
                <div className="text-sm font-heading font-medium text-gold uppercase tracking-widest">Абсолютті чемпион</div>
                <div className="text-3xl font-display font-black text-gold mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">{topThree[0].rankScore.toLocaleString()}</div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="bg-surface/50 border border-border/10 rounded-3xl p-6 text-center order-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-700/80 text-white flex items-center justify-center font-bold text-xl mb-4 shadow">3</div>
                <div className="font-bold text-xl text-foreground mb-1">{topThree[2].name}</div>
                <div className="text-sm font-heading font-medium text-text-muted uppercase tracking-wider">Үшінші орын</div>
                <div className="text-2xl font-display font-black text-amber-700 mt-4">{topThree[2].rankScore.toLocaleString()}</div>
              </div>
            )}

          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-surface border border-border/20 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 relative group">
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
             <KazakhOrnament variant="tumar" className="w-96 h-96 text-gold" />
          </div>

          <div className="grid grid-cols-12 gap-4 p-6 font-heading font-bold uppercase tracking-widest border-b border-border/20 bg-background/50 text-xs text-text-muted relative z-10">
            <div className="col-span-2 text-center">Орын</div>
            <div className="col-span-7">Ойыншы</div>
            <div className="col-span-3 text-right">Ұпай</div>
          </div>

          <div className="relative z-10 divide-y divide-border/10">
            {leaderboardData.length === 0 ? (
              <div className="p-16 text-center text-text-muted font-heading tracking-wider">
                <KazakhOrnament variant="geometric" className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                Әзірге деректер жоқ. Бірінші болып ұпай жинаңыз!
              </div>
            ) : (
              leaderboardData.map((player, idx) => (
                <div
                  key={player.id}
                  className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-surface-elevated transition-colors duration-300 ${
                    idx < 3 ? 'bg-gold/5 font-medium' : ''
                  }`}
                >
                  <div className="col-span-2 text-center font-bold text-2xl font-display text-gold">
                    {idx === 0
                      ? "🥇"
                      : idx === 1
                        ? "🥈"
                        : idx === 2
                          ? "🥉"
                          : idx + 1}
                  </div>
                  <div className="col-span-7 font-bold text-foreground text-lg flex items-center gap-2">
                    {player.name}
                    {idx < 3 && <Star className="w-4 h-4 text-gold fill-gold/50" />}
                  </div>
                  <div className="col-span-3 text-right font-display font-bold text-gold text-2xl drop-shadow-sm">
                    {player.rankScore.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
