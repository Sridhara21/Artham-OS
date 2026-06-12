// ─── Statistical Functions ─────────────────────────────────

function erf(x: number): number {
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911
  const sign = x >= 0 ? 1 : -1
  const absX = Math.abs(x)
  const t = 1 / (1 + p * absX)
  const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-absX*absX)
  return sign * y
}

function _normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

// ─── Confidence Engine ──────────────────────────────────────

export interface ConfidenceMetrics {
  freshness: number     // 0-100%
  volume: number        // 0-100%
  agreement: number     // 0-100%
  accuracy: number      // 0-100%
  overall: number       // calculated
}

export function calculateConfidence(
  signalCount: number,
  shocksActiveCount: number
): ConfidenceMetrics {
  // Freshness drops slightly as more shocks disrupt data streams
  const freshness = Math.max(78, Math.min(99, Math.round(98 - shocksActiveCount * 3.5)))
  
  // Volume increases as more signals are ingested, but active shocks can saturate sensors
  const volume = Math.max(70, Math.min(99, Math.round(85 + Math.min(14, signalCount / 100) - shocksActiveCount * 2)))
  
  // Agreement drops when active shocks cause conflicting indicators between agents
  const agreement = Math.max(65, Math.min(98, Math.round(95 - shocksActiveCount * 6)))
  
  // Historical accuracy reflects the baseline validation model, dropping during unprecedented shocks
  const accuracy = Math.max(72, Math.min(97, Math.round(92 - shocksActiveCount * 2.5)))
  
  // Weighted overall calculation: 30% Freshness, 25% Volume, 25% Agreement, 20% Accuracy
  const overall = Math.round(
    freshness * 0.30 +
    volume * 0.25 +
    agreement * 0.25 +
    accuracy * 0.20
  )
  
  return { freshness, volume, agreement, accuracy, overall }
}

// ─── Dynamic 2D Risk Radar Vectors ─────────────────────────

export interface RiskRadarBubble {
  id: string
  name: string
  x: number // -100 to 100 coordinate
  y: number // -100 to 100 coordinate
  severity: 'high' | 'medium' | 'low'
  description: string
  category: 'Inflation' | 'Supply Chain' | 'Trade' | 'Energy' | 'Agriculture' | 'Logistics' | 'Manufacturing'
}

export function calculateRiskRadar(
  oilShock: number,
  portDisruption: number,
  monsoonDelay: number,
  railStrike: number,
  floodImpact: number,
  coalShortage: number
): RiskRadarBubble[] {
  // Baseline points mapping
  const baseInflation = { x: 10, y: 15 }
  const baseSupply = { x: -25, y: 20 }
  const baseTrade = { x: -30, y: -25 }
  const baseEnergy = { x: 25, y: -30 }
  const baseAgri = { x: 35, y: 10 }
  const baseLogistics = { x: -15, y: -10 }
  const baseMfg = { x: -40, y: 35 }

  // Vector shifts based on slider shocks
  const inflationX = baseInflation.x + (monsoonDelay * 0.6) + (oilShock * 0.3)
  const inflationY = baseInflation.y + (oilShock * 0.7)
  const infScore = Math.max(oilShock, monsoonDelay)

  const supplyX = baseSupply.x - (railStrike * 0.5) - (floodImpact * 0.3)
  const supplyY = baseSupply.y + (portDisruption * 0.6)
  const supplyScore = Math.max(railStrike, portDisruption, floodImpact)

  const tradeX = baseTrade.x - (portDisruption * 0.7)
  const tradeY = baseTrade.y - (oilShock * 0.5)
  const tradeScore = Math.max(portDisruption, oilShock * 0.6)

  const energyX = baseEnergy.x + (coalShortage * 0.7)
  const energyY = baseEnergy.y - (oilShock * 0.5)
  const energyScore = Math.max(coalShortage, oilShock)

  const agriX = baseAgri.x + (monsoonDelay * 0.5)
  const agriY = baseAgri.y + (floodImpact * 0.4)
  const agriScore = Math.max(monsoonDelay, floodImpact)

  const logisticsX = baseLogistics.x - (railStrike * 0.6)
  const logisticsY = baseLogistics.y - (portDisruption * 0.5)
  const logScore = Math.max(railStrike, portDisruption)

  const mfgX = baseMfg.x - (coalShortage * 0.4) - (railStrike * 0.3)
  const mfgY = baseMfg.y - (floodImpact * 0.5)
  const mfgScore = Math.max(coalShortage, floodImpact)

  const clamp = (val: number) => Math.max(-90, Math.min(90, Math.round(val)))

  return [
    {
      id: 'r-inf',
      name: 'Consumer Inflation Risk',
      x: clamp(inflationX),
      y: clamp(inflationY),
      severity: infScore > 65 ? 'high' : infScore > 25 ? 'medium' : 'low',
      description: `Driven by fuel shocks and monsoon agricultural lags. Current delta: +${(infScore/10).toFixed(1)}%`,
      category: 'Inflation'
    },
    {
      id: 'r-sup',
      name: 'Internal Supply Bottlenecks',
      x: clamp(supplyX),
      y: clamp(supplyY),
      severity: supplyScore > 65 ? 'high' : supplyScore > 25 ? 'medium' : 'low',
      description: `Yard delay warnings at major terminals. Speed down ${Math.round(supplyScore * 0.4)}%`,
      category: 'Supply Chain'
    },
    {
      id: 'r-trd',
      name: 'Sovereign Trade Balance',
      x: clamp(tradeX),
      y: clamp(tradeY),
      severity: tradeScore > 65 ? 'high' : tradeScore > 25 ? 'medium' : 'low',
      description: `Westbound container route deviations. Delay: +${Math.round(tradeScore * 0.15)} days`,
      category: 'Trade'
    },
    {
      id: 'r-eng',
      name: 'Energy Grid Reserves',
      x: clamp(energyX),
      y: clamp(energyY),
      severity: energyScore > 65 ? 'high' : energyScore > 25 ? 'medium' : 'low',
      description: `Coal inventories below threshold at generation hubs. Reserve drop: ${Math.round(energyScore * 0.8)}%`,
      category: 'Energy'
    },
    {
      id: 'r-agr',
      name: 'Agricultural Market Imbalances',
      x: clamp(agriX),
      y: clamp(agriY),
      severity: agriScore > 60 ? 'high' : agriScore > 20 ? 'medium' : 'low',
      description: `Arrival volumes dipping across top-tier regional mandis. Deviation: +${Math.round(agriScore * 0.4)}% price anomaly`,
      category: 'Agriculture'
    },
    {
      id: 'r-log',
      name: 'Intermodal Freight Logistics',
      x: clamp(logisticsX),
      y: clamp(logisticsY),
      severity: logScore > 60 ? 'high' : logScore > 20 ? 'medium' : 'low',
      description: `Rake turnaround delays at Dadri and JNPT terminals. Lead time: +${(logScore*0.12).toFixed(1)} hrs`,
      category: 'Logistics'
    },
    {
      id: 'r-mfg',
      name: 'Manufacturing Capacity Outflow',
      x: clamp(mfgX),
      y: clamp(mfgY),
      severity: mfgScore > 65 ? 'high' : mfgScore > 25 ? 'medium' : 'low',
      description: `Industrial output affected by grid outages and rail bottlenecks. Productivity: -${(mfgScore*0.2).toFixed(1)}%`,
      category: 'Manufacturing'
    }
  ]
}

