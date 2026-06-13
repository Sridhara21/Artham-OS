import type {
  CommodityFreight, PortTelemetry, CorridorTelemetry, MandiHeatNode,
  CausalGraph, PresetShock, RecommendedAction, AgentDetails,
  IndexMetricDetail, ReplayEvent, SovereignKPI, ForecastMilestone, IntelligenceAlert, FreightDataPoint
} from '@/types'

// ─── 10 Agent Mesh ──────────────────────────────────────────
export const AGENTS_LIST: AgentDetails[] = [
  { name: 'FlowAgent', role: 'Velocity & Capacity', status: 'idle', description: 'Tracks rail, port, and road throughput and velocity bottlenecks.', signalsProcessed: 1478, lastAction: 'Computed W-DFC capacity delta', reasoningSummary: 'W-DFC utilization is at 84%. Speed drop detected at Dadri junction.', confidence: 94 },
  { name: 'TradeAgent', role: 'Customs & Tariffs', status: 'idle', description: 'Monitors import/export tariff codes and customs speed logs.', signalsProcessed: 984, lastAction: 'Matched CEPA tariff manifest', reasoningSummary: 'HSCode audits completed for 12 incoming steel shipments.', confidence: 91 },
  { name: 'RiskAgent', role: 'Disruption & Variance', status: 'idle', description: 'Evaluates geopolitical hazards and localized strike impacts.', signalsProcessed: 1832, lastAction: 'Flagged Bab-el-Mandeb transit status', reasoningSummary: 'Maritime reroutes via Cape of Good Hope adding 14 days to westward transits.', confidence: 98 },
  { name: 'MacroAgent', role: 'Sovereign GDP & CPI', status: 'idle', description: 'Calculates high-frequency physical-to-financial indicator offsets.', signalsProcessed: 1245, lastAction: 'Updated real-time CPI food weight', reasoningSummary: 'High-frequency vegetable spikes projected to add 24 bps to CPI.', confidence: 92 },
  { name: 'AgriAgent', role: 'Mandi Yields & Arbitrage', status: 'idle', description: 'Aggregates commodity price differentials and cold-chain routing.', signalsProcessed: 1560, lastAction: 'Analyzed Nashik tomato inflows', reasoningSummary: 'Price anomaly at Lasalgaon onion yard touches +24.8%. Sowing lag confirmed.', confidence: 89 },
  { name: 'InfrastructureAgent', role: 'Fixed Assets', status: 'idle', description: 'Assess status of ports, warehouses, and DFC networks.', signalsProcessed: 789, lastAction: 'Audited Mundra container stacks', reasoningSummary: 'Dwell capacity at Mundra is stressed at 32.8 hours.', confidence: 95 },
  { name: 'MobilityAgent', role: 'Transit Operations', status: 'idle', description: 'Controls driver retention indexes, truck density, and fleet delays.', signalsProcessed: 612, lastAction: 'FASTag traffic density computation', reasoningSummary: 'Bypass traffic along NH-48 has expanded vehicle turnaround times.', confidence: 88 },
  { name: 'ClimateAgent', role: 'Thermal & Weather Stresses', status: 'idle', description: 'Applies rainfall deficit and heatwave variables to logistics corridors.', signalsProcessed: 894, lastAction: 'Measured Central India rain deficit', reasoningSummary: 'Precipitation deficit stands at -18%, delaying kharif sowing.', confidence: 90 },
  { name: 'MarketAgent', role: 'Commodity & Futures Hedging', status: 'idle', description: 'Prices rail delay contracts and tracks mandi derivative demand.', signalsProcessed: 1042, lastAction: 'Priced delay derivative premium', reasoningSummary: 'Log-Normal probability curves calculate a 34% strike premium.', confidence: 93 },
  { name: 'CapitalAgent', role: 'Land Valuation & REITs', status: 'idle', description: 'Evaluates railway land holdings and computes commercial yields.', signalsProcessed: 435, lastAction: 'Revalued Bandra Station leasehold', reasoningSummary: 'Hedonic pricing estimates Bandra plot value at ₹847 Cr with 8.2% yield.', confidence: 91 }
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
      { id: 'n1', label: 'Red Sea Disruption', change: 'Cape Reroute (+14d)', confidence: 98, evidence: 'Bab-el-Mandeb transit capacity drops 68%', agents: ['RiskAgent', 'TradeAgent'], status: 'done', phase: 'Cause' },
      { id: 'n2', label: 'Ocean Freight Rate Spike', change: '+14% container costs', confidence: 94, evidence: 'Drewry index for East-West routes spikes past $4,200/FEU', agents: ['FlowAgent', 'TradeAgent'], status: 'done', phase: 'Transmission' },
      { id: 'n3', label: 'Fertilizer Import Shortage', change: '+9.4% CIF India cost', confidence: 89, evidence: 'Imported Di-Ammonium Phosphate delayed 21 days at Vizag Port', agents: ['TradeAgent', 'AgriAgent'], status: 'done', phase: 'Sector' },
      { id: 'n4', label: 'Domestic Agri Input Rise', change: '+6.2% retail input cost', confidence: 85, evidence: 'Urea distribution levels down 12% below normal in northern states', agents: ['AgriAgent', 'MarketAgent'], status: 'done', phase: 'Macro' },
      { id: 'n5', label: 'Tomato & Veg Price Spikes', change: '+4.8% inflation surge', confidence: 91, evidence: 'Transport surcharges applied to regional mandi dispatches', agents: ['AgriAgent', 'MacroAgent'], status: 'done', phase: 'Policy' }
    ],
    connections: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' }
    ]
  },
  monsoon: {
    nodes: [
      { id: 'm1', label: 'Monsoon Sowing Deficit', change: '-18% rain drop', confidence: 95, evidence: 'IMD regional logs confirm below-average precipitation levels', agents: ['ClimateAgent', 'RiskAgent'], status: 'done', phase: 'Cause' },
      { id: 'm2', label: 'Kharif Cultivation Contraction', change: '-12.4% sowing area', confidence: 92, evidence: 'Sowing drop in Madhya Pradesh pulses and Maharashtra oilseed zones', agents: ['AgriAgent', 'ClimateAgent'], status: 'done', phase: 'Transmission' },
      { id: 'm3', label: 'Mandi Arrival Deficit', change: '-15% arrival volume', confidence: 89, evidence: 'Arrival volumes slide at Nashik and Lasalgaon mandi yards', agents: ['FlowAgent', 'AgriAgent'], status: 'done', phase: 'Sector' },
      { id: 'm4', label: 'Agricultural Price Volatility', change: '+32.4% wholesale index', confidence: 94, evidence: 'Onion and tomato daily index models touch seasonal highs', agents: ['AgriAgent', 'MarketAgent'], status: 'done', phase: 'Macro' },
      { id: 'm5', label: 'RBI Monetary Stance Hold', change: 'Repo rate held at 6.50%', confidence: 85, evidence: 'MPC issues rate hold to prevent agricultural cost pass-through', agents: ['MacroAgent', 'CapitalAgent'], status: 'done', phase: 'Policy' }
    ],
    connections: [
      { from: 'm1', to: 'm2' },
      { from: 'm2', to: 'm3' },
      { from: 'm3', to: 'm4' },
      { from: 'm4', to: 'm5' }
    ]
  },
  bottleneck: {
    nodes: [
      { id: 'b1', label: 'JNPT Terminal Congestion', change: '+22% yard dwell time', confidence: 96, evidence: 'Yard container stacks touch critical 4.2 limit; road queue delay spikes', agents: ['FlowAgent', 'InfrastructureAgent'], status: 'done', phase: 'Cause' },
      { id: 'b2', label: 'Flat Wagon Reallocation Delay', change: '-14% wagon availability', confidence: 91, evidence: 'Empty rake placements delay 48 hours at Mundra terminals', agents: ['FlowAgent', 'MobilityAgent'], status: 'done', phase: 'Transmission' },
      { id: 'b3', label: 'NH-48 Diverted Road Traffic', change: '+18.5% FASTag volume', confidence: 88, evidence: 'Highway sensors report 14,000 extra multi-axle truck transits', agents: ['MobilityAgent', 'InfrastructureAgent'], status: 'done', phase: 'Sector' },
      { id: 'b4', label: 'Automotive Cluster Hold-ups', change: '+8.2 hrs lead time', confidence: 93, evidence: 'Gurugram automotive suppliers report buffer stock depletion', agents: ['MobilityAgent', 'RiskAgent'], status: 'done', phase: 'Macro' },
      { id: 'b5', label: 'Industrial Output Drag', change: '-1.4% manufacturing index', confidence: 89, evidence: 'Capacity utilization drops slightly due to logistics friction', agents: ['TradeAgent', 'CapitalAgent'], status: 'done', phase: 'Policy' }
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
      { id: 'i1', label: 'Visakhapatnam Operations Stop', change: '+240% dwell hours', confidence: 98, evidence: 'Sovereign port activity delayed by local handler wage disputes', agents: ['RiskAgent', 'InfrastructureAgent'], status: 'done', phase: 'Cause' },
      { id: 'i2', label: 'Thermal Coal Logistics Lag', change: '-8.5% rake loading', confidence: 93, evidence: 'Power plants average coal reserves drop to critical 4-day limit', agents: ['FlowAgent', 'MacroAgent'], status: 'done', phase: 'Transmission' },
      { id: 'i3', label: 'Mandi Supply Contraction', change: '-11% agricultural load', confidence: 89, evidence: 'Extreme weather and local landslips disrupt arterial transport routes', agents: ['ClimateAgent', 'AgriAgent'], status: 'done', phase: 'Sector' },
      { id: 'i4', label: 'National Cargo Velocity Drop', change: '-4.8% average speed', confidence: 94, evidence: 'Freight train speed falls to 41 km/h average across main tracks', agents: ['MobilityAgent', 'FlowAgent'], status: 'done', phase: 'Macro' },
      { id: 'i5', label: 'ARTHAM Index Adjustments', change: 'Index falls to 73.4 (-2.1 pts)', confidence: 99, evidence: 'Composite macroeconomic tracking slides below 10-day moving average', agents: ['MacroAgent', 'CapitalAgent'], status: 'done', phase: 'Policy' }
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
  { id: 's-oil', name: 'Oil Shock ($150)', description: 'Brent Crude spikes to $150/bbl due to escalating geopolitical tensions in Middle East channels.', oilShock: 75, portDisruption: 15, monsoonDelay: 0, railStrike: 0, floodImpact: 0, coalShortage: 20 },
  { id: 's-hormuz', name: 'Hormuz Closure', description: 'Strait of Hormuz transit lanes blocked; oil container shipping routes suspended.', oilShock: 85, portDisruption: 60, monsoonDelay: 0, railStrike: 0, floodImpact: 0, coalShortage: 10 },
  { id: 's-monsoon', name: 'Monsoon Failure', description: 'Precipitation levels contract by 30% nationwide, cutting agricultural output buffers.', oilShock: 5, portDisruption: 0, monsoonDelay: 75, railStrike: 0, floodImpact: 15, coalShortage: 0 },
  { id: 's-strike', name: 'Port yard Strike', description: 'JNPT and Mundra dock operations halt due to sudden localized labor walkouts.', oilShock: 0, portDisruption: 90, monsoonDelay: 0, railStrike: 50, floodImpact: 0, coalShortage: 15 },
  { id: 's-coal', name: 'Coal Shortage', description: 'Domestic thermal coal loading declines by 8.5%, prompting commercial power companies to plan imports.', oilShock: 10, portDisruption: 0, monsoonDelay: 0, railStrike: 15, floodImpact: 0, coalShortage: 85 },
  { id: 's-semi', name: 'Semiconductor Shock', description: 'Fab supply constraints delay tech component customs clearance by 35 days.', oilShock: 0, portDisruption: 50, monsoonDelay: 0, railStrike: 0, floodImpact: 0, coalShortage: 0 },
  { id: 's-rail', name: 'Railway Capacity Drop', description: 'Track signalling failures block cargo rakes across Gujarat junctions.', oilShock: 10, portDisruption: 40, monsoonDelay: 0, railStrike: 85, floodImpact: 30, coalShortage: 25 },
  { id: 's-boom', name: 'Export Cargo Boom', description: 'Spike in westward manufactured cargo bookings triggers container yard deficits.', oilShock: 15, portDisruption: 40, monsoonDelay: 0, railStrike: 25, floodImpact: 0, coalShortage: 0 },
  { id: 's-energy', name: 'Power Grid Crisis', description: 'Critical power outages force rationing across manufacturing clusters.', oilShock: 90, portDisruption: 10, monsoonDelay: 0, railStrike: 0, floodImpact: 0, coalShortage: 70 },
  { id: 's-recession', name: 'Global Recession', description: 'Westward buyer demand contractions drop export load manifests.', oilShock: -40, portDisruption: -30, monsoonDelay: 0, railStrike: -10, floodImpact: 0, coalShortage: 0 }
]

// ─── Situation Room: Scorecard Metrics ─────────────────────
export const SOVEREIGN_KPIS: SovereignKPI[] = [
  { id: 'kpi-1', name: 'Economic Resilience', value: '86.4%', change: 1.2, description: 'Measures national physical supply redundancy and buffer storage capacity against trade corridor shocks.', status: 'optimal' },
  { id: 'kpi-2', name: 'Supply Chain Stability', value: '78.2%', change: -2.4, description: 'Tracks intermodal reliability, port container clearance speeds, and DFC velocity parameters.', status: 'stressed' },
  { id: 'kpi-3', name: 'Trade Momentum Index', value: '82.5%', change: 1.8, description: 'Aggregates export loading ratios, custom processing manifest times, and net shipping balance.', status: 'stable' },
  { id: 'kpi-4', name: 'Inflationary Cost Pressure', value: '42.1%', change: 4.8, description: 'Downstream price transmission from fuel transport adjustments and agricultural mandi gaps.', status: 'stressed' },
  { id: 'kpi-5', name: 'Infrastructure Util.', value: '64.8%', change: 1.2, description: 'Wagon occupancy, flat wagon distribution, and terminal yard clearance rates.', status: 'stable' },
  { id: 'kpi-6', name: 'Export Competitiveness', value: '85.4%', change: 2.2, description: 'Clearing efficiency of coastal gateways compared to international standard baselines.', status: 'stable' }
]

// ─── Situation Room: Recommended Actions ───────────────────
export const SOVEREIGN_RECOMMENDATIONS: RecommendedAction[] = [
  {
    id: 'rec-1',
    risk: 'Red Sea Cargo Bottlenecks',
    recommendation: 'Divert 12% of container traffic to DFC bypass loops; reallocate 45 empty rail flat wagons from central zones; bypass customs gate delays via advance CEPA filings.',
    costInr: 4200000,
    co2SavedTonnes: 18.2,
    timeSavedHours: 14.5,
    gdpOffsetCr: 2.3,
    confidence: 94,
    riskLevel: 'MED'
  },
  {
    id: 'rec-2',
    risk: 'Mundra Container Yard Congestion',
    recommendation: 'Shift road cargo arrivals to direct rail shuttles; trigger Dharuhera buffer yard logistics releases; deploy emergency customs staff.',
    costInr: 8400000,
    co2SavedTonnes: 32.4,
    timeSavedHours: 28.6,
    gdpOffsetCr: 4.8,
    confidence: 91,
    riskLevel: 'HIGH'
  },
  {
    id: 'rec-3',
    risk: 'Mandi Crop Sowing Lags (Monsoon)',
    recommendation: 'Expand local fertilizer buffer reserves by 15%; establish emergency agricultural credit structures; prioritize fertilizer rake dispatches.',
    costInr: 1500000,
    co2SavedTonnes: 0,
    timeSavedHours: 0,
    gdpOffsetCr: 1.7,
    confidence: 89,
    riskLevel: 'MED'
  }
]

// ─── Forecast Outlook Timelines ────────────────────────────
export const FORECAST_DATA: ForecastMilestone[] = [
  {
    period: '7 Days',
    inflation: '+0.12% CPI delta',
    congestion: 'Stressed Mundra container yards (+6h dwell time)',
    delay: '+1.2 days on Western DFC rakes',
    price: 'Onions: +4% wholesale index',
    provenance: ['Drewry container index +4%', 'Nashik highway bypass diversion active', 'W-DFC capacity utilization reaches 84%'],
    confidence: 94
  },
  {
    period: '30 Days',
    inflation: '+0.28% CPI delta',
    congestion: 'Spillover container stacks at Dadri terminal',
    delay: '+3.4 days average transit duration',
    price: 'Tomatoes: +12% wholesale mandi price',
    provenance: ['Vizag imported Urea shipments delayed 21 days', 'NAFED cold storage reserves drop 12%', 'FASTag road vehicle density up 18.5%'],
    confidence: 89
  },
  {
    period: '90 Days',
    inflation: '+0.54% CPI delta',
    congestion: 'Optimal flows restored to coastal port terminals',
    delay: '+1.8 days average transit duration',
    price: 'Agri price correction across major yards',
    provenance: ['Alternative rail corridors fully operational', 'New commercial warehouse parks commissioned', 'MPC repo rate held at 6.50%'],
    confidence: 91
  },
  {
    period: '180 Days',
    inflation: '+0.14% CPI delta',
    congestion: 'Optimal logistics flow parameters achieved',
    delay: 'Standard velocity indicators (+72 km/h avg)',
    price: 'Food price basket stabilizes completely',
    provenance: ['New flat wagon rolling stock deployed on DFC', 'Kharif sowing levels complete (+3% YoY)', 'Suez shipping backlogs cleared'],
    confidence: 95
  }
]

// ─── Historical Replay Events ─────────────────────────────
export const REPLAY_EVENTS: ReplayEvent[] = [
  {
    id: 'c-suez',
    name: 'Suez Canal Blockage',
    description: 'In March 2021, the container ship Ever Given ran aground, halting 12% of global trade and freezing Indian westward shipping lanes.',
    year: '2021',
    timeline: [
      { day: 1, log: 'Container ship Ever Given runs aground at Suez Canal km 151, blocking all transits.', action: 'Deploy standard tug arrays; notify Suez Canal Authority.', resolved: false },
      { day: 3, log: 'European-bound cargo queues exceed 150 ships; JNPT port yard density rises by +45%.', action: 'Bypass Suez; query alternative routing options.', resolved: false },
      { day: 5, log: 'Freight rates spike by +$1,800/FEU. Alternative shipping routes via Cape of Good Hope activated.', action: 'Initiate Cape of Good Hope route redirects (+14 days transit duration).', resolved: false },
      { day: 7, log: 'Ever Given successfully refloated; Suez blockage cleared. Backlog queue of 360 vessels begins processing.', action: 'Secure priority docking codes at terminal ports to clear yard congestion.', resolved: true }
    ]
  },
  {
    id: 'c-redsea',
    name: 'Red Sea Disruption',
    description: 'Sovereign crisis in Bab-el-Mandeb Strait forcing global container cargo to bypass Suez routes in 2024.',
    year: '2024',
    timeline: [
      { day: 1, log: 'Drone attacks on commercial ships reported near Yemen coast, raising threat status.', action: 'Apply war risk surcharges; monitor cargo pipelines.', resolved: false },
      { day: 5, log: 'Major ocean carriers suspend Red Sea voyages, routing 18% of global cargo via South Africa.', action: 'Establish Cape route transit windows; procure cargo hedges.', resolved: false },
      { day: 10, log: 'Indian imported Urea cargo shipments delayed by 21 days; raw fertilizer import prices rise +9.4%.', action: 'Unlock national fertilizer reserves in northern states.', resolved: false },
      { day: 15, log: 'Agricultural input costs increase by +6.2% at regional mandis, pushing local food inflation.', action: 'Issue temporary mandi transportation fuel credit subsidies.', resolved: true }
    ]
  }
]

// ─── Intelligence Feed alerts ─────────────────────────────
export const INTELLIGENCE_FEED_SEEDS: IntelligenceAlert[] = [
  { id: 'a-1', timestamp: '08:25', severity: 'critical', text: 'New shipping disruption signal ingested in Bab-el-Mandeb Strait', confidence: 98, region: 'Red Sea Corridor', sector: 'Trade' },
  { id: 'a-2', timestamp: '08:24', severity: 'warning', text: 'Inflation probability revised +3.2% due to energy pass-through costs', confidence: 94, region: 'National', sector: 'Macro' },
  { id: 'a-3', timestamp: '08:23', severity: 'warning', text: 'Port congestion index rising across western gateway terminals', confidence: 91, region: 'Gujarat Gateway', sector: 'Infrastructure' },
  { id: 'a-4', timestamp: '08:21', severity: 'critical', text: 'Freight anomaly detected in Red Sea shipping corridors', confidence: 98, region: 'Indian Ocean shipping lanes', sector: 'Trade' },
  { id: 'a-5', timestamp: '07:55', severity: 'warning', text: 'Visakhapatnam Port: Imported DAP fertilizer dispatch delayed due to rail scheduling.', confidence: 93, region: 'Andhra Pradesh', sector: 'Agriculture' },
  { id: 'a-6', timestamp: '07:31', severity: 'info', text: 'Nashik Mandi: Tomato price differential reaches ₹34/kg vs Lucknow terminal.', confidence: 94, region: 'MH-UP Corridor', sector: 'Market' }
]

// ─── Pinned Command Center Data ────────────────────────────
export const HISTORICAL_CHART_DATA: FreightDataPoint[] = [
  { month: 'Jan 26', freightGDP: 71.4, rbiOfficial: 69.8 },
  { month: 'Feb 26', freightGDP: 73.1, rbiOfficial: 71.2 },
  { month: 'Mar 26', freightGDP: 75.8, rbiOfficial: 74.0 },
  { month: 'Apr 26', freightGDP: 74.9, rbiOfficial: null },
  { month: 'May 26', freightGDP: 76.5, rbiOfficial: null },
  { month: 'Jun 26', freightGDP: 73.4, rbiOfficial: null }
]

export const WHAT_CHANGED_TODAY = [
  { label: 'Port Dwell Congestion', value: '▲ 7.2%', trend: 'bad', desc: 'Vizag port bottlenecks strike-bound' },
  { label: 'Core Rail Throughput', value: '▲ 3.1%', trend: 'good', desc: 'Coal rake load schedules complete' },
  { label: 'Agri Mandi Price Gap', value: '▲ 14.8%', trend: 'neutral', desc: 'Nashik tomato supply constraints grow' },
  { label: 'National Economic Pulse', value: '▲ 1.8%', trend: 'good', desc: 'Western DFC container speeds lift' }
]

export const COMMODITY_FREIGHT: CommodityFreight[] = [
  { name: 'Coal & Coke', current: 92, baseline: 85, sector: 'Energy' },
  { name: 'Cement & Clinker', current: 78, baseline: 80, sector: 'Construction' },
  { name: 'Iron & Steel', current: 105, baseline: 90, sector: 'Manufacturing' },
  { name: 'Foodgrains', current: 88, baseline: 85, sector: 'Agriculture' },
  { name: 'Fertilizers', current: 67, baseline: 75, sector: 'Agriculture' },
  { name: 'Petroleum & Oil', current: 102, baseline: 95, sector: 'Energy' }
]

export const PROPRIETARY_INDICES_DETAILS: IndexMetricDetail[] = [
  {
    id: 'idx-1',
    name: 'FreightGDP™',
    value: 73.4,
    change: 2.1,
    methodology: 'Measures industrial physical momentum by calculating the weighted moving average of raw commodity rail/road loads compared to sectoral inputs.',
    formula: 'F_GDP = \\sum (V_{i,t} / V_{i,base} * \\omega_i * \\alpha_i)',
    sources: 'Indian Railways FOIS, NHAI FASTag registers'
  },
  {
    id: 'idx-2',
    name: 'Economic Momentum Index™',
    value: 82.6,
    change: 1.8,
    methodology: 'Composite metric tracking industrial speed shifts, cargo velocities, and trade input deltas.',
    formula: 'EMI = \\gamma_1 \\Delta F_{GDP} + \\gamma_2 \\Delta TPI - \\gamma_3 CSI',
    sources: 'ARTHAM Macro core calculation'
  },
  {
    id: 'idx-3',
    name: 'Corridor Stress Index™',
    value: 12.4,
    change: -4.2,
    methodology: 'Measures speed and vehicle density degradation along primary Dedicated Freight Corridors and highways.',
    formula: 'CSI = (1 - S_t/S_d)*w_s + (D_t/D_c)*w_d',
    sources: 'NHAI FASTag registers, DFC signal sensors'
  },
  {
    id: 'idx-4',
    name: 'Supply Chain Health Score™',
    value: 89.5,
    change: 0.4,
    methodology: 'Measures lead-time predictability by evaluating transit variance and port container yard dwell latencies.',
    formula: 'SCHS = 100 * e^{-\\beta \\sigma_T^2} * (1 - D_{\\text{port}}/D_{\\text{base}})',
    sources: 'Port PCS records, warehouse gate registers'
  },
  {
    id: 'idx-5',
    name: 'Trade Pulse Index™',
    value: 71.2,
    change: 3.4,
    methodology: 'Clearance speed and export/import load scaling across primary coastal and air freight terminals.',
    formula: 'TPI = (\\Phi_{\\text{exp}} + \\Phi_{\\text{imp}})/\\Phi_{\\text{base}} * (1 - \\bar{D}_{\\text{customs}})',
    sources: 'CBIC manifests, port gate APIs'
  },
  {
    id: 'idx-6',
    name: 'Infrastructure Utilization Index™',
    value: 64.8,
    change: 1.2,
    methodology: 'Rake loading, flat wagon deployment, and warehouse space occupancy index.',
    formula: 'IUI = (\\sum \\text{Used Capacity} / \\sum \\text{Design Capacity}) * 100',
    sources: 'Logistics operator datasets'
  },
  {
    id: 'idx-7',
    name: 'Commodity Velocity Score™',
    value: 85.4,
    change: 2.2,
    methodology: 'Velocity score of critical resource commodities across rail networks weighted by current shortage priorities.',
    formula: 'CVS_c = (\\text{Distance} / \\text{Transit Time}) * \\mu_c',
    sources: 'FOIS wagon GPS tracking telemetry'
  }
]

export const DECISION_ALERTS = {
  rbi: [
    {
      id: 'rbi-1',
      title: 'Food CPI Alert: Tomato Spikes Threaten Target Band',
      metric: 'Food Inflation Forecast: +4.8% CPI Offset',
      description: 'Nashik mandi price anomalies have breached the +40% deviation threshold, expanding cargo transport surcharges to downstream nodes.',
      recommendation: 'Maintained withdrawal of repo rate accommodation (6.5%); monitor primary mandi arrivals.',
      confidence: 91,
      impact: 'HIGH',
      expectedOutcome: 'Cool agricultural price volatility within 45 days.'
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
      expectedOutcome: 'Clear the container gridlock, reducing yard dwell hours.'
    }
  ],
  agriculture: [
    {
      id: 'agri-1',
      title: 'Nashik-Lucknow Tomato Price Gap Profitable Arbitrage',
      metric: 'Arbitrage ROI: 310%',
      description: 'Nashik tomato buy price (₹8/kg) vs Lucknow sell price (₹42/kg) creates massive arbitrage after factoring cold chain logistics.',
      recommendation: 'Authorize immediate dispatch of refrigerated wagons.',
      confidence: 94,
      impact: 'HIGH',
      expectedOutcome: 'Arbitrage captures ₹847 crore daily, cooling Lucknow prices.'
    }
  ],
  investor: [
    {
      id: 'inv-1',
      title: 'Coal Supply Crisis Hedging Strategy',
      metric: 'Average Plant Stock: Critical 4-Day Level',
      description: 'Domestic thermal coal loading declines by 8.5%, prompting power company imports.',
      recommendation: 'Shift logistics portfolio holdings toward dry bulk shipping entities.',
      confidence: 93,
      impact: 'HIGH',
      expectedOutcome: 'Mitigate supply-chain energy disruption costs.'
    }
  ]
}

