'use client'
import { useState } from 'react'
import { FORECAST_DATA } from '@/lib/mock-data'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useARTHAMStore } from '@/lib/store'
import { 
  Clock, Activity, ShieldCheck, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2 
} from 'lucide-react'

export default function ForecastLayer() {
  const { livePrices, liveMacro } = useARTHAMStore()
  const [selectedMilestone, setSelectedMilestone] = useState(FORECAST_DATA[0].period)

  const currentData = FORECAST_DATA.find(d => d.period === selectedMilestone) || FORECAST_DATA[0]

  // Calculate dynamic offsets based on live Brent Crude / Wheat pricing
  const oilOffset = Math.max(-2, parseFloat(((livePrices.brentCrude - 84) * 0.04).toFixed(2)))
  const wheatOffset = Math.max(-1.5, parseFloat(((livePrices.wheat - 600) * 0.05).toFixed(2)))

  const getScenarios = (period: string) => {
    switch(period) {
      case '7 Days':
        return {
          best: { inflation: '+0.04%', congestion: 'Mundra dwel: nominal (14h)', delay: 'DFC speeds standard', mandi: 'Onion index stable', confidence: 91 },
          base: { inflation: `+${(0.12 + oilOffset * 0.05).toFixed(2)}%`, congestion: 'Mundra stack stressed (+6h)', delay: '+1.2d DFC rakes delay', mandi: `Onion index: +${(4 + wheatOffset * 0.8).toFixed(1)}%`, confidence: currentData.confidence },
          worst: { inflation: `+${(0.24 + oilOffset * 0.15).toFixed(2)}%`, congestion: 'Mundra yard stacked critical (+18h)', delay: '+3d Western corridor delay', mandi: 'Onion prices surge: +12%', confidence: 84 }
        }
      case '30 Days':
        return {
          best: { inflation: '+0.08%', congestion: 'Mundra stack cleared', delay: 'DFC rakes bypass active', mandi: 'Tomato index: -4%', confidence: 85 },
          base: { inflation: `+${(0.28 + oilOffset * 0.1).toFixed(2)}%`, congestion: 'Dadri terminal stacks spillover', delay: '+3.4d average DFC transit', mandi: `Tomato mandi prices: +${(12 + wheatOffset * 1.5).toFixed(1)}%`, confidence: currentData.confidence },
          worst: { inflation: `+${(0.48 + oilOffset * 0.25).toFixed(2)}%`, congestion: 'Industrial supply blockages at NCR', delay: '+6.5d intermodal logistics delay', mandi: 'Veg mandi basket: +28% surge', confidence: 76 }
        }
      case '90 Days':
        return {
          best: { inflation: '+0.15%', congestion: 'Optimal gate clearance restored', delay: 'Rake placements complete', mandi: 'Agri mandi corrections expand', confidence: 88 },
          base: { inflation: `+${(0.54 + oilOffset * 0.08).toFixed(2)}%`, congestion: 'Optimal flows restored at terminals', delay: '+1.8d average DFC transit', mandi: 'Agri price correction across yards', confidence: currentData.confidence },
          worst: { inflation: `+${(0.85 + oilOffset * 0.2).toFixed(2)}%`, congestion: 'Ancillary stack congestions spillover', delay: '+4.2d logistics bottleneck', mandi: 'Urea imports deficit: +18%', confidence: 71 }
        }
      case '180 Days':
      default:
        return {
          best: { inflation: '+0.05%', congestion: 'Standard terminal turnaround', delay: 'High velocity rail grids', mandi: 'Food basket stabilized', confidence: 94 },
          base: { inflation: `+${(0.14 + oilOffset * 0.02).toFixed(2)}%`, congestion: 'Optimal logistics flow benchmarks', delay: 'Standard DFC speeds (72 km/h)', mandi: 'Kharif sowing yields expanded (+3% YoY)', confidence: currentData.confidence },
          worst: { inflation: `+${(0.38 + oilOffset * 0.12).toFixed(2)}%`, congestion: 'Mundra stacked over baseline', delay: '+2.1d cargo wagon bottlenecks', mandi: 'Kharif crop deficits confirmed (-8% YoY)', confidence: 78 }
        }
    }
  }

  const scenarios = getScenarios(selectedMilestone)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise select-none">
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-2 mb-2">
        <span className="text-accent-purple font-mono text-[9px] uppercase tracking-widest leading-none font-bold">FORECAST // What happens next?</span>
      </div>
      {/* Left panel: Milestone Timeline checklist - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="text-accent-purple" size={14} />
              <h2 className="text-base font-bold text-text-1">Economic Outlook</h2>
            </div>
            <Badge variant="purple">FORECAST HORIZON</Badge>
          </CardHeader>
          <CardBody className="font-mono">
            <span className="text-[9px] text-text-3 uppercase block tracking-wider mb-2.5">Select Forecast Milestone</span>
            <div className="flex flex-col gap-2">
              {FORECAST_DATA.map(d => (
                <button
                  key={d.period}
                  onClick={() => setSelectedMilestone(d.period)}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                    selectedMilestone === d.period
                      ? 'bg-accent-purple/10 border-accent-purple text-accent-purple font-bold shadow-glow-purple'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span>{d.period} Outlook</span>
                  <Badge variant={selectedMilestone === d.period ? 'purple' : 'ghost'}>
                    Conf: {d.confidence}%
                  </Badge>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-text-3 leading-relaxed mt-4 border-t border-border/10 pt-3">
              ARTHAM forecasts macro fluctuations by evaluating historical price transmission, rainfall variations, and logistical dwell deviations.
            </p>
          </CardBody>
        </Card>

        {/* Signal Provenance List */}
        <Card>
          <CardBody className="p-4 flex flex-col gap-3 font-mono text-[11px]">
            <div className="border-b border-border/15 pb-2">
              <span className="text-accent-purple font-extrabold uppercase text-[9px] block mb-0.5 flex items-center gap-1">
                <ShieldCheck size={11} /> Signal Provenance
              </span>
              <span className="text-[8px] text-text-3 block font-semibold">Live variables driving this model:</span>
            </div>

            <div className="flex flex-col gap-2">
              {currentData.provenance.map((sig, idx) => (
                <div key={idx} className="flex items-start gap-1 text-[9.5px] text-text-2 leading-relaxed bg-black/35 p-2 rounded border border-border/10">
                  <ChevronRight size={12} className="text-accent-purple flex-shrink-0 mt-0.5" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Reusable Explainability Panel: Why Artham Believes This */}
        <Card className="border-l-[3px] border-l-accent-purple shadow-glow-purple">
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

      {/* Right panel: Predictions Grid Scenarios - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col min-h-[460px] font-mono">
        <CardHeader className="border-b border-border/10 pb-3 flex justify-between items-center w-full">
          <div>
            <h3 className="text-xs font-bold text-text-1 uppercase">Economic Forecast Case Matrix ({selectedMilestone})</h3>
            <p className="text-[9px] text-text-3 mt-0.5">Three-tier scenario projection with live calibration</p>
          </div>
          <Activity className="text-accent-purple animate-pulse" size={14} />
        </CardHeader>
        <CardBody className="p-5 flex-1 flex flex-col gap-4">
          
          {/* Optimistic Scenario */}
          <div className="p-4 bg-accent-green/5 border border-accent-green/20 rounded hover:border-accent-green/45 transition-all flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-accent-green/10 pb-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-accent-green">
                <CheckCircle2 size={13} />
                <span>OPTIMISTIC SCENARIO</span>
              </div>
              <Badge variant="green" className="text-[8.5px]">CONFIDENCE: {scenarios.best.confidence}%</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2 mb-2 text-[9.5px] text-text-3 font-semibold">
              <div>PROBABILITY OF OCCURRENCE: <span className="text-accent-green font-bold">20%</span></div>
              <div className="text-center font-bold">EXPECTED ECONOMIC IMPACT: <span className="text-accent-green font-bold">MINIMAL</span></div>
              <div className="text-right">MODEL CONFIDENCE: <span className="text-accent-green font-bold">{scenarios.best.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2.5 bg-black/20 p-2 rounded border border-border/10 text-[8.5px] font-mono text-text-2">
              <div className="flex justify-between px-1"><span>Data Quality:</span><span className="text-accent-green font-bold">95%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Signal Agreement:</span><span className="text-accent-green font-bold">91%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Forecast Stability:</span><span className="text-accent-green font-bold">89%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Final Conf:</span><span className="text-accent-green font-bold">{scenarios.best.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-text-2 leading-relaxed">
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Inflation</span>
                <span className="font-bold text-text-1">{scenarios.best.inflation}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Port Dwell</span>
                <span className="font-semibold">{scenarios.best.congestion}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Rail Speed</span>
                <span className="font-semibold">{scenarios.best.delay}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Mandi Index</span>
                <span className="font-semibold text-accent-green">{scenarios.best.mandi}</span>
              </div>
            </div>
          </div>

          {/* Most Likely Scenario */}
          <div className="p-4 bg-accent-purple/5 border border-accent-purple/20 rounded hover:border-accent-purple/45 transition-all flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-accent-purple/10 pb-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-accent-purple">
                <Activity size={13} />
                <span>MOST LIKELY SCENARIO</span>
              </div>
              <Badge variant="purple" className="text-[8.5px]">CONFIDENCE: {scenarios.base.confidence}%</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2 mb-2 text-[9.5px] text-text-3 font-semibold">
              <div>PROBABILITY OF OCCURRENCE: <span className="text-accent-purple font-bold">65%</span></div>
              <div className="text-center font-bold">EXPECTED ECONOMIC IMPACT: <span className="text-accent-purple font-bold">MODERATE</span></div>
              <div className="text-right">MODEL CONFIDENCE: <span className="text-accent-purple font-bold">{scenarios.base.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2.5 bg-black/20 p-2 rounded border border-border/10 text-[8.5px] font-mono text-text-2">
              <div className="flex justify-between px-1"><span>Data Quality:</span><span className="text-accent-purple font-bold">95%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Signal Agreement:</span><span className="text-accent-purple font-bold">91%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Forecast Stability:</span><span className="text-accent-purple font-bold">89%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Final Conf:</span><span className="text-accent-purple font-bold">{scenarios.base.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-text-2 leading-relaxed">
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Inflation</span>
                <span className="font-bold text-accent-purple">{scenarios.base.inflation}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Port Dwell</span>
                <span className="font-semibold">{scenarios.base.congestion}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Rail Speed</span>
                <span className="font-semibold">{scenarios.base.delay}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Mandi Index</span>
                <span className="font-semibold text-text-1">{scenarios.base.mandi}</span>
              </div>
            </div>
          </div>

          {/* Stress Scenario */}
          <div className="p-4 bg-accent-red/5 border border-accent-red/20 rounded hover:border-accent-red/45 transition-all flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-accent-red/10 pb-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-accent-red">
                <AlertTriangle size={13} className="animate-pulse" />
                <span>STRESS SCENARIO</span>
              </div>
              <Badge variant="red" className="text-[8.5px]">CONFIDENCE: {scenarios.worst.confidence}%</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-border/10 pb-2 mb-2 text-[9.5px] text-text-3 font-semibold">
              <div>PROBABILITY OF OCCURRENCE: <span className="text-accent-red font-bold">15%</span></div>
              <div className="text-center font-bold">EXPECTED ECONOMIC IMPACT: <span className="text-accent-red font-bold">SEVERE</span></div>
              <div className="text-right">MODEL CONFIDENCE: <span className="text-accent-red font-bold">{scenarios.worst.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2.5 bg-black/20 p-2 rounded border border-border/10 text-[8.5px] font-mono text-text-2">
              <div className="flex justify-between px-1"><span>Data Quality:</span><span className="text-accent-red font-bold">95%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Signal Agreement:</span><span className="text-accent-red font-bold">91%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Forecast Stability:</span><span className="text-accent-red font-bold">89%</span></div>
              <div className="flex justify-between px-1 border-l border-border/15"><span>Final Conf:</span><span className="text-accent-red font-bold">{scenarios.worst.confidence}%</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-text-2 leading-relaxed">
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Inflation</span>
                <span className="font-bold text-accent-red">{scenarios.worst.inflation}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Port Dwell</span>
                <span className="font-semibold">{scenarios.worst.congestion}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Rail Speed</span>
                <span className="font-semibold">{scenarios.worst.delay}</span>
              </div>
              <div>
                <span className="text-[8px] text-text-3 block uppercase">Mandi Index</span>
                <span className="font-semibold text-accent-red">{scenarios.worst.mandi}</span>
              </div>
            </div>
          </div>

        </CardBody>
      </Card>
    </div>
  )
}
