'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, MapPin, Search, Shield, Activity, FileText, Sparkles,
  Bot, AlertTriangle, ShieldCheck, Zap, Coins, Globe, Landmark, Clock, ArrowRight, RefreshCw, Send, CheckCircle2, History, Cpu
} from 'lucide-react'

import { useARTHAMStore } from '@/lib/store'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/MetricCard'

import ObserveLayer from '@/components/ObserveLayer'
import ReasonLayer from '@/components/ReasonLayer'
import PredictLayer from '@/components/PredictLayer'
import AutopilotLayer from '@/components/AutopilotLayer'
import ChronosLayer from '@/components/ChronosLayer'
import EarthLayer from '@/components/EarthLayer'
import FinanceMonetizeLayer from '@/components/FinanceMonetizeLayer'

import { HISTORICAL_CHART_DATA, WHAT_CHANGED_TODAY, AGENTS_LIST, PROPRIETARY_INDICES_DETAILS } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const {
    activeTab, setActiveTab, arthamIndex, indexChange, economicPulse,
    signalsToday, carbonCreditsToday, activeGraph, executeSearch, driftIndex,
    selectedChronosId, chronosPlaying, advanceChronos
  } = useARTHAMStore()

  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [askInput, setAskInput] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [hoveredIndexId, setHoveredIndexId] = useState<string | null>(null)

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
    toast.success('ARTHAM PRIME: Formulating Directed Acyclic Causal Graph...', { icon: '🧠', duration: 3000 })
    
    setTimeout(() => {
      executeSearch(askInput)
      setLoadingSearch(false)
      setAskInput('')
    }, 1500)
  }

  const triggerPresetSearch = (query: string) => {
    setLoadingSearch(true)
    toast.success('Ingesting natural query into core neural engines...', { icon: '⚡', duration: 2000 })
    setTimeout(() => {
      executeSearch(query)
      setLoadingSearch(false)
    }, 1200)
  }

  // Active agents mapping derived from current tab
  const highlightedAgents = useMemo(() => {
    if (loadingSearch) {
      return AGENTS_LIST.map(a => a.name)
    }
    if (activeTab === 'prime' && activeGraph) {
      const agents = new Set<string>()
      activeGraph.nodes.forEach(node => {
        node.agents.forEach(agent => agents.add(agent))
      })
      return Array.from(agents)
    }
    if (activeTab === 'autopilot') {
      return ['FlowAgent', 'RiskAgent', 'InfrastructureAgent', 'MacroAgent']
    }
    if (activeTab === 'chronos') {
      return ['RiskAgent', 'TradeAgent', 'MacroAgent', 'ClimateAgent']
    }
    if (activeTab === 'earth') {
      return ['TradeAgent', 'FlowAgent', 'InfrastructureAgent', 'CapitalAgent']
    }
    if (activeTab === 'monetize') {
      return ['MarketAgent', 'AgriAgent', 'CapitalAgent', 'TradeAgent']
    }
    return ['MacroAgent', 'FlowAgent', 'RiskAgent']
  }, [loadingSearch, activeTab, activeGraph])

  return (
    <div className="bg-grid scanline vignette min-h-screen flex flex-col font-sans select-none relative z-10 text-text-1">
      <Toaster position="bottom-right" />

      {/* TOP NAVBAR */}
      <nav className="h-16 border-b border-border bg-bg-base/90 backdrop-blur-xl px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-text-1 via-accent-purple to-accent-mint bg-clip-text text-transparent">
              ARTHAM OS X
            </span>
            <div className="text-[9px] font-mono text-text-3 tracking-widest leading-none mt-0.5 uppercase">
              अर्थम् · Civilizational Operating System for the Physical Economy
            </div>
          </div>
          <div className="w-px h-8 bg-border ml-2" />
          <Badge variant="live" dot>GLOBAL OBSERVATORY</Badge>
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
                {indexChange >= 0 ? '▲' : '▼'} {Math.abs(indexChange)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-0.5">
              <span className="font-mono text-sm font-semibold tracking-wider text-text-1">{currentTime}</span>
              <Badge variant="cyan">SOVEREIGN V.2</Badge>
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
            { id: 'autopilot', label: '🤖 AUTOPILOT' },
            { id: 'chronos', label: '⏳ CHRONOS' },
            { id: 'earth', label: '🌐 EARTH' },
            { id: 'monetize', label: '💎 MONETIZE' },
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
          <span>Signals: {signalsToday}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-border-bright" />
          <span>Credits: {carbonCreditsToday} t</span>
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 p-6 overflow-y-auto bg-bg-base/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          {/* INDEX TAB (COMMAND CENTER WINDOW) */}
          {activeTab === 'index' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
              {/* Greeting row - 12 cols */}
              <div className="lg:col-span-12 flex flex-col gap-1.5">
                <span className="text-text-3 font-mono text-xs uppercase tracking-widest leading-none">SYSTEM TELEMETRY SUMMARY</span>
                <h1 className="text-2xl font-extrabold text-text-1">Good Morning.</h1>
              </div>

              {/* Main Metric Cards - 12 cols */}
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

              {/* Ask Artham Search & Proprietary Indices - 8 cols */}
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

                {/* Seven Proprietary Indices Grid */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xs font-bold text-text-1 font-mono uppercase">Proprietary Economic Indices HUD</h3>
                  </CardHeader>
                  <CardBody className="p-4 relative">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {PROPRIETARY_INDICES_DETAILS.map(indexItem => {
                        const isHovered = hoveredIndexId === indexItem.id
                        return (
                          <div
                            key={indexItem.id}
                            onMouseEnter={() => setHoveredIndexId(indexItem.id)}
                            onMouseLeave={() => setHoveredIndexId(null)}
                            className="p-3 bg-black/20 border border-border/25 rounded hover:border-accent-purple cursor-help transition-all relative font-mono text-[10px] flex flex-col justify-between h-20"
                          >
                            <span className="font-semibold text-text-2 truncate">{indexItem.name.replace('™', '')}</span>
                            <div className="flex justify-between items-baseline mt-2 leading-none">
                              <span className="text-base font-extrabold text-text-1">{indexItem.value}</span>
                              <span className={`text-[9px] font-bold ${indexItem.change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                {indexItem.change >= 0 ? '+' : ''}{indexItem.change}%
                              </span>
                            </div>

                            {/* Live Tooltip Popup */}
                            {isHovered && (
                              <div className="absolute bottom-full left-0 z-50 w-64 p-3 bg-bg-overlay border border-accent-purple/40 rounded shadow-glow-purple text-text-2 leading-relaxed animate-fade-rise select-none mb-1 font-mono text-[9px]">
                                <span className="font-bold text-text-1 block mb-1 uppercase text-[10px]">{indexItem.name}</span>
                                <div className="mb-1.5">{indexItem.methodology}</div>
                                <div className="bg-black/40 p-1.5 rounded border border-border/10 text-accent-purple mb-1.5 font-bold">
                                  Formula: {indexItem.formula}
                                </div>
                                <div className="text-text-3 font-semibold text-[8px]">Sources: {indexItem.sources}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Sidebar: What Changed Today - 4 cols */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* What Changed Today */}
                <Card className="h-fit">
                  <CardHeader>
                    <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">What Changed Today</h3>
                  </CardHeader>
                  <CardBody className="flex flex-col gap-3.5 font-mono text-[11px] pb-5">
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
                  </CardBody>
                </Card>

                {/* Artham Index Historical Line Chart */}
                <Card className="flex-1 min-h-[200px] flex flex-col">
                  <CardHeader className="pb-2">
                    <span className="text-[9px] font-mono text-text-3 uppercase block leading-none">Macro Historical Trend</span>
                    <span className="text-xs font-bold font-mono text-text-2 block mt-1 uppercase">ARTHAM Index (6-Month Scale)</span>
                  </CardHeader>
                  <CardBody className="p-3 flex-1 flex flex-col justify-center">
                    <div className="h-32 w-full bg-black/10 rounded border border-border/10 p-1.5">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={HISTORICAL_CHART_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" />
                          <YAxis domain={[65, 80]} stroke="rgba(255,255,255,0.15)" />
                          <Tooltip contentStyle={{ backgroundColor: '#03001C', borderColor: 'rgba(175,169,236,0.3)' }} />
                          <Line type="monotone" dataKey="freightGDP" stroke="#AFA9EC" strokeWidth={2} name="ARTHAM Index" dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* ACTIVE LAYER MOUNTING OVERLAYS */}
          {activeTab === 'twin' && <ObserveLayer />}
          {activeTab === 'prime' && <ReasonLayer />}
          {activeTab === 'scenario_lab' && <PredictLayer />}
          {activeTab === 'autopilot' && <AutopilotLayer />}
          {activeTab === 'chronos' && <ChronosLayer />}
          {activeTab === 'earth' && <EarthLayer />}
          {activeTab === 'monetize' && <FinanceMonetizeLayer />}

        </div>
      </main>

      {/* BOTTOM AGENT NETWORK COLLABORATION VISUALIZER */}
      <footer className="h-28 border-t border-border bg-bg-base/90 backdrop-blur-xl px-6 py-3.5 flex flex-col justify-between flex-shrink-0 relative z-20 overflow-hidden select-none">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full">
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(175,169,236,0.3)" strokeWidth="1" strokeDasharray={loadingSearch || chronosPlaying ? "5 5" : "none"} />
            {(loadingSearch || chronosPlaying) && (
              <circle r="4" fill="#AFA9EC">
                <animateMotion path="M 100,50 L 1000,50" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-1.5">
            <Bot size={13} className="text-accent-purple" />
            <span className="text-[10px] font-mono text-text-3 uppercase tracking-wider">Economic Neural Network — Council of Agents</span>
          </div>
          {(loadingSearch || chronosPlaying) && (
            <span className="text-[9px] font-mono text-accent-purple uppercase tracking-widest animate-pulse font-bold">Agents Negotiating Telemetry...</span>
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
