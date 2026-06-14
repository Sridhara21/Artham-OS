'use client'
import { useState, useEffect } from 'react'
import { useARTHAMStore } from '@/lib/store'
import type { ReasoningNode } from '@/types'
import { Brain, ShieldAlert, CheckCircle2, ChevronRight, Activity, Database, FileText, CheckCircle, X } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Traceability sources dictionary mapping node IDs to empirical credentials
const NODE_SOURCES: Record<string, Array<{ source: string, confidence: number, status: string }>> = {
  n1: [
    { source: 'AIS Maritime Vessel Transponders', confidence: 99, status: 'VERIFIED' },
    { source: 'Reuters Geopolitical intelligence desk', confidence: 94, status: 'VERIFIED' }
  ],
  n2: [
    { source: 'Drewry East-West Container Freight Index', confidence: 96, status: 'VERIFIED' },
    { source: 'Shanghai Containerized Freight Index', confidence: 91, status: 'CALIBRATED' }
  ],
  n3: [
    { source: 'Visakhapatnam Customs CBIC manifests', confidence: 93, status: 'VERIFIED' },
    { source: 'Ministry of Fertilizers daily dispatch reports', confidence: 89, status: 'CALIBRATED' }
  ],
  n4: [
    { source: 'NAFED Buffer stocks registers', confidence: 91, status: 'VERIFIED' },
    { source: 'IFFCO Dealer Network inventory registers', confidence: 86, status: 'ACTIVE' }
  ],
  n5: [
    { source: 'Lasalgaon Mandi Onion Price registers', confidence: 95, status: 'VERIFIED' },
    { source: 'Agmarknet national pricing database', confidence: 91, status: 'VERIFIED' }
  ],
  m1: [
    { source: 'Indian Meteorological Department (IMD)', confidence: 98, status: 'VERIFIED' },
    { source: 'INSAT Satellite Soil Moisture Scan data', confidence: 93, status: 'ACTIVE' }
  ],
  m2: [
    { source: 'State agricultural crop coverage reports', confidence: 92, status: 'VERIFIED' },
    { source: 'FASAL satellite imagery analysis models', confidence: 89, status: 'CALIBRATED' }
  ],
  m3: [
    { source: 'Agmarknet daily mandi arrivals list', confidence: 94, status: 'VERIFIED' },
    { source: 'National cold chain capacity registries', confidence: 90, status: 'VERIFIED' }
  ],
  m4: [
    { source: 'Wholesale Price Index (WPI) food basket', confidence: 96, status: 'VERIFIED' },
    { source: 'DFPD Retail price monitoring cell', confidence: 91, status: 'VERIFIED' }
  ],
  m5: [
    { source: 'RBI Monetary Policy Committee Minutes', confidence: 99, status: 'VERIFIED' },
    { source: 'NSO high-frequency industrial growth model', confidence: 94, status: 'VERIFIED' }
  ],
  b1: [
    { source: 'Port PCS Community gate telemetry', confidence: 97, status: 'VERIFIED' },
    { source: 'JNPT terminal yard container stack RFID', confidence: 94, status: 'ACTIVE' }
  ],
  b2: [
    { source: 'Indian Railways FOIS rake scheduler', confidence: 96, status: 'VERIFIED' },
    { source: 'CONCOR wagon allocation registry', confidence: 91, status: 'CALIBRATED' }
  ],
  b3: [
    { source: 'NHAI FASTag toll volume registers', confidence: 98, status: 'VERIFIED' },
    { source: 'Google Maps traffic speed index API', confidence: 92, status: 'ACTIVE' }
  ],
  b4: [
    { source: 'SIAM Supplier stock levels tracker', confidence: 92, status: 'VERIFIED' },
    { source: 'Gurugram industrial buffer registries', confidence: 89, status: 'CALIBRATED' }
  ],
  b5: [
    { source: 'Index of Industrial Production (IIP) logs', confidence: 97, status: 'VERIFIED' },
    { source: 'MoSPI macro index forecasting models', confidence: 94, status: 'VERIFIED' }
  ]
}

