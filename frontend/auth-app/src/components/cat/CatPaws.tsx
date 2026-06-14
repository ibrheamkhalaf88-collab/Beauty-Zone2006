interface CatPawsProps {
  isVisible: boolean;
}

function CatPaws({ isVisible }: CatPawsProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none">
      <div 
        className="w-6 h-14 bg-gradient-to-b from-primary to-[#6B2F2F] rounded-full shadow-lg origin-bottom animate-cover-eyes-left"
      />
      <div 
        className="w-6 h-14 bg-gradient-to-b from-primary to-[#6B2F2F] rounded-full shadow-lg origin-bottom animate-cover-eyes-right"
      />
    </div>
  );
}

export default CatPaws;
