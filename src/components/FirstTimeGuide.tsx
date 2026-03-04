import { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

const STORAGE_KEY = 'pension-planner-guide-seen';

interface Step {
  title: string;
  body: string;
  guideStep?: number;
}

export function FirstTimeGuide() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;
    if (!seen) {
      setVisible(true);
    }
  }, []);

  const steps: Step[] = [
    { title: t.guide.step0Title, body: t.guide.step0Body },
    { title: t.guide.step1Title, body: t.guide.step1Body, guideStep: 1 },
    { title: t.guide.step2Title, body: t.guide.step2Body, guideStep: 2 },
    { title: t.guide.step3Title, body: t.guide.step3Body, guideStep: 3 },
    { title: t.guide.step4Title, body: t.guide.step4Body, guideStep: 4 },
    { title: t.guide.step5Title, body: t.guide.step5Body, guideStep: 5 },
  ];

  useEffect(() => {
    // Highlight the relevant element
    document.querySelectorAll('.guide-highlighted').forEach((el) => {
      el.classList.remove('guide-highlighted');
    });
    const current = steps[step];
    if (current.guideStep !== undefined) {
      const el = document.querySelector(`[data-guide-step="${current.guideStep}"]`);
      if (el) el.classList.add('guide-highlighted');
    }
    return () => {
      document.querySelectorAll('.guide-highlighted').forEach((el) => {
        el.classList.remove('guide-highlighted');
      });
    };
  }, [step, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFinish() {
    setVisible(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  function handleSkip() {
    handleFinish();
  }

  if (!visible) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white border border-blue-300 rounded-xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">
          {step + 1} {t.guide.of} {steps.length}
        </span>
        <button
          type="button"
          onClick={handleSkip}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          {t.guide.skip}
        </button>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{current.title}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{current.body}</p>
      {/* Progress dots */}
      <div className="flex justify-center gap-1 mb-4">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === step ? 'bg-blue-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
        >
          {t.guide.prev}
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {t.guide.finish}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {t.guide.next}
          </button>
        )}
      </div>
    </div>
  );
}

export function useStartGuide() {
  return () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.location.reload();
  };
}
