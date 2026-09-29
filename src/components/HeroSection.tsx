import React from 'react';
import { Shield, Sparkles, ArrowRight, Eye, Flame, CheckCircle2 } from 'lucide-react';
import { SACRED_IMAGES } from '../config/spiritualConfig';

interface HeroSectionProps {
  onStartQuiz: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartQuiz }) => {
  return (
    <section className="relative overflow-hidden border-b border-red-950/60 bg-gradient-to-b from-[#1a0407] via-[#120305] to-[#0d0204] py-14 sm:py-20 lg:py-24">
      {/* Background ambient texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen">
        <img
          src={SACRED_IMAGES.altarBanner}
          alt="Altar Sagrado"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120305]/90 via-[#120305]/70 to-[#120305]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Subtle trust tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-red-800/40 bg-red-950/40 px-3.5 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm mb-6">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Diagnóstico Espiritual e Comportamental Revelador</span>
        </div>

        {/* Headline with balanced wrap */}
        <h1 className="font-serif-sacred text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight" style={{ textWrap: 'balance' }}>
          Ele(a) se afastou de repente ou você sente cheiro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">traição e mentira?</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-rose-100/80 max-w-2xl mx-auto leading-relaxed font-light">
          A frieza repentina, o segredo com o celular e as brigas sem sentido quase nunca são por acaso. Descubra em menos de 2 minutos se há <strong className="text-amber-200 font-semibold">interferência de terceiros, demandas espirituais ou manipulação mental</strong> afastando quem você ama.
        </p>

        {/* Primary CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartQuiz}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 px-8 py-4 text-base font-bold uppercase tracking-wider text-white shadow-xl shadow-red-950/80 hover:from-red-600 hover:to-red-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Sparkles className="h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Iniciar Teste Revelador Gratuito</span>
            <ArrowRight className="h-5 w-5 text-amber-200 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-red-950/50 text-left">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/20 border border-red-900/30">
            <Eye className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-100">Sigilo Absoluto</p>
              <p className="text-[11px] text-rose-200/60">Seus dados 100% protegidos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/20 border border-red-900/30">
            <Shield className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-100">Garantia Total</p>
              <p className="text-[11px] text-rose-200/60">Atendimento ou dinheiro de volta</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/20 border border-red-900/30">
            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-100">Mãe de Santo Real</p>
              <p className="text-[11px] text-rose-200/60">+27 anos de tradição</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/20 border border-red-900/30">
            <Flame className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-100">Valor Simbólico</p>
              <p className="text-[11px] text-rose-200/60">Apenas R$ 9,90 via PIX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
