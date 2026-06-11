'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, MapPin, Search, Shield, Activity, FileText, Sparkles,
  Bot, AlertTriangle, ShieldCheck, Zap, Coins, Globe, Landmark, Clock, ArrowRight, RefreshCw, Send, CheckCircle2
} from 'lucide-react'

import { useARTHAMStore } from '@/lib/store'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/MetricCard'

import ObserveLayer from '@/components/ObserveLayer'
import ReasonLayer from '@/components/ReasonLayer'
import PredictLayer from '@/components/PredictLayer'
import ActLayer from '@/components/ActLayer'

import { HISTORICAL_CHART_DATA, WHAT_CHANGED_TODAY, AGENTS_LIST } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const {
    activeTab, setActiveTab, arthamIndex, indexChange, economicPulse,
    agentsActive, signalsToday, carbonCreditsToday, totalArbitrageCr,
    activeGraph, executeSearch, driftIndex, searchQuery
  } = useARTHAMStore()

  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [askInput, setAskInput] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)

  // Clock ticking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }))
      setCurrentDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Live index value drift simulation
  useEffect(() => {
    const driftInterval = setInterval(() => {
      driftIndex()
    }, 5000)
    return () => clearInterval(driftInterval)
  }, [driftIndex])

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!askInput.trim()) return

    setLoadingSearch(true)
    toast.success('ARTHAM PRIME activated: Compiling causal variables.', { icon: '🧠', duration: 3000 })
    
    setTimeout(() => {
      executeSearch(askInput)
      setLoadingSearch(false)
      setAskInput('')
    }, 1500)
  }

  const triggerPresetSearch = (query: string) => {
    setLoadingSearch(true)
    toast.success('Ingesting preset query brief...', { icon: '⚡', duration: 2000 })
    setTimeout(() => {
      executeSearch(query)
      setLoadingSearch(false)
    }, 1200)
  }

  // Active agents derived from current causal step or general searching states
  const highlightedAgents = useMemo(() => {
    if (loadingSearch) {
      return AGENTS_LIST.map(a => a.name) // light up all during searching
    }
    if (activeTab === 'prime' && activeGraph) {
      // Find agents cited in the active reasoning nodes
      const agents = new Set<string>()
      activeGraph.nodes.forEach(node => {
        node.agents.forEach(agent => agents.add(agent))
      })
      return Array.from(agents)
    }
    return ['MacroAgent', 'FlowAgent', 'RiskAgent'] // default highlighted indicators
  }, [loadingSearch, activeTab, activeGraph])

  return (
    <div className="bg-grid scanline vignette min-h-screen flex flex-col font-sans select-none relative z-10 text-text-1">
      <Toaster position="bottom-right" />

      {/* TOP HEADER */}
      <nav className="h-16 border-b border-border bg-bg-base/90 backdrop-blur-xl px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-text-1 via-accent-purple to-accent-mint bg-clip-text text-transparent">
              ARTHAM OS
            </span>
            <div className="text-[9px] font-mono text-text-3 tracking-widest leading-none mt-0.5 uppercase">
              अर्थम् · India&apos;s Sovereign Physical Economy Digital Twin
            </div>
          </div>
          <div className="w-px h-8 bg-border ml-2" />
          <Badge variant="cyan" dot>Command Room</Badge>
        </div>

        {/* Real-time index value panel */}
        <div className="flex items-center gap-6">
          <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-md py-1 px-4 flex flex-col items-center shadow-inner">
            <span className="text-[9px] font-mono text-text-3 flex items-center gap-1 leading-none mb-0.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" /> Live ARTHAM Index
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold font-mono text-accent-purple leading-none">{arthamIndex}</span>
              <span className={`text-[10px] font-mono font-bold ${indexChange >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                {indexChange >= 0 ? '+' : ''}{indexChange}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-0.5">
              <span className="font-mono text-sm font-semibold tracking-wider text-text-1">{currentTime}</span>
              <Badge variant="purple">GEMINI 2.0</Badge>
            </div>
            <div className="text-[10px] text-text-3 font-mono leading-none">{currentDate}</div>
          </div>
        </div>
      </nav>

      {/* PLATFORM NAVIGATION */}
      <div className="h-12 border-b border-border bg-bg-base/60 backdrop-blur-xl px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 h-full">
          {[
            { id: 'index', label: '📊 INDEX' },
            { id: 'twin', label: '🗺️ TWIN' },
            { id: 'prime', label: '🧠 PRIME' },
            { id: 'scenario_lab', label: '🧪 SCENARIO LAB' },
            { id: 'decision_center', label: '🏛️ DECISION CENTER' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-full px-4 text-xs font-semibold tracking-wider transition-all duration-150 border-b-2 hover:text-accent-purple ${
                activeTab === tab.id
                  ? 'border-accent-purple text-accent-purple bg-accent-purple/5 font-bold'
                  : 'border-transparent text-text-3'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-text-3">
          <span>Signals Processed: {signalsToday}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border-bright" />
          <span>Carbon Minted: {carbonCreditsToday} t</span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="flex-1 p-6 overflow-y-auto bg-bg-base/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          {/* INDEX TAB (COMMAND CENTER) */}
          {activeTab === 'index' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
              {/* Header Greeting Row - 12 cols */}
              <div className="lg:col-span-12 flex flex-col gap-1.5">
                <span className="text-text-3 font-mono text-xs uppercase tracking-widest leading-none">SYSTEM TELEMETRY SUMMARY</span>
                <h1 className="text-2xl font-extrabold text-text-1">Good Morning.</h1>
              </div>

              {/* Sovereign Telemetry Metric Widgets - 12 cols */}
              <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-5 gap-3">
                <Card className="border-l-[3px] border-l-accent-purple">
                  <CardBody className="p-4 flex flex-col justify-between h-24 font-mono">
                    <span className="text-[9px] text-text-3 uppercase block leading-none">ARTHAM Index™</span>
                    <div>
                      <span className="text-2xl font-extrabold text-accent-purple leading-none">{arthamIndex}</span>
                      <span className={`text-[10px] block font-semibold ${indexChange >= 0 ? 'text-accent-green' : 'text-accent-red'} mt-1`}>
                        {indexChange >= 0 ? '▲' : '▼'} {Math.abs(indexChange)} TODAY
                      </span>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-4 flex flex-col justify-between h-24 font-mono">
                    <span className="text-[9px] text-text-3 uppercase block leading-none">Economic Activity</span>
                    <div>
                      <span className="text-2xl font-extrabold text-text-1 leading-none">+4.7%</span>
                      <span className="text-[9px] text-text-3 block mt-1">vs 12-month baseline</span>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-4 flex flex-col justify-between h-24 font-mono">
                    <span className="text-[9px] text-text-3 uppercase block leading-none">National Confidence</span>
                    <div>
                      <span className="text-2xl font-extrabold text-accent-mint leading-none">82%</span>
                      <span className="text-[9px] text-text-3 block mt-1">Sovereign stress check optimal</span>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-4 flex flex-col justify-between h-24 font-mono">
                    <span className="text-[9px] text-text-3 uppercase block leading-none">Risks Detected</span>
                    <div>
                      <span className="text-2xl font-extrabold text-accent-red leading-none">3</span>
                      <span className="text-[9px] text-accent-red block mt-1 font-semibold uppercase">Mitigations recommended</span>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-4 flex flex-col justify-between h-24 font-mono">
                    <span className="text-[9px] text-text-3 uppercase block leading-none">Opportunities</span>
                    <div>
                      <span className="text-2xl font-extrabold text-accent-green leading-none">5</span>
                      <span className="text-[9px] text-accent-green block mt-1 font-semibold uppercase">Arbitrage active</span>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Ask Artham Command Box - 8 cols */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <Card className="border-l-[3px] border-l-accent-purple shadow-glow-purple">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-accent-purple" size={14} />
                      <h2 className="text-xs font-bold text-text-1 font-mono uppercase tracking-wider">Ask ARTHAM OS — Economic Copilot</h2>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleAskSubmit} className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 text-text-3" size={16} />
                        <input
                          type="text"
                          value={askInput}
                          onChange={(e) => setAskInput(e.target.value)}
                          placeholder="e.g. How will delayed monsoons affect food inflation?"
                          className="w-full bg-black/30 border border-border/40 hover:border-border-bright focus:border-accent-purple focus:outline-none rounded pl-10 pr-4 py-2.5 text-xs text-text-1 font-mono transition-all"
                        />
                      </div>
                      <Button type="submit" variant="primary" size="sm" disabled={loadingSearch} className="px-5 font-mono text-xs">
                        {loadingSearch ? 'Querying Mesh...' : 'Query'}
                      </Button>
                    </form>

                    <div className="mt-4 border-t border-border/10 pt-3 flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-text-3 uppercase tracking-wider block mb-1">Recommended Causal Queries:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { text: "Red Sea crisis input costs", q: "How will a Red Sea disruption affect fertilizer costs in India?" },
                          { text: "Monsoon agricultural inflation", q: "How will delayed monsoons affect food inflation?" },
                          { text: "State freight bottlenecks", q: "Which state is most likely to experience freight bottlenecks?" }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => triggerPresetSearch(item.q)}
                            className="py-1 px-2.5 bg-black/20 border border-border/20 hover:border-accent-purple/35 rounded text-[10px] font-mono text-text-3 hover:text-text-1 transition-all"
                          >
                            {item.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Artham Index Historical Pulse Line Chart */}
                <Card>
                  <CardHeader>
                    <div>
                      <h3 className="text-xs font-bold text-text-1 font-mono uppercase">ARTHAM INDEX™ — S&amp;P 500 equivalent of Physical Economy</h3>
                      <p className="text-[10px] text-text-3 font-mono mt-0.5">High-frequency composite rating tracking cement, coal, agricultural yields, and ports</p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="h-48 w-full bg-black/10 rounded border border-border/20 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={HISTORICAL_CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" />
                          <YAxis domain={[65, 80]} stroke="rgba(255,255,255,0.2)" />
                          <Tooltip contentStyle={{ backgroundColor: '#03001C', borderColor: 'rgba(175,169,236,0.3)' }} />
                          <Line type="monotone" dataKey="freightGDP" stroke="#AFA9EC" strokeWidth={2.5} name="ARTHAM Index" dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          <Line type="monotone" dataKey="rbiOfficial" stroke="#9FD8C5" strokeWidth={2} strokeDasharray="5 5" name="Lagged Official Benchmark" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* What Changed Today Sidebar - 4 cols */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <Card className="flex-1">
                  <CardHeader>
                    <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">What Changed Today</h3>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-4 font-mono text-[11px] h-full justify-between pb-6">
                    <div className="flex flex-col gap-3">
                      {WHAT_CHANGED_TODAY.map((item, idx) => (
                        <div key={idx} className="p-3 bg-black/10 rounded border border-border/20 hover:border-border-bright transition-all">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-text-1">{item.label}</span>
                            <span className={`font-bold ${item.trend === 'good' ? 'text-accent-green' : item.trend === 'bad' ? 'text-accent-red' : 'text-accent-amber'}`}>
                              {item.value}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-3 leading-none">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border/10 pt-3 text-[10px] text-text-3 leading-relaxed">
                      Sovereign alerts recalculate daily at 00:00 IST using automated railway FOIS logs.
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* ACTIVE LAYER VIEWS */}
          {activeTab === 'twin' && <ObserveLayer />}
          {activeTab === 'prime' && <ReasonLayer />}
          {activeTab === 'scenario_lab' && <PredictLayer />}
          {activeTab === 'decision_center' && <ActLayer />}

        </div>
      </main>

      {/* BOTTOM PANEL: Agent Collaboration Visualizer (Economic Neural Network) */}
      <footer className="h-28 border-t border-border bg-bg-base/90 backdrop-blur-xl px-6 py-3.5 flex flex-col justify-between flex-shrink-0 relative z-20 overflow-hidden select-none">
        {/* Glowing Neural Network lines */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full">
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(175,169,236,0.3)" strokeWidth="1" strokeDasharray={loadingSearch ? "5 5" : "none"} />
            {loadingSearch && (
              <circle r="4" fill="#AFA9EC">
                <animateMotion path="M 100,50 L 1000,50" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-1.5">
            <Bot size={13} className="text-accent-purple" />
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider">Economic Neural Network — Collaborating Agents</span>
          </div>
          {loadingSearch && (
            <span className="text-[9px] font-mono text-accent-purple uppercase tracking-widest animate-pulse font-bold">Agents Exchanging Signals...</span>
          )}
        </div>

        {/* 10 Agent Nodes */}
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-2.5 z-10 relative">
          {AGENTS_LIST.map(agent => {
            const isHighlighted = highlightedAgents.includes(agent.name)
            return (
              <div
                key={agent.name}
                className={`py-1.5 px-2 rounded border font-mono text-[9px] transition-all flex flex-col justify-between h-12 ${
                  isHighlighted
                    ? 'border-accent-purple bg-accent-purple/5 shadow-glow-purple text-text-1 font-bold'
                    : 'border-border/30 bg-black/10 text-text-3'
                }`}
              >
                <div className="flex justify-between items-center leading-none">
                  <span className="truncate">{agent.name.replace('Agent', '')}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isHighlighted ? 'bg-accent-green animate-pulse' : 'bg-text-4'}`} />
                </div>
                <span className="text-[8px] text-text-3 font-medium truncate mt-1 leading-none">{agent.role}</span>
              </div>
            )
          })}
        </div>
      </footer>
    </div>
  )
}
