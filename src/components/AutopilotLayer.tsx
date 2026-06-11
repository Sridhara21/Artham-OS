'use client'
import { useState } from 'react'
import { AUTOPILOT_MITIGATIONS } from '@/lib/mock-data'
import { ShieldCheck, Zap, Activity, Clock, Leaf, TrendingUp, Cpu, Check, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function AutopilotLayer() {
  const [activeMitigation, setActiveMitigation] = useState(AUTOPILOT_MITIGATIONS[0].id)
  const [engagingId, setEngagingId] = useState<string | null>(null)
  const [deployedIds, setDeployedIds] = useState<string[]>([])

  const selectedMit = AUTOPILOT_MITIGATIONS.find(m => m.id === activeMitigation) || AUTOPILOT_MITIGATIONS[0]

  const handleEngage = (id: string, name: string) => {
    setEngagingId(id)
    toast.loading(`Autopilot: Injecting routing overrides...`, { id: 'auto-engage' })
    
    setTimeout(() => {
      setEngagingId(null)
      setDeployedIds(prev => [...prev, id])
      toast.success(`Mitigation Deployed: Overrides applied to ${name.split(' ')[0]} network.`, { id: 'auto-engage', icon: '🤖' })
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left List of recommendations - 5 cols */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">ECONOMIC AUTOPILOT™</h2>
              <p className="text-[11px] text-text-3 font-mono mt-0.5">Autonomous Decision & Optimization Engine</p>
            </div>
            <Badge variant="purple" dot>Autopilot Active</Badge>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <span className="text-[9px] font-mono text-text-3 uppercase block tracking-wider">Operational Stresses Detected</span>
            {AUTOPILOT_MITIGATIONS.map(mit => {
              const isSelected = activeMitigation === mit.id
              const isDeployed = deployedIds.includes(mit.id)
              return (
                <div
                  key={mit.id}
                  onClick={() => setActiveMitigation(mit.id)}
                  className={`p-3 bg-black/25 border rounded cursor-pointer transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-accent-purple bg-accent-purple/5 shadow-glow-purple'
                      : 'border-border/30 hover:border-border-bright'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-1 font-mono truncate max-w-[200px]">{mit.title}</span>
                    {isDeployed ? (
                      <Badge variant="green">Deployed</Badge>
                    ) : (
                      <Badge variant={mit.riskLevel === 'HIGH' ? 'red' : 'amber'}>{mit.riskLevel} Stress</Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-accent-purple font-semibold font-mono leading-none">{mit.metric}</div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        {/* Autopilot Decision Framework Explainer */}
        <Card className="flex-1">
          <CardHeader>
            <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Autopilot Optimization Loop</h3>
          </CardHeader>
          <CardBody className="flex flex-col justify-center min-h-[160px] font-mono text-[10px] text-text-3 leading-relaxed">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-accent-purple font-bold">1</div>
                <span>Observe telemetry anomalies via 3D Digital Twin logs.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-accent-purple font-bold">2</div>
                <span>Evaluate alternative corridor speeds, empty wagon pools, and port limits.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-purple/10 border border-accent-purple/30 flex items-center justify-center text-accent-purple font-bold">3</div>
                <span>Select overrides that minimize GDP loss and CO2 emissions.</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right detailed assessment panel - 7 cols */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <Card className="flex-1 flex flex-col justify-between">
          <CardHeader className="border-b border-border/10 pb-3">
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-bold font-mono text-text-1 uppercase">Sovereign Action Dashboard</span>
              <Badge variant="purple">Confidence Score: {selectedMit.confidence}%</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-5 flex-1 flex flex-col gap-4 justify-between font-mono text-[11px]">
            {/* Assessment Narrative */}
            <div>
              <span className="text-text-3 text-[9px] block uppercase mb-1">Empirical Outlier Check</span>
              <p className="bg-black/35 border border-border/10 rounded p-3 text-text-2 leading-relaxed">
                {selectedMit.description}
              </p>
            </div>

            {/* Overrides Blueprint */}
            <div>
              <span className="text-accent-purple text-[9px] block uppercase mb-1 font-bold">Autopilot Optimization Recommendation</span>
              <p className="bg-accent-purple/5 border border-accent-purple/20 rounded p-3 text-text-1 leading-relaxed">
                {selectedMit.recommendation}
              </p>
            </div>

            {/* Mitigations Metrics Offset Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-black/20 p-2.5 rounded border border-border/10 flex flex-col justify-between h-16">
                <span className="text-text-3 text-[8px] leading-none uppercase">Cost Impact</span>
                <span className="text-xs font-bold text-accent-red leading-none">+₹{(selectedMit.costInr / 100000).toFixed(1)} L</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded border border-border/10 flex flex-col justify-between h-16">
                <span className="text-text-3 text-[8px] leading-none uppercase">Carbon Saved</span>
                <span className="text-xs font-bold text-accent-green leading-none">-{selectedMit.co2SavedTonnes} t CO2</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded border border-border/10 flex flex-col justify-between h-16">
                <span className="text-text-3 text-[8px] leading-none uppercase">Time Saved</span>
                <span className="text-xs font-bold text-accent-cyan leading-none">-{selectedMit.timeSavedHours} hrs</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded border border-border/10 flex flex-col justify-between h-16">
                <span className="text-text-3 text-[8px] leading-none uppercase">GDP Offset</span>
                <span className="text-xs font-bold text-accent-purple leading-none">+₹{selectedMit.gdpOffsetCr} Cr</span>
              </div>
            </div>

            {/* Control triggers */}
            <div className="border-t border-border/10 pt-4 flex gap-3">
              {deployedIds.includes(selectedMit.id) ? (
                <div className="w-full py-2.5 bg-accent-green/10 border border-accent-green rounded text-accent-green flex items-center justify-center gap-1.5 font-bold">
                  <Check size={14} /> OPTIMIZATION DEPLOYED SUCCESSFULLY
                </div>
              ) : (
                <Button
                  variant="mint"
                  disabled={engagingId !== null}
                  onClick={() => handleEngage(selectedMit.id, selectedMit.title)}
                  className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Cpu size={14} />
                  {engagingId === selectedMit.id ? 'Deploying Overrides...' : 'Engage Autopilot Override'}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
