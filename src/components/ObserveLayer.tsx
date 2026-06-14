'use client'
import { useState } from 'react'
import { PORT_DATA, CORRIDOR_DATA, MANDI_NODES } from '@/lib/mock-data'
import { Anchor, Activity, TrendingUp, AlertTriangle, HelpCircle, Ship, Sun } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useARTHAMStore } from '@/lib/store'

const STATE_BOUNDARIES = [
  { id: 'in-jk', name: 'Jammu & Kashmir & Ladakh', path: 'M 90,40 L 110,35 L 125,65 L 115,80 L 95,95 L 88,110 L 90,40 Z', region: 'North' },
  { id: 'in-pb', name: 'Punjab & Haryana & Delhi', path: 'M 88,110 L 95,95 L 115,80 L 130,95 L 140,110 L 115,120 L 95,120 L 88,110 Z', region: 'North' },
  { id: 'in-rj', name: 'Rajasthan', path: 'M 88,110 L 95,120 L 115,120 L 110,180 L 80,180 L 70,150 L 95,140 L 88,110 Z', region: 'West' },
  { id: 'in-gj', name: 'Gujarat', path: 'M 80,180 L 110,180 L 115,220 L 75,200 L 45,215 L 32,238 L 50,270 L 68,260 L 80,180 Z', region: 'West' },
  { id: 'in-up', name: 'Uttar Pradesh & Bihar', path: 'M 130,95 L 150,90 L 160,110 L 140,120 L 150,150 L 175,150 L 190,165 L 210,150 L 220,180 L 180,200 L 140,150 L 140,110 L 130,95 Z', region: 'North-Central' },
  { id: 'in-ne', name: 'Northeast States', path: 'M 210,150 L 250,150 L 290,120 L 310,130 L 300,165 L 260,175 L 250,210 L 245,185 L 210,150 Z', region: 'East' },
  { id: 'in-mp', name: 'Madhya Pradesh & Chhattisgarh', path: 'M 115,120 L 140,110 L 140,150 L 180,200 L 190,210 L 160,250 L 120,240 L 110,180 L 115,120 Z', region: 'Central' },
  { id: 'in-mh', name: 'Maharashtra', path: 'M 110,180 L 120,240 L 140,245 L 100,285 L 85,280 L 68,310 L 80,180 Z', region: 'West' },
  { id: 'in-wb', name: 'West Bengal & Odisha', path: 'M 180,200 L 220,180 L 245,185 L 250,210 L 270,230 L 275,255 L 275,265 L 255,275 L 210,300 L 180,280 L 160,250 L 190,210 L 180,200 Z', region: 'East' },
  { id: 'in-ka', name: 'Karnataka & Goa', path: 'M 68,310 L 85,280 L 100,285 L 140,245 L 150,290 L 125,350 L 95,360 L 65,335 L 68,310 Z', region: 'South' },
  { id: 'in-ap', name: 'Andhra Pradesh & Telangana', path: 'M 140,245 L 160,250 L 180,280 L 210,300 L 205,330 L 200,360 L 155,440 L 155,345 L 125,350 L 150,290 L 140,245 Z', region: 'South' },
  { id: 'in-kl', name: 'Kerala', path: 'M 95,360 L 125,350 L 130,400 L 120,410 L 95,360 Z', region: 'South' },
  { id: 'in-tn', name: 'Tamil Nadu', path: 'M 125,350 L 155,345 L 155,440 L 142,475 L 138,475 L 120,410 L 130,400 L 125,350 Z', region: 'South' }
]

