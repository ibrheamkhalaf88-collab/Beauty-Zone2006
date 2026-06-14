import { useRef, useState } from 'react'
import CatHead from './CatHead'

interface InteractiveCatProps {
  isPasswordFocused: boolean;
}

function InteractiveCat({ isPasswordFocused }: InteractiveCatProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      // Normalize to 0-100 range
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex justify-center py-4 cursor-default select-none"
    >
      <CatHead 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isPasswordFocused={isPasswordFocused} 
      />
    </div>
  )
}

export default InteractiveCat
