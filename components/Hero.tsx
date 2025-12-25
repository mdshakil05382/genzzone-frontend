'use client';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Textured background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(184, 134, 11, 0.2) 0%, transparent 50%)`,
        }} />
      </div>

      {/* Center - Stone Washed Text */}
      <div className="relative z-10 flex items-center justify-center min-h-[90vh]">
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white uppercase tracking-tight relative">
            <span className="relative inline-block" style={{
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.5),
                0 0 20px rgba(255, 255, 255, 0.3),
                2px 2px 4px rgba(0, 0, 0, 0.8),
                -2px -2px 4px rgba(139, 69, 19, 0.5)
              `,
              filter: 'contrast(1.2) brightness(0.95)',
              background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 25%, #a3a3a3 50%, #737373 75%, #525252 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              STONE
            </span>
            <span className="relative inline-block ml-4" style={{
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.5),
                0 0 20px rgba(255, 255, 255, 0.3),
                2px 2px 4px rgba(0, 0, 0, 0.8),
                -2px -2px 4px rgba(139, 69, 19, 0.5)
              `,
              filter: 'contrast(1.2) brightness(0.95)',
              background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 25%, #a3a3a3 50%, #737373 75%, #525252 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              WASHED
            </span>
          </h1>
        </div>
      </div>

      {/* Decorative rock formations */}
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-30">
        <div className="w-full h-full bg-gradient-to-tr from-gray-600 to-transparent transform rotate-12" style={{
          clipPath: 'polygon(0% 100%, 20% 80%, 40% 90%, 60% 70%, 80% 85%, 100% 60%, 100% 100%)',
        }}></div>
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
        <div className="w-full h-full bg-gradient-to-tl from-gray-700 to-transparent transform -rotate-12" style={{
          clipPath: 'polygon(0% 60%, 20% 70%, 40% 50%, 60% 65%, 80% 45%, 100% 55%, 100% 100%, 0% 100%)',
        }}></div>
      </div>
    </section>
  );
}

