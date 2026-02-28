import { useState } from 'react'

interface Props {
  title: string
  content: string   // Markdown-ish text with **bold**, > blockquotes, | tables
}

function renderContent(text: string) {
  // Very simple inline renderer for bold, blockquotes, and line breaks
  return text.split('\n').map((line, i) => {
    if (line.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-4 border-blue-300 pl-3 my-2 text-blue-800 italic text-sm">
          {renderInline(line.slice(2))}
        </blockquote>
      )
    }
    if (line.startsWith('| ')) {
      // skip table separator rows
      if (/^\|[-| ]+\|$/.test(line)) return null
      const cells = line.split('|').filter(c => c.trim() !== '')
      return (
        <div key={i} className="flex gap-2 text-sm border-b border-gray-100 py-0.5">
          {cells.map((c, j) => (
            <span key={j} className={`flex-1 ${j === 0 ? 'font-medium' : ''}`}>{renderInline(c.trim())}</span>
          ))}
        </div>
      )
    }
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      return <p key={i} className="font-semibold text-gray-800 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>
    }
    if (line === '') return <div key={i} className="h-2" />
    return <p key={i} className="text-sm text-gray-700 leading-relaxed">{renderInline(line)}</p>
  })
}

function renderInline(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
  )
}

export function InfoBox({ title, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-blue-800 hover:bg-blue-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-blue-500">📖</span>
          {title}
        </span>
        <span className="text-blue-400 text-xs">{open ? '▲ Sluiten' : '▼ Lees meer'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-blue-200">
          {renderContent(content)}
        </div>
      )}
    </div>
  )
}
