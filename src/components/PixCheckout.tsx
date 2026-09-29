import React, { useState, useEffect } from 'react';
import { SiteSettings, LeadData } from '../types';
import {
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Lock,
} from 'lucide-react';
import { pixel } from '../utils/pixel';

interface PixCheckoutProps {
  settings: SiteSettings;
  lead: LeadData | null;
  onPaymentConfirmed?: () => void;
}

export const PixCheckout: React.FC<PixCheckoutProps> = ({
  settings,
  lead,
  onPaymentConfirmed,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 14:59
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Meta Pixel InitiateCheckout
  useEffect(() => {
    const val = parseFloat(settings.valorConsulta.replace(',', '.')) || 9.90;
    pixel.initiateCheckout(val, 'Consulta Espiritual com Mãe Bety');
  }, [settings.valorConsulta]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    pixel.custom('PixKeyCopied', { value: settings.valorConsulta, pixKey: settings.pixKey });
    setTimeout(() => setCopiedKey(false), 3000);

    // Record interaction in backend lead if available
    if (lead?.id) {
      fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pixCopiado: true }),
      }).catch((e) => console.error('Error logging pix copy:', e));
    }
  };

  // WhatsApp redirection with prefilled message
  const handleOpenWhatsApp = () => {
    const nome = lead?.nome || 'Irmão(ã)';
    const parceiro = lead?.nomeParceiro ? ` em relação a ${lead.nomeParceiro}` : '';
    const text = encodeURIComponent(
      `Olá Mãe Bety! Meu nome é ${nome}. Acabei de realizar o pagamento de R$ ${settings.valorConsulta} via PIX para minha consulta sobre afastamento/traição${parceiro}. Segue em anexo o meu comprovante para darmos início ao meu acolhimento e direcionamento espiritual.`
    );
    const cleanNumber = settings.whatsappNumero.replace(/\D/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${text}`;

    if (lead?.id) {
      fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'comprovante_enviado', pagoEm: new Date().toISOString() }),
      }).catch((e) => console.error('Error updating status:', e));
    }

    setShowConfirmationModal(true);
    window.open(url, '_blank');
    if (onPaymentConfirmed) onPaymentConfirmed();
  };

  return (
    <section id="checkout-pix" className="py-10 sm:py-16 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-xl">
        {/* Main Card */}
        <div className="rounded-3xl border border-red-700/60 bg-gradient-to-b from-[#20050a] via-[#140306] to-[#0e0204] p-6 sm:p-8 shadow-2xl shadow-red-950/90 relative overflow-hidden">
          {/* Reservation Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 border-b border-red-950/80 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Reserva de Horário Individual
              </span>
              <h3 className="font-serif-sacred text-2xl font-bold text-white">
                Finalizar Consulta Espiritual
              </h3>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-red-800/60 bg-red-950/60 px-3.5 py-1.5 text-rose-100">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
              <div className="text-right">
                <p className="text-[10px] text-rose-300/70 uppercase">Expira em</p>
                <p className="text-sm font-mono font-bold text-amber-300">{formattedTime}</p>
              </div>
            </div>
          </div>

          {/* Value Display */}
          <div className="mt-5 flex items-center justify-between p-4 rounded-2xl bg-red-950/40 border border-red-900/40">
            <div>
              <p className="text-xs text-rose-200/70">Atendimento Individual com Mãe Bety</p>
              <p className="text-sm font-semibold text-rose-100">Abertura de Oráculo & Firmeza</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-rose-300/50 line-through">R$ 97,00</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-serif-sacred text-amber-300">
                R$ {settings.valorConsulta}
              </p>
            </div>
          </div>

          {/* Clean PIX Key Box with Big Copy Button */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-rose-200/90 mb-2">
                Chave PIX Oficial (Copie e cole no app do seu banco)
              </label>

              <div className="rounded-2xl border-2 border-red-700/70 bg-[#120305] p-4 text-center">
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-amber-300 tracking-wider select-all">
                  {settings.pixKey}
                </p>
                <p className="text-xs text-rose-200/70 mt-1">
                  Beneficiário: <strong className="text-rose-100">{settings.pixBeneficiario}</strong>
                </p>

                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.pixKey)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-98 ${
                    copiedKey
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-red-700 via-rose-600 to-red-600 text-white hover:brightness-110'
                  }`}
                >
                  {copiedKey ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Chave PIX Copiada com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copiar Chave PIX</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simple Step-by-Step Instructions */}
            <div className="space-y-1.5 text-xs text-rose-200/80 bg-red-950/20 p-4 rounded-xl border border-red-900/30">
              <p className="font-semibold text-rose-100 uppercase tracking-wider text-[11px] mb-1">
                Como pagar agora:
              </p>
              <p>1. Abra o app do seu banco e escolha a opção <strong>PIX</strong>.</p>
              <p>2. Cole a chave <strong>{settings.pixKey}</strong> e insira o valor de <strong>R$ {settings.valorConsulta}</strong>.</p>
              <p>3. Após transferir, clique no botão verde abaixo para enviar o comprovante no WhatsApp e ser atendido(a).</p>
            </div>

            {/* Guarantee Badge */}
            <div className="rounded-xl border border-amber-500/50 bg-gradient-to-r from-red-950 via-amber-950/30 to-red-950 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Garantia Máxima: Ou te atendemos ou é devolvido os valores
                </h4>
                <p className="mt-1 text-xs text-rose-100/90 leading-relaxed">
                  Compromisso sagrado: se você não receber seu atendimento com atenção e carinho, seu valor de R$ {settings.valorConsulta} é estornado integralmente na hora via PIX.
                </p>
              </div>
            </div>

            {/* WhatsApp Send Receipt Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 py-4 px-6 text-sm sm:text-base font-extrabold uppercase tracking-wider text-white shadow-xl shadow-emerald-950/80 hover:brightness-110 active:scale-98 transition-all"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                <span>Já Realizei o Pagamento / Enviar Comprovante</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-rose-300/60 text-center">
              <Lock className="h-3 w-3 text-amber-400" />
              <span>Transação segura e auditada. Atendimento confidencial e humanizado.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full rounded-2xl border border-amber-500/50 bg-gradient-to-b from-[#22060b] to-[#120305] p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <h3 className="font-serif-sacred text-2xl font-bold text-white mb-2">
              Atendimento Iniciado!
            </h3>

            <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed mb-6">
              A conversa no WhatsApp da Mãe Bety foi aberta. Envie o seu comprovante para que ela abra o seu oráculo sagrado com prioridade.
            </p>

            <button
              onClick={() => setShowConfirmationModal(false)}
              className="w-full rounded-xl bg-red-800 hover:bg-red-700 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
