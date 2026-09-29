import React from 'react';
import { HelpCircle, Sparkles, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Diagnóstico Confidencial',
      desc: 'Você responde a 6 perguntas profundas sobre a mudança de comportamento, segredos no celular e sinais energéticos da pessoa amada.',
    },
    {
      step: '02',
      title: 'Revelação Imediata',
      desc: 'Nosso sistema oracular analisa os padrões e revela o nível de risco de traição, a probabilidade de uma terceira pessoa e bloqueios mentais.',
    },
    {
      step: '03',
      title: 'Contribuição Simbólica de R$ 9,90',
      desc: 'Taxa simbólica de vela e firmeza no PIX (Chave 35911302296) com garantia de atendimento ou devolução total do dinheiro.',
    },
    {
      step: '04',
      title: 'Acolhimento com a Mãe de Santo',
      desc: 'A Mãe Bety abre o oráculo no WhatsApp, confirma os nomes dos envolvidos e entrega o caminho sagrado para restabelecer a união e a verdade.',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#150407] border-t border-red-950/60">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-800/40 bg-red-950/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Processo Transparente</span>
          </div>
          <h2 className="font-serif-sacred text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Como funciona a consulta com a Mãe de Santo
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-rose-200/70">
            Passo a passo simples, seguro e 100% sigiloso do teste ao seu atendimento individual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-red-900/40 bg-[#1a0408]/80 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden"
            >
              <div className="font-serif-sacred text-3xl font-extrabold text-amber-500/20 mb-3">
                {item.step}
              </div>
              <div>
                <h4 className="font-serif-sacred text-base font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-rose-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-red-950/60 flex items-center gap-1.5 text-[11px] text-amber-400 font-medium">
                <Sparkles className="h-3 w-3" />
                <span>Etapa Essencial</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
