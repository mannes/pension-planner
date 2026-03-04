import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface InfoTooltipProps {
  content: string;
}

type Placement = 'right' | 'left' | 'below';

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'right' as Placement });
  const btnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const pw = 256; // w-64
      const gap = 8;
      const margin = 8;

      let placement: Placement;
      let top: number;
      let left: number;

      if (window.innerWidth - rect.right - gap >= pw + margin) {
        placement = 'right';
        left = rect.right + gap;
        top = rect.top + rect.height / 2;
      } else if (rect.left - gap >= pw + margin) {
        placement = 'left';
        left = rect.left - gap - pw;
        top = rect.top + rect.height / 2;
      } else {
        // Not enough horizontal space — show below, centered and clamped
        placement = 'below';
        top = rect.bottom + gap;
        left = Math.max(margin, Math.min(window.innerWidth - pw - margin, rect.left + rect.width / 2 - pw / 2));
      }

      setPos({ top, left, placement });
    }
    setOpen((v) => !v);
  }

  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        aria-label="More information"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px] font-bold leading-none transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          open
            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
            : 'bg-white border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
        }`}
      >
        i
      </button>

      {open && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: pos.placement !== 'below' ? 'translateY(-50%)' : undefined,
            zIndex: 9999,
          }}
        >
          {/* Arrow */}
          {pos.placement === 'right' && (
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none">
              <div className="w-2 h-2 bg-white border-l border-t border-gray-200 rotate-[-135deg] shadow-[-1px_-1px_0_0_#e5e7eb]" />
            </div>
          )}
          {pos.placement === 'left' && (
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none">
              <div className="w-2 h-2 bg-white border-r border-t border-gray-200 rotate-[45deg] shadow-[1px_-1px_0_0_#e5e7eb]" />
            </div>
          )}
          {pos.placement === 'below' && (
            <div className="absolute -top-1.5 left-4 w-2 h-2 pointer-events-none">
              <div className="w-2 h-2 bg-white border-l border-t border-gray-200 rotate-[45deg] shadow-[-1px_-1px_0_0_#e5e7eb]" />
            </div>
          )}
          {/* Popover */}
          <div
            className="w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs text-gray-600 leading-relaxed"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))' }}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">i</span>
              <p>{content}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
