'use client'
import { useState, useEffect } from 'react'
import { useARTHAMStore } from '@/lib/store'
import type { ReasoningNode } from '@/types'
import { Brain, ShieldAlert, CheckCircle2, ChevronRight, Activity, Command } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ReasonLayer() {
  const { activeGraph, executeSearch, searchQuery } = useARTHAMStore()
  const [selectedNode, setSelectedNode] = useState<ReasoningNode | null>(null)
  const [customQuery, setCustomQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleNodes, setVisibleNodes] = useState<number>(0)

  // Trigger sequential propagation lights when activeGraph loads
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
      }, 750)
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left panel: Prompt & Context Console - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-bold text-text-1">ARTHAM PRIME™</h2>
              <p className="text-[11px] text-text-3 font-mono mt-0.5">Macroeconomic Causal Reasoning Engine</p>
            </div>
            <Badge variant="cyan">REASONING ACTIVE</Badge>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleCustomSearch} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-mono text-text-3 uppercase tracking-wider block mb-1.5">Enter Causal Query</label>
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
          <CardHeader>
            <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Example Causal Presets</h3>
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
                className="w-full py-2.5 px-3 bg-black/25 border border-border/20 hover:border-accent-purple/35 rounded text-left text-[11px] font-mono text-text-2 transition-all flex items-start gap-2 group hover:text-text-1"
              >
                <ChevronRight size={12} className="text-accent-purple mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>{q}</span>
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Custom Causal Graph DAG - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[520px]">
        <CardHeader className="border-b border-border/20 pb-3">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-sm font-bold text-text-1 font-mono uppercase">Reasoning DAG Visualizer</h3>
              {searchQuery && (
                <p className="text-[10px] text-text-3 font-mono mt-0.5">Query: &quot;{searchQuery}&quot;</p>
              )}
            </div>
            <Activity className="text-accent-purple animate-pulse" size={16} />
          </div>
        </CardHeader>

        <CardBody className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-text-3 gap-3">
              <div className="flex items-center gap-1.5 py-4">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-thinking"
                    style={{ animationDelay: `${(i - 1) * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-accent-purple uppercase tracking-widest font-semibold animate-pulse">Running Neural Pipeline...</span>
              <span>Flow, Trade, Macro, and Agri agents are compiling trade parameters.</span>
            </div>
          ) : activeGraph ? (
            <>
              {/* Directed Graph Pipeline (Left) - 7 cols */}
              <div className="flex-1 flex flex-col items-center gap-2 select-none justify-center relative p-4 bg-black/10 rounded border border-border/10">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id="glowing-line" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#AFA9EC" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#67E8F9" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  {/* Causal lines sweep connection */}
                  {activeGraph.nodes.map((node, index) => {
                    if (index >= visibleNodes - 1 || index >= activeGraph.nodes.length - 1) return null
                    const fromY = 40 + index * 68
                    const toY = 40 + (index + 1) * 68
                    return (
                      <g key={`line-${index}`}>
                        <line
                          x1="50%"
                          y1={fromY + 16}
                          x2="50%"
                          y2={toY - 16}
                          stroke="url(#glowing-line)"
                          strokeWidth="2"
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

                <div className="relative z-10 w-full flex flex-col gap-5 items-center">
                  {activeGraph.nodes.map((node, index) => {
                    if (index >= visibleNodes) return null
                    const isSelected = selectedNode?.id === node.id
                    
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`w-[260px] p-2.5 bg-bg-base/90 border rounded cursor-pointer transition-all flex items-center justify-between shadow-card animate-fade-rise ${
                          isSelected
                            ? 'border-accent-purple bg-accent-purple/5 shadow-glow-purple scale-[1.02]'
                            : 'border-border/30 hover:border-border-bright'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 font-mono text-left">
                          <span className="text-[7px] text-accent-cyan font-bold tracking-widest uppercase">
                            {node.phase}
                          </span>
                          <span className="text-[10px] font-bold text-text-1 truncate max-w-[170px]">
                            {node.label}
                          </span>
                          <span className="text-[9px] text-accent-purple font-medium truncate max-w-[170px]">
                            {node.change}
                          </span>
                        </div>
                        <Badge variant={node.confidence > 90 ? 'green' : 'amber'} className="text-[8px] h-5 px-1 bg-black/40">
                          {node.confidence}%
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Node Inspector Details (Right) - 5 cols */}
              <div className="w-full lg:w-64 bg-black/25 rounded border border-border/30 p-4 flex flex-col gap-4 font-mono text-[11px] h-fit">
                {selectedNode ? (
                  <div className="animate-fade-rise flex flex-col gap-3">
                    <div className="border-b border-border/20 pb-2">
                      <span className="text-[9px] text-text-3 block uppercase">Causal State Node</span>
                      <span className="text-xs font-extrabold text-text-1 leading-tight block mt-0.5">{selectedNode.label}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-text-3 block uppercase mb-0.5">Telemetry Impact</span>
                      <span className="text-xs font-bold text-accent-purple">{selectedNode.change}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-text-3 block uppercase mb-1">Attributed Core Agents</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.agents.map((agent) => (
                          <Badge key={agent} variant="purple">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-text-3 block uppercase mb-1">Empirical Evidence log</span>
                      <p className="text-text-2 leading-relaxed bg-black/40 p-2.5 rounded border border-border/10 text-[10px]">
                        {selectedNode.evidence}
                      </p>
                    </div>

                    <div className="border-t border-border/20 pt-2 flex items-center justify-between">
                      <span className="text-[9px] text-text-3 uppercase">Causal Integrity</span>
                      <span className="font-bold text-accent-green flex items-center gap-1">
                        <CheckCircle2 size={12} /> VERIFIED
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-text-3">
                    <span>Select a step to inspect causal variables.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-3 text-xs font-mono gap-3.5">
              <Brain size={32} className="text-border-bright animate-pulse" />
              <span>Causal Reasoning Engine Idle.</span>
              <p className="text-[11px] text-center max-w-sm leading-relaxed">
                Choose an example preset or trigger a custom search in the Command Box to activate the reasoning pipeline.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
