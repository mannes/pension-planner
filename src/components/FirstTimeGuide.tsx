import { useState, useEffect } from 'react'
import { useTranslation } from '../context/LanguageContext'

const STORAGE_KEY = 'pension-planner-guide-seen'

// Maps guide step index → data-guide-step attribute value (null = no highlight)
const STEP_TARGETS: Array<string | null> = [
  null,           // 0: welcome
  'salary',       // 1: set your situation
  'real-toggle',  // 2: nominal vs real
  'results',      // 3: reading the results
]

interface Props {
  onClose: () => void
}

function highlightStep(stepIndex: number) {
  // Remove highlight from any previously highlighted element
  document.querySelectorAll('.guide-highlighted').forEach(el => {
    el.classList.remove('guide-highlighted')
  })

  const target = STEP_TARGETS[stepIndex]
  if (!target) return

  const el = document.querySelector(`[data-guide-step="${target}"]`)
  if (el) {
    el.classList.add('guide-highlighted')
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

export function FirstTimeGuide({ onClose }: Props) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const steps = [
    { ...t.guide.welcome, icon: '🏦' },
    { ...t.guide.step1,   icon: '⚙️' },
    { ...t.guide.step2,   icon: '📊' },
    { ...t.guide.step3,   icon: '💡' },
  ]

  const totalSteps = steps.length
  const current = steps[step]
  const isLast = step === totalSteps - 1
  const isFirst = step === 0

  // Highlight the relevant element whenever the step changes
  useEffect(() => {
    highlightStep(step)
  }, [step])

  // Remove highlight when guide closes
  useEffect(() => {
    return () => {
      document.querySelectorAll('.guide-highlighted').forEach(el => {
        el.classList.remove('guide-highlighted')
      })
    }
  }, [])

  function goToStep(next: number) {
    setStep(next)
  }

  function finish() {
    localStorage.setItem(STORAGE_KEY, 'true')
    onClose()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-80 sm:border sm:border-gray-200 sm:rounded-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-400">
            {t.guide.stepOf(step + 1, totalSteps)}
          </span>
          <button
            type="button"
            onClick={finish}
            className="text-gray-400 hover:text-gray-600 text-sm leading-none"
            aria-label="Sluit gids"
          >
            ✕
          </button>
        </div>

        <div className="text-3xl mb-2">{current.icon}</div>
        <h2 className="text-base font-bold text-gray-900 mb-1">{current.title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{current.body}</p>
      </div>

      {/* Step dots */}
      <div className="px-5 pb-2 flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToStep(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === step ? 'bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Stap ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3 mt-1">
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
              onClick={() => goToStep(step - 1)}
              className="px-3 py-1.5 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.guide.prevBtn}
            </button>
          )}
          {isLast ? (
            <button
              type="button"
              onClick={finish}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.guide.finishBtn}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.guide.nextBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function shouldShowGuide(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true'
}
