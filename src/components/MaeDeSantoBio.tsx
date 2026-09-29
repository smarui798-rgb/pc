import React from 'react';
import { SiteSettings } from '../types';
import { SACRED_IMAGES } from '../config/spiritualConfig';
import { Shield, Sparkles, HeartHandshake, Eye, Award } from 'lucide-react';

interface MaeDeSantoBioProps {
  settings: SiteSettings;
  onStartQuiz: () => void;
}

export const MaeDeSantoBio: React.FC<MaeDeSantoBioProps> = ({
  settings,
  onStartQuiz,
}) => {
  return (
    <section id="mae-de-santo" className="py-14 sm:py-20 px-4 sm:px-6 relative border-t border-red-950/60 bg-gradient-to-b from-[#140306] via-[#1b0509] to-[#120305]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Photo gallery column featuring multiple photos */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary featured photo */}
            <div className="relative group w-full rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-red-950">
              <img
                src={settings.maeFoto || SACRED_IMAGES.maePortrait}
                alt={settings.maeNome}
                className="w-full aspect-4/5 object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = SACRED_IMAGES.maePortrait;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120305] via-transparent to-transparent opacity-75" />

              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="inline-block rounded-full bg-red-950/90 border border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                  Acolhimento com Amor e Firmeza Espiritual
                </span>
              </div>
            </div>

            {/* Supporting photos grid showing consultation & rituals */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden border border-red-900/60 relative group">
                <img
                  src={SACRED_IMAGES.maeRitual}
                  alt="Momento de firmeza espiritual"
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-rose-200">
                  Firmeza & Oração
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-red-900/60 relative group">
                <img
                  src={SACRED_IMAGES.maeAtendimento}
                  alt="Mesa de atendimento oracular"
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-rose-200">
                  Consulta Individual
                </span>
              </div>
            </div>
          </div>

          {/* Description and credentials column */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-800/40 bg-red-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
              <Award className="h-3.5 w-3.5" />
              <span>Sacerdócio & Tradição Espiritual</span>
            </div>

            <h2 className="font-serif-sacred text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {settings.maeNome}
            </h2>

            <p className="text-sm sm:text-base text-amber-200/90 font-medium">
              {settings.maeTitulo}
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm text-rose-100/80 leading-relaxed font-light">
              <p>
                {settings.maeDescricao}
              </p>
              <p>
                Nascida com o dom da clarividência oracular e acolhendo corações feridos há mais de duas décadas, Mãe Bety é referência no desmanche de nós amorosos causados por traições veladas, afastamento repentino e a ação maliciosa de terceiros.
              </p>
              <p className="text-amber-200/90 font-medium italic border-l-2 border-amber-400 pl-3 py-1 bg-red-950/30 rounded-r-lg">
                &ldquo;Não faço amarrações para prejudicar o livre-arbítrio de ninguém. Minha missão sagrada é cortar a negatividade que cega a mente da pessoa amada, revelar a verdade e abrir os caminhos para o respeito mútuo.&rdquo;
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40">
                <Shield className="h-4 w-4 text-amber-400 mb-1" />
                <h5 className="text-xs font-bold text-rose-100">Sigilo Sagrado</h5>
                <p className="text-[11px] text-rose-300/60 mt-0.5">Nenhum detalhe é exposto.</p>
              </div>
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40">
                <HeartHandshake className="h-4 w-4 text-amber-400 mb-1" />
                <h5 className="text-xs font-bold text-rose-100">Acolhimento Real</h5>
                <p className="text-[11px] text-rose-300/60 mt-0.5">Sem julgamentos, com empatia.</p>
              </div>
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40">
                <Sparkles className="h-4 w-4 text-amber-400 mb-1" />
                <h5 className="text-xs font-bold text-rose-100">Valor Simbólico</h5>
                <p className="text-[11px] text-rose-300/60 mt-0.5">Apenas R$ {settings.valorConsulta} no PIX.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onStartQuiz}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:from-red-600 hover:to-red-500 transition-all active:scale-95"
              >
                <span>Fazer o Teste de Afastamento Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
