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

// ─── DECISION CENTER ───────────────────────────────────────
export type PersonaType = 'rbi' | 'railway' | 'agriculture' | 'investor'

export interface DecisionAlert {
  id: string
  title: string
  metric: string
  description: string
  recommendation: string
  confidence: number
  impact: 'HIGH' | 'MED' | 'LOW'
  expectedOutcome: string
}

// ─── App State ────────────────────────────────────────────
export interface ARTHAMState {
  activeTab: string // index, twin, prime, scenario_lab, decision_center
  arthamIndex: number
  indexChange: number
  economicPulse: 'Expansion' | 'Steady' | 'Contraction' | 'Stressed'
  agentsActive: number
  signalsToday: number
  carbonCreditsToday: number
  totalArbitrageCr: number
  lastUpdate: Date
}
