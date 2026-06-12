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
  signalsToday: 847,
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
      // Dynamic shift depends on custom shock values
      const sim = simulateEconomicShock(s.oilShock, s.portDisruption, s.monsoonDelay, s.railStrike, s.floodImpact, s.coalShortage)
      const targetIndex = sim.overallIndex
      
      const delta = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1))
      const newIndex = Math.max(30, Math.min(95, parseFloat((s.arthamIndex * 0.9 + targetIndex * 0.1 + delta).toFixed(1))))
      const newChange = parseFloat((newIndex - targetIndex).toFixed(1))

      const activeShocksCount = [s.oilShock, s.portDisruption, s.monsoonDelay, s.railStrike, s.floodImpact, s.coalShortage].filter(v => v > 0).length
      const confidence = calculateConfidence(s.signalsToday, activeShocksCount)
      
      // Seed a random live alert sometimes
      let updatedAlerts = [...s.feedAlerts]
      if (Math.random() > 0.85) {
        const categories: ('critical' | 'warning' | 'info')[] = ['critical', 'warning', 'info']
        const randomSeverity = categories[Math.floor(Math.random() * 3)]
        const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false }).substring(0, 5)
        const sampleAlerts = [
          'Eastern Corridor: Rake scheduling backlogs cleared.',
          'JNPT Port: FASTag road density dips below baseline.',
          'Mundra Terminal: Turnaround speed indicators optimal.',
          'Lasalgaon Mandi: Onion crop volume arrivals expand +6.4% YoY.',
          'Visakhapatnam: Customs processing dwell hours decrease past baseline.',
          'NH-48 Corridor: Heavy logistics bypass congestion detected.'
        ]
        const text = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)]
        updatedAlerts = [{
          id: `rand-${Date.now()}`,
          timestamp,
          severity: randomSeverity,
          text,
          confidence: Math.round(85 + Math.random() * 14),
          region: 'Grid Corridor',
          sector: 'Logistics'
        }, ...s.feedAlerts].slice(0, 20)
      }

      return {
        arthamIndex: newIndex,
        indexChange: newChange,
        economicPulse: newIndex > 80 ? 'Expansion' : newIndex > 72 ? 'Steady' : 'Stressed',
        signalsToday: s.signalsToday + (Math.random() > 0.6 ? 1 : 0),
        carbonCreditsToday: s.carbonCreditsToday + Math.round(Math.random() * 4),
        overallConfidence: confidence.overall,
        feedAlerts: updatedAlerts,
        lastUpdate: new Date()
      }
    }),

  generateExecutiveBrief: () => {
    const s = get()
    const sim = simulateEconomicShock(s.oilShock, s.portDisruption, s.monsoonDelay, s.railStrike, s.floodImpact, s.coalShortage)
    
    const brief = `### EXECUTIVE SUMMARY
The Sovereign Economic Intelligence mesh registers a **${s.economicPulse.toUpperCase()}** physical state (Index Score: **${s.arthamIndex}**). Simulated stress multipliers indicate a projected GDP shift of **${sim.gdpImpactPct}%** and inflation transmission delta of **+${sim.inflationChangePct}%** under expected shock parameters.

### SITUATION REPORT
A composite analysis of physical cargo flows, port dwell times, and mandi arrivals indicates:
- **Maritime Shipping & Port Terminals**: Coastal gate yard volumes are operating at **${sim.freightVolumeChangePct < -10 ? 'Stressed' : 'Stable'}** levels due to trade lane deviations. Mundra Port registers a yard dwell deviation of **${s.portDisruption > 0 ? `+${s.portDisruption}%` : 'nominal'}**.
- **Dedicated Corridors**: Rail freight speeds stand at **${s.railStrike > 0 ? `-${s.railStrike}%` : 'normal'}** compared to baseline schedules.
- **Agricultural Security**: Sowing area forecasts list a precipitation deficit of **${s.monsoonDelay > 0 ? `-${s.monsoonDelay}%` : 'optimal'}** in central India.

### ROOT CAUSE ANALYSIS (PRIME ATTRIBUTION)
- **Primary Cause**: ${s.oilShock > 0 ? `Brent Crude price pressure (+${s.oilShock}%) propagates energy cost adjustments.` : s.portDisruption > 0 ? 'Yard stack thresholds breached due to maritime shipping backlogs.' : 'Localized logistics bottlenecks causing transit speed degradation.'}
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
    
    // Inject Red Sea Presets into sliders
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
        
        // Stage Switch Triggers
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
        // Stage timings:
        // Stage 1 (10s), Stage 2 (10s), Stage 3 (10s), Stage 4 (15s), Stage 5 (15s)
        const duration = (s.demoStage === 1 || s.demoStage === 2 || s.demoStage === 3) ? 10000 : 15000
        const step = (100 / (duration / 200)) // 200ms ticks
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
