import type {
  CommodityFreight, PortTelemetry, CorridorTelemetry, MandiHeatNode,
  CausalGraph, PresetShock, DecisionAlert, AgentDetails, FreightDataPoint
} from '@/types'

// ─── 10 Agent Mesh ──────────────────────────────────────────
export const AGENTS_LIST: AgentDetails[] = [
  { name: 'FlowAgent', role: 'Velocity & Capacity', status: 'idle', description: 'Tracks rail, port, and road throughput and velocity bottlenecks.' },
  { name: 'TradeAgent', role: 'Customs & Tariffs', status: 'idle', description: 'Monitors import/export tariff codes and customs speed logs.' },
  { name: 'RiskAgent', role: 'Disruption & Variance', status: 'idle', description: 'Evaluates geopolitical hazards and localized strike impacts.' },
  { name: 'MacroAgent', role: 'Sovereign GDP & CPI', status: 'idle', description: 'Calculates high-frequency physical-to-financial indicator offsets.' },
  { name: 'AgriAgent', role: 'Mandi Yields & Arbitrage', status: 'idle', description: 'Aggregates commodity price differentials and cold-chain routing.' },
  { name: 'InfrastructureAgent', role: 'Fixed Assets', status: 'idle', description: 'Assess status of ports, warehouses, and DFC networks.' },
  { name: 'MobilityAgent', role: 'Transit Operations', status: 'idle', description: 'Controls driver retention indexes, truck density, and fleet delays.' },
  { name: 'ClimateAgent', role: 'Thermal & Thermal Stresses', status: 'idle', description: 'Applies rainfall deficit and heatwave variables to logistics corridors.' },
  { name: 'MarketAgent', role: 'Commodity & Futures Hedging', status: 'idle', description: 'Prices rail delay contracts and tracks mandi derivative demand.' },
  { name: 'CapitalAgent', role: 'Land Valuation & REITs', status: 'idle', description: 'Evaluates railway land holdings and computes commercial yields.' }
]

// ─── Observe: Port Telemetry ───────────────────────────────
export const PORT_DATA: PortTelemetry[] = [
  { id: 'JNPT', name: 'JNPT (Mumbai)', congestionPct: 24, status: 'OPTIMAL', dwellHours: 14.2, x: 70, y: 340 },
  { id: 'Mundra', name: 'Mundra Port', congestionPct: 78, status: 'STRESSED', dwellHours: 32.8, x: 42, y: 240 },
  { id: 'Chennai', name: 'Chennai Port', congestionPct: 38, status: 'OPTIMAL', dwellHours: 19.5, x: 140, y: 440 },
  { id: 'Kolkata', name: 'Kolkata Port', congestionPct: 54, status: 'OPTIMAL', dwellHours: 24.1, x: 260, y: 260 },
  { id: 'Vizag', name: 'Visakhapatnam', congestionPct: 92, status: 'CRITICAL', dwellHours: 48.4, x: 190, y: 350 }
]

// ─── Observe: Dedicated Corridors ──────────────────────────
export const CORRIDOR_DATA: CorridorTelemetry[] = [
  {
    id: 'W-DFC',
    name: 'Western DFC',
    source: 'Mundra Port',
    dest: 'Dadri (Delhi NCR)',
    utilizationPct: 84,
    speedKmph: 72,
    status: 'CONGESTED',
    pathPoints: 'M 42,240 C 60,180 80,120 100,85'
  },
  {
    id: 'E-DFC',
    name: 'Eastern DFC',
    source: 'Ludhiana',
    dest: 'Dankuni (Kolkata)',
    utilizationPct: 42,
    speedKmph: 95,
    status: 'OPTIMAL',
    pathPoints: 'M 90,50 C 130,80 180,140 260,260'
  },
  {
    id: 'GQ-SOUTH',
    name: 'Golden Quad South',
    source: 'JNPT (Mumbai)',
    dest: 'Chennai Port',
    utilizationPct: 62,
    speedKmph: 58,
    status: 'OPTIMAL',
    pathPoints: 'M 70,340 C 95,380 120,410 140,440'
  }
]

