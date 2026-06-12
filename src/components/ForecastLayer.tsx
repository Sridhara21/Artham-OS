'use client'
import { useState } from 'react'
import { FORECAST_DATA } from '@/lib/mock-data'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, HelpCircle, ArrowRight, ShieldCheck, ChevronRight, Activity } from 'lucide-react'

export default function ForecastLayer() {
  const [selectedMilestone, setSelectedMilestone] = useState(FORECAST_DATA[0].period)

  const currentData = FORECAST_DATA.find(d => d.period === selectedMilestone) || FORECAST_DATA[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left panel: Milestone Timeline checklist - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="text-accent-purple" size={14} />
              <h2 className="text-base font-bold text-text-1">Economic Outlook</h2>
            </div>
            <Badge variant="purple">FORECAST HORIZON</Badge>
          </CardHeader>
          <CardBody>
            <span className="text-[9px] font-mono text-text-3 uppercase block tracking-wider mb-2.5">Select Forecast Milestone</span>
            <div className="flex flex-col gap-2">
              {FORECAST_DATA.map(d => (
                <button
                  key={d.period}
                  onClick={() => setSelectedMilestone(d.period)}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
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

            <p className="text-[10px] text-text-3 font-mono leading-relaxed mt-4 border-t border-border/10 pt-3">
              Forecast models map high-frequency freight loads to downstream macroeconomic cost adjustments, predicting inflation and congestion trends.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Predictions Grid & Signal Provenance - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[440px]">
        <CardHeader className="border-b border-border/10 pb-3 flex justify-between items-center w-full">
          <div>
            <h3 className="text-xs font-bold text-text-1 font-mono uppercase">Economic Projections ({selectedMilestone})</h3>
            <p className="text-[9px] text-text-3 font-mono mt-0.5">Predicted sectoral variances with empirical calibration</p>
          </div>
          <Activity className="text-accent-purple animate-pulse" size={14} />
        </CardHeader>
        <CardBody className="p-5 flex-1 flex flex-col lg:flex-row gap-6">
          
          {/* Sector Predictions Stack */}
          <div className="flex-1 flex flex-col gap-3 font-mono text-[11px] select-none">
            <div className="bg-black/20 p-3 rounded border border-border/15">
              <span className="text-accent-red font-bold uppercase block text-[8px] mb-1">Inflation cost index</span>
              <p className="text-text-1 leading-snug">{currentData.inflation}</p>
            </div>

            <div className="bg-black/20 p-3 rounded border border-border/15">
              <span className="text-accent-amber font-bold uppercase block text-[8px] mb-1">Freight Congestion</span>
              <p className="text-text-1 leading-snug">{currentData.congestion}</p>
            </div>

            <div className="bg-black/20 p-3 rounded border border-border/15">
              <span className="text-accent-cyan font-bold uppercase block text-[8px] mb-1">Corridor Delays</span>
              <p className="text-text-1 leading-snug">{currentData.delay}</p>
            </div>

            <div className="bg-black/20 p-3 rounded border border-border/15">
              <span className="text-accent-mint font-bold uppercase block text-[8px] mb-1">Mandi Price Index</span>
              <p className="text-text-1 leading-snug">{currentData.price}</p>
            </div>
          </div>

          {/* Signal Provenance List */}
          <div className="w-full lg:w-64 bg-black/25 rounded border border-border/30 p-4 h-fit font-mono text-[11px] flex flex-col gap-3">
            <div className="border-b border-border/15 pb-2">
              <span className="text-accent-purple font-extrabold uppercase text-[9px] block mb-0.5 flex items-center gap-1">
                <ShieldCheck size={11} /> Signal Provenance
              </span>
              <span className="text-[8px] text-text-3 block">Primary variables driving this projection:</span>
            </div>

            <div className="flex flex-col gap-2">
              {currentData.provenance.map((sig, idx) => (
                <div key={idx} className="flex items-start gap-1 text-[10px] text-text-2 leading-relaxed bg-black/35 p-2 rounded border border-border/10">
                  <ChevronRight size={12} className="text-accent-purple flex-shrink-0 mt-0.5" />
                  <span>{sig}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[9px] text-text-3">
              <span>Provenance verified</span>
              <span className="text-accent-green font-bold">100% agreement</span>
            </div>
          </div>

        </CardBody>
      </Card>
    </div>
  )
}
