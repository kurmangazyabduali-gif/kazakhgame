import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Shield,
  MapPin,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { GAMES_METADATA } from "@/lib/data/games";
import { REGIONS } from "@/lib/data/regions";
import { CLAIMS, SOURCES } from "@/lib/data/culturalSources";
import { MaterialSurface } from "@/components/ui/heritage/MaterialSurface";
import { OrnamentFrame } from "@/components/ui/heritage/OrnamentFrame";
import { HeritageButton } from "@/components/ui/heritage/HeritageButton";
import { CulturalBadge } from "@/components/ui/heritage/CulturalBadge";
import { KazakhOrnament } from "@/components/ui/heritage/KazakhOrnament";
import { ProgressCard } from "@/components/heritage/ProgressCard";

interface GameDetailsProps {
  params: Promise<{ slug: string }>;
}

export default async function GameDetailsPage({ params }: GameDetailsProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!game && !GAMES_METADATA[slug]) {
    notFound();
  }

  const meta = GAMES_METADATA[slug];
  const gameData = { ...meta, ...(game || {}) };

  const bestScore = 0;
  const gamesPlayed = 0;

  const gameClaims = CLAIMS.filter((c) => c.gameSlug === slug);
  const historyClaim = gameClaims.find(
    (c) =>
      c.category === "history" ||
      c.category === "tradition" ||
      c.category === "cultural_practice",
  );
  const rulesClaim = gameClaims.find(
    (c) => c.category === "rules" || c.category === "modern_sport",
  );

  return (
    <div className="w-full bg-background min-h-screen">
      {/* 1. HERO HEADER */}
      <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image / Texture */}
        <div className="absolute inset-0 z-0 bg-primary" />
        {gameData.imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={gameData.imageUrl}
              alt={gameData.title}
              fill
              className="object-cover opacity-30 mix-blend-overlay"
            />
          </div>
        )}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Ornament Overlay */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
          <KazakhOrnament
            variant="tumar"
            className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <Link
            href="/games"
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gold hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ойындар жинағына қайту
          </Link>

          <CulturalBadge variant="gold" className="mb-6">
            {gameData.category}
          </CulturalBadge>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-surface to-gold/80 uppercase tracking-tight mb-6 drop-shadow-2xl">
            {gameData.title}
          </h1>

          <div className="flex gap-4">
            <Link href={`/games/${slug}`}>
              <HeritageButton
                variant="gold"
                size="lg"
                className="min-w-[200px]"
              >
                ОЙНАУ / PLAY
              </HeritageButton>
            </Link>
            {Object.values(REGIONS).some((r) => r.games.includes(slug)) && (
              <Link href={`/map?game=${slug}`}>
                <HeritageButton variant="cultural" size="lg">
                  <MapPin className="w-5 h-5" />
                </HeritageButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Stats & Description */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-surface-elevated rounded-2xl overflow-hidden border border-border shadow-lg">
              {gameData.imageUrl && (
                <div className="relative w-full h-64 border-b border-border/50">
                  <Image
                    src={gameData.imageUrl}
                    alt={gameData.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent" />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-display text-3xl font-bold mb-4 text-gold flex items-center gap-2">
                  <Info className="w-6 h-6" /> Об игре
                </h2>
                <p className="text-text-muted leading-relaxed font-serif text-lg mb-8">
                  {gameData.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {gameData.skills.map((skill: string, idx: number) => (
                    <CulturalBadge key={idx} variant="navy">
                      {skill}
                    </CulturalBadge>
                  ))}
                </div>

                <div className="flex items-center gap-4 py-4 border-t border-border/50">
                  <Shield className="w-6 h-6 text-gold" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-text-muted">
                      Сложность
                    </div>
                    <div className="font-bold text-foreground">
                      {gameData.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ProgressCard
                title="Рекорд"
                value={bestScore}
                label="XP"
                className="bg-surface shadow-none border-border/50"
              />
              <ProgressCard
                title="Ойналды"
                value={gamesPlayed}
                label="рет"
                className="bg-surface shadow-none border-border/50"
              />
            </div>
          </div>

          {/* Right Column: Museum / Cultural Context */}
          <div className="lg:col-span-2 space-y-12">
            <MaterialSurface
              material="felt"
              className="rounded-3xl border border-border/40 p-8 md:p-12"
            >
              <div className="flex items-center justify-between mb-8 border-b border-gold/20 pb-6">
                <h2 className="font-display text-4xl font-bold uppercase text-foreground">
                  Культурный Контекст
                </h2>
                <Link
                  href="/culture"
                  className="hidden sm:flex text-sm font-bold text-gold items-center gap-2 uppercase tracking-wider hover:underline"
                >
                  Источники <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-12">
                {/* History / Tradition */}
                {historyClaim && (
                  <div className="relative">
                    <KazakhOrnament
                      variant="geometric"
                      className="w-16 h-16 absolute -top-4 -left-4 text-gold opacity-10"
                    />
                    <h3 className="font-heading text-lg font-bold uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
                      Что это?
                    </h3>
                    <p className="text-xl leading-relaxed text-foreground/90 font-serif mb-6">
                      {historyClaim.claim}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {historyClaim.sourceIds.map((sourceId) => {
                        const source = SOURCES[sourceId];
                        return source ? (
                          <div
                            key={sourceId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-md text-xs font-bold tracking-wider uppercase"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {source.publisher}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Rules / Sport */}
                {rulesClaim && (
                  <div className="relative pt-12 border-t border-border/30">
                    <h3 className="font-heading text-lg font-bold uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
                      {rulesClaim.category === "modern_sport"
                        ? "Современный Спорт"
                        : "Официальные Правила"}
                    </h3>
                    <p className="text-xl leading-relaxed text-foreground/90 font-serif mb-6">
                      {rulesClaim.claim}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {rulesClaim.sourceIds.map((sourceId) => {
                        const source = SOURCES[sourceId];
                        return source ? (
                          <div
                            key={sourceId}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-md text-xs font-bold tracking-wider uppercase"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {source.publisher}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {!historyClaim && !rulesClaim && (
                  <div className="text-text-muted italic font-serif text-lg">
                    Культурный контекст находится в процессе верификации
                    историками.
                  </div>
                )}
              </div>
            </MaterialSurface>

            {/* Learning Loop */}
            <OrnamentFrame variant="subtle" className="bg-surface-elevated">
              <div className="flex flex-col md:flex-row items-center gap-8 p-6">
                <div className="flex-1 space-y-4">
                  <h2 className="font-display text-3xl font-bold uppercase text-foreground mb-6">
                    Как это в игре
                  </h2>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold font-heading">
                      1
                    </div>
                    <p className="text-text-muted pt-1">
                      Ознакомьтесь с механикой управления в симуляции.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold font-heading">
                      2
                    </div>
                    <p className="text-text-muted pt-1">
                      Следуйте подсказкам на экране для достижения цели.
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold font-heading">
                      3
                    </div>
                    <p className="text-text-muted pt-1">
                      Заработайте XP и откройте достижения за мастерство.
                    </p>
                  </div>
                </div>

                <div className="flex-1 w-full bg-background rounded-2xl p-6 border border-border">
                  <h3 className="font-heading font-bold uppercase tracking-wider mb-6 text-center text-foreground">
                    Оқыту циклі
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-right font-bold text-gold text-sm uppercase tracking-widest">
                        PLAY
                      </div>
                      <div className="w-2/3 text-sm text-text-muted">
                        Сынап көру
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-right font-bold text-gold text-sm uppercase tracking-widest">
                        LEARN
                      </div>
                      <div className="w-2/3 text-sm text-text-muted">
                        Ережені түсіну
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-right font-bold text-gold text-sm uppercase tracking-widest">
                        PRACTICE
                      </div>
                      <div className="w-2/3 text-sm text-text-muted">
                        Дағдыны шыңдау
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-right font-bold text-gold text-sm uppercase tracking-widest">
                        MASTER
                      </div>
                      <div className="w-2/3 text-sm text-text-muted">
                        Шебер атану
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </OrnamentFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
