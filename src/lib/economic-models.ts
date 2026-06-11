// ─── Statistical Functions ─────────────────────────────────

function erf(x: number): number {
  const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429, p=0.3275911
  const sign = x >= 0 ? 1 : -1
  const absX = Math.abs(x)
  const t = 1 / (1 + p * absX)
  const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-absX*absX)
  return sign * y
}

function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function logNormalCDF(x: number, mu: number, sigma: number): number {
  if (x <= 0) return 0
  return normalCDF((Math.log(x) - mu) / sigma)
}

// ─── Delay Futures Pricing ─────────────────────────────────

export interface DelayPricingResult {
  pTrigger: number
  pTriggerPct: string
  premium: number
  expectedPayout: number
  maxPayout: number
  distribution: string
}

export function priceDelayContract(
  mu: number, sigma: number, thresholdMin: number,
  payoutPerMin = 100, payoutMultiplier = 1
): DelayPricingResult {
  const pTrigger = 1 - logNormalCDF(thresholdMin, mu, sigma)
  const maxPayout = thresholdMin * payoutPerMin * payoutMultiplier
  const expectedPayout = pTrigger * maxPayout
  const premium = expectedPayout * 1.20
  return {
    pTrigger: parseFloat(pTrigger.toFixed(4)),
    pTriggerPct: (pTrigger * 100).toFixed(1),
    premium: Math.round(premium),
    expectedPayout: Math.round(expectedPayout),
    maxPayout,
    distribution: `Log-Normal (μ=${mu}, σ=${sigma})`,
  }
}

// ─── Arbitrage Calculator ──────────────────────────────────

export interface ArbitrageResult {
  logisticsCost: number
  netProfit: number
  roi: number
  isPerishable: boolean
  profitable: boolean
}

const PERISHABLES = ['tomato','onion','alphonso','banana','mango','potato','grapes']

export function calculateArbitrage(
  buyPrice: number, sellPrice: number, distKm: number, commodityName: string
): ArbitrageResult {
  const isPerishable = PERISHABLES.some(p => commodityName.toLowerCase().includes(p))
  const logisticsCost = (2.5 * distKm / 100) + 0.5 + (isPerishable ? 0.8 : 0)
  const netProfit = sellPrice - buyPrice - logisticsCost
  return {
    logisticsCost: parseFloat(logisticsCost.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    roi: parseFloat((netProfit / buyPrice * 100).toFixed(1)),
    isPerishable,
    profitable: netProfit > 0,
  }
}

// ─── Carbon Credits (IPCC Tier 2) ─────────────────────────

export interface CarbonResult {
  totalPkm: number
  savedKg: number
  savedTonnes: number
  credits: number
  revenueInr: number
  revenueFmt: string
}

export function calculateCarbonCredits(passengers: number, distanceKm: number): CarbonResult {
  const RAIL_FACTOR = 0.041
  const ROAD_FACTOR = 0.171
  const PRICE_PER_CREDIT = 1247
  const totalPkm = passengers * distanceKm
  const savedKg = totalPkm * (ROAD_FACTOR - RAIL_FACTOR)
  const savedTonnes = savedKg / 1000
  const credits = Math.floor(savedTonnes)
  const revenueInr = credits * PRICE_PER_CREDIT
  return {
    totalPkm,
    savedKg: Math.round(savedKg),
    savedTonnes: parseFloat(savedTonnes.toFixed(2)),
    credits,
    revenueInr,
    revenueFmt: `₹${revenueInr.toLocaleString('en-IN')}`,
  }
}

// ─── Hedonic Pricing (Railway Land) ───────────────────────

export interface HedonicResult {
  valueCr: number
  reitGrade: 'AAA' | 'AA+' | 'AA' | 'A+'
  yieldPct: number
  twentyYrRevCr: number
  stationPremiumPct: number
  metroPremiumPct: number
}

export function applyHedonicPricing(
  areaHa: number, ratePerSqft: number,
  stationProxKm: number, metroConnected: boolean, zoneType: string
): HedonicResult {
  const areaSqft = areaHa * 10763.9
  const stationPremium = stationProxKm < 0.2 ? 1.38 : stationProxKm < 0.5 ? 1.22 : 1.10
  const metroPremium = metroConnected ? 1.15 : 1.0
  const zonePremium = zoneType === 'commercial' ? 1.10 : 1.0
  const valueCr = Math.round(areaSqft * ratePerSqft * stationPremium * metroPremium * zonePremium / 10000000)
  const reitGrade = valueCr > 500 ? 'AAA' : valueCr > 350 ? 'AA+' : valueCr > 200 ? 'AA' : 'A+'
  const yieldPct = reitGrade === 'AAA' ? 8.2 : reitGrade === 'AA+' ? 7.8 : 7.4
  return {
    valueCr,
    reitGrade,
    yieldPct,
    twentyYrRevCr: Math.round(valueCr * yieldPct / 100 * 20),
    stationPremiumPct: Math.round((stationPremium - 1) * 100),
    metroPremiumPct: metroConnected ? 15 : 0,
  }
}

// ─── Warehouse Demand Score ────────────────────────────────

export function computeWareHeatScore(signals: {
  industrial: { active: boolean; count: number }
  highway: { active: boolean }
  gstn: { active: boolean; growthPct: number }
  ecomm: { active: boolean }
}): number {
  let score = 0
  if (signals.industrial.active) score += 25 + Math.min(signals.industrial.count / 50 * 10, 10)
  if (signals.highway.active) score += 20
  if (signals.gstn.active) score += 25 + Math.min(signals.gstn.growthPct / 400 * 10, 10)
  if (signals.ecomm.active) score += 20
  return Math.min(Math.round(score), 100)
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
  oilShock: number, // % 0-100
  portDisruption: number, // % 0-100
  monsoonDelay: number, // % 0-100
  railStrike: number, // % 0-100
  floodImpact: number, // % 0-100
  coalShortage: number // % 0-100
): ShockSimulationResult {
  // Economic coefficients mapped to macro indicators
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
  // Compute composite score shift
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
