'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, Search, Activity, Sparkles, Bot, AlertTriangle, Cpu, Command, Play, Square, Award, Bell
} from 'lucide-react'

import { useARTHAMStore } from '@/lib/store'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import CommandBar from '@/components/ui/CommandBar'

import ObserveLayer from '@/components/ObserveLayer'
import ReasonLayer from '@/components/ReasonLayer'
import PredictLayer from '@/components/PredictLayer'
import ForecastLayer from '@/components/ForecastLayer'
import ReplayLayer from '@/components/ReplayLayer'
import SituationRoomLayer from '@/components/SituationRoomLayer'
import IntelligenceFeedLayer from '@/components/IntelligenceFeedLayer'
import ConnectorsLayer from '@/components/ConnectorsLayer'

import { HISTORICAL_CHART_DATA, WHAT_CHANGED_TODAY, AGENTS_LIST, PROPRIETARY_INDICES_DETAILS } from '@/lib/mock-data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const {
    activeTab, setActiveTab, arthamIndex, indexChange, economicPulse,
    signalsToday, eventsTracked, countriesMonitored, dataSourcesCount, scenariosRun, activeForecasts,
    carbonCreditsToday, activeGraph, executeSearch, driftIndex,
    overallConfidence, cmdKOpen, setCmdKOpen,
    demoActive, demoStage, demoProgress, startDemo, stopDemo,
    oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage,
    activePresetShock, setActivePresetShock,
    connectorStates, livePrices, liveMacro, liveWeather,
    pipelineStatus, pipelineStep, lastIngestedHeadline, liveSignalStats,
    fetchLiveData, updateAISVessels, feedAlerts
  } = useARTHAMStore()

  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [askInput, setAskInput] = useState('')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [hoveredIndexId, setHoveredIndexId] = useState<string | null>(null)
  const [copilotState, setCopilotState] = useState<'listening' | 'reasoning' | 'forecasting'>('listening')

  // Copilot state animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCopilotState(prev => {
        if (prev === 'listening') return 'reasoning'
        if (prev === 'reasoning') return 'forecasting'
        return 'listening'
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])


  // Clock ticks
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

  // Fetch live indicators on mount and periodic refresh
  useEffect(() => {
    fetchLiveData()
    const refreshInterval = setInterval(fetchLiveData, 15000)
    return () => clearInterval(refreshInterval)
  }, [fetchLiveData])

  // Update AIS vessel movement vectors
  useEffect(() => {
    const aisInterval = setInterval(updateAISVessels, 1000)
    return () => clearInterval(aisInterval)
  }, [updateAISVessels])

  // Live index random walk drift
  useEffect(() => {
    const driftInterval = setInterval(() => {
      if (!demoActive) driftIndex()
    }, 5000)
    return () => clearInterval(driftInterval)
  }, [driftIndex, demoActive])

  // Bind CMD+K and CTRL+K keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdKOpen(!cmdKOpen)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cmdKOpen, setCmdKOpen])

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

  // Dynamic Proprietary Indices HUD grounded in live indicators and simulation sliders
  const dynamicProprietaryIndices = useMemo(() => {
    const simulatedOilBase = connectorStates.marketFeed 
      ? Math.max(0, Math.round((livePrices.brentCrude - 80) / 80 * 100)) 
      : oilShock

    // 1. FreightGDP (id: 'idx-1'): impacted by port disruption, rail strike, sensex change
    const freightGDPVal = parseFloat((73.4 - (portDisruption * 0.08) - (railStrike * 0.06) + (livePrices.sensexChange * 0.2)).toFixed(1))
    const freightGDPChange = parseFloat((2.1 - (portDisruption * 0.04) - (railStrike * 0.03) + (livePrices.sensexChange * 0.1)).toFixed(1))

    // 2. Economic Momentum Index (id: 'idx-2'): composite tracking industrial speed shifts, cargo velocities
    const ecoMomVal = parseFloat((82.6 - (portDisruption * 0.06) - (railStrike * 0.05) - (simulatedOilBase * 0.04) + (livePrices.brentCrudeChange * 0.05)).toFixed(1))
    const ecoMomChange = parseFloat((1.8 - (portDisruption * 0.03) - (railStrike * 0.02) - (simulatedOilBase * 0.02) + (livePrices.brentCrudeChange * 0.02)).toFixed(1))

    // 3. Corridor Stress Index (id: 'idx-3'): measures speed and vehicle density degradation along Dedicated Freight Corridors
    const corrStressVal = parseFloat((12.4 + (portDisruption * 0.2) + (railStrike * 0.3) + (floodImpact * 0.15)).toFixed(1))
    const corrStressChange = parseFloat((-4.2 + (portDisruption * 0.1) + (railStrike * 0.15) + (floodImpact * 0.08)).toFixed(1))

    // 4. Supply Chain Health Score (id: 'idx-4'): lead-time predictability by evaluating transit variance and port dwell latencies
    const supplyHealthVal = parseFloat((89.5 - (portDisruption * 0.15) - (railStrike * 0.1) - (floodImpact * 0.08)).toFixed(1))
    const supplyHealthChange = parseFloat((0.4 - (portDisruption * 0.07) - (railStrike * 0.05) - (floodImpact * 0.04)).toFixed(1))

    // 5. Trade Pulse Index (id: 'idx-5'): clearance speed and export/import load scaling
    const tradePulseVal = parseFloat((71.2 - (portDisruption * 0.18) + (livePrices.usdInrChange * 0.3)).toFixed(1))
    const tradePulseChange = parseFloat((3.4 - (portDisruption * 0.09) + (livePrices.usdInrChange * 0.15)).toFixed(1))

    // 6. Infrastructure Utilization Index (id: 'idx-6'): rake loading, flat wagon deployment
    const infraUtilVal = parseFloat((64.8 - (railStrike * 0.08) - (floodImpact * 0.1) - (coalShortage * 0.05)).toFixed(1))
    const infraUtilChange = parseFloat((1.2 - (railStrike * 0.04) - (floodImpact * 0.05) - (coalShortage * 0.02)).toFixed(1))

    // 7. Commodity Velocity Score (id: 'idx-7'): velocity score of critical resource commodities across rail networks
    const commVelVal = parseFloat((85.4 - (railStrike * 0.15) - (coalShortage * 0.1)).toFixed(1))
    const commVelChange = parseFloat((2.2 - (railStrike * 0.07) - (coalShortage * 0.05)).toFixed(1))

    return PROPRIETARY_INDICES_DETAILS.map(index => {
      if (index.id === 'idx-1') return { ...index, value: freightGDPVal, change: freightGDPChange }
      if (index.id === 'idx-2') return { ...index, value: ecoMomVal, change: ecoMomChange }
      if (index.id === 'idx-3') return { ...index, value: corrStressVal, change: corrStressChange }
      if (index.id === 'idx-4') return { ...index, value: supplyHealthVal, change: supplyHealthChange }
      if (index.id === 'idx-5') return { ...index, value: tradePulseVal, change: tradePulseChange }
      if (index.id === 'idx-6') return { ...index, value: infraUtilVal, change: infraUtilChange }
      if (index.id === 'idx-7') return { ...index, value: commVelVal, change: commVelChange }
      return index
    })
  }, [oilShock, portDisruption, monsoonDelay, railStrike, floodImpact, coalShortage, livePrices, connectorStates.marketFeed])

  // Dynamic What Changed Today HUD grounded in live weather, indicators and simulation sliders
  const dynamicWhatChangedToday = useMemo(() => {
    const portCongVal = 7.2 + portDisruption * 0.24
    const portCongTrend = portCongVal > 15 ? 'bad' : portCongVal > 8 ? 'neutral' : 'good'
    
    const railThruVal = 3.1 - railStrike * 0.1 - coalShortage * 0.05
    const railThruTrend = railThruVal < 0 ? 'bad' : 'good'

    const agriGapVal = 14.8 + monsoonDelay * 0.3 + (liveWeather.nashik > 28 ? (liveWeather.nashik - 27) * 0.5 : 0)
    const agriGapTrend = agriGapVal > 25 ? 'bad' : agriGapVal > 15 ? 'neutral' : 'good'

    const pulseVal = 1.8 + livePrices.sensexChange * 0.4 - portDisruption * 0.08 - railStrike * 0.06
    const pulseTrend = pulseVal < 0.5 ? 'bad' : pulseVal < 1.5 ? 'neutral' : 'good'

    return [
      {
        label: 'Port Dwell Congestion',
        value: `${portCongVal >= 0 ? '▲' : '▼'} ${Math.abs(portCongVal).toFixed(1)}%`,
        trend: portCongTrend,
        desc: portDisruption > 40 ? 'Critical congestion at western terminals' : 'Vizag port and western gateway flow delay'
      },
      {
        label: 'Core Rail Throughput',
        value: `${railThruVal >= 0 ? '▲' : '▼'} ${Math.abs(railThruVal).toFixed(1)}%`,
        trend: railThruTrend,
        desc: railStrike > 40 ? 'Severe rake deployment slowdowns' : 'Coal and steel rake scheduling profiles'
      },
      {
        label: 'Agri Mandi Price Gap',
        value: `${agriGapVal >= 0 ? '▲' : '▼'} ${Math.abs(agriGapVal).toFixed(1)}%`,
        trend: agriGapTrend,
        desc: monsoonDelay > 30 ? 'Monsoon delay disrupting sowing inputs' : 'Nashik mandi crop supply constraints'
      },
      {
        label: 'National Economic Pulse',
        value: `${pulseVal >= 0 ? '▲' : '▼'} ${Math.abs(pulseVal).toFixed(1)}%`,
        trend: pulseTrend,
        desc: pulseVal < 0.8 ? 'Macro drag from transport capacity friction' : 'Composite physical-financial tracker'
      }
    ]
  }, [portDisruption, railStrike, coalShortage, monsoonDelay, liveWeather.nashik, livePrices.sensexChange])

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
    if (activeTab === 'situation_room') {
      return ['RiskAgent', 'MacroAgent', 'CapitalAgent']
    }
    if (activeTab === 'forecast') {
      return ['MacroAgent', 'AgriAgent', 'ClimateAgent']
    }
    if (activeTab === 'replay') {
      return ['RiskAgent', 'TradeAgent', 'MacroAgent']
    }
    if (activeTab === 'intelligence_feed') {
      return AGENTS_LIST.map(a => a.name)
    }
    return ['MacroAgent', 'FlowAgent', 'RiskAgent']
  }, [loadingSearch, activeTab, activeGraph])

  return (
    <div className="bg-grid scanline vignette min-h-screen flex flex-col font-sans select-none relative z-10 text-text-1 bg-[#03001C]">
      <Toaster position="bottom-right" />
      <CommandBar />

      {/* TOP METRIC STRIP */}
      <div className="h-10 border-b border-border bg-black/80 backdrop-blur-md text-[10px] font-mono tracking-wider px-6 flex items-center justify-between flex-shrink-0 z-30 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-text-3">ARTHAM SCORE:</span>
            <span className="text-accent-purple font-extrabold text-xs">{arthamIndex}</span>
            <span className={`font-extrabold text-[9px] ${indexChange >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {indexChange >= 0 ? '▲ +' : '▼ -'}{Math.abs(indexChange)}
            </span>
          </div>
          <div className="w-px h-3.5 bg-border/40" />
          <div className="flex items-center gap-1.5">
            <span className="text-text-3">CONFIDENCE:</span>
            <span className="text-accent-mint font-extrabold">{overallConfidence}%</span>
          </div>
          <div className="w-px h-3.5 bg-border/40" />
          <div className="flex items-center gap-1.5">
            <span className="text-text-3">RELIABILITY:</span>
            <span className="text-accent-purple font-extrabold uppercase">
              {overallConfidence >= 90 ? 'HIGH' : overallConfidence >= 75 ? 'MODERATE' : 'LOW'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-3">ACTIVE SIGNALS:</span>
          <span className="text-text-1 font-bold">{signalsToday}</span>
          <span className="text-accent-amber font-extrabold text-[9px]">+12 TODAY</span>
        </div>
      </div>

      {/* TOP GLOBAL ECONOMIC TICKER */}
      <div className="overflow-hidden w-full h-8 bg-black/60 border-b border-border/40 flex items-center select-none font-mono text-[9px] text-text-2 tracking-wider relative z-30">
        <div className="flex whitespace-nowrap animate-marquee gap-8">
          <span className="flex items-center gap-1">BRENT CRUDE <span className={`${livePrices.brentCrudeChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.brentCrude} ({livePrices.brentCrudeChange >= 0 ? '+' : ''}{livePrices.brentCrudeChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">WHEAT FUTURES <span className={`${livePrices.wheatChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.wheat} ({livePrices.wheatChange >= 0 ? '+' : ''}{livePrices.wheatChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">USD/INR <span className={`${livePrices.usdInrChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>{livePrices.usdInr} ({livePrices.usdInrChange >= 0 ? '+' : ''}{livePrices.usdInrChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">BSE SENSEX <span className={`${livePrices.sensexChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>{livePrices.sensex} ({livePrices.sensexChange >= 0 ? '+' : ''}{livePrices.sensexChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">NATURAL GAS <span className={`${livePrices.natGasChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.natGas} ({livePrices.natGasChange >= 0 ? '+' : ''}{livePrices.natGasChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">GDP GROWTH (INDIA) <span className="text-accent-green font-bold">+{liveMacro.gdpGrowth}%</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">INFLATION (CPI) <span className="text-accent-amber font-bold">+{liveMacro.inflation}%</span></span>

          {/* Duplicate for looping */}
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">BRENT CRUDE <span className={`${livePrices.brentCrudeChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.brentCrude} ({livePrices.brentCrudeChange >= 0 ? '+' : ''}{livePrices.brentCrudeChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">WHEAT FUTURES <span className={`${livePrices.wheatChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.wheat} ({livePrices.wheatChange >= 0 ? '+' : ''}{livePrices.wheatChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">USD/INR <span className={`${livePrices.usdInrChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>{livePrices.usdInr} ({livePrices.usdInrChange >= 0 ? '+' : ''}{livePrices.usdInrChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">BSE SENSEX <span className={`${livePrices.sensexChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>{livePrices.sensex} ({livePrices.sensexChange >= 0 ? '+' : ''}{livePrices.sensexChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">NATURAL GAS <span className={`${livePrices.natGasChange >= 0 ? 'text-accent-green' : 'text-accent-red'} font-bold`}>${livePrices.natGas} ({livePrices.natGasChange >= 0 ? '+' : ''}{livePrices.natGasChange}%)</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">GDP GROWTH (INDIA) <span className="text-accent-green font-bold">+{liveMacro.gdpGrowth}%</span></span>
          <span className="text-text-4">|</span>
          <span className="flex items-center gap-1">INFLATION (CPI) <span className="text-accent-amber font-bold">+{liveMacro.inflation}%</span></span>
        </div>
      </div>

      {/* GLOBAL COMMAND & INTELLIGENCE FEED STRIP */}
      <div className="h-8 border-b border-border/45 bg-black/45 backdrop-blur-md px-6 flex items-center justify-between text-[9px] font-mono select-none z-30">
        {/* Left Side: Live Intelligence Feed */}
        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
          <span className="text-accent-red font-bold flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
            INTELLIGENCE WIRE:
          </span>
          <div className="overflow-hidden relative flex-1 h-4">
            <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
              {feedAlerts.slice(0, 8).map((alert, idx) => (
                <span key={alert.id || idx} className="text-text-2">
                  <span className="text-text-3 font-semibold mr-1.5">[{alert.timestamp || '08:21'}]</span>
                  <span className="text-text-1 font-bold">{alert.text}</span>
                  <span className="text-[8px] bg-black/45 border border-border/10 text-accent-cyan ml-1.5 px-1 py-0.5 rounded uppercase">
                    {alert.sector}
                  </span>
                </span>
              ))}
              {feedAlerts.length === 0 && (
                <>
                  <span className="text-text-2"><span className="text-text-3 font-semibold">[08:21]</span> Freight anomaly detected</span>
                  <span className="text-text-2"><span className="text-text-3 font-semibold">[08:22]</span> Risk score increased</span>
                  <span className="text-text-2"><span className="text-text-3 font-semibold">[08:23]</span> Forecast updated</span>
                  <span className="text-text-2"><span className="text-text-3 font-semibold">[08:24]</span> New signal ingested</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Pulse Engine Status */}
        <div className="flex items-center gap-4 text-text-3 flex-shrink-0 font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>SIGNAL ENGINE</span>
            <span className="text-accent-green text-[7.5px]">ACTIVE</span>
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>CAUSAL ENGINE</span>
            <span className="text-accent-green text-[7.5px]">ACTIVE</span>
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>FORECAST ENGINE</span>
            <span className="text-accent-green text-[7.5px]">ACTIVE</span>
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>DECISION ENGINE</span>
            <span className="text-accent-green text-[7.5px]">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* MIDDLE LAYOUT SECTION (Sidebar + Right Content Column) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-64 border-r border-border bg-bg-base/90 backdrop-blur-xl flex flex-col justify-between flex-shrink-0 z-20">
          <div>
            {/* Command Center Branding */}
            <div className="p-4.5 border-b border-border bg-black/20">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-text-1 via-accent-purple to-accent-mint bg-clip-text text-transparent block font-heading">
                ARTHAM
              </span>
              <span className="text-[9px] font-sans text-text-3 tracking-wider leading-none mt-1 uppercase block font-semibold">
                Sovereign Economic Intelligence Platform
              </span>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="py-2.5 flex flex-col gap-0.5 px-3">
              {[
                { id: 'index', label: 'INDEX' },
                { id: 'twin', label: 'TWIN' },
                { id: 'prime', label: 'PRIME' },
                { id: 'forecast', label: 'FORECAST' },
                { id: 'scenario_lab', label: 'SCENARIO LAB' },
                { id: 'situation_room', label: 'SITUATION ROOM' },
                { id: 'replay', label: 'REPLAY' },
                { id: 'intelligence_feed', label: 'INTEL FEED' },
                { id: 'connector_hub', label: 'CONNECTOR HUB' }
              ].map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full text-left px-3.5 py-2 rounded text-xs font-bold tracking-wider transition-all duration-150 border-l-[3px] flex items-center justify-between font-heading ${
                    activeTab === tab.id
                      ? 'border-accent-purple text-accent-purple bg-accent-purple/5 font-extrabold shadow-inner'
                      : 'border-transparent text-text-3 hover:text-accent-purple hover:bg-black/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab.id ? 'bg-accent-purple animate-pulse' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Bottom Dock */}
          <div className="p-3 border-t border-border flex flex-col gap-2 bg-black/30">
            <div className="flex justify-between items-center text-[10px] text-text-3 font-sans font-medium">
              <button className="hover:text-text-1 transition-colors cursor-pointer">Settings</button>
              <button className="hover:text-text-1 transition-colors cursor-pointer">About</button>
              <span className="text-[9px] font-mono font-bold text-accent-purple/75">v2026.1</span>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT COLUMN */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* TOP HUD */}
          <header className="h-14 border-b border-border bg-bg-base/95 backdrop-blur-xl px-6 flex items-center justify-between flex-shrink-0 z-20">
            {/* Search/Copilot Box */}
            <div className="flex items-center gap-3 w-1/3">
              <Search className="text-text-3" size={14} />
              <form onSubmit={handleAskSubmit} className="flex-1">
                <input
                  type="text"
                  value={askInput}
                  onChange={(e) => setAskInput(e.target.value)}
                  placeholder="Query economic engines (CMD+K)..."
                  className="w-full bg-transparent text-xs text-text-1 font-mono focus:outline-none border-b border-transparent focus:border-border-bright pb-0.5"
                />
              </form>
            </div>

            {/* HUD Status indicators */}
            <div className="flex items-center gap-4 text-[9px] font-sans font-medium select-none">
              {/* AI Status */}
              <div className="bg-accent-purple/5 border border-accent-purple/20 rounded py-1 px-2.5 flex items-center gap-1 text-text-3 font-heading">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span>AI STATUS: <span className="text-text-1 font-mono font-bold">ACTIVE</span></span>
              </div>

              {/* Signals */}
              <div className="bg-black/20 border border-border/20 rounded py-1 px-2.5 flex items-center gap-1 text-text-3 font-heading">
                <span>SIGNALS: <span className="text-text-1 font-mono font-bold">{signalsToday} LIVE</span></span>
              </div>

              {/* System Health */}
              <div className="bg-black/20 border border-border/20 rounded py-1 px-2.5 flex items-center gap-1 text-text-3 font-heading">
                <span>HEALTH: <span className="text-accent-mint font-mono font-bold">98%</span></span>
              </div>

              {/* Data Freshness */}
              <div className="bg-black/20 border border-border/20 rounded py-1 px-2.5 flex items-center gap-1 text-text-3 font-heading">
                <span>FRESHNESS: <span className="text-text-1 font-mono font-bold">12s ago</span></span>
              </div>

              {/* Demo Mode / Active Scenario */}
              {/* Pipeline Ingestion Overlay Status */}
              {pipelineStatus !== 'idle' ? (
                <div className="bg-accent-purple/15 border border-accent-purple/40 rounded py-1 px-3 flex items-center gap-1.5 text-accent-purple animate-pulse font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                  <span>PIPELINE: <span className="font-mono">{pipelineStatus.toUpperCase()}</span> ACTIVE</span>
                </div>
              ) : (
                <div className="bg-accent-green/5 border border-accent-green/20 rounded py-1 px-3 flex items-center gap-1.5 text-accent-green/80 font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                  <span>SOVEREIGN MESH: SYNCED</span>
                </div>
              )}

              {/* Demo Mode / Active Scenario */}
              {activePresetShock ? (
                <div className="bg-accent-amber/10 border border-accent-amber/35 rounded py-1 px-3 flex items-center gap-1.5 text-accent-amber animate-pulse font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                  <span>DEMO: {activePresetShock === 's-oil' ? 'RED SEA CRISIS' : activePresetShock === 's-monsoon' ? 'MONSOON FAILURE' : activePresetShock === 's-strike' ? 'PORT STRIKE' : activePresetShock === 's-boom' ? 'EXPORT BOOM' : 'SCENARIO'} ACTIVE</span>
                </div>
              ) : demoActive ? (
                <div className="bg-accent-purple/10 border border-accent-purple/35 rounded py-1 px-3 flex items-center gap-1.5 text-accent-purple animate-pulse font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                  <span>DEMO PLAYBACK (<span className="font-mono">{Math.round(demoProgress)}%</span>)</span>
                </div>
              ) : null}

              {/* Clock */}
              <div className="text-text-1 font-bold font-mono px-2.5 py-1 bg-black/40 border border-border/20 rounded">
                {currentTime}
              </div>

              {/* Notifications bell */}
              <div className="relative text-text-3 hover:text-text-1 transition-colors cursor-pointer ml-1">
                <Bell size={14} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-red animate-pulse" />
              </div>
            </div>
          </header>

          {/* AI ASSESSMENT BANNER */}
          <section className="bg-accent-purple/5 border-b border-border px-6 py-2.5 grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0 z-10 font-sans text-[10px] select-none text-text-2">
            <div className="flex flex-col gap-1 md:border-r md:border-border/20 md:pr-4">
              <span className="text-[8px] text-text-3 uppercase tracking-wider block font-bold font-heading">Economic Status</span>
              <span className={`font-extrabold uppercase text-xs tracking-wider font-heading ${activePresetShock === 's-strike' ? 'text-accent-red' : activePresetShock === 's-monsoon' || activePresetShock === 's-oil' ? 'text-accent-amber' : 'text-accent-green'}`}>
                {activePresetShock === 's-oil' ? 'Stressed' : activePresetShock === 's-monsoon' ? 'Alert' : activePresetShock === 's-strike' ? 'Critical' : activePresetShock === 's-boom' ? 'Expansion' : 'Stable'}
              </span>
            </div>
            <div className="flex flex-col gap-1 md:border-r md:border-border/20 md:pr-4">
              <span className="text-[8px] text-text-3 uppercase tracking-wider block font-bold font-heading">Primary Risk</span>
              <span className="font-extrabold text-text-1 truncate block font-heading">
                {activePresetShock === 's-oil' ? 'Brent Crude Price Expansion' : activePresetShock === 's-monsoon' ? 'Sowing Deficits in Pulses & Oilseeds' : activePresetShock === 's-strike' ? 'JNPT & Mundra Stack Stagnation' : activePresetShock === 's-boom' ? 'Empty Wagon Imbalances' : 'Western Freight Corridor Congestion'}
              </span>
            </div>
            <div className="flex flex-col gap-1 md:border-r md:border-border/20 md:pr-4">
              <span className="text-[8px] text-text-3 uppercase tracking-wider block font-bold font-heading">Expected Impact</span>
              <span className="font-semibold text-text-2 leading-none block truncate font-heading">
                {activePresetShock === 's-oil' ? 'High logistics pass-through inflation within 15–30 days' : activePresetShock === 's-monsoon' ? 'Food price index volatility within 45–60 days' : activePresetShock === 's-strike' ? 'Component shortages in automotive hubs within 7–14 days' : activePresetShock === 's-boom' ? 'Peak ocean freight premiums within 30 days' : 'Moderate inflation pressure within 30–45 days'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-text-3 uppercase tracking-wider block font-bold font-heading">Confidence Rating</span>
              <div className="flex items-center gap-1.5 font-sans font-medium">
                <span className="text-accent-mint font-mono font-bold">{overallConfidence}%</span>
                <span className="text-[8px] text-text-3 font-normal font-heading">RELIABILITY:</span>
                <span className="text-accent-purple text-[8px] uppercase tracking-wider font-heading font-semibold">
                  {overallConfidence >= 90 ? 'HIGH' : overallConfidence >= 75 ? 'MODERATE' : 'LOW'}
                </span>
              </div>
            </div>
          </section>

          {/* ACTIVE LAYER MOUNTING OVERLAYS */}
          <main className="flex-1 p-3.5 overflow-y-auto bg-bg-base/30 relative">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              
              {/* INDEX VIEW */}
              {activeTab === 'index' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-rise">
                  <div className="lg:col-span-12 flex flex-col gap-0.5">
                    <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">INDEX // What is happening?</span>
                    <h1 className="text-lg font-extrabold text-text-1">Sovereign Command Console</h1>
                  </div>

                  {/* Top Hero Layout Segment */}
                  <div className="lg:col-span-12 grid grid-cols-1 grid-flow-row lg:grid-cols-12 gap-4">
                    {/* Left: Massive Sovereign Score Card */}
                    <div className="lg:col-span-5">
                      <Card className="border-l-[4px] border-l-accent-purple bg-gradient-to-br from-bg-overlay via-bg-base/65 to-black/80 shadow-glow-purple select-none flex flex-col justify-between h-[280px]">
                        <CardBody className="p-5 flex flex-col justify-between h-full font-sans">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] text-accent-purple font-extrabold uppercase tracking-widest font-heading">NATIONAL ECONOMIC STATUS</span>
                              <span className="text-[9.5px] text-text-3 font-semibold font-mono">REFRESH: 12S AGO</span>
                            </div>
                            <div className="flex items-baseline gap-4 mt-3">
                              <span className="text-5xl font-extrabold tracking-tight text-text-1 font-mono">{arthamIndex}</span>
                              <div className="flex flex-col">
                                <span className="text-sm font-extrabold text-accent-green uppercase tracking-wider font-heading">STABLE</span>
                                <span className="text-[9.5px] font-bold text-accent-green leading-none mt-1 font-mono">▲ +2.1 (7 Days)</span>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-6 text-[10px] text-text-2 border-t border-border/20 pt-3">
                              <div className="flex items-center gap-1.5 font-sans">
                                <span className="text-text-3 font-heading font-semibold">Confidence:</span>
                                <span className="text-accent-mint font-mono font-bold">{overallConfidence}%</span>
                              </div>
                              <div className="w-px h-3 bg-border/20" />
                              <div className="flex items-center gap-1.5 font-sans">
                                <span className="text-text-3 font-heading font-semibold">Status:</span>
                                <span className="text-accent-purple font-heading font-bold">SOVEREIGN NOMINAL</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-x-4 gap-y-2.5 border-t border-border/20 pt-4 text-[8.5px] font-sans text-text-2">
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">SIGNALS ACTIVE</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{signalsToday}</span>
                            </div>
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">EVENTS TRACKED</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{eventsTracked}</span>
                            </div>
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">COUNTRIES</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{countriesMonitored}</span>
                            </div>
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">DATA SOURCES</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{dataSourcesCount}</span>
                            </div>
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">ACTIVE FORECASTS</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{activeForecasts}</span>
                            </div>
                            <div className="flex flex-col border-b border-border/10 pb-1.5">
                              <span className="text-text-3 block text-[7.5px] uppercase font-heading font-semibold">SCENARIOS RUN</span>
                              <span className="text-text-1 font-bold text-xs mt-0.5 font-mono">{scenariosRun}</span>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Right: Copilot, Alerts and Ask panel */}
                    <div className="lg:col-span-7 flex flex-col gap-4 justify-between h-[280px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Copilot Status card */}
                        <Card className="border-l-[3px] border-l-accent-cyan bg-black/30 flex-1 flex flex-col justify-between h-[130px] font-sans">
                          <CardHeader className="pb-1.5">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[9.5px] text-accent-cyan font-bold tracking-wider font-heading">ARTHAM COPILOT STATUS</span>
                              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-ping" />
                            </div>
                          </CardHeader>
                          <CardBody className="p-4 flex flex-col justify-center gap-2">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between text-[10.5px] font-sans font-semibold">
                                <span className={`${copilotState === 'listening' ? 'text-accent-cyan font-bold' : 'text-text-4'}`}>
                                  Listening...
                                </span>
                                <span className={`${copilotState === 'reasoning' ? 'text-accent-purple font-bold' : 'text-text-4'}`}>
                                  Reasoning...
                                </span>
                                <span className={`${copilotState === 'forecasting' ? 'text-accent-mint font-bold' : 'text-text-4'}`}>
                                  Forecasting...
                                </span>
                              </div>
                              <div className="w-full h-1 bg-black/40 rounded overflow-hidden mt-1">
                                <div 
                                  className="h-full bg-accent-cyan transition-all duration-700"
                                  style={{ 
                                    width: copilotState === 'listening' ? '33.3%' : copilotState === 'reasoning' ? '66.6%' : '100%',
                                    marginLeft: copilotState === 'listening' ? '0%' : copilotState === 'reasoning' ? '33.3%' : '0%'
                                  }}
                                />
                              </div>
                            </div>
                            <span className="text-[8.5px] text-text-3 text-right block mt-1 uppercase font-heading font-medium">
                              {copilotState === 'listening' ? 'Scanning RSS Wires & Ports...' : copilotState === 'reasoning' ? 'Generating causal DAG graphs...' : 'Forecasting CPI rate transmissions...'}
                            </span>
                          </CardBody>
                        </Card>

                        {/* National Alert Feed */}
                        <Card className="h-[130px] flex flex-col justify-between">
                          <CardHeader className="pb-1.5">
                            <span className="text-[9.5px] font-heading font-bold text-text-2 uppercase">National Alert Feed</span>
                          </CardHeader>
                          <CardBody className="p-3 overflow-y-auto max-h-[86px] font-sans text-[9px] flex flex-col gap-1.5 pr-1">
                            {feedAlerts.slice(0, 4).map((alert, idx) => (
                              <div key={alert.id || idx} className="p-1.5 bg-black/20 rounded border border-border/15 flex items-center justify-between gap-2">
                                <span className="text-text-3 font-semibold font-mono flex-shrink-0">[{alert.timestamp}]</span>
                                <span className="text-text-2 font-bold truncate flex-1 font-heading">{alert.text}</span>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-accent-red animate-pulse' : 'bg-accent-amber'}`} />
                              </div>
                            ))}
                          </CardBody>
                        </Card>
                      </div>

                      {/* Ask Input bar */}
                      <Card className="border-l-[3px] border-l-accent-purple relative h-[134px]">
                        <CardBody className="p-4 flex flex-col justify-between h-full">
                          <form onSubmit={handleAskSubmit} className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-2.5 text-text-3" size={14} />
                              <input
                                type="text"
                                value={askInput}
                                onChange={(e) => setAskInput(e.target.value)}
                                placeholder="Query economic engines (e.g. How will delayed monsoons affect food inflation?)"
                                className="w-full bg-black/30 border border-border/45 hover:border-border-bright focus:border-accent-purple focus:outline-none rounded pl-9 pr-4 py-2 text-xs text-text-1 font-mono transition-all"
                              />
                            </div>
                            <Button type="submit" variant="primary" size="sm" disabled={loadingSearch} className="px-4 font-heading text-xs h-9 font-semibold">
                              {loadingSearch ? 'Querying...' : 'Query'}
                            </Button>
                          </form>

                          <div className="mt-2 flex items-center gap-1.5 font-sans text-[10px]">
                            <span className="text-text-3 uppercase tracking-wider font-semibold font-heading">Causal Queries:</span>
                            <div className="flex gap-1.5">
                              {[
                                { text: "Red Sea disruption", q: "How will a Red Sea disruption affect fertilizer costs in India?" },
                                { text: "Monsoon agricultural", q: "How will delayed monsoons affect food inflation?" }
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => triggerPresetSearch(item.q)}
                                  className="py-0.5 px-2 bg-black/20 border border-border/20 hover:border-accent-purple/35 rounded text-[9.5px] text-text-3 hover:text-text-1 font-semibold font-heading transition-all"
                                >
                                  {item.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </div>

                  {/* Seven Proprietary Indices HUD */}
                  <div className="lg:col-span-8">
                    <Card>
                      <CardHeader className="py-2.5 px-4">
                        <h3 className="text-xs font-bold text-text-1 font-heading uppercase">Proprietary Economic Indices HUD</h3>
                      </CardHeader>
                      <CardBody className="p-3.5 relative">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          {dynamicProprietaryIndices.map(indexItem => {
                            const isHovered = hoveredIndexId === indexItem.id
                            return (
                              <div
                                key={indexItem.id}
                                onMouseEnter={() => setHoveredIndexId(indexItem.id)}
                                onMouseLeave={() => setHoveredIndexId(null)}
                                className="p-3 bg-black/20 border border-border/25 rounded hover:border-accent-purple cursor-help transition-all relative font-sans text-[10px] flex flex-col justify-between h-20"
                              >
                                <span className="font-bold text-text-2 truncate font-heading">{indexItem.name.replace('™', '')}</span>
                                <div className="flex justify-between items-baseline mt-2 leading-none">
                                  <span className="text-base font-extrabold text-text-1 font-mono">{indexItem.value}</span>
                                  <span className={`text-[9px] font-bold font-mono ${indexItem.change >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                    {indexItem.change >= 0 ? '+' : ''}{indexItem.change}%
                                  </span>
                                </div>

                                {/* Live Tooltip Popup */}
                                {isHovered && (
                                  <div className="absolute bottom-full left-0 z-50 w-64 p-3 bg-bg-overlay border border-accent-purple/40 rounded shadow-glow-purple text-text-2 leading-relaxed animate-fade-rise select-none mb-1 font-sans text-[9.5px]">
                                    <span className="font-bold text-text-1 block mb-1 uppercase text-[10px] font-heading">{indexItem.name}</span>
                                    <div className="mb-1.5">{indexItem.methodology}</div>
                                    <div className="bg-black/40 p-1.5 rounded border border-border/10 text-accent-purple mb-1.5 font-bold font-mono">
                                      Formula: {indexItem.formula}
                                    </div>
                                    <div className="text-text-3 font-semibold text-[8px] font-heading">Sources: <span className="font-sans font-medium">{indexItem.sources}</span></div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Sidebar: What Changed Today & Line Chart */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    {/* Strategic Risk Monitor Card */}
                    <Card className="border-l-[3px] border-l-accent-red">
                      <CardHeader className="py-2.5 px-4">
                        <span className="text-[8px] font-heading text-accent-red font-bold uppercase tracking-wider block">Sovereign Threat Level</span>
                        <h3 className="text-xs font-bold text-text-1 font-heading uppercase mt-0.5">Strategic Risk Monitor</h3>
                      </CardHeader>
                      <CardBody className="p-3 font-sans text-[10px] flex flex-col gap-2">
                        <div className="flex justify-between items-center bg-black/25 p-1.5 rounded border border-border/10">
                          <span className="text-text-2 font-heading font-semibold">Supply Chain Risk:</span>
                          <Badge variant={portDisruption > 40 || railStrike > 40 ? 'red' : 'amber'} className="text-[7.5px] font-bold font-mono h-4">
                            {portDisruption > 40 || railStrike > 40 ? 'CRITICAL' : portDisruption > 20 || railStrike > 20 ? 'HIGH' : 'MEDIUM'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center bg-black/25 p-1.5 rounded border border-border/10">
                          <span className="text-text-2 font-heading font-semibold">Inflation Risk:</span>
                          <Badge variant={activePresetShock === 's-oil' || monsoonDelay > 40 ? 'red' : 'amber'} className="text-[7.5px] font-bold font-mono h-4">
                            {activePresetShock === 's-oil' || monsoonDelay > 40 ? 'HIGH' : 'MEDIUM'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center bg-black/25 p-1.5 rounded border border-border/10">
                          <span className="text-text-2 font-heading font-semibold">Energy Risk:</span>
                          <Badge variant={coalShortage > 50 || oilShock > 50 ? 'red' : 'amber'} className="text-[7.5px] font-bold font-mono h-4">
                            {coalShortage > 50 || oilShock > 50 ? 'CRITICAL' : coalShortage > 20 || oilShock > 20 ? 'HIGH' : 'MEDIUM'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center bg-black/25 p-1.5 rounded border border-border/10">
                          <span className="text-text-2 font-heading font-semibold">Trade Risk:</span>
                          <Badge variant={portDisruption > 40 || activePresetShock === 's-strike' ? 'red' : 'amber'} className="text-[7.5px] font-bold font-mono h-4">
                            {portDisruption > 40 || activePresetShock === 's-strike' ? 'HIGH' : 'MEDIUM'}
                          </Badge>
                        </div>
                      </CardBody>
                    </Card>

                    <Card className="h-fit">
                      <CardHeader className="py-2.5 px-4">
                        <h3 className="text-xs font-bold text-text-2 font-heading uppercase tracking-wider">What Changed Today</h3>
                      </CardHeader>
                      <CardBody className="flex flex-col gap-2 font-sans text-[10px] pb-3.5">
                        {dynamicWhatChangedToday.map((item, idx) => (
                          <div key={idx} className="p-3 bg-black/10 rounded border border-border/20 hover:border-border-bright transition-all">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-text-1 font-heading">{item.label}</span>
                              <span className={`font-bold font-mono ${item.trend === 'good' ? 'text-accent-green' : item.trend === 'bad' ? 'text-accent-red' : 'text-accent-amber'}`}>
                                {item.value}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-3 leading-none font-sans">{item.desc}</p>
                          </div>
                        ))}
                      </CardBody>
                    </Card>

                    {/* Line Chart */}
                    <Card className="flex-1 min-h-[200px] flex flex-col">
                      <CardHeader className="pb-2">
                        <span className="text-[9px] font-heading text-text-3 uppercase block leading-none font-semibold">Macro Historical Trend</span>
                        <span className="text-xs font-bold font-heading text-text-2 block mt-1 uppercase">ARTHAM Index (6-Month Scale)</span>
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

              {activeTab === 'twin' && <ObserveLayer />}
              {activeTab === 'prime' && <ReasonLayer />}
              {activeTab === 'scenario_lab' && <PredictLayer />}
              {activeTab === 'forecast' && <ForecastLayer />}
              {activeTab === 'replay' && <ReplayLayer />}
              {activeTab === 'situation_room' && <SituationRoomLayer />}
              {activeTab === 'intelligence_feed' && <IntelligenceFeedLayer />}
              {activeTab === 'connector_hub' && <ConnectorsLayer />}

            </div>
          </main>

          {/* BOTTOM CONTROL & AGENT COUNCIL TRAY */}
          <footer className="border-t border-border bg-bg-base/90 backdrop-blur-xl px-5 py-2 flex items-center justify-between gap-5 flex-shrink-0 z-20 relative overflow-hidden select-none h-24">
            {/* Left Side: Crisis Trigger Panel */}
            <div className="w-[45%] flex flex-col justify-between h-full border-r border-border/40 pr-4">
              <div className="flex items-center gap-1.5">
                <TrendingUp size={11} className="text-accent-amber" />
                <span className="text-[9px] font-heading text-text-3 uppercase tracking-wider font-semibold">Crisis Simulation Injector</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 's-oil', label: 'RED SEA CRISIS' },
                  { id: 's-monsoon', label: 'MONSOON FAILURE' },
                  { id: 's-strike', label: 'PORT STRIKE' },
                  { id: 's-boom', label: 'EXPORT BOOM' }
                ].map(shock => (
                  <button
                    key={shock.id}
                    onClick={() => {
                      if (activePresetShock === shock.id) {
                        setActivePresetShock(null)
                      } else {
                        setActivePresetShock(shock.id)
                      }
                    }}
                    className={`py-1 px-3 rounded border font-heading text-[9px] text-center font-bold tracking-wider transition-all select-none ${
                      activePresetShock === shock.id
                        ? 'border-accent-amber bg-accent-amber/15 text-accent-amber shadow-glow-amber'
                        : 'border-border/30 bg-black/20 text-text-3 hover:text-text-1 hover:border-accent-amber/40'
                    }`}
                  >
                    {shock.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Agent Council Panel */}
            <div className="flex-1 flex flex-col justify-between h-full pl-2">
              <div className="flex items-center gap-1.5">
                <Bot size={11} className="text-accent-purple" />
                <span className="text-[9px] font-heading text-text-3 uppercase tracking-wider font-semibold">ENGINE STATUS</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[
                  { name: 'SIGNAL ENGINE', desc: `${signalsToday} Signals Processed` },
                  { name: 'CAUSAL ENGINE', desc: '28 Active Graphs' },
                  { name: 'FORECAST ENGINE', desc: '64 Models Running' },
                  { name: 'DECISION ENGINE', desc: '12 Recommendations Ready' }
                ].map(eng => (
                  <div
                    key={eng.name}
                    className="py-1 px-2 rounded border border-border/20 bg-black/10 font-sans text-[8px] flex flex-col justify-between h-[40px]"
                  >
                    <div className="flex justify-between items-center leading-none">
                      <span className="text-text-2 font-bold font-sans truncate">{eng.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    </div>
                    <span className="text-text-3 mt-1 leading-none text-[7.5px] font-medium">{eng.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