// ─── Observe: Mandi Heat Nodes ──────────────────────────────
export const MANDI_NODES: MandiHeatNode[] = [
  { id: 'm-1', name: 'Nashik Mandi', state: 'Maharashtra', crop: 'Tomato', priceAnomalyPct: 42.4, volumeTonnes: 1240, x: 80, y: 310 },
  { id: 'm-2', name: 'Lasalgaon Mandi', state: 'Maharashtra', crop: 'Onion', priceAnomalyPct: 24.8, volumeTonnes: 3400, x: 92, y: 305 },
  { id: 'm-3', name: 'Agra Mandi', state: 'Uttar Pradesh', crop: 'Potato', priceAnomalyPct: -12.5, volumeTonnes: 2100, x: 125, y: 145 },
  { id: 'm-4', name: 'Karnal Mandi', state: 'Haryana', crop: 'Rice', priceAnomalyPct: 8.2, volumeTonnes: 1850, x: 95, y: 65 },
  { id: 'm-5', name: 'Davangere Mandi', state: 'Karnataka', crop: 'Maize', priceAnomalyPct: -5.4, volumeTonnes: 940, x: 115, y: 410 }
]

// ─── Prime: Causal Reasoning Graphs ─────────────────────────
export const REASONING_PRESETS: Record<string, CausalGraph> = {
  redsea: {
    nodes: [
      { id: 'n1', label: 'Red Sea Disruption', change: 'Maritime route deviation via Cape of Good Hope (+14 days)', confidence: 98, evidence: 'Bab-el-Mandeb transit capacity down 68%', agents: ['RiskAgent', 'TradeAgent'], status: 'done' },
      { id: 'n2', label: 'Ocean Freight Rate', change: '+14% container costs', confidence: 94, evidence: 'Drewry index for West-East corridors spikes to $4,200', agents: ['FlowAgent', 'TradeAgent'], status: 'done' },
      { id: 'n3', label: 'Fertilizer Imports', change: '+9.4% CIF India rate', confidence: 89, evidence: 'Imported Di-Ammonium Phosphate cargo delayed by 21 days at Vizag', agents: ['TradeAgent', 'AgriAgent'], status: 'done' },
      { id: 'n4', label: 'Domestic Agri Input', change: '+6.2% retail input cost', confidence: 85, evidence: 'Cooperative urea distributions run 12% below baseline in northern states', agents: ['AgriAgent', 'MarketAgent'], status: 'done' },
      { id: 'n5', label: 'Tomato & Veg Prices', change: '+4.8% inflation surge', confidence: 91, evidence: 'Nashik winter crop output cost premium expands; transport surcharges applied', agents: ['AgriAgent', 'MacroAgent'], status: 'done' },
      { id: 'n6', label: 'Macro Food CPI', change: '+1.2% food index shift', confidence: 82, evidence: 'Tomato, Onion, and Potato index volatility adds 24 bps to headline inflation', agents: ['MacroAgent', 'CapitalAgent'], status: 'done' }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6' }
    ]
  },
  monsoon: {
    nodes: [
      { id: 'm1', label: 'El Nino / Monsoon Delay', change: 'Precipitation deficit -18% in central India', confidence: 95, evidence: 'IMD regional logs report below-normal monsoon advancement', agents: ['ClimateAgent', 'RiskAgent'], status: 'done' },
      { id: 'm2', label: 'Kharif Crop Sowing Area', change: '-12.4% land cultivated', confidence: 92, evidence: 'Pulses and oilseeds sowing drops in Madhya Pradesh and Maharashtra', agents: ['AgriAgent', 'ClimateAgent'], status: 'done' },
      { id: 'm3', label: 'Mandi Arrival Deficit', change: '-15% vegetable arrivals', confidence: 89, evidence: 'Mandi telemetry reports volume contraction in Nashik and Agra yards', agents: ['FlowAgent', 'AgriAgent'], status: 'done' },
      { id: 'm4', label: 'Agri Wholesale Index', change: '+32.4% wholesale prices', confidence: 94, evidence: 'Tomato and Onion mandi indices touch seasonal highs', agents: ['AgriAgent', 'MarketAgent'], status: 'done' },
      { id: 'm5', label: 'CPI Food Basket', change: '+3.4% retail CPI shift', confidence: 91, evidence: 'Food inflation contributes 62% of CPI core deviation', agents: ['MacroAgent', 'MarketAgent'], status: 'done' },
      { id: 'm6', label: 'RBI Repo Rate Hold', change: 'Repo rate held at 6.5%', confidence: 85, evidence: 'MPC stance stays withdrawal of accommodation; yields climb 5 bps', agents: ['MacroAgent', 'CapitalAgent'], status: 'done' }
    ],
    connections: [
      { from: 'm1', to: 'm2' },
      { from: 'm2', to: 'm3' },
      { from: 'm3', to: 'm4' },
      { from: 'm4', to: 'm5' },
      { from: 'm5', to: 'm6' }
    ]
  },
  bottleneck: {
    nodes: [
      { id: 'b1', label: 'JNPT Port Container Spillover', change: '+22% yard dwell time', confidence: 96, evidence: 'Container stack height touches critical 4.2 limit; road turnarounds delay', agents: ['FlowAgent', 'InfrastructureAgent'], status: 'done' },
      { id: 'b2', label: 'Flat Wagon Shortage', change: '-14% wagon availability', confidence: 91, evidence: 'CONCOR empty rake positioning delays by 48 hours at Navi Mumbai yards', agents: ['FlowAgent', 'MobilityAgent'], status: 'done' },
      { id: 'b3', label: 'NH-48 Diverted Traffic', change: '+18.5% truck density', confidence: 88, evidence: 'NHAI FASTag logs confirm 14,000 extra multi-axle truck transits on road bypasses', agents: ['MobilityAgent', 'InfrastructureAgent'], status: 'done' },
      { id: 'b4', label: 'Mumbai-Delhi Transit Lag', change: '+8.2 hours delay', confidence: 93, evidence: 'Avg logistics velocity falls to 24 km/h across Vadodara corridor', agents: ['MobilityAgent', 'RiskAgent'], status: 'done' },
      { id: 'b5', label: 'Manufacturing Lead Times', change: '+3 days automotive parts hold-up', confidence: 89, evidence: 'Gurugram-Manesar cluster logs supply buffer depletion; inventory costs up', agents: ['TradeAgent', 'CapitalAgent'], status: 'done' }
    ],
    connections: [
      { from: 'b1', to: 'b2' },
      { from: 'b2', to: 'b3' },
      { from: 'b3', to: 'b4' },
      { from: 'b4', to: 'b5' }
    ]
  },
  index_drop: {
    nodes: [
      { id: 'i1', label: 'Vizag Port Dwell Spike', change: '+240% container dwell time', confidence: 98, evidence: 'Visakhapatnam operations bottlenecked by local cargo handlers strike', agents: ['RiskAgent', 'InfrastructureAgent'], status: 'done' },
      { id: 'i2', label: 'Rail Coal Loading Drop', change: '-8.5% daily coal loading', confidence: 93, evidence: 'Avg thermal plant fuel reserves contract to critical 4-day threshold', agents: ['FlowAgent', 'MacroAgent'], status: 'done' },
      { id: 'i3', label: 'Agri Mandi Supply Outage', change: '-11% agricultural load', confidence: 89, evidence: 'Extreme weather and localized highway closures disrupt vegetable transits', agents: ['ClimateAgent', 'AgriAgent'], status: 'done' },
      { id: 'i4', label: 'Physical Cargo Velocity', change: '-4.8% nationwide cargo speed', confidence: 94, evidence: 'Indian Railway freight logs report avg speed decline to 41 km/h', agents: ['MobilityAgent', 'FlowAgent'], status: 'done' },
      { id: 'i5', label: 'ARTHAM Index Adjustment', change: 'Index contracts to 73.4 (-2.1 pts)', confidence: 99, evidence: 'Composite macroeconomic tracking falls beneath 10-day moving average', agents: ['MacroAgent', 'CapitalAgent'], status: 'done' }
    ],
    connections: [
      { from: 'i1', to: 'i4' },
      { from: 'i2', to: 'i4' },
      { from: 'i3', to: 'i4' },
      { from: 'i4', to: 'i5' }
    ]
  }
}

