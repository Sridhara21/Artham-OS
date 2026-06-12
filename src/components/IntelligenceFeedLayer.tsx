'use client'
import { useState } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Bell, ShieldAlert, SlidersHorizontal, Search } from 'lucide-react'

export default function IntelligenceFeedLayer() {
  const { feedAlerts } = useARTHAMStore()
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [filterSector, setFilterSector] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Sector list derived dynamically
  const sectors = ['all', 'Logistics', 'Trade', 'Infrastructure', 'Agriculture', 'Market']

  const filteredAlerts = feedAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesSector = filterSector === 'all' || alert.sector === filterSector
    const matchesSearch = alert.text.toLowerCase().includes(searchQuery.toLowerCase()) || alert.region.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSeverity && matchesSector && matchesSearch
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left panel: Filters & stats - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="text-accent-purple animate-swing" size={14} />
              <h2 className="text-base font-bold text-text-1">Intelligence Feed</h2>
            </div>
            <Badge variant="live" dot>Alert Wire</Badge>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 font-mono text-[11px]">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-text-3" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts or regions..."
                className="w-full bg-black/30 border border-border/40 hover:border-border-bright focus:border-accent-purple focus:outline-none rounded pl-8 pr-3 py-2 text-[10px] text-text-1 placeholder-text-4 transition-all"
              />
            </div>

            {/* Severity Filter pills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-text-3 uppercase block mb-1">Filter Severity</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'critical', 'warning', 'info'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev as any)}
                    className={`py-1 px-2.5 rounded text-[9px] font-bold border transition-all ${
                      filterSeverity === sev
                        ? sev === 'critical'
                          ? 'bg-accent-red/10 border-accent-red text-accent-red'
                          : sev === 'warning'
                          ? 'bg-accent-amber/10 border-accent-amber text-accent-amber'
                          : sev === 'info'
                          ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                          : 'bg-text-1/10 border-text-1 text-text-1'
                        : 'bg-black/20 border-border/20 text-text-3 hover:text-text-2'
                    }`}
                  >
                    {sev.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sector Filter pills */}
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-[9px] text-text-3 uppercase block mb-1">Filter Sector</span>
              <div className="flex flex-wrap gap-1.5">
                {sectors.map(sec => (
                  <button
                    key={sec}
                    onClick={() => setFilterSector(sec)}
                    className={`py-1 px-2.5 rounded text-[9px] border transition-all ${
                      filterSector === sec
                        ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan font-bold shadow-glow-mint'
                        : 'bg-black/20 border-border/20 text-text-3 hover:text-text-2'
                    }`}
                  >
                    {sec.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-text-3 leading-relaxed border-t border-border/10 pt-3 mt-2">
              The wire streams direct sensory signals from Dedicated Freight Corridors, regional mandis, customs clearance logs, and ocean gateways.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Right panel: Active Wire Logs - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col min-h-[480px]">
        <CardHeader className="border-b border-border/20 pb-3 flex justify-between items-center w-full">
          <div>
            <h3 className="text-xs font-bold text-text-1 font-mono uppercase">Live Alert Wire Ticker</h3>
            <p className="text-[9px] text-text-3 font-mono mt-0.5">Streaming real-time economic telemetry flags</p>
          </div>
          <Badge variant="purple">{filteredAlerts.length} Active Records</Badge>
        </CardHeader>
        <CardBody className="p-4 flex-1 overflow-y-auto max-h-[420px] flex flex-col gap-3 pr-2">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 bg-black/20 border rounded transition-all flex gap-3.5 hover:border-border-bright items-start animate-fade-rise ${
                  alert.severity === 'critical'
                    ? 'border-accent-red/20 hover:border-accent-red/40'
                    : alert.severity === 'warning'
                    ? 'border-accent-amber/20 hover:border-accent-amber/40'
                    : 'border-border/15'
                }`}
              >
                {/* Timestamp tag */}
                <div className="font-mono text-[9px] bg-black/40 border border-border/10 text-text-3 py-1 px-2 rounded flex-shrink-0">
                  {alert.timestamp}
                </div>

                {/* Main body text */}
                <div className="flex-1 font-mono text-[11px] leading-relaxed">
                  <p className="text-text-1 mb-1.5">{alert.text}</p>
                  <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-text-3 font-semibold">
                    <div>SECTOR: <span className="text-accent-cyan font-bold uppercase">{alert.sector}</span></div>
                    <span className="w-1 h-1 rounded-full bg-text-4" />
                    <div>REGION: <span className="text-text-2 uppercase">{alert.region}</span></div>
                    <span className="w-1 h-1 rounded-full bg-text-4" />
                    <div className="flex items-center gap-1">
                      CONFIDENCE:
                      <Badge variant={alert.confidence > 90 ? 'green' : 'amber'} className="text-[8px] px-1 py-0 h-4">
                        {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Alarm severity dot indicator */}
                <div className="flex-shrink-0 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full block ${
                    alert.severity === 'critical'
                      ? 'bg-accent-red animate-pulse'
                      : alert.severity === 'warning'
                      ? 'bg-accent-amber'
                      : 'bg-accent-purple'
                  }`} />
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-3 py-24 gap-2 font-mono text-xs">
              <ShieldAlert size={28} className="text-text-3/40 animate-pulse" />
              <span>No alerts found matching current filters.</span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
