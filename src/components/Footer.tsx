import React from 'react';
import { HeartCrack, ShieldCheck, Lock, Key } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="border-t border-red-950/80 bg-[#0d0204] py-12 px-4 sm:px-6 text-rose-300/60">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-red-950/60">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <HeartCrack className="h-5 w-5 text-red-500" />
              <span className="font-serif-sacred text-base font-bold text-amber-200 uppercase tracking-wider">
                Acolhimento & Consulta Espiritual
              </span>
            </div>
            <p className="text-xs leading-relaxed text-rose-200/60 max-w-md">
              Orientação oracular, desmanche de nós amorosos e quebra de demandas espirituais sob a condução de {settings.maeNome}. Atendimento humanizado, ético e comprometido com a reconstrução da sua paz.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/80 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Garantia Total: Atendimento ou Reembolso Integral de R$ {settings.valorConsulta}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="font-serif-sacred text-xs font-bold uppercase tracking-wider text-rose-100">
              Navegação
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#como-funciona" className="hover:text-amber-300 transition-colors">
                  Como Funciona o Diagnóstico
                </a>
              </li>
              <li>
                <a href="#mae-de-santo" className="hover:text-amber-300 transition-colors">
                  Biografia da Mãe de Santo
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-amber-300 transition-colors">
                  Depoimentos Verificados
                </a>
              </li>
              <li>
                <a href="#garantia" className="hover:text-amber-300 transition-colors">
                  Termo de Devolução
                </a>
              </li>
            </ul>
          </div>

          {/* Legal and Security */}
          <div className="space-y-2">
            <h5 className="font-serif-sacred text-xs font-bold uppercase tracking-wider text-rose-100">
              Segurança & Sigilo
            </h5>
            <div className="space-y-1.5 text-xs text-rose-300/60 leading-relaxed">
              <p className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                <Lock className="h-3 w-3" />
                <span>Sigilo Sacramental Sagrado</span>
              </p>
              <p>Chave PIX: <code className="text-rose-100">{settings.pixKey}</code></p>
              <p>Atendimento direto e sem intermediários.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-rose-400/50 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Acolhimento Espiritual. Amparo ao exercício da liberdade religiosa e de crença garantido pela CF/88 Art. 5º, VI.
          </p>
          <p className="text-[10px] text-rose-400/40">
            Atendimento sigiloso sob preceito de fé e aconselhamento sagrado.
          </p>
        </div>
      </div>
    </footer>
  );
};