export default function ReasonLayer() {
  const { activeGraph, executeSearch, searchQuery } = useARTHAMStore()
  const [selectedNode, setSelectedNode] = useState<ReasoningNode | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [customQuery, setCustomQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number>(0)

  // Trigger sequential propagation animation when activeGraph loads
  useEffect(() => {
    if (activeGraph) {
      setSelectedNode(activeGraph.nodes[0])
      setVisibleNodes(0)
      const interval = setInterval(() => {
        setVisibleNodes((prev) => {
          if (prev < activeGraph.nodes.length) {
            return prev + 1
          } else {
            clearInterval(interval)
            return prev
          }
        })
      }, 600)
      return () => clearInterval(interval)
    }
  }, [activeGraph])

  const handlePresetSearch = (query: string) => {
    setLoading(true)
    setTimeout(() => {
      executeSearch(query)
      setLoading(false)
    }, 1200)
  }

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customQuery.trim()) return
    setLoading(true)
    setTimeout(() => {
      executeSearch(customQuery)
      setLoading(false)
    }, 1500)
  }

  const handleNodeClick = (node: ReasoningNode) => {
    setSelectedNode(node)
    setDrawerOpen(true)
  }

  // Fallback sources generator if dynamic nodes don't have matching key
  const getSourcesForNode = (node: ReasoningNode) => {
    const key = node.id
    if (NODE_SOURCES[key]) return NODE_SOURCES[key]
    
    // Generates a mock public source based on phase
    return [
      { source: `${node.phase === 'Cause' ? 'Reuters Trade Index' : 'World Bank Data Mesh'}`, confidence: Math.round(90 + Math.random() * 8), status: 'VERIFIED' },
      { source: `National statistical indicators database`, confidence: Math.round(84 + Math.random() * 10), status: 'ACTIVE' }
    ]
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise relative select-none">
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-2 mb-2">
        <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">PRIME // Why is it happening?</span>
      </div>
      
      {/* Left panel: Prompt & Context Console - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5 animate-fade-rise">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">ARTHAM PRIME™</h2>
              <p className="text-[11px] text-text-3 font-sans mt-0.5">Macroeconomic Causal Reasoning Engine</p>
            </div>
            <Badge variant="purple">COGNITIVE ENGINE</Badge>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCustomSearch} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-heading font-semibold text-text-3 uppercase tracking-wider block mb-1.5">Enter Causal Query</label>
                <textarea
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. How will delayed monsoons affect CPI food inflation?"
                  className="w-full h-24 bg-black/30 border border-border/40 hover:border-border-bright focus:border-accent-purple focus:outline-none rounded p-3 text-xs text-text-1 font-mono resize-none leading-relaxed transition-all placeholder-text-4"
                />
              </div>
              <Button type="submit" variant="primary" disabled={loading} className="w-full text-xs font-semibold py-2">
                {loading ? 'Synthesizing Causal Chain...' : 'Activate Reasoning Engine'}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Suggestion Presets */}
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-xs font-bold text-text-2 font-heading uppercase tracking-wider">Example Causal Presets</h3>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            {[
              "How will a Red Sea disruption affect fertilizer costs in India?",
              "How will delayed monsoons affect food inflation?",
              "Which state is most likely to experience freight bottlenecks?",
              "Why did the ARTHAM Index fall today?"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => { setCustomQuery(q); handlePresetSearch(q) }}
                disabled={loading}
                className="w-full py-2.5 px-3 bg-black/25 border border-border/20 hover:border-accent-purple/35 rounded text-left text-[11px] font-sans text-text-2 transition-all flex items-start gap-2 group hover:text-text-1"
              >
                <ChevronRight size={12} className="text-accent-purple mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>{q}</span>
              </button>
            ))}
          </CardBody>
        </Card>

        {/* Top System Drivers Card */}
        <Card className="border-l-[3px] border-l-accent-purple shadow-glow-purple">
          <CardHeader className="pb-1.5">
            <span className="text-[8.5px] font-heading text-accent-purple font-semibold uppercase tracking-wider block">Real-time Causal Priorities</span>
            <h3 className="text-xs font-bold text-text-1 font-heading uppercase mt-0.5">Top System Drivers</h3>
          </CardHeader>
          <CardBody className="p-3.5 font-sans text-[10px] flex flex-col gap-2.5">
            {[
              { name: 'Red Sea Disruption', impact: 91, confidence: 98, strength: '94%' },
              { name: 'Brent Crude Spike', impact: 83, confidence: 92, strength: '88%' },
              { name: 'Port Congestion', impact: 76, confidence: 91, strength: '79%' },
              { name: 'Weather Risk', impact: 72, confidence: 90, strength: '68%' },
              { name: 'USD Volatility', impact: 68, confidence: 89, strength: '72%' }
            ].map((driver, idx) => (
              <div key={idx} className="flex flex-col gap-1 bg-black/25 p-2 rounded border border-border/10">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-heading font-semibold text-text-2">{idx + 1}. {driver.name}</span>
                  <Badge variant={driver.impact > 80 ? 'red' : driver.impact > 70 ? 'amber' : 'ghost'} className="text-[8px] font-mono font-medium h-4.5">
                    IMPACT: {driver.impact}
                  </Badge>
                </div>
                <div className="flex justify-between text-[8px] text-text-3 mt-0.5">
                  <span>CONFIDENCE: <span className="text-accent-mint font-mono font-semibold">{driver.confidence}%</span></span>
                  <span>TRANSMISSION STRENGTH: <span className="text-accent-cyan font-mono font-semibold">{driver.strength}</span></span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Causal Graph Visualizer - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[520px] relative overflow-hidden">
        
        {/* PRIME active banner ribbon */}
        <div className="bg-accent-purple/15 border-b border-accent-purple/20 px-6 py-2 flex flex-wrap items-center justify-between font-sans text-[9px] text-accent-purple select-none font-semibold gap-y-2">
          <div className="flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-accent-purple rounded-full" />
            <span className="font-heading">PRIME ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-accent-purple/85 text-[8.5px] font-sans">
            <span><span className="font-mono">847</span> SIGNALS ANALYSED</span>
            <span className="text-border/20">|</span>
            <span><span className="font-mono">126</span> CAUSAL RELATIONSHIPS</span>
            <span className="text-border/20">|</span>
            <span><span className="font-mono">31</span> SECONDARY EFFECTS</span>
            <span className="text-border/20">|</span>
            <span>CONFIDENCE <span className="font-mono">92%</span></span>
          </div>
          <Badge variant="purple" className="text-[7.5px] font-mono font-medium px-1 h-3.5 leading-none">AGENT COUNCIL</Badge>
        </div>

        <CardHeader className="border-b border-border/20 pb-3">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-sm font-bold text-text-1 font-heading uppercase">Causal Reasoning Graph (DAG)</h3>
              {searchQuery && (
                <p className="text-[10px] text-text-3 font-mono mt-0.5">Query: &quot;{searchQuery}&quot;</p>
              )}
            </div>
            <Activity className="text-accent-purple animate-pulse" size={16} />
          </div>
        </CardHeader>

        <CardBody className="flex-1 p-6 flex items-center justify-center relative bg-black/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center font-mono text-xs text-text-3 gap-3">
              <div className="flex items-center gap-1.5 py-4">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-thinking"
                    style={{ animationDelay: `${(i - 1) * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-accent-purple uppercase tracking-widest font-bold animate-pulse">Running Causal Matrix...</span>
              <span>Flow, Trade, Macro, and Agri agents are compiling trade parameters.</span>
            </div>
          ) : activeGraph ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center py-4">
              
              {/* Connection curves background */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#AFA9EC" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.8} />
                  </linearGradient>
                  <marker id="causalArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#AFA9EC" />
                  </marker>
                </defs>
                {activeGraph.nodes.map((node, index) => {
                  if (index >= visibleNodes - 1 || index >= activeGraph.nodes.length - 1) return null
                  const fromY = 32 + index * 74
                  const toY = 32 + (index + 1) * 74
                  return (
                    <g key={`line-${index}`}>
                      <line
                        x1="50%"
                        y1={fromY + 18}
                        x2="50%"
                        y2={toY - 18}
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        markerEnd="url(#causalArrow)"
                        strokeDasharray="4 4"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="40;0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </line>
                    </g>
                  )
                })}
              </svg>

              {/* Node stack */}
              <div className="relative z-10 w-full flex flex-col gap-6 items-center">
                {activeGraph.nodes.map((node, index) => {
                  if (index >= visibleNodes) return null
                  const isSelected = selectedNode?.id === node.id
                  const isHigh = node.confidence > 90

                  const getClassification = (idx: number) => {
                    switch (idx) {
                      case 0:
                        return { label: 'ROOT CAUSE', color: 'text-accent-red border-accent-red/30 bg-accent-red/5' }
                      case 1:
                        return { label: 'INTERMEDIATE DRIVER', color: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5' }
                      case 2:
                        return { label: 'ECONOMIC EFFECT', color: 'text-accent-purple border-accent-purple/30 bg-accent-purple/5' }
                      case 3:
                        return { label: 'PROPAGATION CONTEXT', color: 'text-accent-pink border-accent-pink/30 bg-accent-pink/5' }
                      case 4:
                      default:
                        return { label: 'STRATEGIC OUTCOME', color: 'text-accent-green border-accent-green/30 bg-accent-green/5' }
                    }
                  }

                  const classInfo = getClassification(index);
                  
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node)}
                      className={`w-[290px] p-3 bg-bg-base/95 border rounded cursor-pointer transition-all flex items-center justify-between shadow-card animate-fade-rise ${
                        isSelected
                          ? 'border-accent-purple bg-accent-purple/5 shadow-glow-purple scale-[1.02]'
                          : isHigh 
                          ? 'border-accent-mint/35 hover:border-accent-mint hover:shadow-glow-mint'
                          : 'border-border/30 hover:border-accent-purple/40'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className={`text-[7.5px] font-semibold tracking-widest uppercase font-heading ${classInfo.color.split(' ')[0]}`}>
                          {classInfo.label}
                        </span>
                        <span className="text-[10px] font-semibold text-text-1 truncate max-w-[200px] font-heading">
                          {node.label}
                        </span>
                        <span className="text-[9px] text-accent-purple font-medium truncate max-w-[200px]">
                          {node.change}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                        <Badge variant={isHigh ? 'green' : 'amber'} className="text-[8px] h-4.5 px-1 bg-black/40 font-mono">
                          {node.confidence}%
                        </Badge>
                        <span className="text-[6px] text-text-3 font-semibold uppercase tracking-wider">CONFIDENCE</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Slide-out Evidence Drawer (Traceability panel) overlay inside card */}
              {selectedNode && (
                <div className={`absolute top-0 right-0 h-full w-[260px] bg-bg-overlay/95 backdrop-blur-xl border-l border-border/40 shadow-glow-purple p-4 z-30 transition-transform duration-300 ${
                  drawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                  <div className="flex justify-between items-center border-b border-border/20 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Database className="text-accent-purple" size={13} />
                      <span className="font-semibold text-text-1 uppercase tracking-wide font-heading">Evidence Drawer</span>
                    </div>
                    <button 
                      onClick={() => setDrawerOpen(false)}
                      className="text-text-3 hover:text-text-1 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex flex-col gap-3 font-sans">
                    <div>
                      <span className="text-[8px] text-text-3 block uppercase font-heading tracking-wider">Causal State Node</span>
                      <span className="text-xs font-semibold text-text-1 mt-0.5 leading-snug block font-heading">{selectedNode.label}</span>
                    </div>

                    <div>
                      <span className="text-[8px] text-text-3 block uppercase font-heading tracking-wider">Telemetry Shift Impact</span>
                      <span className="text-xs font-semibold text-accent-purple mt-0.5 block font-heading">{selectedNode.change}</span>
                    </div>

                    <div>
                      <span className="text-[8px] text-text-3 block uppercase font-heading tracking-wider mb-1">Attributed Signatures</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.agents.map((agent) => (
                          <Badge key={agent} variant="purple" className="text-[8px] px-1 py-0.5 font-mono">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-text-3 block uppercase font-heading tracking-wider mb-1">Empirical Evidence Log</span>
                      <p className="text-text-2 leading-relaxed bg-black/45 p-2.5 rounded border border-border/10 text-[9.5px]">
                        {selectedNode.evidence}
                      </p>
                    </div>

                    {/* Confidence Decomposition */}
                    <div className="bg-black/45 p-2.5 rounded border border-border/10 text-[9.5px] flex flex-col gap-1.5">
                      <span className="text-[8px] text-text-3 block uppercase font-semibold font-heading tracking-wider">Confidence Decomposition</span>
                      <div className="flex justify-between">
                        <span className="text-text-3">Data Quality:</span>
                        <span className="font-semibold text-accent-green font-mono">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-3">Signal Agreement:</span>
                        <span className="font-semibold text-accent-cyan font-mono">91%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-3">Forecast Stability:</span>
                        <span className="font-semibold text-accent-purple font-mono">89%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-3">Model Confidence:</span>
                        <span className="font-semibold text-accent-amber font-mono">{selectedNode.confidence}%</span>
                      </div>
                      <div className="w-full h-px bg-border/25 my-0.5" />
                      <div className="flex justify-between font-semibold text-text-1">
                        <span>Final Confidence:</span>
                        <span className="text-accent-mint font-mono">{selectedNode.confidence}%</span>
                      </div>
                    </div>

                    {/* Dynamic Source lists - answers "How do you know this?" */}
                    <div>
                      <span className="text-[8px] text-text-3 block uppercase mb-1.5 font-semibold font-heading tracking-wider">Evidence Validation Sources</span>
                      <div className="flex flex-col gap-1.5">
                        {getSourcesForNode(selectedNode).map((src, sIdx) => (
                          <div key={sIdx} className="bg-black/25 p-2 rounded border border-border/15 flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-2 text-[9px] font-heading">{src.source}</span>
                              <span className="text-[7px] text-text-3 mt-0.5 font-mono">STATUS: {src.status}</span>
                            </div>
                            <Badge variant={src.confidence > 90 ? 'green' : 'amber'} className="text-[8px] px-1 py-0 h-4 font-mono">
                              {src.confidence}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[9px]">
                      <span className="text-text-3 uppercase font-heading tracking-wider">Causal Integrity</span>
                      <span className="font-semibold text-accent-green flex items-center gap-1">
                        <CheckCircle2 size={11} /> VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-text-3 text-xs font-mono gap-3.5 py-16 text-center">
              <Brain size={32} className="text-border-bright animate-pulse" />
              <span>Causal Reasoning Engine Idle.</span>
              <p className="text-[11px] max-w-sm leading-relaxed text-text-3">
                Choose an example preset or trigger a custom search in the Command Box to activate the reasoning pipeline.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
      
    </div>
  )
}
