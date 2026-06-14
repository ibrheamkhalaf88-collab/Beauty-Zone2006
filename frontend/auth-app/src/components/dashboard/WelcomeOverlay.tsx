import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface WelcomeOverlayProps {
  userName: string
  onComplete: () => void
}

function WelcomeOverlay({ userName, onComplete }: WelcomeOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
      onComplete()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-warm/95 backdrop-blur-sm"
    >
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: -20, 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 500), 
                rotate: 0 
              }}
              animate={{ 
                y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800, 
                rotate: 360, 
                opacity: 0 
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: ['#C4A35A', '#E8A4B8', '#8B3A3A', '#F0E6D3'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}
      
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl mb-4"
        >
          ✨
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-display font-bold text-text-dark mb-2"
        >
          أهلاً وسهلاً، {userName}! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-text-mid"
        >
          مستعدة لاستكشاف عالم الجمال؟ 💎
        </motion.p>
      </div>
    </motion.div>
  )
}

export default WelcomeOverlay
