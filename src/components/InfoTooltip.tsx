import { useState, useRef, useEffect } from 'react'

interface Props {
  text: string
}

export function InfoTooltip({ text }: Props) {
  const [open, setOpen] = useState(false)
  const [flipLeft, setFlipLeft] = useState(false)
  const [flipUp, setFlipUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function computePosition() {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setFlipLeft(window.innerWidth - rect.right < 264)
    setFlipUp(window.innerHeight - rect.bottom < 160)
  }

  function handleOpen(isOpen: boolean) {
    if (isOpen) computePosition()
    setOpen(isOpen)
  }

  const posClass = [
    flipLeft ? 'right-0' : 'left-6',
    flipUp   ? 'bottom-6' : 'top-0',
  ].join(' ')

  return (
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => handleOpen(!open)}
        onMouseEnter={() => handleOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="ml-1.5 w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex-shrink-0"
        aria-label="Meer informatie"
      >
        ?
      </button>
      {open && (
        <div className={`absolute z-50 ${posClass} w-64 p-3 bg-white border border-blue-200 rounded-lg shadow-lg text-xs text-gray-700 leading-relaxed`}>
          {text}
        </div>
      )}
    </div>
  )
}
