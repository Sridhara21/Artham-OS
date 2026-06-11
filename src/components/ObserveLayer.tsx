'use client'
import { useState } from 'react'
import { PORT_DATA, CORRIDOR_DATA, MANDI_NODES } from '@/lib/mock-data'
import { Anchor, Activity, TrendingUp, AlertOctagon, HelpCircle } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function ObserveLayer() {
  const [activeLayer, setActiveLayer] = useState<'corridors' | 'ports' | 'mandis'>('corridors')
  const [selectedNode, setSelectedNode] = useState<{ type: string; name: string; details: any } | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left controls and telemetry metrics - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">ARTHAM TWIN™</h2>
              <p className="text-[11px] text-text-3 font-mono mt-0.5">National Physical Economy Digital Twin</p>
            </div>
            <Badge variant="live" dot>LIVE TELEMETRY</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => { setActiveLayer('corridors'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                  activeLayer === 'corridors'
                    ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🔀 DEDICATED FREIGHT CORRIDORS</span>
                <Badge variant={activeLayer === 'corridors' ? 'purple' : 'ghost'}>Active</Badge>
              </button>

              <button
                onClick={() => { setActiveLayer('ports'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                  activeLayer === 'ports'
                    ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>⚓ SOVEREIGN PORTS TELEMETRY</span>
                <Badge variant={activeLayer === 'ports' ? 'cyan' : 'ghost'}>Active</Badge>
              </button>

              <button
                onClick={() => { setActiveLayer('mandis'); setSelectedNode(null) }}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                  activeLayer === 'mandis'
                    ? 'bg-accent-mint/10 border-accent-mint text-accent-mint'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🌾 AGRICULTURAL MANDI HEAT</span>
                <Badge variant={activeLayer === 'mandis' ? 'mint' : 'ghost'}>Active</Badge>
              </button>
            </div>

            <p className="text-[11px] text-text-3 leading-relaxed border-t border-border/20 pt-3">
              Abstractions highlight logistical stress points, pipeline velocity, and localized supply margins rather than cartographic street coordinates.
            </p>
          </CardBody>
        </Card>

        {/* Selected telemetry data box */}
        <Card className="flex-1">
          <CardHeader>
            <h3 className="text-xs font-bold text-text-2 uppercase tracking-widest font-mono">
              {selectedNode ? `${selectedNode.type} Details` : 'Telemetry Console'}
            </h3>
          </CardHeader>
          <CardBody className="flex flex-col justify-center min-h-[200px]">
            {selectedNode ? (
              <div className="animate-fade-rise flex flex-col gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-text-1">{selectedNode.name}</h4>
                  <p className="text-[10px] text-text-3 font-mono">{selectedNode.type === 'CORRIDOR' ? 'Infrastructure Pipeline' : 'Telemetry Node'}</p>
                </div>

                {selectedNode.type === 'PORT' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">CONGESTION LEVEL</div>
                      <div className={`text-base font-bold ${selectedNode.details.congestionPct > 70 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.congestionPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">DWELL CAPACITY</div>
                      <div className="text-base font-bold text-accent-cyan">{selectedNode.details.dwellHours} hrs</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20 flex items-center gap-2">
                      <AlertOctagon size={14} className={selectedNode.details.status === 'CRITICAL' ? 'text-accent-red' : 'text-accent-amber'} />
                      <span className="text-[10px] text-text-2 font-semibold">Status flagged as: {selectedNode.details.status}</span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'CORRIDOR' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">CAPACITY INDEX</div>
                      <div className="text-base font-bold text-accent-purple">{selectedNode.details.utilizationPct}%</div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">PIPELINE VELOCITY</div>
                      <div className="text-base font-bold text-accent-green">{selectedNode.details.speedKmph} km/h</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20">
                      <span className="text-[10px] text-text-2">Rake speed bottlenecks tracked at Dadri terminus.</span>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'MANDI' && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">PRICE ANOMALY</div>
                      <div className={`text-base font-bold ${selectedNode.details.priceAnomalyPct > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                        {selectedNode.details.priceAnomalyPct > 0 ? '+' : ''}{selectedNode.details.priceAnomalyPct}%
                      </div>
                    </div>
                    <div className="bg-black/20 p-2.5 rounded border border-border/20">
                      <div className="text-text-3 text-[9px] mb-1">DAILY VOLUME</div>
                      <div className="text-base font-bold text-text-1">{selectedNode.details.volumeTonnes} T</div>
                    </div>
                    <div className="col-span-2 bg-black/20 p-2.5 rounded border border-border/20">
                      <span className="text-[10px] text-text-2">Primary Crop: {selectedNode.details.crop} ({selectedNode.details.state})</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-text-3 font-mono text-[11px] flex flex-col items-center gap-2">
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
        <div className="absolute top-4 left-4 z-20 flex flex-col font-mono text-[10px] text-text-3 gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>GRID TELEMETRY: SYNCED</span>
          </div>
          <div>PROJECTION: Abstract Cylindrical Twin</div>
        </div>

        {/* The Map Canvas */}
        <svg
          viewBox="0 0 350 500"
          className="w-full max-w-[420px] aspect-[7/10] relative z-10 transition-all"
        >
          {/* India Stylized Polygon Base */}
          <path
            d="M 90,40 L 110,35 L 125,65 L 115,80 L 130,95 L 150,90 L 160,110 L 140,120 L 150,150 L 175,150 L 190,165 L 210,150 L 250,150 L 290,120 L 310,130 L 300,165 L 260,175 L 250,210 L 270,230 L 250,255 L 245,230 L 230,225 L 220,245 L 255,275 L 205,300 L 195,330 L 180,360 L 150,440 L 142,475 L 138,475 L 120,410 L 95,360 L 78,335 L 75,310 L 85,280 L 50,270 L 32,238 L 45,215 L 75,200 L 80,180 L 70,150 L 95,140 L 88,110 L 90,40 Z"
            fill="rgba(175, 169, 236, 0.03)"
            stroke="rgba(175, 169, 236, 0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* DFC Corridors Layer */}
          {activeLayer === 'corridors' && (
            <g className="animate-fade-rise">
              {CORRIDOR_DATA.map((c) => (
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
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              ))}
            </g>
          )}

          {/* Ports Layer */}
          {activeLayer === 'ports' && (
            <g className="animate-fade-rise">
              {PORT_DATA.map((p) => (
                <g
                  key={p.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode({ type: 'PORT', name: p.name, details: p })}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={p.congestionPct > 70 ? '10' : '6'}
                    className={p.congestionPct > 70 ? 'fill-accent-red/20 stroke-accent-red animate-pulse' : 'fill-accent-cyan/25 stroke-accent-cyan'}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    className={p.congestionPct > 70 ? 'fill-accent-red' : 'fill-accent-cyan'}
                  />
                </g>
              ))}
            </g>
          )}

          {/* Agri Mandis Layer */}
          {activeLayer === 'mandis' && (
            <g className="animate-fade-rise">
              {MANDI_NODES.map((m) => (
                <g
                  key={m.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedNode({ type: 'MANDI', name: m.name, details: m })}
                >
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="5"
                    className={m.priceAnomalyPct > 20 ? 'fill-accent-red/30 stroke-accent-red animate-pulse' : 'fill-accent-green/30 stroke-accent-green'}
                    strokeWidth="1"
                  />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r="2"
                    className={m.priceAnomalyPct > 20 ? 'fill-accent-red' : 'fill-accent-green'}
                  />
                </g>
              ))}
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
