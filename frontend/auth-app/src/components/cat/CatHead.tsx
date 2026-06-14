import CatEyes from './CatEyes'
import CatPaws from './CatPaws'

interface CatHeadProps {
  mouseX: number;
  mouseY: number;
  isPasswordFocused: boolean;
}

function CatHead({ mouseX, mouseY, isPasswordFocused }: CatHeadProps) {
  return (
    <div className="relative w-36 h-36 mx-auto mb-2">
      {/* Main Head */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 to-amber-500/90 rounded-full shadow-lg shadow-secondary/20">
        
        {/* Left Ear */}
        <div className="absolute -top-4 left-4 w-8 h-12 bg-gradient-to-br from-secondary to-amber-600 rounded-full transform -rotate-12 origin-bottom" 
             style={{ transform: isPasswordFocused ? 'rotate(-20deg) translateY(-2px)' : 'rotate(-12deg)' }} />
        {/* Right Ear */}
        <div className="absolute -top-4 right-4 w-8 h-12 bg-gradient-to-bl from-secondary to-amber-600 rounded-full transform rotate-12 origin-bottom"
             style={{ transform: isPasswordFocused ? 'rotate(20deg) translateY(-2px)' : 'rotate(12deg)' }} />

        {/* Inner Ears */}
        <div className="absolute -top-2 left-5 w-5 h-7 bg-pink-300 rounded-full transform -rotate-12" />
        <div className="absolute -top-2 right-5 w-5 h-7 bg-pink-300 rounded-full transform rotate-12" />

        {/* Eyes Layer */}
        <CatEyes mouseX={mouseX} mouseY={mouseY} isPasswordFocused={isPasswordFocused} />

        {/* Paws Layer (covers eyes when password is focused) */}
        <CatPaws isVisible={isPasswordFocused} />

        {/* Nose */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-400 rounded-full" />

        {/* Mouth */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-0">
          <div className="w-4 h-3 border-b-2 border-text-dark/80 rounded-full transform -rotate-15 origin-top-right" />
          <div className="w-4 h-3 border-b-2 border-text-dark/80 rounded-full transform rotate-15 origin-top-left" />
        </div>

        {/* Whiskers */}
        <div className="absolute top-1/2 -left-6 w-10 h-0.5 bg-text-dark/20 rotate-12 origin-right" />
        <div className="absolute top-1/2 -left-6 w-8 h-0.5 bg-text-dark/15 -rotate-6 origin-right" />
        <div className="absolute top-1/2 -right-6 w-10 h-0.5 bg-text-dark/20 -rotate-12 origin-left" />
        <div className="absolute top-1/2 -right-6 w-8 h-0.5 bg-text-dark/15 rotate-6 origin-left" />

        {/* Cheek Blush */}
        <div className="absolute top-2/3 left-2 w-6 h-4 bg-pink-300/30 rounded-full blur-sm" />
        <div className="absolute top-2/3 right-2 w-6 h-4 bg-pink-300/30 rounded-full blur-sm" />
      </div>
    </div>
  );
}

export default CatHead;
