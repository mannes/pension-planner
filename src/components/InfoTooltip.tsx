import { useState, useRef, useEffect, CSSProperties } from 'react'

interface Props {
  text: string
}

export function InfoTooltip({ text }: Props) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
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

  function computeStyle(): CSSProperties {
    if (!buttonRef.current) return {}
    const rect = buttonRef.current.getBoundingClientRect()
    const TOOLTIP_W = 264
    const TOOLTIP_H = 160

    const s: CSSProperties = { position: 'fixed', width: TOOLTIP_W, zIndex: 9999 }

    // Horizontal: prefer left-aligned to button; flip right if near right edge
    if (window.innerWidth - rect.left < TOOLTIP_W) {
      s.right = window.innerWidth - rect.right
    } else {
      s.left = rect.left
    }

    // Vertical: show below button; flip up if near bottom edge
    if (window.innerHeight - rect.bottom < TOOLTIP_H) {
      s.bottom = window.innerHeight - rect.top + 4
    } else {
      s.top = rect.bottom + 4
    }

    return s
  }

  function handleOpen(isOpen: boolean) {
    if (isOpen) setStyle(computeStyle())
    setOpen(isOpen)
  }

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
        <div style={style} className="p-3 bg-white border border-blue-200 rounded-lg shadow-lg text-xs text-gray-700 leading-relaxed">
          {text}
        </div>
      )}
    </div>
  )
}
