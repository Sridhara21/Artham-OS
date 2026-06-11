'use client'
import { useState } from 'react'
import { EARTH_CARGO_FLOWS } from '@/lib/mock-data'
import { Globe, Compass, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function EarthLayer() {
  const [activeFilter, setActiveFilter] = useState<'shipping' | 'energy' | 'all'>('shipping')
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(EARTH_CARGO_FLOWS[0].id)

  const selectedRoute = EARTH_CARGO_FLOWS.find(r => r.id === selectedRouteId) || EARTH_CARGO_FLOWS[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left panel controls and route logs - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="text-accent-cyan animate-spin-slow" size={14} style={{ animationDuration: '12s' }} />
              <h2 className="text-base font-bold text-text-1">ARTHAM EARTH™</h2>
            </div>
            <Badge variant="cyan">GLOBAL OBSERVER</Badge>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={() => setActiveFilter('shipping')}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                  activeFilter === 'shipping'
                    ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>🌐 GLOBAL SHIPPING ROUTES</span>
                <Badge variant={activeFilter === 'shipping' ? 'cyan' : 'ghost'}>Active</Badge>
              </button>

              <button
                onClick={() => setActiveFilter('energy')}
                className={`w-full py-2 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                  activeFilter === 'energy'
                    ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                    : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                }`}
              >
                <span>⚡ TRANS-SOVEREIGN PIPELINES</span>
                <Badge variant={activeFilter === 'energy' ? 'purple' : 'ghost'}>Active</Badge>
              </button>
            </div>

            <p className="text-[10px] text-text-3 font-mono leading-relaxed mt-4 border-t border-border/10 pt-3">
              Radar traces plot global container shipments and cargo flows across maritime checkpoints in real-time.
            </p>
          </CardBody>
        </Card>

        {/* Global Route details */}
        {selectedRoute && (
          <Card className="flex-1">
            <CardHeader>
              <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Route Telemetry Console</h3>
            </CardHeader>
            <CardBody className="flex flex-col justify-center min-h-[180px] font-mono text-[11px] leading-relaxed">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[9px] text-text-3 block uppercase leading-none">Shipping Lane</span>
                  <span className="text-xs font-extrabold text-text-1">{selectedRoute.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Cargo Class</span>
                    <span className="font-bold text-accent-cyan">{selectedRoute.cargoType}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Weekly Volume</span>
                    <span className="font-bold text-text-1">{selectedRoute.volumeKmt} KMT</span>
                  </div>
                  <div className="col-span-2 bg-black/20 p-2 rounded border border-border/10 flex items-center justify-between">
                    <span className="text-text-3 text-[8px] uppercase">Route Status</span>
                    <Badge variant={selectedRoute.status === 'congested' ? 'red' : selectedRoute.status === 'stressed' ? 'amber' : 'green'}>
                      {selectedRoute.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="bg-accent-cyan/5 border border-accent-cyan/15 rounded p-2.5 text-[10px] text-text-3 flex items-start gap-2">
                  <Compass size={12} className="text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Sourced from trans-oceanic satellite radar mapping logs.</span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Center 3D Globe Vector display - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col items-center justify-center p-6 bg-black/40 overflow-hidden relative min-h-[500px]">
        {/* Globe Header Status */}
        <div className="absolute top-4 left-4 z-20 flex flex-col font-mono text-[10px] text-text-3 gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span>GLOBAL RADAR: SCANNING</span>
          </div>
          <div>PROJECTION: Orthographic Global Mesh</div>
        </div>

        {/* Global Radar Map */}
        <div className="w-full max-w-[400px] aspect-square relative z-10 flex items-center justify-center">
          {/* Animated Globe Circles and paths */}
          <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
            {/* Outer Globe Circle representing atmosphere */}
            <circle
              cx="200"
              cy="200"
              r="170"
              fill="none"
              stroke="rgba(103, 232, 249, 0.12)"
              strokeWidth="2.5"
            />

            {/* Latitude Grid lines */}
            {[100, 150, 200, 250, 300].map((y, idx) => {
              const rx = Math.sqrt(170*170 - (y-200)*(y-200))
              return (
                <ellipse
                  key={idx}
                  cx="200"
                  cy={y}
                  rx={rx}
                  ry={rx * 0.15}
                  fill="none"
                  stroke="rgba(175, 169, 236, 0.08)"
                  strokeWidth="1"
                />
              )
            })}

            {/* Longitude rotating grids */}
            <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px', animationDuration: '40s' }}>
              <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="rgba(175, 169, 236, 0.06)" strokeWidth="1" />
              <ellipse cx="200" cy="200" rx="170" ry="120" fill="none" stroke="rgba(175, 169, 236, 0.06)" strokeWidth="1" />
              <line x1="200" y1="30" x2="200" y2="370" stroke="rgba(175, 169, 236, 0.06)" strokeWidth="1" />
              <line x1="30" y1="200" x2="370" y2="200" stroke="rgba(175, 169, 236, 0.06)" strokeWidth="1" />
            </g>

            {/* Global Trade Corridor Paths */}
            {activeFilter !== 'energy' && (
              <g>
                {EARTH_CARGO_FLOWS.map(route => {
                  const isSelected = selectedRouteId === route.id
                  return (
                    <g key={route.id} className="cursor-pointer" onClick={() => setSelectedRouteId(route.id)}>
                      {/* Halo backer path */}
                      <path
                        d={route.routePath}
                        fill="none"
                        stroke={route.status === 'congested' ? 'rgba(255,107,107,0.2)' : 'rgba(103,232,249,0.2)'}
                        strokeWidth={isSelected ? "5" : "3"}
                        strokeLinecap="round"
                      />
                      {/* Pulse path */}
                      <path
                        d={route.routePath}
                        fill="none"
                        stroke={route.status === 'congested' ? '#FF6B6B' : '#67E8F9'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="6, 6"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="80;0"
                          dur="6s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  )
                })}
              </g>
            )}

            {/* Energy Pipelines */}
            {activeFilter !== 'shipping' && (
              <g className="animate-fade-rise">
                {/* pipeline 1: Central Asia-India */}
                <path d="M 60,180 C 100,220 130,280 140,440" fill="none" stroke="#AFA9EC" strokeWidth="2.5" strokeDasharray="4, 4" />
                {/* pipeline 2: Gulf-India */}
                <path d="M 32,240 C 60,320 100,380 140,440" fill="none" stroke="#AFA9EC" strokeWidth="2.5" strokeDasharray="4, 4" />
              </g>
            )}

            {/* Global Nodes */}
            {/* Rotterdam */}
            <circle cx="30" cy="100" r="4" fill="#67E8F9" className="animate-pulse" />
            <text x="38" y="98" fill="rgba(240,238,248,0.4)" fontSize="8" fontFamily="monospace">Rotterdam</text>

            {/* Suez Canal */}
            <circle cx="60" cy="180" r="4" fill="#FFB347" className="animate-pulse" />
            <text x="68" y="178" fill="rgba(240,238,248,0.4)" fontSize="8" fontFamily="monospace">Suez</text>

            {/* JNPT (Mumbai) */}
            <circle cx="140" cy="440" r="5" fill="#67E8F9" />
            <text x="148" y="438" fill="#67E8F9" fontSize="9" fontFamily="monospace" fontWeight="bold">JNPT (India)</text>

            {/* Singapore */}
            <circle cx="320" cy="410" r="4" fill="#67E8F9" />
            <text x="328" y="408" fill="rgba(240,238,248,0.4)" fontSize="8" fontFamily="monospace">Singapore</text>

            {/* Shanghai */}
            <circle cx="330" cy="220" r="4" fill="#FF6B6B" className="animate-pulse" />
            <text x="338" y="218" fill="rgba(240,238,248,0.4)" fontSize="8" fontFamily="monospace">Shanghai</text>
          </svg>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 flex gap-3 text-[9px] font-mono text-text-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-cyan" />
            <span>Optimal Flow</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-amber" />
            <span>Stressed Queue</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <span>Congested Terminal</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
