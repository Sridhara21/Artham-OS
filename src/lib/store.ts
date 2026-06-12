import { create } from 'zustand'
import type { ARTHAMState, CausalGraph, ReplayEvent, ReplayStep, RecommendedAction, SovereignKPI, ForecastMilestone, IntelligenceAlert } from '@/types'
import {
  REASONING_PRESETS,
  REPLAY_EVENTS,
  SOVEREIGN_RECOMMENDATIONS,
  SOVEREIGN_KPIS,
  FORECAST_DATA,
  INTELLIGENCE_FEED_SEEDS
} from './mock-data'
import { calculateConfidence, calculateRiskRadar, simulateEconomicShock } from './economic-models'

interface ARTHAMStore extends ARTHAMState {
  searchQuery: string
  activePresetShock: string | null
  activeGraph: CausalGraph | null
  
  // Intelligence Feed Live Alerts
  feedAlerts: IntelligenceAlert[]
  
  // Chronos Replay States (labeled Historical Intelligence)
  selectedReplayId: string | null
  replayPlaying: boolean
  replayCurrentDay: number
  replayLogTimeline: ReplayStep[]

  // Custom Simulator Sliders (0-100)
  oilShock: number
  portDisruption: number
  monsoonDelay: number
  railStrike: number
  floodImpact: number
  coalShortage: number

  // CMD+K Dialog Command State
  cmdKOpen: boolean

  // Demo Walkthrough States
  demoActive: boolean
  demoStage: number // 1 to 5
  demoProgress: number // 0 to 100 for visual bars

  // Generated Executive Narrative Brief
  activeBrief: string | null

  // --- NEW LIVE SOVEREIGN PIPELINE STATE ---
  connectorStates: {
    marketFeed: boolean
    newsFeed: boolean
    macroFeed: boolean
    weatherFeed: boolean
  }
  connectorLatency: {
    marketFeed: number
    newsFeed: number
    macroFeed: number
    weatherFeed: number
  }
  livePrices: {
    brentCrude: number
    brentCrudeChange: number
    sensex: number
    sensexChange: number
    usdInr: number
    usdInrChange: number
    wheat: number
    wheatChange: number
    natGas: number
    natGasChange: number
  }
  liveMacro: {
    gdpGrowth: number
    inflation: number
  }
  liveWeather: {
    nashik: number
    mundra: number
    mumbai: number
  }
  connectorLogs: string[]
  aisVessels: Array<{
    id: string
    name: string
    x: number
    y: number
    cargo: string
    speed: number
    status: string
    destination: string
    angle: number
  }>
  pipelineStatus: 'idle' | 'ingesting' | 'reasoning' | 'forecasting' | 'recommending' | 'complete'
  pipelineStep: number
  lastIngestedHeadline: string | null
  liveSignalStats: {
    totalSignals: number
    highImpact: number
    medImpact: number
    lowImpact: number
    lastUpdateTime: string
  }

  // --- NEW LIVE ACTIONS ---
  fetchLiveData: () => Promise<void>
  triggerLivePipeline: (headline: string) => Promise<void>
  updateAISVessels: () => void
  toggleConnector: (key: 'marketFeed' | 'newsFeed' | 'macroFeed' | 'weatherFeed') => void
  addConnectorLog: (log: string) => void

  // Actions
  setActiveTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  setActivePresetShock: (shockId: string | null) => void
  setCustomShockValue: (key: 'oilShock' | 'portDisruption' | 'monsoonDelay' | 'railStrike' | 'floodImpact' | 'coalShortage', val: number) => void
  resetShocks: () => void
  executeSearch: (query: string) => void
  driftIndex: () => void
  setCmdKOpen: (open: boolean) => void
  generateExecutiveBrief: () => void
  
  // Replay Actions
  selectReplayEvent: (eventId: string | null) => void
  setReplayPlaying: (playing: boolean) => void
  resetReplay: () => void
  advanceReplay: () => void

