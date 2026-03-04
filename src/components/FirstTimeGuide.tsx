import { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

const STORAGE_KEY = 'pension-planner-guide-seen';

interface Step {
  title: string;
  body: string;
  target?: string;      // data-guide-step value to highlight
  inHeader?: boolean;   // target lives in sticky header → skip backdrop + z-lift
}

export function FirstTimeGuide() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  // Show on first visit
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  // Listen for external restart trigger (no page reload needed)
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setVisible(true);
    };
    window.addEventListener('pension-guide-start', handler);
    return () => window.removeEventListener('pension-guide-start', handler);
  }, []);

  const steps: Step[] = [
    { title: t.guide.step0Title, body: t.guide.step0Body },
    { title: t.guide.step1Title, body: t.guide.step1Body, target: 'inputs' },
    { title: t.guide.step2Title, body: t.guide.step2Body, target: 'results' },
    { title: t.guide.step3Title, body: t.guide.step3Body, target: 'real-toggle', inHeader: true },
    { title: t.guide.step4Title, body: t.guide.step4Body, target: 'tax' },
    { title: t.guide.step5Title, body: t.guide.step5Body, target: 'glossary' },
  ];

  // Highlight target element and scroll it into view
  useEffect(() => {
    document.querySelectorAll('.guide-highlighted, .guide-spotlight').forEach((el) => {
      el.classList.remove('guide-highlighted', 'guide-spotlight');
    });

    if (!visible) return;

    const current = steps[step];
    if (!current.target) return;

    const el = document.querySelector(`[data-guide-step="${current.target}"]`);
    if (!el) return;

    el.classList.add('guide-highlighted');
    if (!current.inHeader) {
      el.classList.add('guide-spotlight');
      // Small delay so the backdrop renders before we scroll
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }

    return () => {
      el.classList.remove('guide-highlighted', 'guide-spotlight');
    };
  }, [step, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFinish() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const totalSteps = steps.length - 1; // exclude welcome step from count

  // ── Step 0: blocking welcome modal ──────────────────────────────────────
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{current.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-7">{current.body}</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              {t.guide.start}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t.guide.skip}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Steps 1–5: floating panel + optional backdrop ────────────────────────
  const showBackdrop = !!current.target && !current.inHeader;

  return (
    <>
      {/* Semi-transparent backdrop — only when spotlight is needed */}
      {showBackdrop && (
        <div className="fixed inset-0 z-50 bg-black/30 pointer-events-none" />
      )}

      {/* Tour panel — mobile: bottom sheet | desktop: bottom-right corner */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] sm:bottom-6 sm:right-6 sm:left-auto sm:w-96">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-blue-100 p-5">

          {/* Step counter + skip */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {step} {t.guide.of} {totalSteps}
            </span>
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t.guide.skip}
            </button>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2">{current.title}</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{current.body}</p>

          {/* Progress dots (steps 1–5) */}
          <div className="flex justify-center gap-1.5 mb-4">
            {steps.slice(1).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i + 1)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i + 1 === step ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors"
            >
              {t.guide.prev}
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t.guide.finish}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t.guide.next} →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function useStartGuide() {
  return () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('pension-guide-start'));
  };
}
