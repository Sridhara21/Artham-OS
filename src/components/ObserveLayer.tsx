'use client'
import { useState } from 'react'
import { PORT_DATA, CORRIDOR_DATA, MANDI_NODES } from '@/lib/mock-data'
import { Anchor, Activity, TrendingUp, AlertTriangle, HelpCircle, Ship, Sun } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useARTHAMStore } from '@/lib/store'

export default function ObserveLayer() {
  const { 
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    aisVessels, liveWeather, connectorStates, activePresetShock
  } = useARTHAMStore()
  
  const [activeLayer, setActiveLayer] = useState<'corridors' | 'ports' | 'mandis'>('corridors')
  const [selectedNode, setSelectedNode] = useState<{ type: string; name: string; details: any } | null>(null)

  // Recalculate utilization based on slider changes
  const dynamicCorridors = CORRIDOR_DATA.map(c => {
    let utilization = c.utilizationPct
    if (c.id === 'W-DFC') {
      utilization = Math.min(99, c.utilizationPct + Math.round(portDisruption * 0.2 + railStrike * 0.15))
    } else if (c.id === 'E-DFC') {
      utilization = Math.min(99, c.utilizationPct + Math.round(coalShortage * 0.15 + floodImpact * 0.1))
    }
    const status = utilization > 80 ? 'CONGESTED' : utilization > 60 ? 'DELAYED' : 'OPTIMAL'
    return { ...c, utilizationPct: utilization, status }
  })

  const dynamicPorts = PORT_DATA.map(p => {
    let congestion = p.congestionPct
    if (p.id === 'Mundra' || p.id === 'JNPT') {
      congestion = Math.min(99, p.congestionPct + Math.round(portDisruption * 0.2))
    } else if (p.id === 'Vizag') {
      congestion = Math.min(99, p.congestionPct + Math.round(railStrike * 0.1))
    }
    const status = congestion > 80 ? 'CRITICAL' : congestion > 50 ? 'STRESSED' : 'OPTIMAL'
    return { ...p, congestionPct: congestion, status }
  })

  const dynamicMandis = MANDI_NODES.map(m => {
    let priceAnomaly = m.priceAnomalyPct
    if (m.crop === 'Tomato' || m.crop === 'Onion') {
      priceAnomaly = parseFloat((m.priceAnomalyPct + monsoonDelay * 0.3).toFixed(1))
    }
    return { ...m, priceAnomalyPct: priceAnomaly }
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise select-none">
      {/* Left controls and telemetry metrics - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">ARTHAM TWIN™</h2>
              <p className="text-[11px] text-text-3 font-mono mt-0.5">National Physical Economy Digital Twin</p>
            </div>
            <Badge variant="live" dot>LIVE FLOWS</Badge>
          </CardHeader>
          <CardBody className="font-mono">
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => { setActiveLayer('corridors'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                  activeLayer === 'corridors'
                    ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🔀 LOGISTICS CORRIDORS FLOW</span>
                <Badge variant={activeLayer === 'corridors' ? 'purple' : 'ghost'}>Active</Badge>
              </button>

              <button
                onClick={() => { setActiveLayer('ports'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                  activeLayer === 'ports'
                    ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>⚓ MARITIME GATEWAY CHANNELS</span>
                <Badge variant={activeLayer === 'ports' ? 'cyan' : 'ghost'}>Active</Badge>
              </button>

              <button
                onClick={() => { setActiveLayer('mandis'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                  activeLayer === 'mandis'
                    ? 'bg-accent-mint/10 border-accent-mint text-accent-mint'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🌾 COMMODITY MARKET FLOWS</span>
                <Badge variant={activeLayer === 'mandis' ? 'mint' : 'ghost'}>Active</Badge>
              </button>
            </div>

            <p className="text-[10px] text-text-3 leading-relaxed border-t border-border/20 pt-3">
              This layout charts physical trade corridor utilization, maritime shipping lanes, and localized mandi prices to represent real-time economic health.
            </p>
          </CardBody>
        </Card>

        {/* Selected telemetry data box */}
        <Card className="flex-1 font-mono">
          <CardHeader>
            <h3 className="text-xs font-bold text-text-2 uppercase tracking-widest">
              {selectedNode ? `${selectedNode.type} Details` : 'Telemetry Console'}
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col justify-center min-h-[220px]">
            {selectedNode ? (
              <div className="animate-fade-rise flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-text-1">{selectedNode.name}</h4>
                  <p className="text-[9px] text-text-3">{selectedNode.type === 'CORRIDOR' ? 'Infrastructure Pipeline' : 'Telemetry Node'}</p>
                </div>

                {selectedNode.type === 'PORT' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">CONGESTION LEVEL</div>
                      <div className={`text-base font-bold ${selectedNode.details.congestionPct > 70 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.congestionPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">DWELL CAPACITY</div>
                      <div className="text-base font-bold text-accent-cyan">{selectedNode.details.dwellHours} hrs</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20 flex items-center gap-2">
                      <AlertTriangle size={14} className={selectedNode.details.status === 'CRITICAL' ? 'text-accent-red animate-pulse' : 'text-accent-amber'} />
                      <span className="text-[9.5px] text-text-2 font-semibold">Status flagged as: {selectedNode.details.status}</span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'CORRIDOR' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">CAPACITY INDEX</div>
                      <div className="text-base font-bold text-accent-purple">{selectedNode.details.utilizationPct}%</div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">PIPELINE VELOCITY</div>
                      <div className="text-base font-bold text-accent-green">{selectedNode.details.speedKmph} km/h</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-[8px] text-text-3 uppercase font-bold mb-1">Downstream Risk Attribute</div>
                      <span className={`text-[10px] font-bold ${selectedNode.details.utilizationPct > 80 ? 'text-accent-red' : 'text-accent-green'}`}>
                        RISK PROFILE: {selectedNode.details.utilizationPct > 80 ? 'ELEVATED' : 'MINIMAL'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'MANDI' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">PRICE ANOMALY</div>
                      <div className={`text-base font-bold ${selectedNode.details.priceAnomalyPct > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.priceAnomalyPct > 0 ? '+' : ''}{selectedNode.details.priceAnomalyPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1">DAILY VOLUME</div>
                      <div className="text-base font-bold text-text-1">{selectedNode.details.volumeTonnes} T</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20">
                      <span className="text-[10px] text-text-2">Primary Crop: {selectedNode.details.crop} ({selectedNode.details.state})</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-text-3 text-[10px] flex flex-col items-center gap-2">
                <HelpCircle size={18} className="text-text-3" />
                <span>Select a corridor or node on the map to stream telemetry logs.</span>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Map display panel - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-black/40 overflow-hidden relative min-h-[500px]">
        {/* Map Header Status */}
        <div className="absolute top-4 left-4 z-20 flex flex-col font-mono text-[9px] text-text-3 gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="font-bold text-text-1">ECONOMIC FLOW LAYER ACTIVE</span>
          </div>
          <div>PROJECTION: Abstract Cylindrical Twin Map</div>
        </div>

        {/* The Map Canvas */}
        <svg
          viewBox="0 0 350 500"
          className="w-full max-w-[420px] aspect-[7/10] relative z-10 transition-all select-none"
        >
          {/* India Stylized Polygon Base */}
          <path
            d="M 90,40 L 110,35 L 125,65 L 115,80 L 130,95 L 150,90 L 160,110 L 140,120 L 150,150 L 175,150 L 190,165 L 210,150 L 250,150 L 290,120 L 310,130 L 300,165 L 260,175 L 250,210 L 270,230 L 275,255 L 275,265 L 255,275 L 210,300 L 205,330 L 200,360 L 155,440 L 142,475 L 138,475 L 120,410 L 95,360 L 65,335 L 68,310 L 85,280 L 50,270 L 32,238 L 45,215 L 75,200 L 80,180 L 70,150 L 95,140 L 88,110 L 90,40 Z"
            fill="rgba(175, 169, 236, 0.03)"
            stroke="rgba(175, 169, 236, 0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* DFC Corridors Layer */}
          {activeLayer === 'corridors' && (
            <g className="animate-fade-rise">
              {dynamicCorridors.map((c) => (
                <g key={c.id} className="cursor-pointer" onClick={() => setSelectedNode({ type: 'CORRIDOR', name: c.name, details: c })}>
                  {/* Glowing backing line */}
                  <path
                    d={c.pathPoints}
                    fill="none"
                    stroke={c.status === 'CONGESTED' ? 'rgba(255,107,107,0.3)' : 'rgba(175,169,236,0.3)'}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Primary flow path */}
                  <path
                    id={c.id}
                    d={c.pathPoints}
                    fill="none"
                    stroke={c.status === 'CONGESTED' ? '#FF6B6B' : '#AFA9EC'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="8, 8"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="100;0"
                      dur={c.status === 'CONGESTED' ? '12s' : '6s'}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              ))}

              {/* Economic meaning overlays directly on map */}
              <g className="font-mono text-[6.5px] fill-text-2 pointer-events-none select-none font-bold">
                <text x="50" y="150" fill={dynamicCorridors[0].utilizationPct > 80 ? '#FF6B6B' : '#AFA9EC'}>
                  WESTERN DFC: {dynamicCorridors[0].utilizationPct}% | {dynamicCorridors[0].utilizationPct > 80 ? 'ELEVATED RISK' : 'MINIMAL'}
                </text>
                <text x="145" y="110" fill={dynamicCorridors[1].utilizationPct > 70 ? '#FF6B6B' : '#AFA9EC'}>
                  EASTERN DFC: {dynamicCorridors[1].utilizationPct}% | {dynamicCorridors[1].utilizationPct > 70 ? 'STRESSED' : 'MINIMAL'}
                </text>
                <text x="100" y="390" fill="#AFA9EC">
                  SOUTHERN ROAD CORRIDOR: {dynamicCorridors[2].utilizationPct}%
                </text>
              </g>
            </g>
          )}

          {/* Ports Layer (which overlays AIS Vessel traffic) */}
          {activeLayer === 'ports' && (
            <g className="animate-fade-rise">
              {/* Draw animated AIS vessels */}
              {aisVessels.map(v => (
                <g key={v.id} className="transition-all duration-1000 ease-linear">
                  {/* Pulse circle */}
                  <circle cx={v.x} cy={v.y} r="5.5" className="fill-accent-purple/10 stroke-accent-purple/30 animate-pulse" />
                  {/* Triangle cursor representing ship direction */}
                  <polygon 
                    points={`${v.x},${v.y - 3.5} ${v.x - 2.5},${v.y + 3.5} ${v.x + 2.5},${v.y + 3.5}`} 
                    className="fill-accent-purple stroke-accent-purple/60"
                    transform={`rotate(${v.angle || 0}, ${v.x}, ${v.y})`}
                  />
                  {/* Text labels next to vessel */}
                  <text x={v.x + 6} y={v.y + 2} className="font-mono text-[5px] fill-text-3 font-semibold pointer-events-none select-none">
                    {v.name} ({v.cargo})
                  </text>
                </g>
              ))}

              {dynamicPorts.map((p) => {
                const isCritical = p.congestionPct > 70
                return (
                  <g
                    key={p.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode({ type: 'PORT', name: p.name, details: p })}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isCritical ? '10' : '6'}
                      className={isCritical ? 'fill-accent-red/20 stroke-accent-red animate-pulse' : 'fill-accent-cyan/25 stroke-accent-cyan'}
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="3"
                      className={isCritical ? 'fill-accent-red animate-pulse' : 'fill-accent-cyan'}
                    />
                    {/* Anchor icon overlay label */}
                    <text x={p.x + 7} y={p.y + 2.5} className="font-mono text-[5.5px] fill-accent-cyan bg-black/60 font-bold">
                      {p.id} ({p.congestionPct}%)
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Agri Mandis Layer */}
          {activeLayer === 'mandis' && (
            <g className="animate-fade-rise">
              {dynamicMandis.map((m) => {
                const isStressed = m.priceAnomalyPct > 30
                // Match coords to live weather values
                const temp = m.id === 'm-1' || m.id === 'm-2' ? liveWeather.nashik : m.id === 'm-3' ? liveWeather.mumbai - 2.8 : liveWeather.nashik - 1.5
                return (
                  <g
                    key={m.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode({ type: 'MANDI', name: m.name, details: m })}
                  >
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r={isStressed ? '9' : '5'}
                      className={isStressed ? 'fill-accent-red/30 stroke-accent-red animate-pulse' : 'fill-accent-green/30 stroke-accent-green'}
                      strokeWidth="1"
                    />
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="2"
                      className={isStressed ? 'fill-accent-red animate-pulse' : 'fill-accent-green'}
                    />
                    {/* Render Mandi Labels and Live Weather badges */}
                    <text x={m.x + 7} y={m.y - 1} className="font-mono text-[5px] fill-text-2 bg-black/40 pointer-events-none select-none">
                      {m.name.replace(' Mandi', '')}
                    </text>
                    <text x={m.x + 7} y={m.y + 4.5} className="font-mono text-[4.5px] fill-accent-cyan bg-black/40 font-semibold pointer-events-none select-none">
                      {temp}°C
                    </text>
                  </g>
                )
              })}
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex gap-3 text-[9px] font-mono text-text-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-amber" />
            <span>Stressed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span>Critical</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
