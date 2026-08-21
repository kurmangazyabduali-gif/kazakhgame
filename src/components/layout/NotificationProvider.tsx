'use client'

import { useState } from 'react'
import { Trophy, ArrowUpCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

type Notification = {
  id: string
  type: 'level_up' | 'achievement' | 'quest'
  title?: string
  message: string
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentLevelUp, setCurrentLevelUp] = useState<Notification | null>(null)

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const closeLevelUp = () => {
    if (currentLevelUp) {
      markAsRead(currentLevelUp.id)
      setCurrentLevelUp(null)
    }
  }

  return (
    <>
      {children}

      <AnimatePresence>
        {currentLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border-2 border-primary rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
              
              <button 
                onClick={closeLevelUp}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6"
              >
                <ArrowUpCircle className="w-12 h-12 text-primary" />
              </motion.div>

              <h2 className="text-4xl font-black text-primary mb-2 uppercase tracking-widest">
                LEVEL UP!
              </h2>
              <p className="text-xl font-bold mb-6 text-foreground">
                {currentLevelUp.message}
              </p>
              
              <button 
                onClick={closeLevelUp}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 hover:scale-105 transition-all"
              >
                Жалғастыру
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Toasts for Achievements/Quests */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.filter(n => n.type !== 'level_up').map(notif => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-card border rounded-xl p-4 shadow-lg flex items-center gap-4 max-w-sm"
            >
              <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{notif.title}</h4>
                <p className="text-xs text-muted-foreground">{notif.message}</p>
              </div>
              <button onClick={() => markAsRead(notif.id)} className="ml-auto text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
