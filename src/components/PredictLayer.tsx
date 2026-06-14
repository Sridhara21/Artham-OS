'use client'
import { useMemo, useState, useEffect } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { PRESET_SHOCKS } from '@/lib/mock-data'
import { simulateEconomicShock } from '@/lib/economic-models'
import { Sliders, RefreshCw, AlertTriangle, Check } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PredictLayer() {
  const {
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    activePresetShock, setActivePresetShock, setCustomShockValue, resetShocks
  } = useARTHAMStore()

  const [recalculating, setRecalculating] = useState(false)
  const [recalcText, setRecalcText] = useState('')

  const handleSliderChange = (key: 'oilShock' | 'portDisruption' | 'monsoonDelay' | 'railStrike' | 'floodImpact' | 'coalShortage', val: number) => {
    setCustomShockValue(key, val)
    setRecalculating(true)
    setRecalcText('SIMULATION ENGINE ACTIVE: Processing 847 Signals...')
  }

  useEffect(() => {
    if (!recalculating) return

    const t1 = setTimeout(() => {
      setRecalcText('SIMULATION ENGINE ACTIVE: Recalculating Dependencies...')
    }, 300)

    const t2 = setTimeout(() => {
      setRecalcText('SIMULATION ENGINE ACTIVE: Updating Economic Graph...')
    }, 600)

    const t3 = setTimeout(() => {
      setRecalculating(false)
    }, 900)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [recalculating])

  // Calculate impacts dynamically based on store slider values
  const simulation = useMemo(() => {
    return simulateEconomicShock(oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage)
  }, [oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage])

  const handlePresetClick = (shockId: string) => {
    const shock = PRESET_SHOCKS.find(s => s.id === shockId)
    if (shock) {
      setActivePresetShock(shockId)
      // Apply preset values
      setCustomShockValue('oilShock', shock.oilShock)
      setCustomShockValue('portDisruption', shock.portDisruption)
      setCustomShockValue('monsoonDelay', shock.monsoonDelay)
      setCustomShockValue('railStrike', shock.railStrike)
      setCustomShockValue('floodImpact', shock.floodImpact)
      setCustomShockValue('coalShortage', shock.coalShortage)
      // Re-assert active preset shock since setCustomShockValue resets it to null
      useARTHAMStore.setState({ activePresetShock: shockId })
      
      // Also show computing delay for preset updates
      setRecalculating(true)
      setRecalcText('SIMULATION ENGINE ACTIVE: Ingesting Scenario Presets...')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-2 mb-2">
        <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">SCENARIO LAB // What if conditions change?</span>
      </div>

      {/* Left panel: Shock Presets & Sliders - 5 cols */}
      <div className="lg:col-span-5 flex flex-col gap-5 animate-fade-rise">
        {/* Preset Shocks Grid */}
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1 font-heading">SCENARIO LAB™</h2>
              <p className="text-[11px] text-text-3 font-sans mt-0.5">Macroeconomic Sovereign Stress Simulator</p>
            </div>
            <Badge variant="amber">SIMULATION ENGINE</Badge>
          </CardHeader>
          <CardBody className="font-sans">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRESET_SHOCKS.map(shock => (
                <button
                  key={shock.id}
                  onClick={() => handlePresetClick(shock.id)}
                  className={`py-2 px-3 border rounded text-left text-[10px] font-semibold font-sans transition-all flex items-center justify-between ${
                    activePresetShock === shock.id
                      ? 'bg-accent-amber/10 border-accent-amber text-accent-amber font-semibold shadow-glow-amber'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span className="truncate">{shock.name}</span>
                  {activePresetShock === shock.id && <Check size={10} className="text-accent-amber flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="border-t border-border/20 pt-3 flex justify-between items-center">
              <span className="text-[10px] font-heading font-semibold text-text-3 uppercase">Customize Shock Variables</span>
              <Button variant="ghost" size="sm" onClick={resetShocks} className="text-[10px] font-sans font-semibold">
                <RefreshCw size={10} /> Reset Values
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Sliders Panel */}
        <Card className="flex-1">
          <CardBody className="flex flex-col gap-4 font-sans text-[11px]">
            {/* Slider 1: Brent Crude */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>🛢️ BRENT CRUDE OIL SHOCK</span>
                <span className="text-accent-amber font-mono font-semibold">+{oilShock}%</span>
              </div>
              <input
                type="range" min="-50" max="100" step="5"
                value={oilShock}
                onChange={(e) => handleSliderChange('oilShock', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>

            {/* Slider 2: Port Disruption */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>⚓ PORT YARD DISRUPTION</span>
                <span className="text-accent-amber font-mono font-semibold">+{portDisruption}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={portDisruption}
                onChange={(e) => handleSliderChange('portDisruption', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>

            {/* Slider 3: Monsoon Deficit */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>🌾 MONSOON DELAY DEFICIT</span>
                <span className="text-accent-amber font-mono font-semibold">+{monsoonDelay}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={monsoonDelay}
                onChange={(e) => handleSliderChange('monsoonDelay', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>

            {/* Slider 4: Rail Handler Strike */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>🚆 RAILROAD HANDLER STRIKE</span>
                <span className="text-accent-amber font-mono font-semibold">+{railStrike}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={railStrike}
                onChange={(e) => handleSliderChange('railStrike', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>

            {/* Slider 5: Local Flood Impact */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>🌊 CORRIDOR FLOOD SHUT-DOWN</span>
                <span className="text-accent-amber font-mono font-semibold">+{floodImpact}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={floodImpact}
                onChange={(e) => handleSliderChange('floodImpact', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>

            {/* Slider 6: Coal Supply Shortage */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-text-2">
                <span>🔌 COAL TERMINAL SHORTAGE</span>
                <span className="text-accent-amber font-mono font-semibold">+{coalShortage}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5"
                value={coalShortage}
                onChange={(e) => handleSliderChange('coalShortage', parseInt(e.target.value))}
                className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-amber"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Simulation Forecast Graph - 7 cols */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        {/* Dynamic Metric Readouts */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardBody className="p-3.5 flex flex-col justify-between h-20 font-sans">
              <span className="text-[9px] text-text-3 block uppercase leading-none">Est GDP Impact</span>
              <span className={`text-base font-semibold font-mono leading-none ${simulation.gdpImpactPct < 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                {simulation.gdpImpactPct > 0 ? '+' : ''}{simulation.gdpImpactPct}%
              </span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-3.5 flex flex-col justify-between h-20 font-sans">
              <span className="text-[9px] text-text-3 block uppercase leading-none">Inflation Offset</span>
              <span className={`text-base font-semibold font-mono leading-none ${simulation.inflationChangePct > 1.5 ? 'text-accent-red' : 'text-accent-green'}`}>
                +{simulation.inflationChangePct}%
              </span>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-3.5 flex flex-col justify-between h-20 font-sans">
              <span className="text-[9px] text-text-3 block uppercase leading-none">Freight Volume Delta</span>
              <span className={`text-base font-semibold font-mono leading-none ${simulation.freightVolumeChangePct < 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                {simulation.freightVolumeChangePct > 0 ? '+' : ''}{simulation.freightVolumeChangePct}%
              </span>
            </CardBody>
          </Card>
        </div>

        {/* Recharts Projections Area */}
        <Card className="flex-1 flex flex-col min-h-[360px] relative overflow-hidden">
          <CardHeader className="border-b border-border/20 pb-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-xs font-bold text-text-1 font-heading uppercase">Scenario Modeling Forecast (ARTHAM INDEX)</h3>
              <Badge variant="purple" className="font-mono font-medium">Expected Index: {simulation.overallIndex}</Badge>
            </div>
          </CardHeader>
          <CardBody className="flex-1 p-4 flex flex-col justify-between relative font-sans">
            {recalculating && (
              <div className="absolute inset-0 bg-bg-base/85 backdrop-blur-md flex flex-col items-center justify-center font-mono text-[9px] text-accent-amber border border-accent-amber/20 rounded z-30 select-none animate-pulse">
                <span className="w-2 h-2 rounded-full bg-accent-amber animate-ping mb-3" />
                <span className="font-semibold tracking-widest uppercase">{recalcText}</span>
              </div>
            )}

            <div className="h-60 w-full bg-black/10 rounded border border-border/20 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulation.simulationData}>
                  <defs>
                    <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9FD8C5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#9FD8C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AFA9EC" stopOpacity={0.20}/>
                      <stop offset="95%" stopColor="#AFA9EC" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" />
                  <YAxis domain={[30, 100]} stroke="rgba(255,255,255,0.2)" />
                  <Tooltip contentStyle={{ backgroundColor: '#03001C', borderColor: 'rgba(175,169,236,0.3)' }} />
                  
                  {/* Baseline indicator */}
                  <Area type="monotone" dataKey="baseCase" stroke="rgba(240,238,248,0.2)" strokeWidth={1} fill="none" name="Baseline (No Shock)" />
                  
                  {/* Scenario bands */}
                  <Area type="monotone" dataKey="bestCase" stroke="#9FD8C5" strokeWidth={2} fillOpacity={1} fill="url(#colorBest)" name="Best Case (Mitigated)" />
                  <Area type="monotone" dataKey="expectedCase" stroke="#AFA9EC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpected)" name="Expected Impact" />
                  <Area type="monotone" dataKey="worstCase" stroke="#FF6B6B" strokeWidth={2} fillOpacity={1} fill="url(#colorWorst)" name="Worst Case (Compounded)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-accent-amber/5 border border-accent-amber/20 rounded p-3 text-[10px] text-text-2 flex items-start gap-2.5 leading-relaxed mt-2 font-sans">
              <AlertTriangle className="text-accent-amber flex-shrink-0" size={14} />
              <div>
                <span className="font-heading font-semibold text-accent-amber block mb-0.5 uppercase">Simulation Warning Code</span>
                Expected Case projections drop the ARTHAM Index by <span className="font-mono font-semibold">{Math.abs(parseFloat((74.3 - simulation.overallIndex).toFixed(1)))}</span> points. Check mitigations inside the **SITUATION ROOM** tab to optimize buffers.
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
