import React, { useState, useRef, MouseEvent } from 'react';
import { generateChristmasGreeting, GreetingTheme } from '../services/geminiService';

const themes: { id: GreetingTheme; label: string; icon: string }[] = [
    { id: 'magic', label: 'Магія', icon: '✨' },
    { id: 'cozy', label: 'Затишок', icon: '🕯️' },
    { id: 'hope', label: 'Надія', icon: '🌟' },
    { id: 'spiritual', label: 'Духовність', icon: '🙏' },
];

const InteractiveCard: React.FC = () => {
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<GreetingTheme>('magic');
  
  // Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Invert for correct tilt feel
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const generate = async (theme: GreetingTheme) => {
    setLoading(true);
    // Add a small artificial delay for the "magic" feeling
    const [text] = await Promise.all([
      generateChristmasGreeting(theme),
      new Promise(resolve => setTimeout(resolve, 800))
    ]);
    setGreeting(text);
    setLoading(false);
  };

  const handleOpen = async () => {
    if (isOpen) return;
    await generate(currentTheme);
    setIsOpen(true);
  };

  const handleThemeSelect = async (theme: GreetingTheme) => {
      setCurrentTheme(theme);
      await generate(theme);
  };

  const handleReset = () => {
    setIsOpen(false);
    setTimeout(() => {
        setGreeting(null);
        setTilt({ x: 0, y: 0 });
    }, 500);
  };

  // Calculate transforms
  // When closed: just tilt
  // When open: flip 180 + tilt (inverted X for backface natural feel)
  const transformStyle = isOpen 
    ? `rotateY(${180 + tilt.y * 0.5}deg) rotateX(${tilt.x * 0.5}deg)` 
    : `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`;

  return (
    <div 
        className="relative w-full max-w-2xl mx-auto perspective-1000 min-h-[500px] flex items-center justify-center p-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      {/* Container that handles the flip and tilt */}
      <div 
        ref={cardRef}
        className={`relative w-full transition-transform duration-1000 ease-out transform-style-3d cursor-pointer shadow-2xl rounded-xl`}
        style={{ 
          transform: transformStyle,
          minHeight: '450px',
          transition: 'transform 0.1s ease-out, min-height 0.3s'
        }}
        onClick={!isOpen ? handleOpen : undefined}
      >
        
        {/* FRONT OF CARD */}
        <div className="absolute inset-0 w-full h-full backface-hidden shadow-2xl rounded-xl overflow-hidden border-2 border-christmas-gold/30 group bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-christmas-red to-slate-900"></div>
          
          {/* Moving sheen effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:animate-shimmer"></div>
          
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                {/* SVG Snowflake/Star Icon */}
                <svg className="w-24 h-24 text-christmas-gold mb-6 drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v18m9-9H3m15.364 6.364l-12.728-12.728m12.728 0L9.272 19.272M12 7a5 5 0 110 10 5 5 0 010-10z" />
                </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider mb-4 drop-shadow-lg">
              Різдво 2026
            </h2>
            <p className="text-christmas-gold/90 font-sans text-sm tracking-[0.3em] uppercase mt-4 border-t border-b border-christmas-gold/30 py-2 inline-block">
              Натисніть для магії
            </p>

             {loading && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                     <div className="w-8 h-8 border-4 border-christmas-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
             )}
          </div>
          
          {/* Shiny border effect */}
          <div className="absolute inset-0 border-4 border-double border-christmas-gold/20 rounded-xl pointer-events-none"></div>
        </div>

        {/* BACK OF CARD (Reveal) */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-white text-slate-900 rounded-xl shadow-2xl p-6 md:p-10 flex flex-col items-center"
            style={{ transform: 'rotateY(180deg)' }}
            onClick={(e) => e.stopPropagation()} 
        >
          <div className="absolute inset-0 border-[16px] border-christmas-red/10 pointer-events-none rounded-xl"></div>
          <div className="absolute inset-4 border border-christmas-gold/50 pointer-events-none"></div>

          <div className="w-full flex-grow flex flex-col items-center justify-center relative z-10 overflow-y-auto scrollbar-hide">
            {loading ? (
                 <div className="flex flex-col items-center justify-center space-y-4 py-10">
                    <div className="w-12 h-12 border-4 border-christmas-red border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-serif text-christmas-red italic text-lg animate-pulse">Зірки шепочуть...</p>
                 </div>
            ) : (
                <>
                    <div className="mb-4 text-christmas-red">
                        <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                             <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                        </svg>
                    </div>
                    
                    <div className="font-serif text-lg md:text-xl leading-relaxed text-slate-800 italic text-center px-2">
                      {greeting}
                    </div>

                    <div className="w-8 h-[1px] bg-christmas-red/30 my-6"></div>

                    {/* Theme Selectors */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => handleThemeSelect(t.id)}
                                disabled={loading}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all
                                    flex items-center gap-1
                                    ${currentTheme === t.id 
                                        ? 'bg-christmas-red text-white shadow-md scale-105' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                                `}
                            >
                                <span>{t.icon}</span> {t.label}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handleReset}
                        className="px-8 py-2 border-b border-slate-300 text-slate-400 font-sans text-xs uppercase tracking-widest hover:text-christmas-red hover:border-christmas-red transition-colors"
                    >
                        Закрити
                    </button>
                </>
            )}
          </div>
        </div>

      </div>
      
      {/* Helper CSS for 3D flip */}
      <style>{`
        .perspective-1000 { perspective: 1200px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        /* Custom Scrollbar hide */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default InteractiveCard;