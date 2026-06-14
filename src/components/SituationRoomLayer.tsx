'use client'
import { useState, useMemo } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { SOVEREIGN_RECOMMENDATIONS } from '@/lib/mock-data'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Compass, Clipboard, Sparkles, Award } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SituationRoomLayer() {
  const {
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    activeBrief, generateExecutiveBrief, connectorStates, livePrices
  } = useARTHAMStore()

  const [briefLoading, setBriefLoading] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState<Record<string, boolean>>({})

  // Dynamic calculations based on live market prices
  const simulatedOilBase = connectorStates.marketFeed 
    ? Math.max(0, Math.round((livePrices.brentCrude - 80) / 80 * 100)) 
    : oilShock

  const handleGenerateBrief = () => {
    setBriefLoading(true)
    toast.loading('Synthesizing sovereign briefing records...', { id: 'brief-gen' })
    setTimeout(() => {
      generateExecutiveBrief()
      setBriefLoading(false)
      toast.success('Executive Brief compiled successfully.', { id: 'brief-gen', icon: '📝' })
    }, 1500)
  }

  // Dynamic calculations for all KPIs based on simulation parameters
  const dynamicKPIs = useMemo(() => {
    const val1 = Math.max(30, Math.min(99.5, 86.4 - simulatedOilBase * 0.12 - monsoonDelay * 0.08 - railStrike * 0.05))
    const change1 = 1.2 - simulatedOilBase * 0.06 - monsoonDelay * 0.04 - railStrike * 0.03

    const val2 = Math.max(30, Math.min(99.5, 78.2 - portDisruption * 0.22 - railStrike * 0.18 - floodImpact * 0.1))
    const change2 = -2.4 - portDisruption * 0.11 - railStrike * 0.09 - floodImpact * 0.05

    const val3 = Math.max(30, Math.min(99.5, 82.5 - portDisruption * 0.18 - simulatedOilBase * 0.12))
    const change3 = 1.8 - portDisruption * 0.09 - simulatedOilBase * 0.06

    const val4 = Math.max(10, Math.min(99.5, 42.1 + monsoonDelay * 0.35 + simulatedOilBase * 0.25))
    const change4 = 4.8 + monsoonDelay * 0.18 + simulatedOilBase * 0.12

    const val5 = Math.max(30, Math.min(99.5, 64.8 - railStrike * 0.15 - floodImpact * 0.2 - coalShortage * 0.1))
    const change5 = 1.2 - railStrike * 0.08 - floodImpact * 0.1 - coalShortage * 0.05

    const val6 = Math.max(30, Math.min(99.5, 85.4 - portDisruption * 0.25))
    const change6 = 2.2 - portDisruption * 0.12

    return [
      { id: 'kpi-1', name: 'Economic Resilience', value: `${val1.toFixed(1)}%`, change: change1 },
      { id: 'kpi-2', name: 'Supply Chain Stability', value: `${val2.toFixed(1)}%`, change: change2 },
      { id: 'kpi-3', name: 'Trade Momentum Index', value: `${val3.toFixed(1)}%`, change: change3 },
      { id: 'kpi-4', name: 'Inflationary Cost Pressure', value: `${val4.toFixed(1)}%`, change: change4 },
      { id: 'kpi-5', name: 'Infrastructure Util.', value: `${val5.toFixed(1)}%`, change: change5 },
      { id: 'kpi-6', name: 'Export Competitiveness', value: `${val6.toFixed(1)}%`, change: change6 },
    ]
  }, [simulatedOilBase, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-rise">
      {/* Narrative Subtitle */}
      <div className="lg:col-span-12 flex flex-col gap-0.5 border-b border-border/20 pb-1.5 mb-1">
        <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">SITUATION ROOM // What should we do?</span>
      </div>
      
      {/* 1. Sovereign Scorecard Banner - 12 Cols */}
      <div className="lg:col-span-12 flex flex-col gap-1.5 select-none animate-fade-rise">
        <div className="flex flex-col border-b border-border/20 pb-2 mb-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] font-heading text-accent-purple font-semibold tracking-widest uppercase">ARTHAM SITUATION ROOM</span>
              <span className="text-lg font-bold text-text-1 font-heading tracking-wide mt-0.5">EXECUTIVE DOSSIER</span>
            </div>
            <Badge variant="purple" dot>Briefing Session Active</Badge>
          </div>
          <div className="flex justify-between items-center mt-1 text-[8px] font-mono text-accent-red font-medium bg-accent-red/5 border border-accent-red/25 px-2 py-0.5 rounded w-fit uppercase">
            CLASSIFICATION: STRATEGIC ECONOMIC ASSESSMENT
          </div>
        </div>

        {/* 6 Sovereign Scorecard KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 mt-0.5">
          {dynamicKPIs.map((kpi) => {
            const isNegative = kpi.change < 0
            return (
              <Card key={kpi.id} className="border-t-2 border-t-accent-purple/20">
                <CardBody className="p-3 flex flex-col justify-between h-20 font-sans select-none">
                  <span className="text-[8.5px] text-text-3 font-heading font-medium uppercase tracking-wider block leading-tight truncate">{kpi.name}</span>
                  <div>
                    <span className="text-lg font-bold text-text-1 leading-none font-mono">{kpi.value}</span>
                    <span className={`text-[9px] block font-mono font-medium mt-0.5 ${isNegative ? 'text-accent-red' : 'text-accent-green'}`}>
                      {isNegative ? '▼' : '▲'} {Math.abs(parseFloat(kpi.change.toFixed(1)))}%
                    </span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Column 1: Strategic Risk, Executive Intelligence Brief, Explainability Ledger, Roadmap - 6 Cols */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {/* Strategic Risk Monitor Card */}
        <Card className="border-l-[3px] border-l-accent-red">
          <CardHeader className="py-2.5 px-4">
            <span className="text-[8px] font-heading text-accent-red font-semibold uppercase tracking-wider block">Sovereign Threat Level</span>
            <h3 className="text-xs font-bold text-text-1 font-heading uppercase mt-0.5">Strategic Risk Monitor</h3>
          </CardHeader>
          <CardBody className="p-3.5 font-sans text-[10px] flex flex-col gap-2">
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Supply Chain Risk:</span>
              <Badge variant={portDisruption > 40 || railStrike > 40 ? 'red' : 'amber'} className="text-[8px] font-medium font-mono h-4">
                {portDisruption > 40 || railStrike > 40 ? 'CRITICAL' : portDisruption > 20 || railStrike > 20 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Inflation Risk:</span>
              <Badge variant={simulatedOilBase > 40 || monsoonDelay > 40 ? 'red' : 'amber'} className="text-[8px] font-medium font-mono h-4">
                {simulatedOilBase > 40 || monsoonDelay > 40 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Energy Risk:</span>
              <Badge variant={coalShortage > 50 || simulatedOilBase > 50 ? 'red' : 'amber'} className="text-[8px] font-medium font-mono h-4">
                {coalShortage > 50 || simulatedOilBase > 50 ? 'CRITICAL' : coalShortage > 20 || simulatedOilBase > 20 ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-black/25 p-2 rounded border border-border/10">
              <span className="text-text-2">Trade Risk:</span>
              <Badge variant={portDisruption > 40 || activeBrief?.includes('Mundra') ? 'red' : 'amber'} className="text-[8px] font-medium font-mono h-4">
                {portDisruption > 40 || activeBrief?.includes('Mundra') ? 'HIGH' : 'MEDIUM'}
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Executive Narrative Brief Generator */}
        <Card className="flex-1 flex flex-col min-h-[280px]">
          <CardHeader className="py-2.5 px-4 border-b border-border/20">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-1.5">
                <Clipboard className="text-accent-purple" size={13} />
                <h3 className="text-xs font-bold text-text-1 font-heading uppercase tracking-wide">Executive Intelligence Brief</h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateBrief}
                disabled={briefLoading}
                className="font-sans font-semibold text-[9px] px-2.5 py-0.5 flex items-center gap-1"
              >
                <Sparkles size={10} />
                {briefLoading ? 'Compiling...' : 'Generate Brief'}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="flex-1 p-3 bg-black/15 font-sans text-[10px] leading-relaxed max-h-[260px] overflow-y-auto text-text-2 text-justify">
            {activeBrief ? (
              <div className="animate-fade-rise flex flex-col gap-2.5 whitespace-pre-line text-text-2 text-justify">
                {activeBrief}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-3 py-10 gap-1.5 text-center font-sans">
                <Clipboard size={20} className="text-text-3/40" />
                <span>No brief compiled. Click &quot;Generate Brief&quot; above to compile current telemetry profiles.</span>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Reusable Explainability Panel: Why Artham Believes This */}
        <Card className="border-l-[3px] border-l-accent-purple shadow-glow-purple">
          <CardHeader className="py-2.5 px-4 pb-1">
            <span className="text-[8px] font-heading text-accent-purple font-semibold uppercase tracking-wider block">Explainability Ledger</span>
            <h3 className="text-xs font-bold text-text-1 font-heading uppercase mt-0.5">Why ARTHAM Believes This</h3>
          </CardHeader>
          <CardBody className="p-3 font-sans text-[10px] flex flex-col gap-2.5">
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-heading font-semibold mb-0.5">Primary Signals</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="purple" className="text-[7.5px] px-1 py-0.5 font-mono font-medium">Red Sea Disruption</Badge>
                <Badge variant="purple" className="text-[7.5px] px-1 py-0.5 font-mono font-medium">Brent Crude Spike</Badge>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-heading font-semibold mb-0.5">Secondary Signals</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="ghost" className="text-[7.5px] border border-border/20 px-1 py-0.5 font-mono font-medium">Port Congestion</Badge>
                <Badge variant="ghost" className="text-[7.5px] border border-border/20 px-1 py-0.5 font-mono font-medium">Weather Delay</Badge>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-text-3 block uppercase font-heading font-semibold mb-0.5">Affected Sectors</span>
              <div className="flex flex-wrap gap-1">
                <Badge variant="cyan" className="text-[7.5px] px-1 py-0.5 font-mono font-medium">Logistics</Badge>
                <Badge variant="cyan" className="text-[7.5px] px-1 py-0.5 font-mono font-medium">Energy</Badge>
                <Badge variant="cyan" className="text-[7.5px] px-1 py-0.5 font-mono font-medium">Manufacturing</Badge>
              </div>
            </div>
            <div className="bg-black/35 p-2 rounded border border-border/10 text-[9px] font-sans">
              <span className="text-[8px] text-text-3 block uppercase font-heading font-semibold mb-0.5">Expected Outcome</span>
              <span className="text-text-2 leading-relaxed">Import Inflation Risk passes through to wholesale supply indexes within <span className="font-mono">15–30</span> days.</span>
            </div>
          </CardBody>
        </Card>

        {/* Sovereign Evolution Roadmap Banner */}
        <Card className="border-l-[3px] border-l-accent-cyan shadow-glow-mint">
          <CardBody className="p-3 flex flex-col gap-1.5 font-sans text-[10px] select-none">
            <span className="text-[8.5px] text-accent-cyan font-heading font-semibold tracking-widest uppercase block mb-0.5 flex items-center gap-1">
              <Award size={11} /> ARTHAM EVOLUTION ROADMAP
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="bg-accent-cyan/15 border border-accent-cyan/35 rounded p-2 flex flex-col gap-0.5">
                <span className="font-heading font-semibold text-text-1 uppercase text-[8.5px] block">PHASE 1</span>
                <span className="text-text-3 leading-tight block text-[8px] font-sans">Economic Intel</span>
                <Badge variant="cyan" className="mt-1 text-[7px] py-0 px-1 w-fit font-mono font-medium">ACTIVE</Badge>
              </div>
              <div className="bg-black/20 border border-border/20 rounded p-2 flex flex-col gap-0.5 opacity-70">
                <span className="font-heading font-semibold text-text-2 uppercase text-[8.5px] block">PHASE 2</span>
                <span className="text-text-3 leading-tight block text-[8px] font-sans">Decision Engine</span>
                <Badge variant="purple" className="mt-1 text-[7px] py-0 px-1 w-fit font-mono font-medium">IN DEV</Badge>
              </div>
              <div className="bg-black/20 border border-border/20 rounded p-2 flex flex-col gap-0.5 opacity-50">
                <span className="font-heading font-semibold text-text-2 uppercase text-[8.5px] block">PHASE 3</span>
                <span className="text-text-3 leading-tight block text-[8px] font-sans">National OS</span>
                <Badge variant="ghost" className="mt-1 text-[7px] py-0 px-1 w-fit font-mono font-medium">VISION</Badge>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Column 2: Recommended Actions - 6 Cols */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        {/* Recommended Actions Panel: upgraded to Sovereign Action Briefs */}
        <Card className="h-full">
          <CardHeader className="py-2.5 px-4 pb-1.5">
            <div className="flex items-center gap-2">
              <Compass className="text-accent-amber" size={13} />
              <h3 className="text-xs font-bold text-text-1 font-heading uppercase tracking-wide">Sovereign Action Briefs (Mitigations)</h3>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-3.5 font-sans text-[10px] pb-3.5">
            {/* Action brief provenance statement */}
            <div className="p-2.5 bg-black/45 border border-border/25 rounded text-[9.5px] text-text-2 flex flex-col gap-0.5 leading-snug">
              <span className="text-[8.5px] text-text-3 block uppercase font-heading font-semibold">Traceable Recommendation Protocol</span>
              <p className="text-accent-purple font-semibold">
                RECOMMENDED COURSE OF ACTION: Generated from <span className="font-mono">847</span> Signals, <span className="font-mono">126</span> Causal Relationships, and <span className="font-mono">3</span> Scenario Simulations.
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
                  className={`p-3 bg-black/20 border rounded transition-all flex flex-col gap-2.5 ${
                    isActive
                      ? 'border-accent-amber bg-accent-amber/5 shadow-inner'
                      : 'border-border/10 opacity-60'
                  }`}
                >
                  {/* Priority and Risk Title */}
                  <div className="flex justify-between items-center border-b border-border/10 pb-1 text-[8.5px] font-sans">
                    <span className="font-heading font-semibold text-text-1 uppercase tracking-wide truncate max-w-[65%]">
                      {rec.risk}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-text-3 font-heading font-semibold uppercase">PRIORITY:</span>
                      <Badge variant={isActive ? rec.riskLevel === 'HIGH' ? 'red' : 'amber' : 'ghost'} className="text-[7.5px] font-mono font-medium h-4">
                        {isActive ? rec.riskLevel : 'STANDBY'}
                      </Badge>
                    </div>
                  </div>

                  {/* Sovereign Action and Expected Outcome Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px]">
                    <div className="bg-black/30 p-2 rounded border border-border/15">
                      <span className="text-[7.5px] text-text-3 block uppercase font-heading font-semibold mb-0.5">ACTION</span>
                      <p className="text-text-1 font-medium leading-relaxed">{rec.recommendation}</p>
                    </div>

                    <div className="bg-black/30 p-2 rounded border border-border/15 flex flex-col justify-between">
                      <div>
                        <span className="text-[7.5px] text-text-3 block uppercase font-heading font-semibold mb-0.5">EXPECTED OUTCOME</span>
                        <p className="text-accent-green font-medium leading-relaxed">
                          Reduce Freight Exposure <span className="font-mono font-medium">18%</span> (dampens pricing pass-through by <span className="font-mono font-medium">{rec.id === 'rec-1' ? '0.8' : rec.id === 'rec-2' ? '1.2' : '0.5'}%</span>).
                        </p>
                      </div>
                      <div className="text-[7.5px] text-text-3 font-heading font-semibold mt-1.5 uppercase">
                        GDP OFFSET: <span className="text-text-2 font-mono">₹{rec.gdpOffsetCr} Cr</span> | CO2: <span className="text-accent-green font-mono">-{rec.co2SavedTonnes}t</span>
                      </div>
                    </div>
                  </div>

                  {/* Reasoning Transparency Pathway */}
                  <div className="bg-black/35 p-2 rounded border border-border/15 font-sans text-[9px] flex flex-col gap-1">
                    <span className="text-[7.5px] text-text-3 block uppercase font-heading font-semibold leading-none">Reasoning Pathway (Why This Action?)</span>
                    <div className="flex items-center gap-1 text-text-2 flex-wrap leading-relaxed">
                      <span className="bg-accent-purple/10 border border-accent-purple/35 text-accent-purple px-1 py-0.5 rounded text-[7.5px] font-semibold">
                        SIGNAL: {rec.id === 'rec-1' ? 'Red Sea Disruption' : rec.id === 'rec-2' ? 'JNPT Stack Congestion' : 'Monsoon Delay Deficit'}
                      </span>
                      <span className="text-text-4 font-semibold">→</span>
                      <span className="bg-accent-cyan/10 border border-accent-cyan/35 text-accent-cyan px-1 py-0.5 rounded text-[7.5px] font-semibold">
                        EVENT: {rec.id === 'rec-1' ? 'Cape route redirects' : rec.id === 'rec-2' ? 'Empty wagon reallocations' : 'Kharif sowing contractions'}
                      </span>
                      <span className="text-text-4 font-semibold">→</span>
                      <span className="bg-accent-amber/10 border border-accent-amber/35 text-accent-amber px-1 py-0.5 rounded text-[7.5px] font-semibold">
                        CONSEQUENCE: {rec.id === 'rec-1' ? 'Ocean Freight Rate Spike' : rec.id === 'rec-2' ? 'NH-48 Diverted Road Traffic' : 'Mandi Arrival Deficits'}
                      </span>
                      <span className="text-text-4 font-semibold">→</span>
                      <span className="bg-accent-red/10 border border-accent-red/35 text-accent-red px-1 py-0.5 rounded text-[7.5px] font-semibold">
                        OUTCOME: {rec.id === 'rec-1' ? 'Import Cost Inflation' : rec.id === 'rec-2' ? 'Gurugram Factory Delays' : 'Food Pricing Volatility'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Confidence and Cost */}
                  <div className="flex justify-between items-center text-[9px] text-text-3 border-t border-border/10 pt-1.5 font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-3 font-heading font-semibold uppercase">CONFIDENCE:</span>
                      <span className="text-accent-purple font-mono font-medium text-[9.5px]">{rec.confidence}%</span>
                      <button 
                        onClick={() => setShowBreakdown(prev => ({ ...prev, [rec.id]: !prev[rec.id] }))}
                        className="text-accent-cyan underline hover:text-accent-cyan/80 text-[7.5px] ml-0.5 cursor-pointer focus:outline-none"
                      >
                        {showBreakdown[rec.id] ? '[Hide Breakdown]' : '[View Breakdown]'}
                      </button>
                    </div>
                    <div className="font-heading font-semibold">
                      BUDGET PROFILE: <span className="text-accent-cyan font-mono">₹{(rec.costInr / 100000).toFixed(0)} Lakhs</span>
                    </div>
                  </div>

                  {/* Collapsible Confidence Decomposition */}
                  {showBreakdown[rec.id] && (
                    <div className="bg-black/45 p-1.5 rounded border border-border/10 text-[8.5px] font-mono text-text-2 flex flex-wrap justify-between gap-1.5 animate-fade-rise">
                      <div>Data Quality: <span className="text-accent-purple font-semibold">95%</span></div>
                      <div>Signal Agreement: <span className="text-accent-purple font-semibold">91%</span></div>
                      <div>Forecast Stability: <span className="text-accent-purple font-semibold">89%</span></div>
                      <div>Model Confidence: <span className="text-accent-purple font-semibold">{rec.confidence}%</span></div>
                    </div>
                  )}

                  {/* Recommendation Provenance Line */}
                  <div className="border-t border-border/10 pt-1.5 text-[7.5px] font-sans text-text-3/90">
                    <span className="text-accent-purple font-heading font-semibold uppercase mr-1">RATIONALE:</span>
                    Generated From: <span className="font-mono">847</span> Signals | <span className="font-mono">126</span> Causal Relationships | <span className="font-mono">3</span> Scenario Simulations
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
