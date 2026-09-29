import React from 'react';
import { ShieldCheck, HeartCrack, Sparkles } from 'lucide-react';

interface NavbarProps {
  onStartQuiz: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartQuiz }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-950/60 bg-[#120305]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <HeartCrack className="h-5 w-5 text-red-500" />
          <a
            href="/"
            className="font-serif-sacred text-base font-bold tracking-wider text-amber-200 hover:text-amber-100 transition-colors uppercase sm:text-lg"
          >
            Acolhimento Espiritual
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-medium text-red-200/80">
          <a href="#como-funciona" className="hover:text-amber-300 transition-colors">
            Como Funciona
          </a>
          <a href="#mae-de-santo" className="hover:text-amber-300 transition-colors">
            Mãe de Santo
          </a>
          <a href="#depoimentos" className="hover:text-amber-300 transition-colors">
            Depoimentos
          </a>
          <a href="#garantia" className="hover:text-amber-300 transition-colors">
            Garantia
          </a>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStartQuiz}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-800 to-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-red-950 hover:from-red-700 hover:to-red-500 transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Fazer Diagnóstico</span>
          </button>
        </div>
      </div>
    </header>
  );
};
