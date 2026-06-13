'use client'
import { useState } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { SOVEREIGN_KPIS, SOVEREIGN_RECOMMENDATIONS } from '@/lib/mock-data'
import { calculateRiskRadar } from '@/lib/economic-models'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Compass, Clipboard, Sparkles, Award, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SituationRoomLayer() {
  const {
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    activeBrief, generateExecutiveBrief, connectorStates, livePrices
  } = useARTHAMStore()

  const [hoveredBubbleId, setHoveredBubbleId] = useState<string | null>(null)
  const [briefLoading, setBriefLoading] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState<Record<string, boolean>>({})

  // Dynamic calculations based on live market prices
  const simulatedOilBase = connectorStates.marketFeed 
    ? Math.max(0, Math.round((livePrices.brentCrude - 80) / 80 * 100)) 
    : oilShock

  const riskRadarBubbles = calculateRiskRadar(
    simulatedOilBase, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage
  )

  const handleGenerateBrief = () => {
    setBriefLoading(true)
    toast.loading('Synthesizing sovereign briefing records...', { id: 'brief-gen' })
    setTimeout(() => {
      generateExecutiveBrief()
      setBriefLoading(false)
      toast.success('Executive Brief compiled successfully.', { id: 'brief-gen', icon: '📝' })
    }, 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Narrative Subtitle */}
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-2 mb-2">
        <span className="text-accent-purple font-mono text-[9px] uppercase tracking-widest leading-none font-bold">SITUATION ROOM // What should we do?</span>
      </div>
      
      {/* 1. Sovereign Scorecard Banner - 12 Cols */}
      <div className="lg:col-span-12 flex flex-col gap-2 select-none">
        <div className="flex flex-col border-b border-border/20 pb-3 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-accent-purple font-bold tracking-widest uppercase">ARTHAM SITUATION ROOM</span>
              <span className="text-xl font-extrabold text-text-1 font-mono tracking-wider mt-1">EXECUTIVE DOSSIER</span>
            </div>
            <Badge variant="purple" dot>Briefing Session Active</Badge>
          </div>
          <div className="flex justify-between items-center mt-2 text-[8px] font-mono text-accent-red font-bold bg-accent-red/5 border border-accent-red/25 px-2.5 py-1 rounded w-fit uppercase">
            CLASSIFICATION: STRATEGIC ECONOMIC ASSESSMENT
          </div>
        </div>

        {/* 6 Sovereign Scorecard KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mt-1">
          {SOVEREIGN_KPIS.map((kpi) => {
            const currentChange = kpi.id === 'kpi-4' ? (monsoonDelay*0.15 + simulatedOilBase*0.1) : kpi.change
            const isNegative = currentChange < 0
            return (
              <Card key={kpi.id} className="border-t-2 border-t-accent-purple/20">
                <CardBody className="p-3.5 flex flex-col justify-between h-24 font-mono select-none">
                  <span className="text-[9px] text-text-3 uppercase tracking-wider block leading-tight truncate">{kpi.name}</span>
                  <div>
                    <span className="text-xl font-extrabold text-text-1 leading-none">{kpi.value}</span>
                    <span className={`text-[10px] block font-bold mt-1 ${isNegative ? 'text-accent-red' : 'text-accent-green'}`}>
                      {isNegative ? '▼' : '▲'} {Math.abs(parseFloat(currentChange.toFixed(1)))}%
                    </span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 2. Risk Radar Quadrant & Roadmap Banner - 6 Cols */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Strategic Risk Monitor Card */}
        <Card className="border-l-[3px] border-l-accent-red">
          <CardHeader className="pb-1.5">
            <span className="text-[8.5px] font-mono text-accent-red font-bold uppercase tracking-wider block">Sovereign Threat Level</span>
            <h3 className="text-xs font-bold text-text-1 font-mono uppercase mt-0.5">Strategic Risk Monitor</h3>
          </CardHeader>
          <CardBody className="p-3.5 font-mono text-[10.5px] flex flex-col gap-2.5">
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Supply Chain Risk:</span>
              <Badge variant={portDisruption > 40 || railStrike > 40 ? 'red' : 'amber'} className="text-[8.5px] font-bold h-4.5">
                {portDisruption > 40 || railStrike > 40 ? 'CRITICAL' : portDisruption > 20 || railStrike > 20 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Inflation Risk:</span>
              <Badge variant={simulatedOilBase > 40 || monsoonDelay > 40 ? 'red' : 'amber'} className="text-[8.5px] font-bold h-4.5">
                {simulatedOilBase > 40 || monsoonDelay > 40 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Energy Risk:</span>
              <Badge variant={coalShortage > 50 || simulatedOilBase > 50 ? 'red' : 'amber'} className="text-[8.5px] font-bold h-4.5">
                {coalShortage > 50 || simulatedOilBase > 50 ? 'CRITICAL' : coalShortage > 20 || simulatedOilBase > 20 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Trade Risk:</span>
              <Badge variant={portDisruption > 40 || activeBrief?.includes('Mundra') ? 'red' : 'amber'} className="text-[8.5px] font-bold h-4.5">
                {portDisruption > 40 || activeBrief?.includes('Mundra') ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card className="flex-1 flex flex-col min-h-[420px]">
          <CardHeader className="border-b border-border/20 pb-3">
            <div>
              <h3 className="text-xs font-bold text-text-1 font-mono uppercase tracking-wide">2D Economic Risk Radar</h3>
              <p className="text-[9px] text-text-3 font-mono mt-0.5">Quadrant Coordinate projection of systemic shocks</p>
            </div>
          </CardHeader>
          <CardBody className="flex-1 p-4 relative flex items-center justify-center bg-black/10 select-none">
            
            {/* Quadrant Legend labels */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-text-3">INFLATION / ENERGY (Stressed)</div>
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-text-3">SUPPLY / TRADE (Consolidated)</div>

            {/* SVG Quadrant Graph */}
            <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto relative z-10">
              {/* Grid axes */}
              <line x1="150" y1="10" x2="150" y2="290" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="10" y1="150" x2="290" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Concentric risk rings */}
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(175,169,236,0.04)" strokeWidth="1" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(175,169,236,0.05)" strokeWidth="1" />
              <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(175,169,236,0.06)" strokeWidth="1" />

              {/* Dynamic Risk Bubbles */}
              {riskRadarBubbles.map((bubble) => {
                const cx = 150 + (bubble.x / 100) * 130
                const cy = 150 - (bubble.y / 100) * 130
                const r = bubble.severity === 'high' ? 10 : bubble.severity === 'medium' ? 7 : 5
                const isHovered = hoveredBubbleId === bubble.id
                
                return (
                  <g
                    key={bubble.id}
                    className="cursor-help"
                    onMouseEnter={() => setHoveredBubbleId(bubble.id)}
                    onMouseLeave={() => setHoveredBubbleId(null)}
                  >
                    {/* Glowing outer halo for high severity */}
                    {bubble.severity === 'high' && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 8}
                        className="fill-accent-red/10 stroke-accent-red/20 animate-pulse"
                        strokeWidth="1"
                      />
                    )}
                    {/* Primary bubble dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      className={
                        bubble.severity === 'high'
                          ? 'fill-accent-red/35 stroke-accent-red'
                          : bubble.severity === 'medium'
                          ? 'fill-accent-amber/30 stroke-accent-amber'
                          : 'fill-accent-purple/20 stroke-accent-purple'
                      }
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="2"
                      className={
                        bubble.severity === 'high'
                          ? 'fill-accent-red'
                          : bubble.severity === 'medium'
                          ? 'fill-accent-amber'
                          : 'fill-accent-purple'
                      }
                    />

                    {/* Small text label next to node */}
                    <text
                      x={cx + 8}
                      y={cy + 3}
                      fill="rgba(240,238,248,0.5)"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {bubble.category}
                    </text>

                    {/* Tooltip Overlay */}
                    {isHovered && (
                      <foreignObject x={cx - 75} y={cy - 75} width="150" height="70" className="z-50 pointer-events-none">
                        <div className="p-2 bg-bg-overlay border border-accent-purple/30 rounded shadow-glow-purple text-[8px] font-mono text-text-2 leading-tight select-none">
                          <span className="font-bold text-text-1 block uppercase mb-0.5">{bubble.name}</span>
                          <span className="text-accent-purple uppercase block text-[7px] mb-1">Grid: X:{bubble.x} Y:{bubble.y}</span>
                          <div className="leading-tight">{bubble.description}</div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                )
              })}
            </svg>
          </CardBody>
        </Card>

        {/* Sovereign Evolution Roadmap Banner */}
        <Card className="border-l-[3px] border-l-accent-cyan shadow-glow-mint">
          <CardBody className="p-4 flex flex-col gap-2 font-mono text-[10px] select-none">
            <span className="text-[9px] text-accent-cyan font-bold tracking-widest uppercase block mb-1 flex items-center gap-1">
              <Award size={12} /> ARTHAM EVOLUTION ROADMAP
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-accent-cyan/15 border border-accent-cyan/35 rounded p-2.5 flex flex-col gap-1">
                <span className="font-bold text-text-1 uppercase text-[9px] block">PHASE 1</span>
                <span className="text-text-3 leading-tight block">Economic Intelligence Layer</span>
                <Badge variant="cyan" className="mt-1 text-[8px]">ACTIVE</Badge>
              </div>
              <div className="bg-black/20 border border-border/20 rounded p-2.5 flex flex-col gap-1 opacity-70">
                <span className="font-bold text-text-2 uppercase text-[9px] block">PHASE 2</span>
                <span className="text-text-3 leading-tight block">Decision Intelligence Engine</span>
                <Badge variant="purple" className="mt-1 text-[8px]">IN DEV</Badge>
              </div>
              <div className="bg-black/20 border border-border/20 rounded p-2.5 flex flex-col gap-1 opacity-50">
                <span className="font-bold text-text-2 uppercase text-[9px] block">PHASE 3</span>
                <span className="text-text-3 leading-tight block">National Coordination OS</span>
                <Badge variant="ghost" className="mt-1 text-[8px]">VISION</Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 3. Recommended Actions & Executive Narrative - 6 Cols */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        
        {/* Recommended Actions Panel: upgraded to Sovereign Action Briefs */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Compass className="text-accent-amber" size={14} />
              <h3 className="text-xs font-bold text-text-1 font-mono uppercase tracking-wide">Sovereign Action Briefs (Mitigations)</h3>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 font-mono text-[11px] pb-4">
            {/* Action brief provenance statement */}
            <div className="p-2.5 bg-black/45 border border-border/25 rounded text-[9.5px] text-text-2 flex flex-col gap-0.5 leading-snug">
              <span className="text-[8px] text-text-3 block uppercase font-bold">Traceable Recommendation Protocol</span>
              <p className="text-accent-purple font-extrabold">
                RECOMMENDED COURSE OF ACTION: Generated from 847 Signals, 126 Causal Relationships, and 3 Scenario Simulations.
              </p>
            </div>

            {SOVEREIGN_RECOMMENDATIONS.map((rec) => {
              const isActive = rec.id === 'rec-1' 
                ? (simulatedOilBase > 0 || portDisruption > 0) 
                : rec.id === 'rec-2' 
                ? portDisruption > 40 
                : monsoonDelay > 20

              return (
                <div
                  key={rec.id}
                  className={`p-4 bg-black/20 border rounded transition-all flex flex-col gap-3 ${
                    isActive
                      ? 'border-accent-amber bg-accent-amber/5 shadow-inner'
                      : 'border-border/10 opacity-60'
                  }`}
                >
                  {/* Priority and Risk Title */}
                  <div className="flex justify-between items-center border-b border-border/10 pb-1.5 text-[9px] font-bold">
                    <span className="font-extrabold text-text-1 uppercase tracking-wide truncate max-w-[65%]">
                      {rec.risk}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-text-3 font-semibold uppercase">PRIORITY:</span>
                      <Badge variant={isActive ? rec.riskLevel === 'HIGH' ? 'red' : 'amber' : 'ghost'} className="text-[8px] h-4.5">
                        {isActive ? rec.riskLevel : 'STANDBY'}
                      </Badge>
                    </div>
                  </div>

                  {/* Sovereign Action and Expected Outcome Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                    <div className="bg-black/30 p-2.5 rounded border border-border/15">
                      <span className="text-[8px] text-text-3 block uppercase font-bold mb-1">ACTION</span>
                      <p className="text-text-1 font-semibold leading-relaxed">{rec.recommendation}</p>
                    </div>

                    <div className="bg-black/30 p-2.5 rounded border border-border/15 flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] text-text-3 block uppercase font-bold mb-1">EXPECTED OUTCOME</span>
                        <p className="text-accent-green font-semibold leading-relaxed">
                          Reduce Freight Exposure 18% (dampens pricing pass-through by {rec.id === 'rec-1' ? '0.8' : rec.id === 'rec-2' ? '1.2' : '0.5'}%).
                        </p>
                      </div>
                      <div className="text-[8px] text-text-3 font-semibold mt-2 uppercase">
                        GDP OFFSET: <span className="text-text-2">₹{rec.gdpOffsetCr} Cr</span> | CO2: <span className="text-accent-green">-{rec.co2SavedTonnes}t</span>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning Transparency Pathway */}
                  <div className="bg-black/35 p-2.5 rounded border border-border/15 font-mono text-[9px] flex flex-col gap-1.5">
                    <span className="text-[8px] text-text-3 block uppercase font-bold leading-none">Reasoning Pathway (Why This Action?)</span>
                    <div className="flex items-center gap-1 text-text-2 flex-wrap leading-relaxed">
                      <span className="bg-accent-purple/10 border border-accent-purple/35 text-accent-purple px-1.5 py-0.5 rounded text-[8px] font-bold">
                        SIGNAL: {rec.id === 'rec-1' ? 'Red Sea Disruption' : rec.id === 'rec-2' ? 'JNPT Stack Congestion' : 'Monsoon Delay Deficit'}
                      </span>
                      <span className="text-text-4 font-bold">→</span>
                      <span className="bg-accent-cyan/10 border border-accent-cyan/35 text-accent-cyan px-1.5 py-0.5 rounded text-[8px] font-bold">
                        EVENT: {rec.id === 'rec-1' ? 'Cape route redirects' : rec.id === 'rec-2' ? 'Empty wagon reallocations' : 'Kharif sowing contractions'}
                      </span>
                      <span className="text-text-4 font-bold">→</span>
                      <span className="bg-accent-amber/10 border border-accent-amber/35 text-accent-amber px-1.5 py-0.5 rounded text-[8px] font-bold">
                        CONSEQUENCE: {rec.id === 'rec-1' ? 'Ocean Freight Rate Spike' : rec.id === 'rec-2' ? 'NH-48 Diverted Road Traffic' : 'Mandi Arrival Deficits'}
                      </span>
                      <span className="text-text-4 font-bold">→</span>
                      <span className="bg-accent-red/10 border border-accent-red/35 text-accent-red px-1.5 py-0.5 rounded text-[8px] font-bold">
                        OUTCOME: {rec.id === 'rec-1' ? 'Import Cost Inflation' : rec.id === 'rec-2' ? 'Gurugram Factory Delays' : 'Food Pricing Volatility'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Confidence and Cost */}
                  <div className="flex justify-between items-center text-[9.5px] text-text-3 border-t border-border/10 pt-2 font-bold font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-text-3 font-semibold uppercase">CONFIDENCE:</span>
                      <span className="text-accent-purple text-[10px]">{rec.confidence}%</span>
                      <button 
                        onClick={() => setShowBreakdown(prev => ({ ...prev, [rec.id]: !prev[rec.id] }))}
                        className="text-accent-cyan underline hover:text-accent-cyan/80 text-[8px] ml-1 cursor-pointer focus:outline-none"
                      >
                        {showBreakdown[rec.id] ? '[Hide Breakdown]' : '[View Breakdown]'}
                      </button>
                    </div>
                    <div>
                      BUDGET PROFILE: <span className="text-accent-cyan">₹{(rec.costInr / 100000).toFixed(0)} Lakhs</span>
                    </div>
                  </div>

                  {/* Collapsible Confidence Decomposition */}
                  {showBreakdown[rec.id] && (
                    <div className="bg-black/45 p-2 rounded border border-border/10 text-[8.5px] font-mono text-text-2 flex flex-wrap justify-between gap-2 animate-fade-rise">
                      <div>Data Quality: <span className="text-accent-purple font-bold">95%</span></div>
                      <div>Signal Agreement: <span className="text-accent-purple font-bold">91%</span></div>
                      <div>Forecast Stability: <span className="text-accent-purple font-bold">89%</span></div>
                      <div>Model Confidence: <span className="text-accent-purple font-bold">{rec.confidence}%</span></div>
                    </div>
                  )}

                  {/* Recommendation Provenance Line */}
                  <div className="border-t border-border/10 pt-2 text-[8px] font-mono text-text-3/90">
                    <span className="text-accent-purple font-extrabold uppercase mr-1">RATIONALE:</span>
                    Generated From: 847 Signals | 126 Causal Relationships | 3 Scenario Simulations
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        {/* Executive Narrative Brief Generator */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b border-border/20 pb-3">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <Clipboard className="text-accent-purple" size={14} />
                <h3 className="text-xs font-bold text-text-1 font-mono uppercase tracking-wide">Executive Intelligence Brief</h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateBrief}
                disabled={briefLoading}
                className="font-mono text-[10px] px-3 py-1 flex items-center gap-1.5"
              >
                <Sparkles size={11} />
                {briefLoading ? 'Compiling...' : 'Generate Brief'}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="flex-1 p-4 bg-black/15 font-mono text-[10px] leading-relaxed max-h-[300px] overflow-y-auto">
            {activeBrief ? (
              <div className="animate-fade-rise flex flex-col gap-3 whitespace-pre-line text-text-2 text-justify">
                {activeBrief}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-3 py-12 gap-2 text-center">
                <Clipboard size={24} className="text-text-3/40" />
                <span>No brief compiled. Click &quot;Generate Brief&quot; above to compile current telemetry profiles.</span>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Reusable Explainability Panel: Why Artham Believes This */}
        <Card className="border-l-[3px] border-l-accent-purple shadow-glow-purple mt-4">
          <CardHeader className="pb-1.5">
            <span className="text-[8.5px] font-mono text-accent-purple font-bold uppercase tracking-wider block">Explainability Ledger</span>
            <h3 className="text-xs font-bold text-text-1 font-mono uppercase mt-0.5">Why ARTHAM Believes This</h3>
          </CardHeader>
          <CardBody className="p-3.5 font-mono text-[10px] flex flex-col gap-3">
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-bold mb-1">Primary Signals</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="purple" className="text-[8px] px-1 py-0.5">Red Sea Disruption</Badge>
                <Badge variant="purple" className="text-[8px] px-1 py-0.5">Brent Crude Spike</Badge>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-bold mb-1">Secondary Signals</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="ghost" className="text-[8px] border border-border/20 px-1 py-0.5">Port Congestion</Badge>
                <Badge variant="ghost" className="text-[8px] border border-border/20 px-1 py-0.5">Weather Delay</Badge>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-bold mb-1">Affected Sectors</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="cyan" className="text-[8px] px-1 py-0.5">Logistics</Badge>
                <Badge variant="cyan" className="text-[8px] px-1 py-0.5">Energy</Badge>
                <Badge variant="cyan" className="text-[8px] px-1 py-0.5">Manufacturing</Badge>
              </div>
            </div>
            <div className="bg-black/35 p-2 rounded border border-border/10 text-[9.5px]">
              <span className="text-[8px] text-text-3 block uppercase font-bold mb-0.5">Expected Outcome</span>
              <span className="text-text-2 leading-relaxed">Import Inflation Risk passes through to wholesale supply indexes within 15–30 days.</span>
            </div>
          </CardBody>
        </Card>
      </div>

    </div>
  )
}
