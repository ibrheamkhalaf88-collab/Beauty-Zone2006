import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Achievement } from '../../data/mockData'

interface AchievementsGridProps {
  achievements: Achievement[]
}

function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50"
    >
      <h3 className="font-bold text-text-dark text-lg mb-4">إنجازاتي</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.1, y: -4 }}
            className={`relative flex flex-col items-center p-3 rounded-2xl transition-all cursor-default ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-secondary/10 to-amber-400/10 border-2 border-secondary/30' 
                : 'bg-white/30 border-2 border-dashed border-text-light/20'
            }`}
          >
            <div className="text-3xl mb-2">
              {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-text-light/40" />}
            </div>
            <span className={`text-xs text-center font-medium ${achievement.unlocked ? 'text-text-dark' : 'text-text-light'}`}>
              {achievement.title}
            </span>
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AchievementsGrid
