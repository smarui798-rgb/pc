import React from 'react';
import { ShieldCheck, RotateCcw, Clock, Lock, Sparkles } from 'lucide-react';

export const GuaranteeSection: React.FC = () => {
  return (
    <section id="garantia" className="py-16 sm:py-20 px-4 sm:px-6 border-t border-red-950/60 bg-gradient-to-b from-[#120305] to-[#1c050a]">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-r from-red-950/90 via-[#26050b] to-red-950/90 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Guarantee Badge Icon */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-2xl shadow-amber-950/60">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#170306] text-amber-300">
                  <ShieldCheck className="h-14 w-14" />
                </div>
              </div>
              <span className="mt-4 font-serif-sacred text-base font-extrabold text-amber-300 uppercase tracking-wider">
                Garantia Blindada
              </span>
              <span className="text-[11px] text-rose-200/70">Devolução Incondicional</span>
            </div>

            {/* Content description */}
            <div className="md:col-span-8 space-y-4 text-left">
              <h3 className="font-serif-sacred text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Ou te atendemos e direcionamos ou seu dinheiro é devolvido
              </h3>

              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                Sabemos o quanto o seu coração já foi machucado por promessas vazias e falsas expectativas. Por isso, assumimos 100% do risco da sua consulta de R$ 9,90.
              </p>

              <div className="space-y-2.5 pt-1 text-xs text-rose-200/90">
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Reembolso Automático:</strong> Se por qualquer motivo a consulta não atender suas expectativas de clareza ou se não houver retorno no WhatsApp, basta solicitar que estornamos os R$ 9,90 na hora via chave PIX.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Atendimento Humanizado:</strong> Não usamos robôs de resposta automática. É a Mãe Bety e sua equipe de firmeza que respondem diretamente seu caso.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sigilo Sacramental:</strong> O que você contar fica trancado a sete chaves perante o sagrado.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
