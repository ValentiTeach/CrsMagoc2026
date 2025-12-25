import React, { useState } from 'react';
import Snowfall from './components/Snowfall';
import InteractiveCard from './components/InteractiveCard';
import CursorSparkles from './components/CursorSparkles';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden flex flex-col">
      {/* Visual Effects */}
      <Snowfall />
      <CursorSparkles />

      {/* Header */}
      <header className="relative z-10 w-full py-8 text-center animate-float">
        <h1 className="font-serif text-5xl md:text-7xl text-christmas-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          Магія Різдва
        </h1>
        <div className="flex items-center justify-center space-x-4 mt-2">
            <div className="h-[1px] w-12 bg-christmas-gold/50"></div>
            <span className="font-sans text-christmas-gold/80 tracking-[0.5em] text-sm md:text-base">2026</span>
            <div className="h-[1px] w-12 bg-christmas-gold/50"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4">
        
        <div className="w-full max-w-4xl mx-auto mb-12">
            <InteractiveCard />
        </div>

        <div className="text-center max-w-md mx-auto">
            <p className="font-sans text-slate-400 text-xs tracking-wider opacity-60">
                Створено за допомогою Gemini AI. Доторкніться до дива.
            </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center border-t border-white/5">
        <p className="font-serif text-slate-500 text-sm">
          &copy; 2026 Генератор Різдвяних Привітань
        </p>
      </footer>
    </div>
  );
};

export default App;