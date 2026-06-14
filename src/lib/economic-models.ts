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