export default function ObserveLayer() {
  const { 
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    aisVessels, liveWeather, connectorStates, activePresetShock
  } = useARTHAMStore()
  
  const [activeLayer, setActiveLayer] = useState<'corridors' | 'ports' | 'mandis'>('corridors')
  const [selectedNode, setSelectedNode] = useState<{ type: string; name: string; details: any } | null>(null)
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null)

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-rise select-none">
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-1.5 mb-1">
        <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">TWIN // Where is it happening?</span>
      </div>
      {/* Left controls and telemetry metrics - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <Card>
          <CardHeader className="py-2.5 px-4">
            <div>
              <h2 className="text-sm font-bold text-text-1">ARTHAM TWIN™</h2>
              <p className="text-[10px] text-text-3 font-sans mt-0.5">National Physical Economy Digital Twin</p>
            </div>
            <Badge variant="live" dot>LIVE FLOWS</Badge>
          </CardHeader>
          <CardBody className="font-sans p-4">
            <div className="flex flex-col gap-1.5 mb-3">
              <button
                onClick={() => { setActiveLayer('corridors'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-[11px] font-semibold border transition-all flex items-center justify-between ${
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
                className={`w-full py-2 px-3 rounded text-left text-[11px] font-semibold border transition-all flex items-center justify-between ${
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
                className={`w-full py-2 px-3 rounded text-left text-[11px] font-semibold border transition-all flex items-center justify-between ${
                  activeLayer === 'mandis'
                    ? 'bg-accent-mint/10 border-accent-mint text-accent-mint'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🌾 COMMODITY MARKET FLOWS</span>
                <Badge variant={activeLayer === 'mandis' ? 'mint' : 'ghost'}>Active</Badge>
              </button>
            </div>

            <p className="text-[9.5px] text-text-3 leading-relaxed border-t border-border/20 pt-2.5">
              This layout charts physical trade corridor utilization, maritime shipping lanes, and localized mandi prices to represent real-time economic health. Click states on the map for regional status.
            </p>
          </CardBody>
        </Card>

        {/* Selected telemetry data box */}
        <Card className="flex-1">
          <CardHeader className="py-2.5 px-4">
            <h3 className="text-[11px] font-semibold text-text-2 uppercase tracking-widest font-heading">
              {selectedNode ? `${selectedNode.type} Details` : 'Telemetry Console'}
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col justify-center min-h-[190px] p-4 font-sans text-xs">
            {selectedNode ? (
              <div className="animate-fade-rise flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-text-1 font-heading">{selectedNode.name}</h4>
                  <p className="text-[8.5px] text-text-3 font-heading uppercase tracking-wide">{selectedNode.type === 'CORRIDOR' ? 'Infrastructure Pipeline' : selectedNode.type === 'STATE' ? 'Regional Economy' : 'Telemetry Node'}</p>
                </div>

                {selectedNode.type === 'STATE' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">REGIONAL HEALTH</div>
                      <div className={`text-sm font-semibold font-mono ${selectedNode.details.status === 'CRITICAL' ? 'text-accent-red animate-pulse' : selectedNode.details.status === 'STRESSED' ? 'text-accent-amber' : 'text-accent-green'}`}>
                        {selectedNode.details.economicHealth}
                      </div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">REGION ZONE</div>
                      <div className="text-sm font-semibold text-accent-cyan truncate">{selectedNode.details.region}</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2 rounded border border-border/20">
                      <span className="text-[9px] text-text-2 font-heading">Primary Sector: <span className="font-sans font-medium text-text-1">{selectedNode.details.primaryIndustry}</span></span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'PORT' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">CONGESTION LEVEL</div>
                      <div className={`text-sm font-semibold font-mono ${selectedNode.details.congestionPct > 70 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.congestionPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">DWELL CAPACITY</div>
                      <div className="text-sm font-semibold font-mono text-accent-cyan">{selectedNode.details.dwellHours} hrs</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2 rounded border border-border/20 flex items-center gap-2">
                      <AlertTriangle size={12} className={selectedNode.details.status === 'CRITICAL' ? 'text-accent-red animate-pulse' : 'text-accent-amber'} />
                      <span className="text-[9px] text-text-2 font-heading">Status flagged as: <span className={`font-semibold ${selectedNode.details.status === 'CRITICAL' ? 'text-accent-red' : 'text-accent-amber'}`}>{selectedNode.details.status}</span></span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'CORRIDOR' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">CAPACITY INDEX</div>
                      <div className="text-sm font-semibold font-mono text-accent-purple">{selectedNode.details.utilizationPct}%</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">PIPELINE VELOCITY</div>
                      <div className="text-sm font-semibold font-mono text-accent-green">{selectedNode.details.speedKmph} km/h</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-[8px] text-text-3 uppercase font-semibold font-heading mb-0.5 tracking-wider">Downstream Risk Attribute</div>
                      <span className={`text-[9.5px] font-semibold font-heading ${selectedNode.details.utilizationPct > 80 ? 'text-accent-red' : 'text-accent-green'}`}>
                        RISK PROFILE: {selectedNode.details.utilizationPct > 80 ? 'ELEVATED' : 'MINIMAL'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'MANDI' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">PRICE ANOMALY</div>
                      <div className={`text-sm font-semibold font-mono ${selectedNode.details.priceAnomalyPct > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.priceAnomalyPct > 0 ? '+' : ''}{selectedNode.details.priceAnomalyPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2 rounded border border-border/20">
                      <div className="text-text-3 text-[8px] mb-1 font-heading uppercase tracking-wider">DAILY VOLUME</div>
                      <div className="text-sm font-semibold font-mono text-text-1">{selectedNode.details.volumeTonnes} T</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2 rounded border border-border/20">
                      <span className="text-[9.5px] text-text-2 font-heading">Primary Crop: <span className="font-semibold text-text-1">{selectedNode.details.crop} ({selectedNode.details.state})</span></span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-text-3 text-[9.5px] flex flex-col items-center gap-1.5 font-sans">
                <HelpCircle size={16} className="text-text-3" />
                <span>Select a state, corridor, or node on the map to stream telemetry logs.</span>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Map display panel - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col items-center justify-center p-4 bg-black/40 overflow-hidden relative min-h-[440px]">
        {/* Map Header Status */}
        <div className="absolute top-4 left-4 z-20 flex flex-col font-sans text-[9px] text-text-3 gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span className="font-heading font-semibold text-text-1">ECONOMIC FLOW LAYER ACTIVE</span>
          </div>
          <div>PROJECTION: Abstract Cylindrical Twin Map</div>
        </div>

        {/* The Map Canvas */}
        <svg
          viewBox="0 0 350 500"
          className="w-full max-w-[390px] aspect-[7/10] relative z-10 transition-all select-none"
        >
          {/* India National Boundary Outline */}
          <path
            d="M 90,40 L 110,35 L 125,65 L 115,80 L 130,95 L 150,90 L 160,110 L 140,120 L 150,150 L 175,150 L 190,165 L 210,150 L 250,150 L 290,120 L 310,130 L 300,165 L 260,175 L 250,210 L 270,230 L 275,255 L 275,265 L 255,275 L 210,300 L 205,330 L 200,360 L 155,440 L 142,475 L 138,475 L 120,410 L 95,360 L 65,335 L 68,310 L 85,280 L 50,270 L 32,238 L 45,215 L 75,200 L 80,180 L 70,150 L 95,140 L 88,110 L 90,40 Z"
            fill="none"
            stroke="rgba(175, 169, 236, 0.35)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="pointer-events-none"
          />
          {/* State Boundaries Overlay */}
          <g>
            {STATE_BOUNDARIES.map((state) => {
              const isHovered = hoveredStateId === state.id
              // Determine regional economic health based on state/region and active shocks
              let healthStatus = 'OPTIMAL'
              let highlightColor = 'rgba(175, 169, 236, 0.18)' // standard default
              if (state.id === 'in-gj' && portDisruption > 40) {
                healthStatus = 'CRITICAL'
                highlightColor = 'rgba(255, 107, 107, 0.35)'
              } else if (state.id === 'in-mh' && portDisruption > 20) {
                healthStatus = 'STRESSED'
                highlightColor = 'rgba(255, 179, 71, 0.28)'
              } else if (state.id === 'in-up' && monsoonDelay > 40) {
                healthStatus = 'STRESSED'
                highlightColor = 'rgba(255, 179, 71, 0.28)'
              } else if (state.id === 'in-ap' && railStrike > 40) {
                healthStatus = 'CRITICAL'
                highlightColor = 'rgba(255, 107, 107, 0.35)'
              }
              
              return (
                <path
                  key={state.id}
                  d={state.path}
                  fill={isHovered ? 'rgba(175, 169, 236, 0.12)' : 'rgba(175, 169, 236, 0.02)'}
                  stroke={isHovered ? 'rgba(175, 169, 236, 0.60)' : highlightColor}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  strokeLinejoin="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredStateId(state.id)}
                  onMouseLeave={() => setHoveredStateId(null)}
                  onClick={() => {
                    setSelectedNode({
                      type: 'STATE',
                      name: state.name,
                      details: {
                        region: state.region,
                        status: healthStatus,
                        economicHealth: healthStatus === 'OPTIMAL' ? '98%' : healthStatus === 'STRESSED' ? '82%' : '64%',
                        primaryIndustry: state.region === 'West' ? 'Heavy Manufacturing & Shipping' : state.region === 'South' ? 'Agri-trade & Tech Hubs' : 'Wheat & Pulses Cultivation'
                      }
                    })
                  }}
                />
              )
            })}
          </g>
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
                  {/* Moving cargo corridor particle overlay */}
                  <circle r="2.5" fill={c.status === 'CONGESTED' ? '#FF6B6B' : '#9FD8C5'}>
                    <animateMotion
                      dur={c.status === 'CONGESTED' ? '12s' : '6s'}
                      repeatCount="indefinite"
                      path={c.pathPoints}
                    />
                  </circle>
                  {/* Second staggered particle overlay */}
                  <circle r="1.5" fill={c.status === 'CONGESTED' ? '#FF6B6B' : '#9FD8C5'} opacity="0.6">
                    <animateMotion
                      dur={c.status === 'CONGESTED' ? '12s' : '6s'}
                      begin="3s"
                      repeatCount="indefinite"
                      path={c.pathPoints}
                    />
                  </circle>
                </g>
              ))}

              {/* Economic meaning overlays directly on map */}
              <g className="fill-text-2 pointer-events-none select-none text-[6.5px]">
                <text x="50" y="150" fill={dynamicCorridors[0].utilizationPct > 80 ? '#FF6B6B' : '#AFA9EC'} className="font-heading font-semibold">
                  WESTERN DFC: <tspan className="font-mono">{dynamicCorridors[0].utilizationPct}%</tspan> | {dynamicCorridors[0].utilizationPct > 80 ? 'ELEVATED RISK' : 'MINIMAL'}
                </text>
                <text x="145" y="110" fill={dynamicCorridors[1].utilizationPct > 70 ? '#FF6B6B' : '#AFA9EC'} className="font-heading font-semibold">
                  EASTERN DFC: <tspan className="font-mono">{dynamicCorridors[1].utilizationPct}%</tspan> | {dynamicCorridors[1].utilizationPct > 70 ? 'STRESSED' : 'MINIMAL'}
                </text>
                <text x="100" y="390" fill="#AFA9EC" className="font-heading font-semibold">
                  SOUTHERN ROAD CORRIDOR: <tspan className="font-mono">{dynamicCorridors[2].utilizationPct}%</tspan>
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
                  <text x={v.x + 6} y={v.y + 1} className="font-sans text-[5px] fill-text-3 font-semibold pointer-events-none select-none">
                    {v.name} ({v.cargo})
                  </text>
                  {/* Floating load indicators and risk status tags */}
                  <text x={v.x + 6} y={v.y + 6} className="font-mono text-[4px] fill-accent-cyan font-semibold pointer-events-none select-none">
                    Container Vol: {v.id === 'v-1' ? '+14%' : v.id === 'v-2' ? '+8%' : '+11%'} | Risk: {v.id === 'v-1' ? 'MEDIUM' : 'LOW'}
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
                    <text x={p.x + 7} y={p.y + 2.5} className="font-heading text-[5.5px] fill-accent-cyan font-bold">
                      {p.id} (<tspan className="font-mono font-semibold">{p.congestionPct}%</tspan>)
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
                    <text x={m.x + 7} y={m.y - 1} className="font-sans text-[5.5px] fill-text-2 font-medium pointer-events-none select-none">
                      {m.name.replace(' Mandi', '')}
                    </text>
                    <text x={m.x + 7} y={m.y + 4.5} className="font-mono text-[4.5px] fill-accent-cyan font-semibold pointer-events-none select-none">
                      {temp}°C
                    </text>
                  </g>
                )
              })}
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex gap-3 text-[9px] font-sans font-medium text-text-3">
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
