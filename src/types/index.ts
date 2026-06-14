// ─── Agent Definition ───────────────────────────────────────
export type AgentName =
  | 'FlowAgent'
  | 'TradeAgent'
  | 'RiskAgent'
  | 'MacroAgent'
  | 'AgriAgent'
  | 'InfrastructureAgent'
  | 'MobilityAgent'
  | 'ClimateAgent'
  | 'MarketAgent'
  | 'CapitalAgent'

export interface AgentDetails {
  name: AgentName
  role: string
  status: 'idle' | 'active' | 'done'
  description: string
  signalsProcessed: number
  lastAction: string
  reasoningSummary: string
  confidence: number
}

// ─── SENSE / TWIN Telemetry ───────────────────────────────
export interface FreightDataPoint {
  month: string
  freightGDP: number
  rbiOfficial: number | null
}

export interface CommodityFreight {
  name: string
  current: number
  baseline: number
  sector: string
}

export interface PortTelemetry {
  id: string
  name: string
  congestionPct: number
  status: 'OPTIMAL' | 'STRESSED' | 'CRITICAL'
  dwellHours: number
  x: number
  y: number
}

export interface CorridorTelemetry {
  id: string
  name: string
  source: string
  dest: string
  utilizationPct: number
  speedKmph: number
  status: 'OPTIMAL' | 'CONGESTED' | 'DELAYED'
  pathPoints: string // SVG path string
}

export interface MandiHeatNode {
  id: string
  name: string
  state: string
  crop: string
  priceAnomalyPct: number // +% or -% deviation
  volumeTonnes: number
  x: number
  y: number
}

// ─── PRIME / Causal Reasoning Engine ──────────────────────
export interface ReasoningNode {
  id: string
  label: string
  change: string
  confidence: number
  evidence: string
  agents: AgentName[]
  status: 'pending' | 'active' | 'done'
  phase: 'Cause' | 'Transmission' | 'Sector' | 'Macro' | 'Policy'
}

export interface CausalGraph {
  nodes: ReasoningNode[]
  connections: { from: string; to: string }[]
}

// ─── SCENARIO LAB ──────────────────────────────────────────
export interface PresetShock {
  id: string
  name: string
  description: string
  oilShock: number       // % change
  portDisruption: number  // % congestion increase
  monsoonDelay: number   // % precipitation drop
  railStrike: number     // % network speed drop
  floodImpact: number    // % local shut-offs
  coalShortage: number   // % power drop
}

export interface SimulatedImpactPoint {
  month: string
  baseCase: number
  bestCase: number
  expectedCase: number
  worstCase: number
}

// ─── SITUATION ROOM & RECOMMENDATIONS ──────────────────────
export interface SovereignKPI {
  id: string
  name: string
  value: string
  change: number
  description: string
  status: 'optimal' | 'stable' | 'stressed' | 'critical'
}



export interface RecommendedAction {
  id: string
  risk: string
  recommendation: string
  costInr: number            // In Rupees
  co2SavedTonnes: number
  timeSavedHours: number
  gdpOffsetCr: number        // In Crores
  confidence: number
  riskLevel: 'HIGH' | 'MED' | 'LOW'
}

// ─── FORECAST (Chronos Outlook) ───────────────────────────
export interface ForecastMilestone {
  period: string // "7 Days" | "30 Days" | "90 Days" | "180 Days"
  inflation: string
  congestion: string
  delay: string
  price: string
  provenance: string[] // List of signals e.g. ["Freight costs +18%", ...]
  confidence: number
}

// ─── REPLAY (Historical Intelligence) ──────────────────────
export interface ReplayStep {
  day: number
  log: string
  action: string
  resolved: boolean
}

export interface ReplayEvent {
  id: string
  name: string
  description: string
  year: string
  timeline: ReplayStep[]
}

// ─── INTELLIGENCE FEED ─────────────────────────────────────
export interface IntelligenceAlert {
  id: string
  timestamp: string
  severity: 'critical' | 'warning' | 'info'
  text: string
  confidence: number
  region: string
  sector: string
}

// ─── SEVEN PROPRIETARY INDICES ─────────────────────────────
export interface IndexMetricDetail {
  id: string
  name: string
  value: number
  change: number
  methodology: string
  formula: string
  sources: string
}

// ─── App State ────────────────────────────────────────────
export interface ARTHAMState {
  activeTab: string // index, twin, prime, scenario_lab, forecast, replay, situation_room, intelligence_feed
  arthamIndex: number
  indexChange: number
  economicPulse: 'Expansion' | 'Steady' | 'Contraction' | 'Stressed'
  agentsActive: number
  signalsToday: number
  eventsTracked: number
  countriesMonitored: number
  dataSourcesCount: number
  scenariosRun: number
  activeForecasts: number
  carbonCreditsToday: number
  totalArbitrageCr: number
  lastUpdate: Date
  overallConfidence: number
}
