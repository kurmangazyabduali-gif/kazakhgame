import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament';

export type TransitionState = 'enter' | 'exit' | 'level' | 'result' | 'idle';

interface GameTransitionProps {
  state: TransitionState;
  title?: string;
  subtitle?: string;
  onTransitionComplete?: () => void;
  reducedMotion?: boolean;
}

export function GameTransition({
  state,
  title,
  subtitle,
  onTransitionComplete,
  reducedMotion = false
}: GameTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (state !== 'idle') {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onTransitionComplete) onTransitionComplete();
      }, 3000); // 3 seconds transition
      return () => clearTimeout(timer);
    }
  }, [state, onTransitionComplete]);

  const transitionDuration = reducedMotion ? 0.3 : 0.8;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: transitionDuration, ease: "easeInOut" }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-background/80" />
          
          <motion.div 
            initial={{ scale: reducedMotion ? 1 : 0.9, y: reducedMotion ? 0 : 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: reducedMotion ? 1 : 1.1, opacity: 0 }}
            transition={{ duration: transitionDuration, ease: "easeOut", delay: 0.2 }}
            className="relative z-10 flex flex-col items-center text-center p-12 max-w-lg"
          >
            <KazakhOrnament 
              variant="tumar" 
              className="w-24 h-24 text-gold mb-8 drop-shadow-xl" 
              animate={reducedMotion ? 'none' : 'draw'}
            />
            
            {title && (
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-5xl md:text-6xl font-bold text-foreground uppercase tracking-widest drop-shadow-md mb-4"
              >
                {title}
              </motion.h1>
            )}
            
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-text-muted text-lg font-heading tracking-widest uppercase"
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
