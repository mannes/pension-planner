import { useState } from 'react'
import { useTranslation } from '../context/LanguageContext'

const STORAGE_KEY = 'pension-planner-guide-seen'

interface Step {
  title: string
  body: string
  icon: string
  highlight: string  // what to look at
}

interface Props {
  onClose: () => void
}

export function FirstTimeGuide({ onClose }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const steps: Step[] = [
    { ...t.guide.welcome, icon: '🏦', highlight: '' },
    { ...t.guide.step1,   icon: '💶', highlight: '' },
    { ...t.guide.step2,   icon: '📋', highlight: '' },
    { ...t.guide.step3,   icon: '💰', highlight: '' },
    { ...t.guide.step4,   icon: '📊', highlight: '' },
    { ...t.guide.step5,   icon: '📈', highlight: '' },
  ]

  const totalSteps = steps.length
  const current = steps[step]
  const isLast = step === totalSteps - 1
  const isFirst = step === 0

  function finish() {
    localStorage.setItem(STORAGE_KEY, 'true')
    onClose()
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) finish() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-400">
              {t.guide.stepOf(step + 1, totalSteps)}
            </span>
            <button
              type="button"
              onClick={finish}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="text-4xl mb-3">{current.icon}</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{current.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{current.body}</p>
        </div>

        {/* Step dots */}
        <div className="px-6 pb-2 flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            {t.guide.skipBtn}
          </button>
          <div className="flex gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.guide.prevBtn}
              </button>
            )}
            {isLast ? (
              <button
                type="button"
                onClick={finish}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t.guide.finishBtn}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {t.guide.nextBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function shouldShowGuide(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true'
}
