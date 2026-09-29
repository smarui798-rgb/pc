import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { ArrowLeft, ArrowRight, Sparkles, Check, HelpCircle } from 'lucide-react';
import { pixel } from '../utils/pixel';

interface QuizSectionProps {
  onComplete: (answers: Record<number, string>) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState('');

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setErrorMsg('');
    const newAnswers = { ...selectedAnswers, [currentQuestion.id]: optionId };
    setSelectedAnswers(newAnswers);

    // Meta Pixel Quiz Event
    pixel.quizStep(currentStep + 1, QUIZ_QUESTIONS.length, currentQuestion.title);

    // Auto advance after slight delay for tactile feedback
    setTimeout(() => {
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        pixel.custom('QuizCompleted', { total_answers: Object.keys(newAnswers).length });
        onComplete(newAnswers);
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrorMsg('');
    }
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion.id]) {
      setErrorMsg('Por favor, selecione a opção que mais se aproxima do seu caso.');
      return;
    }
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(selectedAnswers);
    }
  };

  return (
    <section id="quiz-section" className="py-12 sm:py-16 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-3xl">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-rose-300/80 mb-2">
            <span>Passo {currentStep + 1} de {QUIZ_QUESTIONS.length}</span>
            <span className="text-amber-300 font-bold">{progressPercent}% Concluído</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-red-950/80 border border-red-900/40">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Card for current question */}
        <div className="rounded-2xl border border-red-900/50 bg-gradient-to-b from-[#1c0509] to-[#120305] p-6 sm:p-8 shadow-2xl shadow-red-950/60 backdrop-blur-sm">
          {/* Question title and context */}
          <div className="mb-6">
            <h2 className="font-serif-sacred text-xl sm:text-2xl font-bold text-white leading-snug">
              {currentQuestion.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-rose-200/70">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options grid */}
          <div className="space-y-3.5">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? 'border-amber-400 bg-red-900/40 shadow-lg shadow-red-950 ring-1 ring-amber-400/50'
                      : 'border-red-950/80 bg-[#160407]/70 hover:border-red-700/60 hover:bg-red-950/30'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-stone-950'
                        : 'border-red-800 bg-red-950/60 text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-semibold text-rose-100">
                      {option.label}
                    </p>
                    {option.description && (
                      <p className="mt-1 text-xs text-rose-200/60 leading-relaxed">
                        {option.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <p className="mt-4 text-xs text-amber-300 font-medium flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              {errorMsg}
            </p>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-red-950/80">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                currentStep === 0
                  ? 'opacity-30 cursor-not-allowed text-stone-500'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-800 to-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:from-red-700 hover:to-red-500 transition-all active:scale-95"
            >
              <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? 'Finalizar & Revelar' : 'Próxima'}</span>
              {currentStep === QUIZ_QUESTIONS.length - 1 ? (
                <Sparkles className="h-4 w-4 text-amber-300" />
              ) : (
                <ArrowRight className="h-4 w-4 text-rose-200" />
              )}
            </button>
          </div>
        </div>

        {/* Security and privacy reassurance note */}
        <p className="mt-4 text-center text-xs text-rose-300/50">
          🔒 Suas respostas são 100% confidenciais e protegidas sob sigilo espiritual sagrado.
        </p>
      </div>
    </section>
  );
};
