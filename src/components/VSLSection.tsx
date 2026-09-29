import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings, LeadData, DiagnosisResult } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Flame,
  CheckCircle,
  AlertTriangle,
  HeartCrack,
  Eye,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { SACRED_IMAGES } from '../config/spiritualConfig';

interface VSLSectionProps {
  settings: SiteSettings;
  lead: LeadData | null;
  diagnosis: DiagnosisResult;
  onProceedToCheckout: () => void;
}

export const VSLSection: React.FC<VSLSectionProps> = ({
  settings,
  lead,
  diagnosis,
  onProceedToCheckout,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const totalDurationSec = 160; // ~2m40s

  const activeVideoUrl = settings.vslVideoUrl || '';
  const videoRef = useRef<HTMLVideoElement>(null);

  // Exact subtitles transcribed from Mãe Bety's real video
  const videoTranscript = [
    { start: 0, end: 5, text: 'A maior parte das minhas clientes me procuram sempre com os mesmos relatos...' },
    { start: 5, end: 11, text: '"Estava tudo bem, estava tudo ótimo, mas de repente ele mudou, esfriou e sumiu."' },
    { start: 11, end: 17, text: 'E o que muitas de vocês não sabem é que na maior parte das vezes NÃO é falta de sentimento.' },
    { start: 17, end: 27, text: 'É bloqueio energético, é interferência espiritual ou até mesmo energia externa com pensamentos virados.' },
    { start: 27, end: 35, text: 'Por exemplo: inveja, olho gordo, pessoas falando muito do seu relacionamento em si...' },
    { start: 35, end: 44, text: 'E tudo isso começa a carregar todo o campo energético do casal, criando bloqueios sem você perceber.' },
    { start: 44, end: 54, text: 'E o que acontece? Ele começa a ficar confuso, irritado sem motivo, distante, sem perceber o porquê...' },
    { start: 54, end: 65, text: 'Mas não é porque ele deixou de gostar de você! É porque ele está ENERGETICAMENTE BLOQUEADO!' },
    { start: 65, end: 77, text: 'E é aqui que entra a magia: ela limpa, desbloqueia, organiza, adoça o coração de vocês dois.' },
    { start: 77, end: 90, text: 'Então depois do trabalho espiritual, ele volta a sentir com clareza, volta a pensar em você, sentir saudade e te procurar!' },
    { start: 90, end: 105, text: 'E tudo isso realizado sem precisar do seu esforço. Quando tratamos o lado espiritual, o resultado é maravilhoso!' },
    { start: 105, end: 160, text: 'Consulta pelo preço de uma coca, apenas R$ 9,90! Clique no botão abaixo e fale comigo agora.' },
  ];

  // Current subtitle based on time
  const currentSubtitleObj =
    videoTranscript.find((t) => currentTimeSec >= t.start && currentTimeSec < t.end) ||
    videoTranscript[0];
  const currentSubtitle = currentSubtitleObj.text;

  // Web Speech API Narrator (Speaks in Portuguese when playing simulated player)
  const speakCurrentSubtitle = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isMuted || !hasInteractedAudio || activeVideoUrl) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find(
        (v) =>
          (v.lang === 'pt-BR' || v.lang === 'pt_BR') &&
          (v.name.toLowerCase().includes('maria') ||
            v.name.toLowerCase().includes('luciana') ||
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('google português') ||
            v.name.toLowerCase().includes('brazil'))
      ) || voices.find((v) => v.lang.startsWith('pt'));

    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Trigger speech when subtitle changes if simulated player is active
  useEffect(() => {
    if (isPlaying && !activeVideoUrl && hasInteractedAudio && !isMuted) {
      speakCurrentSubtitle(currentSubtitle);
    }
  }, [currentSubtitle, isPlaying, hasInteractedAudio, isMuted, activeVideoUrl]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!hasInteractedAudio) {
      setHasInteractedAudio(true);
      setIsMuted(false);
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }

    if (!activeVideoUrl) {
      if (isPlaying) {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } else {
        speakCurrentSubtitle(currentSubtitle);
      }
    }

    setIsPlaying(!isPlaying);
  };

  // Toggle Mute
  const toggleMute = () => {
    setHasInteractedAudio(true);
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }

    if (newMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    } else if (!newMuted && isPlaying && !activeVideoUrl) {
      speakCurrentSubtitle(currentSubtitle);
    }
  };

  // Unlock Audio Button Action
  const handleUnlockAudio = () => {
    setHasInteractedAudio(true);
    setIsMuted(false);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    } else {
      speakCurrentSubtitle(currentSubtitle);
    }
  };

  // Progress timer for playback (when not using native video element timeupdate)
  useEffect(() => {
    let interval: any;
    if (isPlaying && !activeVideoUrl) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeVideoUrl]);

  useEffect(() => {
    if (!activeVideoUrl) {
      setProgress(Math.round((currentTimeSec / totalDurationSec) * 100));
    }
  }, [currentTimeSec, activeVideoUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to detect if URL is YouTube or Vimeo
  const getEmbedInfo = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch) {
      return {
        type: 'youtube',
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0&playsinline=1`,
      };
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=0`,
      };
    }
    return null;
  };

  const embedInfo = getEmbedInfo(activeVideoUrl);

  const primeiroNome = lead?.nome ? lead.nome.trim().split(' ')[0] : 'Irmã(o)';
  const parceiro = lead?.nomeParceiro?.trim() ? lead.nomeParceiro.trim() : 'a pessoa amada';

  // Identify the specific problem selected by the user in Quiz Question 1
  const ansQ1 = lead?.respostasQuiz?.[1];
  let sintomaPrincipal = 'Frieza repentina e distanciamento';
  let sintomaDetalhe = 'mudou de comportamento e esfriou com você';
  if (ansQ1 === '1a') {
    sintomaPrincipal = 'Frieza repentina e corte de afeto';
    sintomaDetalhe = 'parou de demonstrar carinho, abraçar e te trata como alguém estranho';
  } else if (ansQ1 === '1b') {
    sintomaPrincipal = 'Segredos no celular e comportamento suspeito';
    sintomaDetalhe = 'esconde a tela, trocou senhas e age com mistério e desconfiança';
  } else if (ansQ1 === '1c') {
    sintomaPrincipal = 'Brigas constantes por motivos banais';
    sintomaDetalhe = 'qualquer conversa vira discussão agressiva e estresse sem sentido';
  } else if (ansQ1 === '1d') {
    sintomaPrincipal = 'Bloqueio, término ou afastamento físico';
    sintomaDetalhe = 'saiu de casa, te bloqueou nas redes ou sumiu sem dar explicações';
  }

  // Question 2: Suspected Interference
  const ansQ2 = lead?.respostasQuiz?.[2];
  let causaInterferencia = 'Energias pesadas e inveja travando os caminhos';
  if (ansQ2 === '2a') {
    causaInterferencia = 'Presença de terceira pessoa / rival induzindo a rejeição';
  } else if (ansQ2 === '2b') {
    causaInterferencia = 'Inveja e olho gordo de pessoas próximas que secaram a relação';
  } else if (ansQ2 === '2c') {
    causaInterferencia = 'Trabalho espiritual de amarração ou corte feito para separar vocês';
  } else if (ansQ2 === '2d') {
    causaInterferencia = 'Cansaço extremo e influência energética negativa no lar';
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto text-left">
      {/* Top Warning Banner */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950 via-red-900/60 to-red-950 border border-red-700/80 shadow-2xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-300">
            Aviso Espiritual de Emergência para {primeiroNome}:
          </p>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-medium">
            O que você relatou sobre <span className="text-amber-200 underline font-bold">{sintomaPrincipal.toLowerCase()}</span> com {parceiro} <strong className="text-white uppercase">não é falta de amor</strong>.
            Assista ao vídeo abaixo para entender a revelação de Mãe Bety antes que a separação se torne irreversível.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-red-900/60 bg-gradient-to-b from-[#180408] via-[#120205] to-[#0a0103] p-5 sm:p-8 shadow-2xl shadow-red-950 relative">
        {/* Personalized Callout */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-800/80 bg-red-950/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 shadow-md">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>Diagnóstico do Oráculo Revelado</span>
          </div>

          <h2 className="font-serif-sacred text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            &ldquo;Ele não te deixou de amar.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400">
              A mente dele está bloqueada.
            </span>&rdquo;
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-rose-200/80">
            Assista ao vídeo oficial gravado por Mãe Bety explicando por que cobranças no WhatsApp só pioram o caso e o que deve ser feito nas próximas 24 horas.
          </p>
        </div>

        {/* Video Card Container */}
        <div className="rounded-3xl border-2 border-red-700/80 bg-[#120305] shadow-2xl shadow-red-950/90 overflow-hidden relative max-w-md mx-auto">
          {/* Top Banner (As in Mãe Bety's video) */}
          <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-800 text-white py-2 px-3 text-center text-xs sm:text-sm font-extrabold uppercase tracking-wide shadow-md flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>consulta pelo preço de uma coca, apenas 9,90</span>
          </div>

          {/* Video Player Display */}
          <div className="relative aspect-9/14 sm:aspect-9/13 w-full max-h-[560px] mx-auto overflow-hidden bg-black flex items-center justify-center">
            {/* 1. Embed (YouTube / Vimeo) */}
            {embedInfo ? (
              <iframe
                src={embedInfo.src}
                title="Vídeo da Mãe Bety"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ) : activeVideoUrl ? (
              /* 2. Direct MP4 Video Player */
              <video
                ref={videoRef}
                src={activeVideoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => {
                  const target = e.target as HTMLVideoElement;
                  setCurrentTimeSec(target.currentTime);
                  setProgress((target.currentTime / (target.duration || totalDurationSec)) * 100);
                }}
              />
            ) : (
              /* 3. Interactive Video Player with Real Portuguese Audio Narrator */
              <>
                <img
                  src={SACRED_IMAGES.maeVslFrame || settings.maeFoto}
                  alt="Mãe Bety Oficial"
                  className="h-full w-full object-cover object-top brightness-95"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                {/* Sticker Badge: @maebetyoficial */}
                <div className="absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 z-20">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-rose-950 shadow-xl border border-rose-200">
                    <span className="text-red-600 font-bold">@</span>
                    <span>maebetyoficial</span>
                  </div>
                </div>

                {/* Central Play/Pause Button */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute z-20 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-600/90 text-white border-2 border-amber-400 shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Pausar Vídeo' : 'Tocar Vídeo'}
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 text-white fill-white" />
                  ) : (
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  )}
                </button>

                {/* Equalizer animation when playing */}
                {isPlaying && (
                  <div className="absolute top-4 right-4 z-20 flex items-end gap-1 px-2.5 py-1.5 rounded-xl bg-black/70 border border-red-950 backdrop-blur-md">
                    <span className="h-2.5 w-1 bg-amber-400 animate-pulse" />
                    <span className="h-5 w-1 bg-amber-400 animate-pulse delay-75" />
                    <span className="h-3 w-1 bg-amber-400 animate-pulse delay-150" />
                    <span className="h-6 w-1 bg-amber-400 animate-pulse delay-100" />
                  </div>
                )}

                {/* Subtitle Caption */}
                <div className="absolute bottom-4 left-3 right-3 z-20 text-center">
                  <div className="inline-block rounded-2xl bg-black/90 border border-red-900/80 p-3 text-xs sm:text-sm font-bold text-amber-200 backdrop-blur-md shadow-2xl leading-snug">
                    {currentSubtitle}
                  </div>
                </div>
              </>
            )}

            {/* Unmute / Audio Overlay Prompt for Browsers */}
            {(!hasInteractedAudio || isMuted) && (
              <button
                type="button"
                onClick={handleUnlockAudio}
                className="absolute top-4 left-4 z-30 inline-flex items-center gap-2 rounded-full bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xl animate-pulse hover:bg-red-500 border border-amber-300"
              >
                <VolumeX className="h-4 w-4" />
                <span>Toque para Ouvir o Áudio</span>
              </button>
            )}
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="p-3 bg-[#100204] border-t border-red-950 flex items-center justify-between gap-3 text-xs text-rose-200">
            <button
              onClick={togglePlay}
              className="text-rose-100 hover:text-amber-300 transition-colors p-1"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <span className="font-mono text-[11px] text-rose-300/80">
              {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
            </span>

            {/* Scrubber Progress Bar */}
            <div className="flex-1 h-1.5 rounded-full bg-red-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-amber-300 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={toggleMute}
              className="text-rose-200 hover:text-white transition-colors p-1"
              title={isMuted ? 'Ativar Som' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-red-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* CTA Button to WhatsApp / Checkout */}
        <div className="mt-8 text-center max-w-lg mx-auto">
          <button
            onClick={onProceedToCheckout}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 p-4 sm:p-5 font-serif-sacred text-base sm:text-lg font-extrabold uppercase tracking-wide text-stone-950 shadow-2xl shadow-red-900/60 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Falar com Mãe Bety no WhatsApp por R$ 9,90</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <p className="mt-2.5 text-xs text-rose-300/70 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>Atendimento individual e sigiloso com garantia de devolução PIX</span>
          </p>
        </div>
      </div>
    </div>
  );
};
