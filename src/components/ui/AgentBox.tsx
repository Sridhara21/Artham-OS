'use client'
import { useState, useRef } from 'react'
import { Bot, Zap } from 'lucide-react'
import { Button } from './Button'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

interface AgentBoxProps {
  layer: string
  title: string
  message: string
  fallback?: string
  className?: string
}

export function AgentBox({ layer, title, message, fallback, className }: AgentBoxProps) {
  const [status, setStatus] = useState<'idle' | 'thinking' | 'done' | 'error'>('idle')
  const [output, setOutput] = useState('')
  const [cached, setCached] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  async function typewrite(text: string) {
    setOutput('')
    for (let i = 0; i < text.length; i++) {
      await new Promise(r => setTimeout(r, text[i] === ' ' ? 5 : 14))
      setOutput(prev => prev + text[i])
      if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }

  async function runAgent() {
    setStatus('thinking')
    setOutput('')
    try {
      const res = await fetch(`/api/agents/${layer}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setCached(data.cached)
      setStatus('done')
      await typewrite(data.text)
    } catch {
      setStatus('error')
      await typewrite(fallback || 'Agent offline. Please check API configuration.')
    }
  }

  return (
    <div className={cn('rounded-md border-l-[3px] border-l-accent-purple border border-[rgba(175,169,236,0.2)] bg-[rgba(175,169,236,0.04)] p-4 mt-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-accent-purple" />
          <span className="text-xs font-bold text-accent-purple tracking-wide">{title}</span>
          {cached && <Badge variant="amber">Cached</Badge>}
          {status === 'done' && !cached && <Badge variant="green">Live</Badge>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={runAgent}
          disabled={status === 'thinking'}
          loading={status === 'thinking'}
        >
          {status === 'idle' ? (
            <><Zap size={12} /> Activate Agent</>
          ) : status === 'done' ? (
            <><Zap size={12} /> Re-run</>
          ) : null}
        </Button>
      </div>

      {status === 'thinking' && (
        <div className="flex items-center gap-2 text-text-3 text-xs font-mono py-3">
          <span>Agent thinking</span>
          <span className="flex gap-1">
            {[1,2,3].map(i => (
              <span key={i} className={`w-1 h-1 rounded-full bg-accent-purple animate-thinking thinking-dot`} style={{ animationDelay: `${(i-1)*0.2}s` }} />
            ))}
          </span>
        </div>
      )}

      {(status === 'done' || status === 'error') && output && (
        <div
          ref={outputRef}
          className="font-mono text-[11px] leading-relaxed text-text-2 max-h-52 overflow-y-auto bg-black/20 rounded p-3 whitespace-pre-wrap"
        >
          {output}
          {status === 'done' && <span className="inline animate-cursor-blink text-accent-purple">▋</span>}
        </div>
      )}

      {status === 'idle' && (
        <p className="text-[11px] text-text-3 font-mono">Click to activate Gemini-powered agent analysis...</p>
      )}
    </div>
  )
}
