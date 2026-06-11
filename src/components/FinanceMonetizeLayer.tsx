'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Coins, TrendingUp, ShieldAlert, Cpu, ArrowUpRight, HelpCircle,
  Clock, ShieldCheck, HelpCircle as HelpIcon, Play, AlertTriangle,
  RotateCcw, Sparkles, MapPin, Truck, Leaf, FileText, ChevronRight, Zap
} from 'lucide-react'
import {
  priceDelayContract,
  calculateArbitrage,
  calculateCarbonCredits,
  applyHedonicPricing,
  formatINR,
  formatCr
} from '@/lib/economic-models'
import toast from 'react-hot-toast'

export default function FinanceMonetizeLayer() {
  const [activeSubTab, setActiveSubTab] = useState<'arbitrage' | 'fintech' | 'assets'>('arbitrage')

  // --- Sub-Tab 1: Arbitrage State ---
  const [selectedArbIdx, setSelectedArbIdx] = useState(0)
  const [executingArbId, setExecutingArbId] = useState<number | null>(null)
  const [executedArbIds, setExecutedArbIds] = useState<number[]>([])

  const arbitrageData = [
    { id: 1, commodity: 'Tomato', from: 'Nashik, MH', to: 'Lucknow, UP', buy: 8, sell: 42, dist: 1480, status: 'Available' },
    { id: 2, commodity: 'Onion', from: 'Lasalgaon, MH', to: 'Delhi NCR', buy: 12, sell: 38, dist: 1440, status: 'Available' },
    { id: 3, commodity: 'Alphonso', from: 'Ratnagiri, MH', to: 'Mumbai, MH', buy: 60, sell: 120, dist: 320, status: 'Available' },
    { id: 4, commodity: 'Banana', from: 'Jalgaon, MH', to: 'Kolkata, WB', buy: 18, sell: 45, dist: 1890, status: 'Available' }
  ]

  const activeArb = arbitrageData[selectedArbIdx]
  const arbMetrics = useMemo(() => {
    return calculateArbitrage(activeArb.buy, activeArb.sell, activeArb.dist, activeArb.commodity)
  }, [activeArb])

  const handleExecuteArbitrage = (id: number, commodity: string) => {
    setExecutingArbId(id)
    toast.loading(`Securing mandi logistics and lockouts...`, { id: 'arb-lock' })
    setTimeout(() => {
      setExecutingArbId(null)
      setExecutedArbIds(prev => [...prev, id])
      toast.success(`Arbitrage Executed: 3 reefer wagons booked for ${commodity} route.`, { id: 'arb-lock', icon: '🌾' })
    }, 2000)
  }

  // --- Sub-Tab 2: Fintech & Customs State ---
  const [selectedTrainIdx, setSelectedTrainIdx] = useState(0)
  const [thresholdMinutes, setThresholdMinutes] = useState(60)
  const [contractPayout, setContractPayout] = useState(2000)
  const [buyingContract, setBuyingContract] = useState(false)
  const [hsDescription, setHsDescription] = useState(
    'Autonomous warehouse sorting robot with LiDAR navigation sensor array, onboard NVIDIA Jetson AGX Orin ML processor, motorized conveyor belt mechanism, and computer vision system for package identification — for use in e-commerce fulfillment centers'
  )
  const [hsClassifying, setHsClassifying] = useState(false)
  const [hsResult, setHsResult] = useState<any>(null)

  const trainsList = [
    { name: '12952 Mumbai Rajdhani', mu: 3.21, sigma: 0.84 },
    { name: '12301 Howrah Rajdhani', mu: 3.38, sigma: 0.91 },
    { name: '12691 Bengaluru Rajdhani', mu: 3.09, sigma: 0.79 }
  ]

  const activeTrain = trainsList[selectedTrainIdx]
  const delayFutures = useMemo(() => {
    return priceDelayContract(activeTrain.mu, activeTrain.sigma, thresholdMinutes, 100, contractPayout / 1000)
  }, [activeTrain, thresholdMinutes, contractPayout])

  const handleBuyContract = () => {
    setBuyingContract(true)
    toast.loading(`Pricing and committing to delay ledger...`, { id: 'futures-buy' })
    setTimeout(() => {
      setBuyingContract(false)
      toast.success(`Derivative Secured: ${activeTrain.name} @ >${thresholdMinutes} mins threshold.`, { id: 'futures-buy', icon: '💹' })
    }, 1800)
  }

  const handleClassifyHSCode = () => {
    setHsClassifying(true)
    toast.loading(`Consulting CBIC registries and FTA rulesets...`, { id: 'hs-oracle' })
    setTimeout(() => {
      setHsClassifying(false)
      setHsResult({
        code: '8428.90',
        desc: 'Industrial Conveyor & Handling Machinery',
        duty: '7.5% BCD + 10% IGST = 17.5%',
        savings: '₹37.5 Lakh standard route saved',
        cepaSavings: '₹75.0 Lakh UAE CEPA route (0% BCD) saved',
        alternatives: [
          { code: '8471.50', desc: 'ADP Processing Units', rate: '0% BCD', delta: '−7.5% BCD savings recommended' },
          { code: '8479.89', desc: 'Other Industrial Machines', rate: '10% BCD', delta: '+2.5% premium' }
        ]
      })
      toast.success(`HS Classification Complete: Optimizations found.`, { id: 'hs-oracle', icon: '🔮' })
    }, 1500)
  }

  // --- Sub-Tab 3: Real Asset State ---
  const [carbonPassengers, setCarbonPassengers] = useState(1140)
  const [carbonDistance, setCarbonDistance] = useState(1380)
  const carbonResult = useMemo(() => {
    return calculateCarbonCredits(carbonPassengers, carbonDistance)
  }, [carbonPassengers, carbonDistance])

  const [landAreaHa, setLandAreaHa] = useState(12.4)
  const [landRateSqft, setLandRateSqft] = useState(8500)
  const [stationProx, setStationProx] = useState(0.15)
  const [metroConnected, setMetroConnected] = useState(true)
  const [landZone, setLandZone] = useState('commercial')

  const landResult = useMemo(() => {
    return applyHedonicPricing(landAreaHa, landRateSqft, stationProx, metroConnected, landZone)
  }, [landAreaHa, landRateSqft, stationProx, metroConnected, landZone])

  const [dispatchingRetention, setDispatchingRetention] = useState(false)
  const handleDispatchRetention = () => {
    setDispatchingRetention(true)
    toast.loading(`Injecting retention incentives to driver ledger...`, { id: 'fleet-ret' })
    setTimeout(() => {
      setDispatchingRetention(false)
      toast.success(`Campaign Dispatched: Bonus offerings locked to 23 high-risk driver profiles.`, { id: 'fleet-ret', icon: '🚛' })
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-rise">
      {/* Tab Navigation header */}
      <div className="flex items-center justify-between border-b border-border/20 pb-3">
        <div className="flex items-center gap-1.5">
          <Coins className="text-accent-pink animate-pulse" size={16} />
          <h2 className="text-sm font-bold text-text-1 font-mono uppercase tracking-wider">Arbitrage, Fintech & Real Assets</h2>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'arbitrage' as const, label: '🌾 Arbitrage & Deals', icon: '🌾' },
            { id: 'fintech' as const, label: '💹 Fintech & Customs', icon: '💹' },
            { id: 'assets' as const, label: '🚀 Property & Carbon', icon: '🚀' }
          ].map(sub => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`py-1.5 px-3 rounded text-[11px] font-semibold font-mono border transition-all ${
                activeSubTab === sub.id
                  ? 'bg-accent-pink/10 border-accent-pink text-accent-pink shadow-glow-purple font-bold'
                  : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
              }`}
            >
              <span>{sub.icon}</span> <span className="ml-1">{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: ARBITRAGE & DEALS */}
      {activeSubTab === 'arbitrage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
          {/* Left panel: Arbitrage listings - 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">MandiArb™ Live Arbitrage Scanner</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Scanning 7,500 mandis · 500 commodities · Dynamic route offsets</p>
                </div>
                <Badge variant="mint">₹847 Cr Opportunity</Badge>
              </CardHeader>
              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px] leading-relaxed border-collapse">
                    <thead>
                      <tr className="border-b border-border/20 text-text-3 text-[9px] uppercase tracking-wider bg-black/10">
                        <th className="py-2.5 px-4">Commodity</th>
                        <th className="py-2.5 px-3">From</th>
                        <th className="py-2.5 px-3">To</th>
                        <th className="py-2.5 px-3 text-right">Spread</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arbitrageData.map((arb, idx) => {
                        const isSelected = selectedArbIdx === idx
                        const isExecuted = executedArbIds.includes(arb.id)
                        return (
                          <tr
                            key={arb.id}
                            onClick={() => setSelectedArbIdx(idx)}
                            className={`border-b border-border/10 cursor-pointer transition-all hover:bg-white/5 ${
                              isSelected ? 'bg-accent-pink/5 font-semibold text-text-1' : 'text-text-2'
                            }`}
                          >
                            <td className="py-3 px-4 font-bold">{arb.commodity}</td>
                            <td className="py-3 px-3">{arb.from.split(',')[0]}</td>
                            <td className="py-3 px-3">{arb.to.split(',')[0]}</td>
                            <td className="py-3 px-3 text-right text-accent-green">₹{arb.buy} → ₹{arb.sell}</td>
                            <td className="py-3 px-4 text-center">
                              {isExecuted ? (
                                <span className="py-0.5 px-2 bg-accent-green/10 border border-accent-green text-accent-green text-[9px] rounded font-bold uppercase">Locked</span>
                              ) : (
                                <span className="py-0.5 px-2 bg-accent-cyan/10 border border-accent-cyan text-accent-cyan text-[9px] rounded uppercase">Scan</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* Wagon Capacity & Fraud Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader>
                  <h4 className="text-[10px] font-mono font-bold text-text-2 uppercase tracking-wider">Empty Wagon Allocation</h4>
                </CardHeader>
                <CardBody className="flex items-center gap-4 py-3 font-mono text-[10px] text-text-3">
                  <div className="w-16 h-16 rounded-full border-[6px] border-accent-red border-t-accent-cyan flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-text-1">38%</span>
                  </div>
                  <div>
                    <span className="text-text-2 font-bold block mb-1">38% Lost Capacity</span>
                    Empty wagons positioning return runs cost <span className="text-accent-red">₹847 Cr/day</span>. Reallocating routes via MandiArb bypasses.
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="text-[10px] font-mono font-bold text-text-2 uppercase tracking-wider">Tatkal Booking Fraud scan</h4>
                </CardHeader>
                <CardBody className="flex flex-col gap-2 font-mono text-[10px]">
                  <div className="flex justify-between items-center text-text-2">
                    <span>Blocked Agent Accounts:</span>
                    <span className="text-accent-red font-bold">15,247</span>
                  </div>
                  <div className="flex justify-between items-center text-text-2">
                    <span>Scalper Revenue Seized:</span>
                    <span className="text-accent-red font-bold">₹38.4 Cr</span>
                  </div>
                  <div className="flex justify-between items-center text-accent-green font-semibold">
                    <span>Enforcement Status:</span>
                    <span>98.4% Secure</span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Right panel: Arbitrage details calculator - 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Card className="flex-1 flex flex-col justify-between">
              <CardHeader className="border-b border-border/10 pb-3">
                <span className="text-xs font-bold font-mono text-text-1 uppercase">Route Profitability Model</span>
                <Badge variant="cyan">Perishable: {arbMetrics.isPerishable ? 'YES' : 'NO'}</Badge>
              </CardHeader>
              <CardBody className="p-5 flex-1 flex flex-col gap-4 font-mono text-[11px] justify-between">
                <div>
                  <span className="text-text-3 text-[9px] block uppercase mb-1">Arbitrage Pipeline</span>
                  <div className="bg-black/35 border border-border/10 rounded p-3 text-text-1 text-center font-bold">
                    {activeArb.commodity} Buy in {activeArb.from} → Sell in {activeArb.to}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Transit Distance</span>
                    <span className="font-bold text-text-1">{activeArb.dist} km</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Calculated Fuel Cost</span>
                    <span className="font-bold text-accent-red">₹{arbMetrics.logisticsCost}/kg</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Estimated Net Return</span>
                    <span className="font-bold text-accent-green">₹{arbMetrics.netProfit}/kg</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Arbitrage ROI %</span>
                    <span className="font-bold text-accent-cyan">{arbMetrics.roi}%</span>
                  </div>
                </div>

                <div className="border-t border-border/10 pt-4">
                  {executedArbIds.includes(activeArb.id) ? (
                    <div className="w-full py-2.5 bg-accent-green/10 border border-accent-green rounded text-accent-green flex items-center justify-center gap-1.5 font-bold">
                      <ShieldCheck size={14} /> WAGONS COMMITTED & LOCKED
                    </div>
                  ) : (
                    <Button
                      variant="mint"
                      disabled={executingArbId !== null}
                      onClick={() => handleExecuteArbitrage(activeArb.id, activeArb.commodity)}
                      className="w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Cpu size={14} />
                      {executingArbId === activeArb.id ? 'Securing Wagons...' : 'Execute Arbitrage Contract'}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FINTECH & CUSTOMS */}
      {activeSubTab === 'fintech' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
          {/* Left panel: Train Delay Futures - 6 cols */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">TrainDelay Futures™ Derivatives</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Log-Normal risk loading & automated execution ledgers</p>
                </div>
                <Badge variant="purple">Fintech derivatives</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 font-mono text-[11px]">
                {/* Select train */}
                <div>
                  <label className="text-[9px] text-text-3 block uppercase mb-1">Select Core Cargo Train</label>
                  <select
                    value={selectedTrainIdx}
                    onChange={(e) => setSelectedTrainIdx(parseInt(e.target.value))}
                    className="w-full bg-black/30 border border-border/40 hover:border-border-bright rounded p-2 text-xs text-text-1 outline-none"
                  >
                    {trainsList.map((t, idx) => (
                      <option key={idx} value={idx}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Delay threshold */}
                <div>
                  <label className="text-[9px] text-text-3 block uppercase mb-1.5">Committal Delay Threshold</label>
                  <div className="flex gap-2">
                    {[30, 60, 90, 120].map(mins => (
                      <button
                        key={mins}
                        onClick={() => setThresholdMinutes(mins)}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all ${
                          thresholdMinutes === mins
                            ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                            : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2'
                        }`}
                      >
                        {mins} mins
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payout target */}
                <div>
                  <label className="text-[9px] text-text-3 block uppercase mb-1.5">Option Payout target</label>
                  <div className="flex gap-2">
                    {[1000, 2000, 5000, 10000].map(p => (
                      <button
                        key={p}
                        onClick={() => setContractPayout(p)}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold border transition-all ${
                          contractPayout === p
                            ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                            : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2'
                        }`}
                      >
                        ₹{p.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/10 pt-3">
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Probability</span>
                    <span className="font-bold text-accent-amber">{delayFutures.pTriggerPct}%</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Commited Premium</span>
                    <span className="font-bold text-accent-cyan">₹{delayFutures.premium.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Expected Payout</span>
                    <span className="font-bold text-accent-red">₹{delayFutures.expectedPayout.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Theoretical Model</span>
                    <span className="font-bold text-text-2 truncate block">{delayFutures.distribution}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  disabled={buyingContract}
                  onClick={handleBuyContract}
                  className="w-full text-xs py-2 flex items-center justify-center gap-1.5 mt-2"
                >
                  <Coins size={13} /> {buyingContract ? 'Booking Contract...' : 'Hedge Supply Delay Risks'}
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Right panel: HSCode Oracle - 6 cols */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">🔮 HSCode Oracle™ customs Duty Optimizer</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Automated HSCode classification & FTA duty minimizing loops</p>
                </div>
                <Badge variant="mint">₹47.3 Cr saved today</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 font-mono text-[11px]">
                <div>
                  <label className="text-[9px] text-text-3 block uppercase mb-1">Describe Imported Asset</label>
                  <textarea
                    value={hsDescription}
                    onChange={(e) => setHsDescription(e.target.value)}
                    className="w-full h-16 bg-black/30 border border-border/40 hover:border-border-bright focus:border-accent-mint focus:outline-none rounded p-2.5 text-[11px] leading-relaxed resize-none transition-all placeholder-text-4"
                  />
                </div>

                <Button
                  variant="mint"
                  disabled={hsClassifying}
                  onClick={handleClassifyHSCode}
                  className="w-full text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} /> {hsClassifying ? 'Analyzing Tariffs...' : 'Run Customs Optimization Check'}
                </Button>

                {hsResult && (
                  <div className="animate-fade-rise flex flex-col gap-3 border-t border-border/10 pt-3">
                    <div className="flex justify-between items-center bg-black/20 p-2.5 rounded border border-border/10">
                      <div>
                        <span className="text-[9px] text-text-3 block uppercase">Recommended HSCode</span>
                        <span className="text-xs font-bold text-accent-purple">{hsResult.code} ({hsResult.desc})</span>
                      </div>
                      <Badge variant="purple">{hsResult.duty}</Badge>
                    </div>

                    {/* FTA savings */}
                    <div className="bg-accent-green/5 border border-accent-green/20 rounded p-2.5">
                      <span className="text-[8px] font-bold text-accent-green block uppercase mb-0.5">India-UAE CEPA Treaty Benefit</span>
                      <p className="text-[10px] text-text-1 font-semibold leading-relaxed">
                        {hsResult.cepaSavings} (standard duty route would be {hsResult.savings}).
                      </p>
                    </div>

                    {/* Alternative classifications */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[8px] text-text-3 block uppercase">Alternative Classifications Checks</span>
                      {hsResult.alternatives.map((alt: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-black/10 p-2 rounded border border-border/10 text-[10px] text-text-2">
                          <span>Code {alt.code} — {alt.desc}</span>
                          <span className={alt.delta.includes('savings') ? 'text-accent-green font-bold' : 'text-accent-red font-bold'}>{alt.delta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROPERTY & CARBON */}
      {activeSubTab === 'assets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
          {/* Left panel: Carbon credits - 6 cols */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">💚 RailCarbon™ Credits Minting loop</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Verra VCS standard IPCC Tier 2 savings tracker</p>
                </div>
                <Badge variant="purple">Minting Active</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 font-mono text-[11px]">
                {/* Sliders */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-text-2">
                    <span>Electric Rail passengers</span>
                    <span className="text-accent-purple font-bold">{carbonPassengers} passengers</span>
                  </div>
                  <input
                    type="range" min="100" max="3000" step="50"
                    value={carbonPassengers}
                    onChange={(e) => setCarbonPassengers(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-text-2">
                    <span>Average transit distance</span>
                    <span className="text-accent-purple font-bold">{carbonDistance} km</span>
                  </div>
                  <input
                    type="range" min="50" max="2500" step="50"
                    value={carbonDistance}
                    onChange={(e) => setCarbonDistance(parseInt(e.target.value))}
                    className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/10 pt-3">
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Carbon saved</span>
                    <span className="font-bold text-accent-green">{carbonResult.savedTonnes} t CO2</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Verra Credits Minted</span>
                    <span className="font-bold text-accent-cyan">{carbonResult.credits} credits</span>
                  </div>
                  <div className="col-span-2 bg-black/20 p-3 rounded border border-border/10 text-center">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">CBL exchange Revenue generated</span>
                    <span className="text-base font-extrabold text-accent-green">{carbonResult.revenueFmt}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Truck Attrition Driver risk */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">🚛 TruckAttrition AI™ Fleet Predictor</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Driver resignation logs & LTV assessments</p>
                </div>
                <Badge variant="red">23 High Risk profiles</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-3 font-mono text-[10px] text-text-3">
                <div className="bg-black/20 p-3 rounded border border-border/10 leading-relaxed text-text-2">
                  Truck driver attrition forecasts indicate a <span className="text-accent-red">23% attrition spike</span> in western sectors due to NH-48 toll detours. Avoid replacement costs (₹9.2 Lakh total) via immediate retention campaign overrides.
                </div>
                <Button
                  variant="mint"
                  disabled={dispatchingRetention}
                  onClick={handleDispatchRetention}
                  className="w-full py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Truck size={13} /> {dispatchingRetention ? 'Dispatching Campaigns...' : 'Activate fleet Retention campaigns'}
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* Right panel: RailLand REIT & Wareheat - 6 cols */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">🏢 RailLand™ REIT Valuation Engine</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Hedonic land parcel pricing for sovereign lease packages</p>
                </div>
                <Badge variant="purple">REIT GRADE: {landResult.reitGrade}</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 font-mono text-[11px]">
                {/* Sliders */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-text-2">
                      <span>Area Size (Ha)</span>
                      <span className="text-accent-purple font-bold">{landAreaHa} Ha</span>
                    </div>
                    <input
                      type="range" min="1" max="50" step="0.5"
                      value={landAreaHa}
                      onChange={(e) => setLandAreaHa(parseFloat(e.target.value))}
                      className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-text-2">
                      <span>Base rate/sqft</span>
                      <span className="text-accent-purple font-bold">₹{landRateSqft}</span>
                    </div>
                    <input
                      type="range" min="1000" max="25000" step="500"
                      value={landRateSqft}
                      onChange={(e) => setLandRateSqft(parseInt(e.target.value))}
                      className="w-full h-1 bg-black/40 rounded-lg appearance-none cursor-pointer accent-accent-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-border/10 pt-3 text-xs">
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Station Premium</span>
                    <span className="font-bold text-accent-green">+{landResult.stationPremiumPct}%</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">Metro Premium</span>
                    <span className="font-bold text-accent-cyan">+{landResult.metroPremiumPct}%</span>
                  </div>
                  <div className="bg-black/20 p-2.5 rounded border border-border/10">
                    <span className="text-text-3 text-[8px] block uppercase mb-1">REIT Yield</span>
                    <span className="font-bold text-accent-purple">{landResult.yieldPct}%/yr</span>
                  </div>
                  <div className="col-span-3 bg-accent-purple/5 p-3 rounded border border-accent-purple/20 text-center flex flex-col justify-center h-16">
                    <span className="text-text-3 text-[8px] uppercase">20-Year Cumulative Lease Revenue Projections</span>
                    <span className="text-base font-extrabold text-accent-purple">{formatCr(landResult.twentyYrRevCr)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Wareheat list */}
            <Card>
              <CardHeader>
                <div>
                  <h3 className="text-xs font-bold text-text-1 font-mono uppercase">🔮 WareHeat™ emerging zones scoring</h3>
                  <p className="text-[10px] text-text-3 font-mono mt-0.5">Scoring industrial warehouse demand points ahead of pricing</p>
                </div>
                <Badge variant="mint">94% backtest</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-3 font-mono text-[10px]">
                {[
                  { name: 'Hosur, Tamil Nadu', score: 87, timing: '8-14 months', trend: 'CRITICAL' },
                  { name: 'Bhiwadi, Rajasthan', score: 74, timing: '12-20 months', trend: 'HIGH' },
                  { name: 'Ludhiana East, Punjab', score: 62, timing: '18-28 months', trend: 'EMERGING' }
                ].map((zone, idx) => (
                  <div key={idx} className="p-2.5 bg-black/20 border border-border/20 rounded flex justify-between items-center hover:border-border-bright transition-all">
                    <div>
                      <span className="font-bold text-text-1 block">{zone.name}</span>
                      <span className="text-[9px] text-text-3">Timing: {zone.timing}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-accent-purple font-bold block">Score: {zone.score}/100</span>
                      <span className={`text-[8px] font-bold ${zone.trend === 'CRITICAL' ? 'text-accent-red' : zone.trend === 'HIGH' ? 'text-accent-amber' : 'text-accent-cyan'}`}>{zone.trend}</span>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
