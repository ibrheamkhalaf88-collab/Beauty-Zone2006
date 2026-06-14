import { useEffect, useRef } from 'react'

interface CatEyesProps {
  mouseX: number;
  mouseY: number;
  isPasswordFocused: boolean;
}

function CatEyes({ mouseX, mouseY, isPasswordFocused }: CatEyesProps) {
  if (isPasswordFocused) return null;

  const maxOffset = 8;
  const angle = Math.atan2(mouseY - 50, mouseX - 50);
  const distance = Math.min(Math.sqrt((mouseX - 50) ** 2 + (mouseY - 50) ** 2) / 10, maxOffset);

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 pointer-events-none">
      {/* Left Eye */}
      <div 
        className="w-7 h-7 bg-white rounded-full relative overflow-hidden border-2 border-text-dark/10"
        style={{ transform: 'translate(-2px, 0)' }}
      >
        <div 
          className="w-3.5 h-3.5 bg-text-dark rounded-full absolute top-1/2 left-1/2 transition-transform duration-100 ease-out"
          style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
        </div>
      </div>
      
      {/* Right Eye */}
      <div 
        className="w-7 h-7 bg-white rounded-full relative overflow-hidden border-2 border-text-dark/10"
        style={{ transform: 'translate(2px, 0)' }}
      >
        <div 
          className="w-3.5 h-3.5 bg-text-dark rounded-full absolute top-1/2 left-1/2 transition-transform duration-100 ease-out"
          style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 right-0.5" />
        </div>
      </div>
    </div>
  );
}

export default CatEyes;
