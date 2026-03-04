import { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

function renderDefinition(text: string): React.ReactNode {
  const paragraphs = text.split(/\n\n/);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, pi) => {
        const lines = para.split('\n');
        const isList = lines.length > 1 && lines.every(l => l.trimStart().startsWith('•'));
        if (isList) {
          return (
            <ul key={pi} className="space-y-0.5">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-1.5">
                  <span className="text-gray-300 flex-shrink-0 mt-px">•</span>
                  <span>{renderBold(line.replace(/^[\s•]+/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={pi}>{renderBold(para)}</p>;
      })}
    </div>
  );
}

export function GlossaryPanel() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none">📖</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{t.glossary.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.glossary.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            {t.glossary.entries.length}
          </span>
          <span
            className="text-gray-400 text-base leading-none transition-transform duration-200"
            style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Entries — all visible when open */}
      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {t.glossary.entries.map((entry, i) => (
            <div key={i} className="px-5 py-4">
              <p className="text-sm font-semibold text-gray-800 mb-1.5">{entry.term}</p>
              <div className="text-xs text-gray-500 leading-relaxed">
                {renderDefinition(entry.definition)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
