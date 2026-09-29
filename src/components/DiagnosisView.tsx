import React, { useState, useEffect } from 'react';
import { DiagnosisResult, SiteSettings } from '../types';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowDownCircle,
  Clock,
  HeartCrack,
  Eye,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { SACRED_IMAGES } from '../config/spiritualConfig';

interface DiagnosisViewProps {
  diagnosis: DiagnosisResult;
  leadName: string;
  partnerName?: string;
  settings: SiteSettings;
  onProceedToCheckout: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
  diagnosis,
  leadName,
  partnerName,
  settings,
  onProceedToCheckout,
}) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setAnalyzing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  const primeiroNome = leadName.split(' ')[0] || 'Irmão(ã)';
  const parceiro = partnerName?.trim() ? partnerName.trim() : 'a pessoa amada';

  if (analyzing) {
    return (
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-lg rounded-2xl border border-red-900/60 bg-gradient-to-b from-[#1c0509] to-[#120305] p-8 shadow-2xl">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-950/80 border border-amber-500/40">
            <Flame className="h-10 w-10 text-amber-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-red-500/40 border-t-transparent animate-spin" />
          </div>

          <h3 className="font-serif-sacred text-xl font-bold text-white mb-2">
            Cruzando Frequências & Sinais Espirituais...
          </h3>
          <p className="text-xs text-rose-200/70 mb-6">
            Consultando os arquétipos do oráculo para {primeiroNome} e {parceiro}.
          </p>

          <div className="h-3 w-full overflow-hidden rounded-full bg-red-950 border border-red-900/50">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <span className="mt-2 block text-xs font-mono text-amber-300">
            {analysisProgress}% concluído
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnostico-resultado" className="py-12 sm:py-16 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Banner with risk level */}
        <div className="rounded-2xl border border-red-800/80 bg-gradient-to-r from-red-950 via-red-900/90 to-red-950 p-6 sm:p-8 shadow-2xl shadow-red-950/80 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-red-950/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 shadow-inner">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Nível de Risco: {diagnosis.nivelRisco}</span>
          </div>

          <h2 className="font-serif-sacred text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Diagnóstico Confirmado para {primeiroNome}: Há fortes indícios de ação externa e perturbação
          </h2>

          <p className="mt-4 text-sm sm:text-base text-rose-100/90 max-w-2xl mx-auto leading-relaxed">
            {diagnosis.resumoCaso}
          </p>
        </div>

        {/* 3 Pillars of Diagnostic analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-red-900/50 bg-[#170407] p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <HeartCrack className="h-5 w-5" />
                <h4 className="font-serif-sacred text-sm font-bold uppercase tracking-wider text-rose-100">
                  Bloqueio Emocional
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
                {diagnosis.bloqueioEmocional}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-red-950 flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Sintoma Primário Confirmado</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-red-900/50 bg-[#170407] p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <Eye className="h-5 w-5" />
                <h4 className="font-serif-sacred text-sm font-bold uppercase tracking-wider text-rose-100">
                  Terceira Pessoa / Inveja
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
                {diagnosis.interferenciaExterna}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-red-950 flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Influência Externa Ativa</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-red-900/50 bg-[#170407] p-6 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <Flame className="h-5 w-5" />
                <h4 className="font-serif-sacred text-sm font-bold uppercase tracking-wider text-rose-100">
                  Influência Espiritual
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed">
                {diagnosis.interferenciaEspiritual}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-red-950 flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Necessita Quebra Urgente</span>
            </div>
          </div>
        </div>

        {/* Deep Spiritual Explanation: Why people change overnight */}
        <div className="rounded-2xl border border-red-900/40 bg-gradient-to-b from-[#1b0509] to-[#120305] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="h-4 w-4" />
            <span>Entenda o Fenômeno</span>
          </div>

          <h3 className="font-serif-sacred text-xl sm:text-2xl font-bold text-white leading-snug">
            Por que {parceiro} parece outra pessoa da noite para o dia?
          </h3>

          <div className="mt-4 space-y-3 text-xs sm:text-sm text-rose-100/80 leading-relaxed">
            <p>
              Quando uma pessoa é alvo de <strong>interferência mental induzida, inveja destrutiva ou amarrações</strong>, acontece o que a tradição espiritual chama de <em>&ldquo;véu da cegueira&rdquo;</em>.
            </p>
            <p>
              A pessoa começa a ver defeito em tudo o que você faz, sente uma irritação inexplicável ao estar perto e é atraída magneticamente para pessoas que não prestam. Na cabeça dela, ela acha que está decidindo por conta própria, mas a mente está confusa e vulnerável a energias externas.
            </p>
            <p className="text-amber-200 font-medium">
              Tentar convencer na base do desespero ou de brigas só acelera o afastamento. É necessário agir no plano energético e espiritual para dissolver o nó e restaurar a verdade.
            </p>
          </div>
        </div>

        {/* Personalized Consultation Offer with Mãe de Santo */}
        <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#24060c] via-[#1a0408] to-[#120305] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Photo of Mãe de Santo */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl shadow-red-950">
                <img
                  src={settings.maeFoto || SACRED_IMAGES.maePortrait}
                  alt={settings.maeNome}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback if custom URL fails
                    (e.target as HTMLImageElement).src = SACRED_IMAGES.maePortrait;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <h4 className="mt-3 font-serif-sacred text-base font-bold text-amber-200">
                {settings.maeNome}
              </h4>
              <p className="text-xs text-rose-200/70">{settings.maeTitulo}</p>
            </div>

            {/* Offer details & Call to Action */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 rounded-md bg-red-900/60 border border-red-700/50 px-3 py-1 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Consulta Individual & Aconselhamento Direcionado</span>
              </div>

              <h3 className="font-serif-sacred text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Receba a revelação completa e a orientação de firmeza com a Mãe de Santo
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-rose-100/90">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Abertura do oráculo para confirmar nomes e quem está agindo nos bastidores.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Verificação detalhada de amarrações, olho gordo ou feitiços amorosos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Encaminhamento prático e seguro para afastar rivais e trazer a pessoa de volta à lucidez.</span>
                </li>
              </ul>

              {/* Price comparison */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-xs text-rose-300/50 line-through">De R$ 97,00</span>
                <span className="text-3xl sm:text-4xl font-extrabold font-serif-sacred text-amber-300">
                  R$ {settings.valorConsulta}
                </span>
                <span className="text-xs text-rose-200/70 font-medium">
                  (Contribuição simbólica para o oráculo)
                </span>
              </div>

              {/* Guarantee callout */}
              <div className="p-3 rounded-lg bg-red-950/60 border border-amber-500/30 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
                <p className="text-xs text-rose-100 font-medium leading-tight">
                  <strong className="text-amber-300">Garantia Absoluta:</strong> Ou você recebe o acolhimento e a orientação da Mãe de Santo no WhatsApp, ou seus R$ {settings.valorConsulta} são devolvidos imediatamente.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 px-8 py-4 text-sm sm:text-base font-extrabold uppercase tracking-wider text-stone-950 shadow-xl shadow-red-950 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sparkles className="h-5 w-5 text-stone-950 fill-stone-950" />
                  <span>Garantir Consulta por Apenas R$ {settings.valorConsulta}</span>
                  <ArrowDownCircle className="h-5 w-5 text-stone-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