  // Demo Walkthrough actions
  startDemo: () => void
  stopDemo: () => void
  setDemoStage: (stage: number) => void
}

export const useARTHAMStore = create<ARTHAMStore>((set, get) => ({
  activeTab: 'index',
  arthamIndex: 73.4,
  indexChange: 2.1,
  economicPulse: 'Expansion',
  agentsActive: 10,
  signalsToday: 143,
  carbonCreditsToday: 8472,
  totalArbitrageCr: 847,
  lastUpdate: new Date(),
  overallConfidence: 92,

  searchQuery: '',
  activePresetShock: null,
  activeGraph: null,

  feedAlerts: INTELLIGENCE_FEED_SEEDS,

  selectedReplayId: null,
  replayPlaying: false,
  replayCurrentDay: 0,
  replayLogTimeline: [],

  oilShock: 0,
  portDisruption: 0,
  monsoonDelay: 0,
  railStrike: 0,
  floodImpact: 0,
  coalShortage: 0,

  cmdKOpen: false,

  demoActive: false,
  demoStage: 0,
  demoProgress: 0,

  activeBrief: null,

  // --- NEW LIVE STATE INITIALIZATIONS ---
  connectorStates: {
    marketFeed: true,
    newsFeed: true,
    macroFeed: true,
    weatherFeed: true
  },
  connectorLatency: {
    marketFeed: 148,
    newsFeed: 182,
    macroFeed: 95,
    weatherFeed: 52
  },
  livePrices: {
    brentCrude: 86.93,
    brentCrudeChange: 2.1,
    sensex: 75527.95,
    sensexChange: 0.3,
    usdInr: 83.42,
    usdInrChange: 0.1,
    wheat: 612.50,
    wheatChange: -0.8,
    natGas: 2.34,
    natGasChange: 1.4
  },
  liveMacro: {
    gdpGrowth: 6.5,
    inflation: 4.2
  },
  liveWeather: {
    nashik: 27.1,
    mundra: 30.3,
    mumbai: 31.2
  },
  connectorLogs: [
    '[SYSTEM] ARTHAM OS Core data connectors initialized.',
    '[SYSTEM] Ready for live signals ingestion.'
  ],
  aisVessels: [
    { id: 'v-1', name: 'Sovereign Titan', x: 22, y: 380, cargo: 'Brent Crude', speed: 18, status: 'Cruising', destination: 'Mundra Port', angle: 45 },
    { id: 'v-2', name: 'Bharat Freight V', x: 90, y: 470, cargo: 'Urea Fertilizer', speed: 14, status: 'Queueing', destination: 'JNPT (Mumbai)', angle: 10 },
    { id: 'v-3', name: 'Dharmesh Cargo', x: 190, y: 460, cargo: 'Coal', speed: 16, status: 'Cruising', destination: 'Chennai Port', angle: -20 },
    { id: 'v-4', name: 'Indian Gateway', x: 280, y: 390, cargo: 'Steel Enclosures', speed: 20, status: 'In Harbor', destination: 'Vizag Port', angle: 110 }
  ],
  pipelineStatus: 'idle',
  pipelineStep: 0,
  lastIngestedHeadline: null,
  liveSignalStats: {
    totalSignals: 143,
    highImpact: 12,
    medImpact: 41,
    lowImpact: 90,
    lastUpdateTime: 'Just now'
  },

  // --- NEW ACTIONS ---
  fetchLiveData: async () => {
    const addLog = (msg: string) => set((s) => ({ connectorLogs: [...s.connectorLogs, `[${new Date().toLocaleTimeString('en-IN')}] ${msg}`].slice(-50) }))
    addLog('Initiating synchronised fetch across live sovereign indicators...')
    
    try {
      const res = await fetch('/api/connectors')
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`)
      const data = await res.json()
      
      set((s) => {
        const latencies = {
          marketFeed: Math.round(data.latency * 0.4),
          newsFeed: Math.round(data.latency * 0.3),
          macroFeed: Math.round(data.latency * 0.2),
          weatherFeed: Math.round(data.latency * 0.1)
        }
        
        const nextLogs = [
          ...s.connectorLogs,
          `[SYNC] Sync status: OK (200)`,
          `[SYNC] Yahoo Finance ticker parsed in ${latencies.marketFeed}ms. Brent Crude: $${data.market.brentCrude.price}`,
          `[SYNC] Google News RSS wire loaded in ${latencies.newsFeed}ms. Pulled ${data.news?.length || 0} headlines.`,
          `[SYNC] World Bank database synced in ${latencies.macroFeed}ms. GDP Growth baseline: ${data.macro.gdpGrowth}%`,
          `[SYNC] Open-Meteo climatic sensors processed in ${latencies.weatherFeed}ms. Nashik temp: ${data.weather.nashik}°C`
        ]

        // Load news headlines into the main feed wire
        let updatedAlerts = [...s.feedAlerts]
        if (s.connectorStates.newsFeed && data.news && data.news.length > 0) {
          const timestampStr = new Date().toLocaleTimeString('en-IN', { hour12: false }).substring(0, 5)
          const incomingAlerts = data.news.map((item: any, idx: number) => {
            const isHigh = item.title.toLowerCase().match(/(disrupt|deficit|delay|spike|strike|crisis|congestion|clog)/)
            return {
              id: `news-${idx}-${Date.now()}`,
              timestamp: timestampStr,
              severity: isHigh ? 'critical' : 'warning',
              text: item.title,
              confidence: Math.round(89 + Math.random() * 10),
              region: item.source || 'Global Corridors',
              sector: item.title.toLowerCase().match(/(crop|mandi|wheat|tomato|onion|agricultural)/) ? 'Agriculture' : 'Trade'
            }
          })
          
          const existingTexts = new Set(s.feedAlerts.map(a => a.text))
          const newUnique = incomingAlerts.filter((a: any) => !existingTexts.has(a.text))
          updatedAlerts = [...newUnique, ...s.feedAlerts].slice(0, 30)
        }

        return {
          connectorLatency: latencies,
          connectorLogs: nextLogs.slice(-50),
          livePrices: {
            brentCrude: data.market.brentCrude.price,
            brentCrudeChange: data.market.brentCrude.pctChange,
            sensex: data.market.sensex.price,
            sensexChange: data.market.sensex.pctChange,
            usdInr: data.market.usdInr.price,
            usdInrChange: data.market.usdInr.pctChange,
            wheat: data.market.wheat.price,
            wheatChange: data.market.wheat.pctChange,
            natGas: data.market.natGas.price,
            natGasChange: data.market.natGas.pctChange
          },
          liveMacro: {
            gdpGrowth: data.macro.gdpGrowth,
            inflation: data.macro.inflation
          },
          liveWeather: {
            nashik: data.weather.nashik,
            mundra: data.weather.mundra,
            mumbai: data.weather.mumbai
          },
          feedAlerts: updatedAlerts,
          signalsToday: s.signalsToday + Math.round(Math.random() * 3),
          liveSignalStats: {
            totalSignals: s.liveSignalStats.totalSignals + Math.round(Math.random() * 3),
            highImpact: s.liveSignalStats.highImpact + (Math.random() > 0.85 ? 1 : 0),
            medImpact: s.liveSignalStats.medImpact + (Math.random() > 0.65 ? 1 : 0),
            lowImpact: s.liveSignalStats.lowImpact + (Math.random() > 0.45 ? 1 : 0),
            lastUpdateTime: 'Just now'
          }
        }
      })
    } catch (e: any) {
      console.error('Failed to sync live data:', e)
      addLog(`[ERROR] Live connector sync failed: ${e.message}. Preserving local models.`)
    }
  },

  triggerLivePipeline: async (headline) => {
    const addLog = (msg: string) => set((s) => ({ connectorLogs: [...s.connectorLogs, `[PIPELINE] ${msg}`].slice(-50) }))
    
    // Step 1: Ingestion
    set({ 
      pipelineStatus: 'ingesting', 
      pipelineStep: 1, 
      lastIngestedHeadline: headline 
    })
    addLog(`Ingesting live signal: "${headline}"`)
    
    await new Promise(r => setTimeout(r, 1200))
    
    // Step 2: Reasoning (Generate Causal Graph)
    set({ pipelineStatus: 'reasoning', pipelineStep: 2 })
    addLog(`Requesting cognitive causal compilation from PRIME reasoning engine...`)
    
    try {
      const res = await fetch('/api/agents/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: headline })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      
      const graph = data.graph || REASONING_PRESETS.index_drop
      addLog(`Causal Directed Acyclic Graph structured. ${graph.nodes.length} downstream impact nodes identified.`)
      
      set({ activeGraph: graph })
      
      await new Promise(r => setTimeout(r, 1200))
      
      // Step 3: Forecasting
      set({ pipelineStatus: 'forecasting', pipelineStep: 3 })
      addLog(`Simulating macroeconomic pass-through offsets and confidence bands...`)
      
      // If we see terms in the headline, update simulation parameters to ground them in reality
      const lower = headline.toLowerCase()
      if (lower.includes('red sea') || lower.includes('shipping') || lower.includes('freight')) {
        set({ portDisruption: 48, railStrike: 10, oilShock: 15 })
      } else if (lower.includes('monsoon') || lower.includes('rain') || lower.includes('crop') || lower.includes('deficit')) {
        set({ monsoonDelay: 35, floodImpact: 15 })
      } else if (lower.includes('strike') || lower.includes('dock') || lower.includes('worker')) {
        set({ portDisruption: 75, railStrike: 25 })
      } else {
        set({ oilShock: 20 })
      }
      
      await new Promise(r => setTimeout(r, 1200))
      
      // Step 4: Recommending (Situation Room)
      set({ pipelineStatus: 'recommending', pipelineStep: 4 })
      addLog(`Compiling executive Sovereign Action Brief for National Security advisor...`)
      
      set({ 
        pipelineStatus: 'complete', 
        pipelineStep: 5,
        activeTab: 'prime' // Auto navigate to PRIME to view graph results
      })
      addLog(`Pipeline execution finished successfully. Global indices synchronized.`)
      
      get().generateExecutiveBrief()
      
    } catch (err: any) {
      console.error(err)
      addLog(`[ERROR] Pipeline cascade failed: ${err.message}. Reverting system hooks.`)
      set({ pipelineStatus: 'idle', pipelineStep: 0 })
    }
  },

  updateAISVessels: () => {
    set((s) => {
      const updatedVessels = s.aisVessels.map(v => {
        let nextX = v.x
        let nextY = v.y
        let nextAngle = v.angle
        
        if (v.status === 'Cruising') {
          let targetX = 42
          let targetY = 240
          if (v.destination.includes('JNPT')) { targetX = 70; targetY = 340 }
          else if (v.destination.includes('Chennai')) { targetX = 140; targetY = 440 }
          else if (v.destination.includes('Vizag')) { targetX = 190; targetY = 350 }
          
          const dx = targetX - v.x
          const dy = targetY - v.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist > 6) {
            const step = 1.2
            nextX += (dx / dist) * step
            nextY += (dy / dist) * step
            nextAngle = Math.atan2(dy, dx) * (180 / Math.PI)
          } else {
            return { ...v, status: 'Queueing', speed: 0 }
          }
        } else if (v.status === 'Queueing') {
          // Circular drift around port anchorages
          const t = Date.now() / 3000
          nextX = v.x + Math.sin(t) * 0.15
          nextY = v.y + Math.cos(t) * 0.15
        }
        
        return {
          ...v,
          x: parseFloat(nextX.toFixed(2)),
          y: parseFloat(nextY.toFixed(2)),
          angle: Math.round(nextAngle)
        }
      })
      return { aisVessels: updatedVessels }
    })
  },

  toggleConnector: (key) => {
    set((s) => {
      const nextStates = { ...s.connectorStates, [key]: !s.connectorStates[key] }
      const statusLabel = nextStates[key] ? 'CONNECTED' : 'DISCONNECTED'
      const logs = [...s.connectorLogs, `[SYSTEM] Pipeline connector "${key}" set to ${statusLabel}.`]
      return { 
        connectorStates: nextStates,
        connectorLogs: logs.slice(-50)
      }
    })
  },

  addConnectorLog: (log) => {
    set((s) => ({ connectorLogs: [...s.connectorLogs, log].slice(-50) }))
  },

  // --- MAIN ACTIONS ---
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCmdKOpen: (open) => set({ cmdKOpen: open }),
  
  setActivePresetShock: (shockId) => {
    if (shockId === null) {
      set({
        activePresetShock: null,
        oilShock: 0,
        portDisruption: 0,
        monsoonDelay: 0,
        railStrike: 0,
        floodImpact: 0,
        coalShortage: 0
      })
    } else {
      set({ activePresetShock: shockId })
    }
    get().generateExecutiveBrief()
  },

  setCustomShockValue: (key, val) => {
    set((s) => ({ [key]: val, activePresetShock: null }))
    get().generateExecutiveBrief()
  },
  
  resetShocks: () => {
    set({
      activePresetShock: null,
      oilShock: 0,
      portDisruption: 0,
      monsoonDelay: 0,
      railStrike: 0,
      floodImpact: 0,
      coalShortage: 0
    })
    get().generateExecutiveBrief()
  },

  executeSearch: (query) => {
    const lower = query.toLowerCase()
    let matchedKey = 'index_drop'
    
    if (lower.includes('red sea') || lower.includes('fertilizer') || lower.includes('tomato')) {
      matchedKey = 'redsea'
    } else if (lower.includes('monsoon') || lower.includes('rain') || lower.includes('inflation')) {
      matchedKey = 'monsoon'
    } else if (lower.includes('bottleneck') || lower.includes('state') || lower.includes('delays')) {
      matchedKey = 'bottleneck'
    } else if (lower.includes('why did') || lower.includes('index fall')) {
      matchedKey = 'index_drop'
    }

    set({
      searchQuery: query,
      activeGraph: REASONING_PRESETS[matchedKey],
      activeTab: 'prime'
    })
  },

  driftIndex: () =>
    set((s) => {
      // Dynamic shift depends on custom shock values and Brent Crude Oil price
      const simulatedOilBase = s.connectorStates.marketFeed 
        ? Math.max(0, Math.round((s.livePrices.brentCrude - 80) / 80 * 100)) 
        : s.oilShock

      const sim = simulateEconomicShock(
        simulatedOilBase, 
        s.portDisruption, 
        s.monsoonDelay, 
        s.railStrike, 
        s.floodImpact, 
        s.coalShortage
      )
      const targetIndex = sim.overallIndex
      
      const delta = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1))
      const newIndex = Math.max(30, Math.min(95, parseFloat((s.arthamIndex * 0.95 + targetIndex * 0.05 + delta).toFixed(1))))
      const newChange = parseFloat((newIndex - targetIndex).toFixed(1))

      const activeShocksCount = [simulatedOilBase, s.portDisruption, s.monsoonDelay, s.railStrike, s.floodImpact, s.coalShortage].filter(v => v > 0).length
      const confidence = calculateConfidence(s.signalsToday, activeShocksCount)
      
      // Random signal generated locally if news ticker is quiet
      let updatedAlerts = [...s.feedAlerts]
      if (Math.random() > 0.9) {
        const categories: ('critical' | 'warning' | 'info')[] = ['critical', 'warning', 'info']
        const randomSeverity = categories[Math.floor(Math.random() * 3)]
        const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }).substring(0, 5)
        const sampleAlerts = [
          'Eastern DFC: Rake velocity indicators touch peak average speed (95 km/h).',
          'JNPT Port: Container stack occupancy dips to 24% baseline.',
          'Mundra Terminal: Turnaround speed indicators optimized at 32 hours.',
          'Lasalgaon Mandi: Onion crop daily supply volumes contract 12%.',
          'Visakhapatnam Port: Dry bulk custom clearance backlogs resolved.',
          'NH-48 Corridor: Heavy multi-axle logs route bypass density clearing.'
        ]
        const text = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)]
        updatedAlerts = [{
          id: `rand-${Date.now()}`,
          timestamp,
          severity: randomSeverity,
          text,
          confidence: Math.round(85 + Math.random() * 14),
          region: 'Local Hub',
          sector: 'Infrastructure'
        }, ...s.feedAlerts].slice(0, 20)
      }

      return {
        arthamIndex: newIndex,
        indexChange: newChange,
        economicPulse: newIndex > 80 ? 'Expansion' : newIndex > 72 ? 'Steady' : 'Stressed',
        signalsToday: s.signalsToday + (Math.random() > 0.8 ? 1 : 0),
        carbonCreditsToday: s.carbonCreditsToday + Math.round(Math.random() * 4),
        overallConfidence: confidence.overall,
        feedAlerts: updatedAlerts,
        lastUpdate: new Date()
      }
    }),

  generateExecutiveBrief: () => {
    const s = get()
    const simulatedOilBase = s.connectorStates.marketFeed 
      ? Math.max(0, Math.round((s.livePrices.brentCrude - 80) / 80 * 100)) 
      : s.oilShock

    const sim = simulateEconomicShock(
      simulatedOilBase, 
      s.portDisruption, 
      s.monsoonDelay, 
      s.railStrike, 
      s.floodImpact, 
      s.coalShortage
    )
    
    const brief = `### EXECUTIVE SUMMARY
The Sovereign Economic Intelligence mesh registers a **${s.economicPulse.toUpperCase()}** physical state (Index Score: **${s.arthamIndex}**). Simulated stress multipliers indicate a projected GDP shift of **${sim.gdpImpactPct}%** and inflation transmission delta of **+${sim.inflationChangePct}%** under expected shock parameters.

### SITUATION REPORT
A composite analysis of physical cargo flows, port dwell times, and mandi arrivals indicates:
- **Maritime Shipping & Port Terminals**: Coastal gate yard volumes are operating at **${sim.freightVolumeChangePct < -10 ? 'Stressed' : 'Stable'}** levels due to trade lane deviations. Mundra Port registers a yard dwell deviation of **${s.portDisruption > 0 ? `+${s.portDisruption}%` : 'nominal'}**.
- **Dedicated Corridors**: Rail freight speeds stand at **${s.railStrike > 0 ? `-${s.railStrike}%` : 'normal'}** compared to baseline schedules.
- **Agricultural Security**: Sowing area forecasts list a precipitation deficit of **${s.monsoonDelay > 0 ? `-${s.monsoonDelay}%` : 'optimal'}** in central India.

### ROOT CAUSE ANALYSIS (PRIME ATTRIBUTION)
- **Primary Cause**: ${simulatedOilBase > 0 ? `Brent Crude price pressure (+${simulatedOilBase}%) propagates energy cost adjustments.` : s.portDisruption > 0 ? 'Yard stack thresholds breached due to maritime shipping backlogs.' : 'Localized logistics bottlenecks causing transit speed degradation.'}
- **Secondary Transmission**: Energy price inflation, agricultural credit contractions, and FASTag vehicle density spillovers on arterial routes.

### PROJECTED OUTCOMES (FORECAST OUTLOOK)
- **7-30 Days**: Freight volume delta contracts by **${sim.freightVolumeChangePct}%**, pushing wholesale mandi commodity prices upward.
- **90-180 Days**: Seasonal cost indexes remain elevated. RBI repo rate updates stay vulnerable to agricultural pass-through inflation.

### RECOMMENDED SOVEREIGN ACTIONS
1. **Infrastructure Reallocations**: Divert 12% of container traffic from congested western terminals to Eastern DFC corridors.
2. **Regulatory Clearance**: Fast-track import custom clearance gate checks using advance CEPA tariff declarations.
3. **Agriculture Intervention**: Boost local fertilizer warehouse reserves by 15% to support kharif credit pipelines.

### CONFIDENCE ASSESSMENT
- **Aggregate Score**: **${s.overallConfidence}%**
- **Metrics Breakdown**: Freshness: ${Math.round(s.overallConfidence * 1.05)}% | Source Agreement: ${Math.round(s.overallConfidence * 0.95)}% | Historical Precision: High.`

    set({ activeBrief: brief })
  },

  selectReplayEvent: (eventId) => {
    if (eventId === null) {
      set({
        selectedReplayId: null,
        replayPlaying: false,
        replayCurrentDay: 0,
        replayLogTimeline: []
      })
    } else {
      const e = REPLAY_EVENTS.find(event => event.id === eventId)
      set({
        selectedReplayId: eventId,
        replayPlaying: false,
        replayCurrentDay: 1,
        replayLogTimeline: e ? [e.timeline[0]] : []
      })
    }
  },

  setReplayPlaying: (playing) => set({ replayPlaying: playing }),
  
  resetReplay: () => set((s) => {
    if (!s.selectedReplayId) return {}
    const e = REPLAY_EVENTS.find(event => event.id === s.selectedReplayId)
    return {
      replayPlaying: false,
      replayCurrentDay: 1,
      replayLogTimeline: e ? [e.timeline[0]] : []
    }
  }),

  advanceReplay: () => set((s) => {
    if (!s.selectedReplayId) return {}
    const e = REPLAY_EVENTS.find(event => event.id === s.selectedReplayId)
    if (!e) return {}
    
    const nextDay = s.replayCurrentDay + 1
    const matchingSteps = e.timeline.filter(t => t.day <= nextDay)
    
    if (nextDay > e.timeline[e.timeline.length - 1].day) {
      return { replayPlaying: false }
    }
    
    return {
      replayCurrentDay: nextDay,
      replayLogTimeline: matchingSteps
    }
  }),

  startDemo: () => {
    set({ demoActive: true, demoStage: 1, demoProgress: 0 })
    get().setActiveTab('index')
    
    set({
      oilShock: 35,
      portDisruption: 40,
      monsoonDelay: 0,
      railStrike: 10,
      floodImpact: 10,
      coalShortage: 0,
      activePresetShock: 's-oil'
    })
    get().generateExecutiveBrief()

    let progressInterval = setInterval(() => {
      const s = get()
      if (!s.demoActive) {
        clearInterval(progressInterval)
        return
      }

      if (s.demoProgress >= 100) {
        const nextStage = s.demoStage + 1
        if (nextStage > 5) {
          clearInterval(progressInterval)
          set({ demoActive: false, demoStage: 0, demoProgress: 0 })
          return
        }
        
        if (nextStage === 2) {
          set({ activeTab: 'twin' })
        } else if (nextStage === 3) {
          set({ activeTab: 'prime', activeGraph: REASONING_PRESETS['redsea'] })
        } else if (nextStage === 4) {
          set({ activeTab: 'forecast' })
        } else if (nextStage === 5) {
          set({ activeTab: 'situation_room' })
        }

        set({ demoStage: nextStage, demoProgress: 0 })
      } else {
        const duration = (s.demoStage === 1 || s.demoStage === 2 || s.demoStage === 3) ? 10000 : 15000
        const step = (100 / (duration / 200))
        set({ demoProgress: Math.min(100, s.demoProgress + step) })
      }
    }, 200);
  },

  stopDemo: () => {
    set({ demoActive: false, demoStage: 0, demoProgress: 0 })
    get().resetShocks()
  },

  setDemoStage: (stage) => set({ demoStage: stage })
}))
