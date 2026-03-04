import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface InfoBoxProps {
  title: string;
  content: string;
}

/** Render **bold** markers inline */
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-gray-800">{part}</strong>
      : part
  );
}

/** Parse mini-markdown: paragraphs (blank line), bullet lists (• lines), bold (**) */
function renderContent(content: string): React.ReactNode {
  const paras = content.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {paras.map((para, pi) => {
        const lines = para.split('\n').filter(Boolean);
        const allBullets = lines.every(l => l.startsWith('• '));

        if (allBullets) {
          return (
            <ul key={pi} className="space-y-1.5">
              {lines.map((line, li) => (
                <li key={li} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0 text-xs">●</span>
                  <span>{renderBold(line.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Mixed: lines starting with • become bullets, others become text
        const hasBullets = lines.some(l => l.startsWith('• '));
        if (hasBullets) {
          return (
            <div key={pi} className="space-y-1.5">
              {lines.map((line, li) =>
                line.startsWith('• ') ? (
                  <div key={li} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0 text-xs">●</span>
                    <span>{renderBold(line.slice(2))}</span>
                  </div>
                ) : (
                  <p key={li} className="font-semibold text-gray-700 text-xs mt-2">
                    {renderBold(line)}
                  </p>
                )
              )}
            </div>
          );
        }

        return <p key={pi}>{renderBold(para)}</p>;
      })}
    </div>
  );
}

export function InfoBox({ title, content }: InfoBoxProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div className="mt-3 border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors ${
          open ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
            open ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            i
          </span>
          <span className={`text-xs font-medium truncate transition-colors ${open ? 'text-blue-700' : 'text-gray-600'}`}>
            {title}
          </span>
        </div>
        <span className={`flex-shrink-0 text-xs transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : 'text-gray-400'}`}>
          ▾
        </span>
      </button>

      <div
        ref={bodyRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: height }}
      >
        <div className="px-4 py-4 bg-white border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
          {renderContent(content)}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            {t.infoBox.close} ↑
          </button>
        </div>
      </div>
    </div>
  );
}
