'use client'
import { useState, useEffect } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { DECISION_ALERTS } from '@/lib/mock-data'
import type { DecisionAlert, PersonaType } from '@/types'
import { ShieldCheck, UserCheck, AlertTriangle, ArrowRight, Bot, Zap } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ActLayer() {
  const { activePersona, setActivePersona } = useARTHAMStore()
  const [alerts, setAlerts] = useState<DecisionAlert[]>([])
  const [loading, setLoading] = useState(false)
  const [signalInput, setSignalInput] = useState('')

  // Load preset alerts when persona changes
  useEffect(() => {
    setAlerts(DECISION_ALERTS[activePersona] || [])
  }, [activePersona])

  const handleFetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/agents/decision_center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: signalInput || 'Generate current systemic physical economy threat response recommendations.',
          persona: activePersona.toUpperCase()
        })
      })
      const data = await res.json()
      setAlerts(data.alerts || [])
    } catch (err) {
      console.error('Failed fetching alerts:', err)
      setAlerts(DECISION_ALERTS[activePersona] || [])
    } finally {
      setLoading(false)
    }
  }

  const PERSONAS = [
    { id: 'rbi' as PersonaType, label: 'RBI Mode', icon: '🏛️' },
    { id: 'railway' as PersonaType, label: 'Railway Mode', icon: '🚆' },
    { id: 'agriculture' as PersonaType, label: 'Agriculture Mode', icon: '🌾' },
    { id: 'investor' as PersonaType, label: 'Investor Mode', icon: '💼' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left panel: Persona Selector & Context Input - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">DECISION CENTER™</h2>
              <p className="text-[11px] text-text-3 font-mono mt-0.5">Sovereign Action & Capital Deployment Policy</p>
            </div>
            <Badge variant="green">DECISION PORTAL</Badge>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <label className="text-[10px] font-mono text-text-3 uppercase tracking-wider">Select Institutional Persona</label>
            <div className="flex flex-col gap-2">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setActivePersona(p.id); setSignalInput('') }}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center gap-3 ${
                    activePersona === p.id
                      ? 'bg-accent-green/10 border-accent-green text-accent-green font-bold shadow-glow-mint'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span className="text-sm">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Generate Custom Directives */}
        <Card>
          <CardHeader>
            <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Ingest Regional Signal</h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-3 font-mono text-[11px]">
            <textarea
              value={signalInput}
              onChange={(e) => setSignalInput(e.target.value)}
              placeholder="e.g. Western DFC track maintenance scheduled for Q3 2026. Review routing alternates."
              className="w-full h-20 bg-black/30 border border-border/40 hover:border-border-bright focus:border-accent-green focus:outline-none rounded p-3 text-xs text-text-1 font-mono resize-none leading-relaxed transition-all placeholder-text-4"
            />
            <Button
              variant="mint"
              disabled={loading}
              onClick={handleFetchAlerts}
              className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Bot size={13} /> {loading ? 'Compiling AI Response...' : 'Instruct AI Agent'}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Active Action Directives List - 8 cols */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="bg-bg-elevated border border-border/30 rounded-md py-2 px-4 flex items-center justify-between font-mono text-[11px]">
          <span className="text-text-3 flex items-center gap-1.5">
            <UserCheck size={14} className="text-accent-green" />
            <span>ACTIVE EXECUTIVE MODE:</span>
            <span className="text-text-1 font-bold uppercase">{activePersona} AUTHORIZATION</span>
          </span>
          <span className="text-text-3">System status: Secure</span>
        </div>

        {loading ? (
          <Card className="flex-1 flex flex-col items-center justify-center min-h-[360px] font-mono text-xs text-text-3 gap-3.5">
            <div className="flex gap-1.5 py-4">
              {[1, 2, 3].map(i => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-accent-green animate-thinking"
                  style={{ animationDelay: `${(i - 1) * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-accent-green font-bold uppercase tracking-wider animate-pulse font-mono">Formulating Strategic Directives...</span>
            <span>Synthesizing structural buffers and macroeconomic targets.</span>
          </Card>
        ) : alerts.length > 0 ? (
          <div className="flex flex-col gap-4 max-h-[440px] overflow-y-auto pr-2">
            {alerts.map((alert, idx) => (
              <Card key={alert.id || idx} className="animate-fade-rise border-l-[3px] border-l-accent-green">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="text-xs font-extrabold text-text-1 font-mono">{alert.title}</h4>
                      <span className="text-[10px] text-accent-green font-mono font-bold block mt-1">{alert.metric}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={alert.impact === 'HIGH' ? 'red' : alert.impact === 'MED' ? 'amber' : 'ghost'}>
                        {alert.impact} Impact
                      </Badge>
                      <Badge variant="green">
                        {alert.confidence}% Conf
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-2 flex flex-col gap-3 border-t border-border/10">
                  <div className="text-[11px] leading-relaxed text-text-2 font-mono">
                    <span className="text-text-3 uppercase block mb-0.5 text-[9px]">Empirical Assessment</span>
                    {alert.description}
                  </div>

                  <div className="bg-black/25 p-3 rounded border border-border/10 font-mono text-[11px] leading-relaxed text-text-1">
                    <span className="text-accent-green font-bold uppercase block mb-0.5 text-[9px]">Sovereign Action Directive</span>
                    {alert.recommendation}
                  </div>

                  <div className="text-[10px] font-mono text-text-3 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-accent-green" />
                    <span>Expected Outcome: <span className="text-text-2">{alert.expectedOutcome}</span></span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex-1 flex flex-col items-center justify-center min-h-[360px] text-text-3 text-xs font-mono">
            <span>No directives loaded. Select an executive mode on the left.</span>
          </Card>
        )}
      </div>
    </div>
  )
}
