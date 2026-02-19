"use client";

export function GoldGlowLine() {
  return (
    <div className="relative w-full h-12 flex items-center justify-center overflow-hidden my-6">
      {/* Background line */}
      <div className="absolute w-full h-[2px] bg-zinc-800/50" />

      {/* Animated glow line */}
      <div className="absolute w-full h-[2px] overflow-hidden">
        <div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          style={{
            boxShadow: '0 0 20px 3px rgba(251, 191, 36, 0.7), 0 0 40px 6px rgba(245, 158, 11, 0.4)',
            animation: 'slideGlow 3s linear infinite',
          }}
        />
      </div>

      {/* CSS animation keyframes */}
      <style jsx>{`
        @keyframes slideGlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
      `}</style>
    </div>
  );
}
