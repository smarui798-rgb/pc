import React, { useState } from 'react';
import { TESTIMONIALS, WHATSAPP_PRINTS } from '../data/testimonials';
import {
  CheckCircle2,
  Star,
  Play,
  Pause,
  Volume2,
  ShieldCheck,
  MessageSquare,
  Clock,
  MapPin,
} from 'lucide-react';

export const SocialProofSection: React.FC = () => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const toggleAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <section id="depoimentos" className="py-16 sm:py-20 px-4 sm:px-6 border-t border-red-950/60 bg-gradient-to-b from-[#130305] via-[#1a0407] to-[#120305]">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-800/50 bg-red-950/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Casos Reais & Verificados</span>
          </div>

          <h2 className="font-serif-sacred text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Quem buscou a orientação da Mãe de Santo recuperou a verdade e a paz
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-rose-200/70">
            Veja relatos espontâneos de pessoas que estavam vivendo a mesma dor de frieza, traição e afastamento que você sente hoje.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-red-900/50 bg-gradient-to-b from-[#1a0408] to-[#120305] p-6 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* User info header */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-red-950">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.foto}
                      alt={item.nome}
                      className="h-12 w-12 rounded-full object-cover border border-amber-400/50"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-rose-100">{item.nome}</h4>
                        {item.verificado && (
                          <span className="text-[10px] bg-red-950 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Verificado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-rose-300/60 mt-0.5">
                        <span>{item.idade} anos</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {item.cidade}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Case badge */}
                <div className="mb-3">
                  <span className="text-xs font-semibold text-amber-300/90 bg-red-950/80 px-2.5 py-1 rounded-md border border-red-800/40">
                    Motivo: {item.caso}
                  </span>
                </div>

                {/* Testimonial text */}
                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed italic">
                  &ldquo;{item.depoimento}&rdquo;
                </p>
              </div>

              {/* Bottom bar with resolution time and audio clip if available */}
              <div className="mt-5 pt-4 border-t border-red-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-rose-300/70 flex items-center gap-1 font-medium text-[11px]">
                  <Clock className="h-3 w-3 text-amber-400" />
                  Resultado: {item.tempoResolucao}
                </span>

                {item.temAudio && (
                  <button
                    type="button"
                    onClick={() => toggleAudio(item.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-950/90 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-red-900 transition-colors"
                  >
                    {playingAudioId === item.id ? (
                      <>
                        <Pause className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <span>Pausar Relato ({item.audioDuracao})</span>
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="h-3 w-1 bg-amber-400 animate-pulse" />
                          <span className="h-4 w-1 bg-amber-400 animate-pulse delay-75" />
                          <span className="h-2 w-1 bg-amber-400 animate-pulse delay-150" />
                        </div>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>Ouvir Áudio ({item.audioDuracao})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Real WhatsApp Messages Cards Section */}
        <div className="mt-14 pt-10 border-t border-red-950/70">
          <div className="text-center mb-8">
            <h3 className="font-serif-sacred text-lg sm:text-2xl font-bold text-white">
              Mensagens Recebidas Diretamente no WhatsApp da Mãe de Santo
            </h3>
            <p className="text-xs text-rose-300/70 mt-1">
              Conversas autorizadas com nomes preservados para resguardar o sigilo dos fiéis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHATSAPP_PRINTS.map((print, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-red-900/40 bg-[#160407] p-4 text-xs shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-red-950 text-[11px] text-rose-300/60 font-semibold">
                    <span className="text-amber-300">{print.remetente}</span>
                    <span>{print.tempo}</span>
                  </div>
                  <p className="text-rose-100/90 leading-relaxed font-sans">
                    &ldquo;{print.mensagem}&rdquo;
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mensagem Verificada</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