// ─── Scenario Lab: Preset Shocks ───────────────────────────
export const PRESET_SHOCKS: PresetShock[] = [
  {
    id: 's-oil',
    name: 'Oil Shock (+35%)',
    description: 'Brent Crude spikes to $115/bbl due to OPEC+ output cuts and shipping disruptions.',
    oilShock: 35,
    portDisruption: 10,
    monsoonDelay: 0,
    railStrike: 0,
    floodImpact: 0,
    coalShortage: 15
  },
  {
    id: 's-strike',
    name: 'Port & Rail Strike',
    description: 'National freight handlers call for a 7-day walkout affecting western transport hubs.',
    oilShock: 0,
    portDisruption: 80,
    monsoonDelay: 0,
    railStrike: 70,
    floodImpact: 15,
    coalShortage: 30
  },
  {
    id: 's-monsoon',
    name: 'Delayed Monsoon (-22%)',
    description: 'El Nino weather patterns drop agricultural precipitation by 22% in breadbasket states.',
    oilShock: 5,
    portDisruption: 0,
    monsoonDelay: 85,
    railStrike: 0,
    floodImpact: 0,
    coalShortage: 10
  },
  {
    id: 's-trade',
    name: 'Trade War Surcharges',
    description: 'Tariffs on imported raw steel and key electronics parts increase across bilateral segments.',
    oilShock: 10,
    portDisruption: 45,
    monsoonDelay: 0,
    railStrike: 0,
    floodImpact: 0,
    coalShortage: 0
  },
  {
    id: 's-flood',
    name: 'Corridor Flooding',
    description: 'Severe monsoon downpours submerge DFC nodes in Gujarat and Maharashtra routing.',
    oilShock: 15,
    portDisruption: 60,
    monsoonDelay: 0,
    railStrike: 25,
    floodImpact: 90,
    coalShortage: 20
  },
  {
    id: 's-coal',
    name: 'Coal Supply Crisis',
    description: 'Mine flooding lowers domestic thermal coal output, forcing rolling power outages.',
    oilShock: 20,
    portDisruption: 20,
    monsoonDelay: 10,
    railStrike: 10,
    floodImpact: 40,
    coalShortage: 95
  }
]

