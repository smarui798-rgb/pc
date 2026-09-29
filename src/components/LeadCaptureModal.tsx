import React, { useState } from 'react';
import { Lock, Sparkles, User, MessageSquare, HeartHandshake } from 'lucide-react';
import { pixel } from '../utils/pixel';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onSubmit: (leadInfo: { nome: string; whatsapp: string; nomeParceiro?: string }) => void;
  isLoading: boolean;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onSubmit, isLoading }) => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nomeParceiro, setNomeParceiro] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Format WhatsApp with mask (XX) 9XXXX-XXXX
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    setWhatsapp(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = whatsapp.replace(/\D/g, '');

    if (!nome.trim() || nome.trim().length < 3) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    setError('');
    // Meta Pixel Lead Event
    pixel.lead({
      nome: nome.trim(),
      whatsapp,
      parceiro: nomeParceiro.trim(),
    });

    onSubmit({
      nome: nome.trim(),
      whatsapp,
      nomeParceiro: nomeParceiro.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-red-900/60 bg-gradient-to-b from-[#1f050a] via-[#150407] to-[#0f0204] p-6 sm:p-8 shadow-2xl shadow-red-950/90 text-left">
        {/* Header tag */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3">
          <Sparkles className="h-4 w-4" />
          <span>Suas Respostas Foram Analisadas</span>
        </div>

        <h3 className="font-serif-sacred text-2xl font-bold text-white leading-tight">
          Para quem devemos revelar o <span className="text-red-400">Diagnóstico Espiritual?</span>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-rose-200/70 leading-relaxed">
          Para preservar a energia sagrada e o sigilo deste oráculo, informe seus dados de contato. Seu diagnóstico detalhado será gerado imediatamente na próxima tela.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>Seu Nome Completo *</span>
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Mariana Souza"
              className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-4 py-3 text-base text-white placeholder-rose-300/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
              <span>Seu WhatsApp com DDD (Para envio do atendimento) *</span>
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={handleWhatsappChange}
              placeholder="(11) 99876-5432"
              className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-4 py-3 text-base text-white placeholder-rose-300/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-1.5 flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-amber-400" />
              <span>Primeiro nome dele(a) (Opcional - para sintonizar a energia)</span>
            </label>
            <input
              type="text"
              value={nomeParceiro}
              onChange={(e) => setNomeParceiro(e.target.value)}
              placeholder="Ex: Rodrigo"
              className="w-full rounded-xl border border-red-900/60 bg-[#120305] px-4 py-3 text-base text-white placeholder-rose-300/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            />
          </div>

          {error && (
            <p className="text-xs text-amber-300 font-medium bg-red-950/60 border border-red-900/50 p-2.5 rounded-lg">
              ⚠️ {error}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 py-3.5 px-6 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-red-950/80 hover:from-red-600 hover:to-red-700 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sintonizando Oráculo...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Ver Diagnóstico Completo</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-rose-300/60">
          <Lock className="h-3 w-3 text-amber-400" />
          <span>Seus dados nunca serão compartilhados. Ambiente 100% criptografado.</span>
        </div>
      </div>
    </div>
  );
};
