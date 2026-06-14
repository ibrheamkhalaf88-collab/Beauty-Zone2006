import { useState, useEffect } from 'react'

export function useAnimatedCounter(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(ease * target)
      
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return count
}