// ─── Decision Center: Institutional Persona Alerts ─────────
export const DECISION_ALERTS: Record<string, DecisionAlert[]> = {
  rbi: [
    {
      id: 'rbi-1',
      title: 'Food CPI Alert: Tomato Spikes Threaten Target Band',
      metric: 'Food Inflation Forecast: +4.8% CPI Offset',
      description: 'Nashik mandi price anomalies have breached the +40% deviation threshold, expanding cargo transport surcharges to downstream nodes.',
      recommendation: 'Maintained withdrawal of repo rate accommodation (6.5%); monitor primary mandi arrivals before agricultural credit updates.',
      confidence: 91,
      impact: 'HIGH',
      expectedOutcome: 'Cool agricultural price volatility within 45 days, anchoring secondary inflation indexes.'
    },
    {
      id: 'rbi-2',
      title: 'Western DFC Congestion Adding Transit Cost Premiums',
      metric: 'Logistics Surcharge Deviation: +₹1.8/km/tonne',
      description: 'Congestion at Mundra container yards has triggered secondary highway route diversions, swelling FASTag highway volumes.',
      recommendation: 'Review asset credit facilities for commercial haulers; adjust trade transport liquidity allocations.',
      confidence: 88,
      impact: 'MED',
      expectedOutcome: 'Stabilizes supply-chain liquidity and prevents transport cost indexing from leaking into core CPI.'
    }
  ],
  railway: [
    {
      id: 'rail-1',
      title: 'Western DFC Bottleneck: JNPT Container Spillover',
      metric: 'Yard Container Dwell Time: 32.8 Hrs',
      description: 'Mundra container stacks exceed normal structural capacity, delaying empty rake turnarounds by 48 hours.',
      recommendation: 'Re-prioritize empty flat wagon positions from central zone hubs; activate DFC speed-bypass rules.',
      confidence: 96,
      impact: 'HIGH',
      expectedOutcome: 'Clear the container gridlock, reducing yard dwell hours to a baseline of 18 hours in 5 days.'
    },
    {
      id: 'rail-2',
      title: 'Station Prox REIT Land Parcel Valuation Upgrade',
      metric: 'REIT Grade AAA Asset: Bandra parcel ₹847 Cr value',
      description: 'Bandra Station proximity premium has risen (+38% <200m) with the completion of the line connection corridor.',
      recommendation: 'Bundle the land parcel under the AAA Grade REIT package; execute a 20-year lease structure at 8.2% projected yield.',
      confidence: 93,
      impact: 'HIGH',
      expectedOutcome: 'Unlock liquid capital yields from idle spatial assets, providing immediate revenue flow.'
    }
  ],
  agriculture: [
    {
      id: 'agri-1',
      title: 'Nashik-Lucknow Tomato Price Gap Profitable Arbitrage',
      metric: 'Arbitrage ROI: 310% (P&L ₹14.4 Lakh / wagon)',
      description: 'Nashik tomato buy price (₹8/kg) vs Lucknow sell price (₹42/kg) creates massive arbitrage after factoring cold chain logistics.',
      recommendation: 'Authorize immediate dispatch of 3 empty refrigerated wagons from neighboring zones; secure mandi buy volumes.',
      confidence: 94,
      impact: 'HIGH',
      expectedOutcome: 'Arbitrage captures ₹847 crore daily uncaptured profit, cooling Lucknow retail price index by 18%.'
    },
    {
      id: 'agri-2',
      title: 'Delayed Monsoon Crop Sowing Squeeze',
      metric: 'MP pulses and oilseeds area: -12.4% sowing',
      description: 'Precipitation deficit of 18% in central India limits reservoir irrigation, halting primary sowing operations.',
      recommendation: 'Increase fertilizer warehouse buffer levels locally by 15%; extend emergency agricultural credit support.',
      confidence: 89,
      impact: 'MED',
      expectedOutcome: 'Prevents structural crop yield failures, stabilizing wholesale mandi prices.'
    }
  ],
  investor: [
    {
      id: 'inv-1',
      title: 'Coal Supply Crisis Hedging Strategy',
      metric: 'Average Plant Stock: Critical 4-Day Level',
      description: 'Domestic thermal coal loading declines by 8.5%, prompting commercial power companies to plan imports.',
      recommendation: 'Shift logistics portfolio holdings toward dry bulk shipping entities; hedge logistics exposure with delay derivatives.',
      confidence: 93,
      impact: 'HIGH',
      expectedOutcome: 'Mitigate supply-chain energy disruption costs, capturing alpha from ocean transport stocks.'
    },
    {
      id: 'inv-2',
      title: 'Dharuhera Warehouse Demand Peak Validation',
      metric: 'Dharuhera WareHeat Score: 91/100',
      description: 'Industrial approvals (₹8,400 Cr), NH-48 widening, and new GST registrations confirm demand peak for Q3 2027.',
      recommendation: 'Deploy capital into Grade-A logistics parks in Dharuhera; target 4.2M sqft logistics capacity.',
      confidence: 91,
      impact: 'HIGH',
      expectedOutcome: 'Captures early warehouse rental yields ahead of retail distribution surges, achieving a 14.8% IRR.'
    }
  ]
}

