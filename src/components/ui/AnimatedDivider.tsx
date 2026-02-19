"use client";

export function AnimatedDivider() {
  return (
    <div className="relative w-full h-12 flex items-center justify-center overflow-hidden my-6">
      {/* Background line */}
      <div className="absolute w-full h-[2px] bg-zinc-800/50" />
      
      {/* Animated glow line */}
      <div className="absolute w-full h-[2px] overflow-hidden">
        <div 
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-slide-glow"
          style={{
            boxShadow: '0 0 20px 3px rgba(251, 191, 36, 0.7), 0 0 40px 6px rgba(245, 158, 11, 0.4)',
          }}
        />
      </div>
    </div>
  );
}
