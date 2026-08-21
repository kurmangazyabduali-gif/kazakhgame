import { createClient } from "@/lib/supabase/server";
import { RankingService } from "@/lib/services/RankingService";
import { Trophy } from "lucide-react";
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
    { id: "kelin-shai", label: "Келін шай" },
    { id: "togyz-kumalak", label: "Тоғызқұмалақ" },
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
    // Try to query both old and new slugs to be safe
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

        {/* Leaderboard Table */}
        <div className="bg-surface border border-border/20 rounded-3xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 relative group">
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
             <KazakhOrnament variant="tumar" className="w-96 h-96 text-gold" />
          </div>

          <div className="grid grid-cols-12 gap-4 p-6 font-heading font-bold uppercase tracking-widest border-b border-border/20 bg-background/50 text-xs text-text-muted relative z-10">
            <div className="col-span-2 text-center">Орын</div>
            <div className="col-span-7">Ойыншы</div>
            <div className="col-span-3 text-right">Ұпай</div>
          </div>

          <div className="relative z-10">
            {leaderboardData.length === 0 ? (
              <div className="p-16 text-center text-text-muted font-heading tracking-wider">
                <KazakhOrnament variant="geometric" className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                Әзірге деректер жоқ. Бірінші болып ұпай жинаңыз!
              </div>
            ) : (
              leaderboardData.map((player, idx) => (
                <div
                  key={player.id}
                  className="grid grid-cols-12 gap-4 p-6 border-b border-border/10 last:border-0 items-center hover:bg-surface-elevated transition-colors duration-300"
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
                  <div className="col-span-7 font-bold text-foreground text-lg">
                    {player.name}
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