// ─── Pinned Command Center Data ────────────────────────────
export const HISTORICAL_CHART_DATA: FreightDataPoint[] = [
  { month: 'Jan 26', freightGDP: 71.4, rbiOfficial: 69.8 },
  { month: 'Feb 26', freightGDP: 73.1, rbiOfficial: 71.2 },
  { month: 'Mar 26', freightGDP: 75.8, rbiOfficial: 74.0 },
  { month: 'Apr 26', freightGDP: 74.9, rbiOfficial: null },
  { month: 'May 26', freightGDP: 76.5, rbiOfficial: null },
  { month: 'Jun 26', freightGDP: 74.3, rbiOfficial: null }
]

export const WHAT_CHANGED_TODAY = [
  { label: 'Port Dwell Congestion', value: '▲ 7.2%', trend: 'bad', desc: 'Vizag port bottlenecks strike-bound' },
  { label: 'Core Rail Throughput', value: '▲ 3.1%', trend: 'good', desc: 'Coal rake load schedules complete' },
  { label: 'Agri Mandi Price Gap', value: '▲ 14.8%', trend: 'neutral', desc: 'Nashik tomato supply constraints grow' },
  { label: 'National Economic Pulse', value: '▲ 1.8%', trend: 'good', desc: 'Western DFC container speeds lift' }
]

// ─── Commodity Freight Loader for SENSE ─────────────────────
export const COMMODITY_FREIGHT: CommodityFreight[] = [
  { name: 'Coal & Coke', current: 92, baseline: 85, sector: 'Energy' },
  { name: 'Cement & Clinker', current: 78, baseline: 80, sector: 'Construction' },
  { name: 'Iron & Steel', current: 105, baseline: 90, sector: 'Manufacturing' },
  { name: 'Foodgrains', current: 88, baseline: 85, sector: 'Agriculture' },
  { name: 'Fertilizers', current: 67, baseline: 75, sector: 'Agriculture' },
  { name: 'Petroleum & Oil', current: 102, baseline: 95, sector: 'Energy' }
]
