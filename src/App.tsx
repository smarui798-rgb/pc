import React, { useState, useEffect } from 'react';
import { SiteSettings, LeadData, DiagnosisResult } from './types';
import { DEFAULT_SETTINGS } from './config/spiritualConfig';
import { calculateDiagnosis } from './utils/diagnosisCalculator';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuizSection } from './components/QuizSection';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { VSLSection } from './components/VSLSection';
import { PixCheckout } from './components/PixCheckout';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MaeDeSantoBio } from './components/MaeDeSantoBio';
import { SocialProofSection } from './components/SocialProofSection';
import { GuaranteeSection } from './components/GuaranteeSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { pixel } from './utils/pixel';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string> | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [currentLead, setCurrentLead] = useState<LeadData | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'funnel' | 'vsl' | 'checkout'>('funnel');

  // Track PageView on view change
  useEffect(() => {
    pixel.pageView();
  }, [currentView]);

  // Load site settings and check if accessing separate admin route
  useEffect(() => {
    const isSeparateAdmin =
      window.location.pathname === '/admin' ||
      window.location.pathname.startsWith('/admin') ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true');

    if (isSeparateAdmin) {
      setIsAdminOpen(true);
    }

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.maeNome) {
          setSettings(data);
        }
      })
      .catch((err) => {
        console.warn('Using default settings (backend may still be booting):', err);
      });
  }, []);

  // When quiz completes (3 essential questions answered)
  const handleQuizComplete = (answers: Record<number, string>) => {
    setQuizAnswers(answers);
    setIsLeadModalOpen(true);
  };

  // When user fills out the lead capture form (Nome, WhatsApp, Parceiro)
  const handleLeadSubmit = async (leadInfo: {
    nome: string;
    whatsapp: string;
    nomeParceiro?: string;
  }) => {
    setIsSubmittingLead(true);

    try {
      // Calculate diagnosis
      const diagResult = calculateDiagnosis(
        quizAnswers || {},
        leadInfo.nome,
        leadInfo.nomeParceiro
      );
      setDiagnosis(diagResult);

      // Save lead to persistent database via server API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: leadInfo.nome,
          whatsapp: leadInfo.whatsapp,
          nomeParceiro: leadInfo.nomeParceiro,
          respostasQuiz: quizAnswers || {},
          diagnostico: diagResult,
        }),
      });

      const data = await res.json();
      if (data.lead) {
        setCurrentLead(data.lead);
      } else {
        // Fallback local lead object if network delay
        setCurrentLead({
          nome: leadInfo.nome,
          whatsapp: leadInfo.whatsapp,
          nomeParceiro: leadInfo.nomeParceiro,
          respostasQuiz: quizAnswers || {},
          diagnostico: diagResult,
        });
      }

      setIsLeadModalOpen(false);
      // Lead submitted -> Go directly to the VSL video as requested
      setCurrentView('vsl');

      // Smooth scroll to top of VSL video
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving lead:', err);
      const diagResult = calculateDiagnosis(
        quizAnswers || {},
        leadInfo.nome,
        leadInfo.nomeParceiro
      );
      setDiagnosis(diagResult);
      setCurrentLead({
        nome: leadInfo.nome,
        whatsapp: leadInfo.whatsapp,
        nomeParceiro: leadInfo.nomeParceiro,
        respostasQuiz: quizAnswers || {},
        diagnostico: diagResult,
      });
      setIsLeadModalOpen(false);
      setCurrentView('vsl');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Scroll to quiz from hero or nav
  const handleScrollToQuiz = () => {
    if (currentView !== 'funnel') {
      setCurrentView('funnel');
      setTimeout(() => {
        const el = document.getElementById('quiz-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('quiz-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#120305] text-[#fce7e7] flex flex-col font-sans-clean overflow-x-hidden selection:bg-red-800 selection:text-white">
      {/* Header (Clean, no admin buttons visible to visitors) */}
      <Navbar
        onStartQuiz={handleScrollToQuiz}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {currentView === 'funnel' && (
          <>
            <HeroSection onStartQuiz={handleScrollToQuiz} />
            <QuizSection onComplete={handleQuizComplete} />
            <HowItWorksSection />
            <MaeDeSantoBio
              settings={settings}
              onStartQuiz={handleScrollToQuiz}
            />
            <SocialProofSection />
            <GuaranteeSection />
          </>
        )}

        {/* VSL Section: Displayed immediately after lead capture form */}
        {currentView === 'vsl' && diagnosis && (
          <>
            <VSLSection
              settings={settings}
              lead={currentLead}
              diagnosis={diagnosis}
              onProceedToCheckout={handleProceedToCheckout}
            />
            <SocialProofSection />
            <GuaranteeSection />
          </>
        )}

        {/* Clean PIX Checkout (No QR Code, single Chave PIX, copy button) */}
        {currentView === 'checkout' && (
          <>
            <PixCheckout
              settings={settings}
              lead={currentLead}
              onPaymentConfirmed={() => {}}
            />
            <GuaranteeSection />
            <SocialProofSection />
          </>
        )}
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onSubmit={handleLeadSubmit}
        isLoading={isSubmittingLead}
      />

      {/* Admin Panel: Only accessible via separate URL (/admin, #admin) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.pathname.startsWith('/admin')) {
            window.history.pushState(null, '', '/');
          }
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        currentSettings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
      />

      {/* Clean Footer (No admin links visible to visitors) */}
      <Footer settings={settings} />
    </div>
  );
}
