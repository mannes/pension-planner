import React, { useState } from 'react'

interface Props {
  title: string
  content: string   // Markdown-ish text with **bold**, > blockquotes, | tables
}

function renderContent(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Collect consecutive table rows into a single <table>
    if (line.startsWith('| ')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('| ')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines.filter(l => !/^\|[-| ]+\|$/.test(l))
      const parseRow = (l: string) => l.split('|').filter(c => c.trim() !== '')
      elements.push(
        <table key={i} className="w-full text-xs my-2 border-collapse">
          <thead>
            <tr>
              {parseRow(rows[0]).map((c, j) => (
                <th key={j} className="text-left py-1 pr-4 font-semibold text-gray-700 border-b border-gray-200">{renderInline(c.trim())}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, ri) => (
              <tr key={ri} className="border-b border-gray-100">
                {parseRow(row).map((c, j) => (
                  <td key={j} className={`py-1 pr-4 ${j === 0 ? 'font-medium text-gray-700' : 'text-gray-600'}`}>{renderInline(c.trim())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
      continue
    }

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-blue-300 pl-3 my-2 text-blue-800 italic text-sm">
          {renderInline(line.slice(2))}
        </blockquote>
      )
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-gray-800 mt-3 mb-1 text-sm">{line.slice(2, -2)}</p>)
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="text-sm text-gray-700 leading-relaxed">{renderInline(line)}</p>)
    }
    i++
  }

  return elements
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
