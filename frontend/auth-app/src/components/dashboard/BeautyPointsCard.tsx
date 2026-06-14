import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

interface BeautyPointsCardProps {
  points: number
  nextRewardPoints: number
  tier: string
}

function BeautyPointsCard({ points, nextRewardPoints, tier }: BeautyPointsCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const animatedPoints = useAnimatedCounter(points, 2000)
  const progress = Math.min((points / nextRewardPoints) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50 cursor-default"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div 
          animate={{ rotate: isHovered ? 12 : 0 }}
          className="w-12 h-12 bg-gradient-to-br from-secondary to-amber-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Crown className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="font-bold text-text-dark text-lg">نقاط الجمال</h3>
          <p className="text-text-light text-sm">تصنيف: {tier === 'gold' ? 'ذهبي' : tier}</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <motion.span 
          className="text-5xl font-display font-bold text-secondary inline-block"
        >
          {animatedPoints}
        </motion.span>
        <span className="text-text-light text-sm mr-2">نقطة</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-accent/50 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-amber-400 rounded-full"
        />
      </div>
      <div className="flex justify-between text-xs text-text-light">
        <span>0</span>
        <span>{nextRewardPoints} نقطة للمكافأة التالية</span>
        <span>{nextRewardPoints}</span>
      </div>
    </motion.div>
  )
}

export default BeautyPointsCard
