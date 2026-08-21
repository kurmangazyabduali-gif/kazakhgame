import React, { ReactNode } from 'react';
import { gameAudio } from '@/lib/services/GameAudioService';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface GameShellProps {
  children: ReactNode;
  title: string;
  gameSlug: string;
}

export function GameShell({ children, title, gameSlug }: GameShellProps) {
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    gameAudio.init();
    setIsMuted(localStorage.getItem('uly_dala_audio_muted') === 'true');
  }, []);

  const handleToggleMute = () => {
    const muted = gameAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) gameAudio.playSfx('click');
  };

  return (
    <div
      className="fixed inset-0 w-full bg-background overflow-hidden flex flex-col touch-none select-none z-[100]"
      style={{ height: '100dvh' }}
    >
      {/* Universal Header - safe area aware */}
      <div
        className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 pointer-events-none"
        style={{ height: '64px', paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 pointer-events-auto relative z-10">
          <Link
            href={`/games/info/${gameSlug}`}
            className="p-2 rounded-full bg-surface/50 hover:bg-surface border border-border/20 text-text-muted hover:text-gold transition-colors backdrop-blur-sm touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="font-display font-bold text-lg md:text-xl text-foreground drop-shadow-md tracking-widest uppercase truncate max-w-[180px] md:max-w-none">
            {title}
          </div>
        </div>

        <div className="flex items-center pointer-events-auto relative z-10">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-surface/50 hover:bg-surface border border-border/20 text-text-muted hover:text-gold transition-colors backdrop-blur-sm touch-manipulation"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 w-full relative z-10 overflow-hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {children}
      </div>
    </div>
  );
}
