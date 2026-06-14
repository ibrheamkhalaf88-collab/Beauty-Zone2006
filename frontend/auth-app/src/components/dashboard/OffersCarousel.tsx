import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Tag, Copy } from 'lucide-react'
import type { Offer } from '../../data/mockData'

interface OffersCarouselProps {
  offers: Offer[]
}

function OffersCarousel({ offers }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/50"
    >
      <h3 className="font-bold text-text-dark text-lg mb-4">عروض خاصة</h3>
      
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-amber-300/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Tag className="w-10 h-10 text-secondary/60" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-text-dark mb-1">{offers[currentIndex].title}</h4>
              <p className="text-text-light text-sm mb-3">{offers[currentIndex].description}</p>
              <div className="flex items-center gap-2">
                <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-bold">
                  {offers[currentIndex].code}
                </span>
                <button
                  onClick={() => copyCode(offers[currentIndex].code)}
                  className="p-2 bg-white/50 rounded-xl hover:bg-white/80 transition-colors"
                  title="نسخ الكود"
                >
                  <Copy className="w-4 h-4 text-text-mid" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button 
          onClick={prevOffer}
          className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-text-dark" />
        </button>
        <div className="flex gap-2">
          {offers.map((_, index) => (
            <div 
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-secondary' : 'bg-accent'
              }`}
            />
          ))}
        </div>
        <button 
          onClick={nextOffer}
          className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-text-dark" />
        </button>
      </div>
    </motion.div>
  )
}

export default OffersCarousel