// ─── Scenario Shock Simulator ──────────────────────────────

export interface ShockSimulationResult {
  gdpImpactPct: number
  inflationChangePct: number
  freightVolumeChangePct: number
  overallIndex: number
  simulationData: {
    month: string
    baseCase: number
    bestCase: number
    expectedCase: number
    worstCase: number
  }[]
}

export function simulateEconomicShock(
  oilShock: number,
  portDisruption: number,
  monsoonDelay: number,
  railStrike: number,
  floodImpact: number,
  coalShortage: number
): ShockSimulationResult {
  const oilInf = (oilShock / 100) * 1.5
  const oilGdp = -(oilShock / 100) * 0.8
  const oilFreight = -(oilShock / 100) * 1.2

  const portInf = (portDisruption / 100) * 0.6
  const portGdp = -(portDisruption / 100) * 0.4
  const portFreight = -(portDisruption / 100) * 1.8

  const monsoonInf = (monsoonDelay / 100) * 2.2
  const monsoonGdp = -(monsoonDelay / 100) * 0.7
  const monsoonFreight = -(monsoonDelay / 100) * 0.5

  const railInf = (railStrike / 100) * 0.4
  const railGdp = -(railStrike / 100) * 0.9
  const railFreight = -(railStrike / 100) * 3.5

  const floodInf = (floodImpact / 100) * 0.5
  const floodGdp = -(floodImpact / 100) * 0.3
  const floodFreight = -(floodImpact / 100) * 1.5

  const coalInf = (coalShortage / 100) * 0.8
  const coalGdp = -(coalShortage / 100) * 1.1
  const coalFreight = -(coalShortage / 100) * 2.5

  const gdpImpactPct = parseFloat((oilGdp + portGdp + monsoonGdp + railGdp + floodGdp + coalGdp).toFixed(2))
  const inflationChangePct = parseFloat((oilInf + portInf + monsoonInf + railInf + floodInf + coalInf).toFixed(2))
  const freightVolumeChangePct = parseFloat((oilFreight + portFreight + monsoonFreight + railFreight + floodFreight + coalFreight).toFixed(2))

  const baselineIndex = 74.3
  const indexShift = gdpImpactPct * 1.5 + freightVolumeChangePct * 0.4
  const overallIndex = Math.max(30, Math.min(95, parseFloat((baselineIndex + indexShift).toFixed(1))))

  const months = ['Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26']
  const simulationData = months.map((m, idx) => {
    const timeFactor = (idx + 1) / 6
    const base = parseFloat((baselineIndex + idx * 0.35).toFixed(1))
    const worstModifier = indexShift * 1.4 * timeFactor
    const expectedModifier = indexShift * timeFactor
    const bestModifier = indexShift * 0.6 * timeFactor

    return {
      month: m,
      baseCase: base,
      bestCase: Math.max(30, Math.min(99, parseFloat((base + bestModifier).toFixed(1)))),
      expectedCase: Math.max(30, Math.min(99, parseFloat((base + expectedModifier).toFixed(1)))),
      worstCase: Math.max(30, Math.min(99, parseFloat((base + worstModifier).toFixed(1)))),
    }
  })

  return {
    gdpImpactPct,
    inflationChangePct,
    freightVolumeChangePct,
    overallIndex,
    simulationData
  }
}

// ─── Format Utilities ──────────────────────────────────────

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatCr(cr: number): string {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)} Lakh Cr`
  return `₹${cr.toLocaleString('en-IN')} Cr`
}
