'use client'
import { useEffect, useState, useRef } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { Search, Command, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react'

export default function CommandBar() {
  const { cmdKOpen, setCmdKOpen, executeSearch } = useARTHAMStore()
  const [input, setInput] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // Suggestion presets
  const presets = [
    { text: 'What is driving inflation?', query: 'Why did the ARTHAM Index fall today?' },
    { text: 'Show freight anomalies', query: 'Which state is most likely to experience freight bottlenecks?' },
    { text: 'Run Red Sea scenario', query: 'How will a Red Sea disruption affect fertilizer costs in India?' },
    { text: 'Forecast onion prices', query: 'How will delayed monsoons affect food inflation?' }
  ]

  // Backdrop click handler
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setCmdKOpen(false)
      }
    }
    if (cmdKOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [cmdKOpen, setCmdKOpen])

  const handleSubmit = (queryText: string) => {
    if (!queryText.trim()) return
    executeSearch(queryText)
    setCmdKOpen(false)
    setInput('')
  }

  if (!cmdKOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-bg-overlay border border-accent-purple/40 rounded-lg shadow-glow-purple overflow-hidden font-mono flex flex-col animate-fade-rise"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 border-b border-border/20 px-4 py-3 bg-black/40">
          <Search className="text-text-3" size={16} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(input)
              }
            }}
            placeholder="Search commands or ask economic questions..."
            className="flex-1 bg-transparent border-none text-xs text-text-1 focus:outline-none placeholder-text-4"
            autoFocus
          />
          <div className="flex items-center gap-1.5 text-[8px] text-text-3 border border-border/20 rounded py-0.5 px-1 bg-black/20">
            <span>ENTER</span>
            <CornerDownLeft size={8} />
          </div>
          <button onClick={() => setCmdKOpen(false)} className="text-text-3 hover:text-text-1">
            <X size={14} />
          </button>
        </div>

        {/* Suggestion list */}
        <div className="p-4 flex flex-col gap-2.5">
          <span className="text-[8px] text-text-3 uppercase block tracking-wider mb-1 flex items-center gap-1 font-bold">
            <Command size={10} className="text-accent-purple" /> Suggested Economic Commands
          </span>
          
          <div className="flex flex-col gap-1.5">
            {presets.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleSubmit(preset.query)}
                className="p-2.5 bg-black/25 border border-border/10 hover:border-accent-purple/35 rounded cursor-pointer transition-all flex items-center justify-between group text-[10px] text-text-2 hover:text-text-1"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={11} className="text-accent-purple opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span>{preset.text}</span>
                </div>
                <ArrowRight size={11} className="text-text-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border/15 bg-black/30 py-2 px-4 text-[8px] text-text-3 flex justify-between items-center select-none">
          <span>ARTHAM OS X Command Console v2.0</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  )
}
