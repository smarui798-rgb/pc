// Meta Pixel Integration Helper for Pixel ID: 28368526246108051

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const PIXEL_ID = '28368526246108051';

export const pixel = {
  // PageView Event
  pageView: () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  },

  // Quiz Interaction Event (when user answers a quiz question or starts quiz)
  quizStep: (stepNumber: number, totalSteps: number, questionTitle?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'QuizProgress', {
        step: stepNumber,
        total_steps: totalSteps,
        question: questionTitle || `Pergunta ${stepNumber}`,
      });
      // Standard ViewContent on quiz
      window.fbq('track', 'ViewContent', {
        content_name: `Quiz Pergunta ${stepNumber}`,
        content_category: 'Diagnóstico Amoroso',
      });
    }
  },

  // Form Lead Event (When user submits Name, WhatsApp, Partner)
  lead: (data: { nome: string; whatsapp?: string; parceiro?: string }) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Formulário Diagnóstico Espiritual',
        content_category: 'Acolhimento Espiritual',
        value: 9.90,
        currency: 'BRL',
      });
    }
  },

  // Initiate Checkout (when entering checkout or viewing PIX key)
  initiateCheckout: (value: number = 9.90, productName: string = 'Consulta Espiritual') => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: productName,
        content_category: 'Espiritual',
        value: value,
        currency: 'BRL',
      });
    }
  },

  // Purchase Event (when payment is confirmed or when manual sale is recorded)
  purchase: (value: number, category: 'Consulta' | 'Trabalho Espiritual', clientName?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        content_name: category === 'Consulta' ? 'Consulta Espiritual' : 'Trabalho Espiritual',
        content_category: category,
        value: Number(value.toFixed(2)),
        currency: 'BRL',
        num_items: 1,
      });
    }
  },

  // Custom Event
  custom: (eventName: string, params: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }
  },
};
