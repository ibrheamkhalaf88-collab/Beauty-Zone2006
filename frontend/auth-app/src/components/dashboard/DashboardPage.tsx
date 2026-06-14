import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LogOut, User as UserIcon } from 'lucide-react'
import WelcomeOverlay from './WelcomeOverlay'
import BeautyPointsCard from './BeautyPointsCard'
import OrdersTimeline from './OrdersTimeline'
import OffersCarousel from './OffersCarousel'
import AchievementsGrid from './AchievementsGrid'
import { mockUser, mockOrders, mockOffers, mockAchievements } from '../../data/mockData'

interface UserData {
  name: string
}

interface DashboardPageProps {
  user: UserData | null
  onLogout: () => void
}

function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [showWelcome, setShowWelcome] = useState(true)

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 relative">
      {/* Welcome Overlay */}
      {showWelcome && (
        <WelcomeOverlay 
          userName={user?.name || mockUser.name}
          onComplete={handleWelcomeComplete}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-secondary/20">
              <UserIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-text-dark">
                {user?.name || mockUser.name}
              </h1>
              <p className="text-text-light text-sm">أهلاً بكِ في بيوتي زون ✨</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 text-text-mid hover:text-primary hover:bg-white/80 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">خروج</span>
          </button>
        </motion.div>

        {/* Main Grid */}
        <div className="space-y-6">
          {/* Top Row */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <BeautyPointsCard
                points={mockUser.beautyPoints}
                nextRewardPoints={mockUser.nextRewardPoints}
                tier={mockUser.tier}
              />
            </div>
            <div className="md:col-span-2">
              <OffersCarousel offers={mockOffers} />
            </div>
          </div>

          {/* Orders */}
          <OrdersTimeline orders={mockOrders} />

          {/* Achievements */}
          <AchievementsGrid achievements={mockAchievements} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-text-light/40 text-sm">Beauty Zone  2025</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
