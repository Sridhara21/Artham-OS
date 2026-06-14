'use client'
import { useState, useEffect } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Activity, Wifi, Database, Newspaper, CloudSun, Cpu, ArrowRight, 
  RefreshCw, Play, CheckCircle2, ShieldAlert, FileText, Server, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ConnectorsLayer() {
  const {
    connectorStates,
    connectorLatency,
    livePrices,
    liveMacro,
    liveWeather,
    connectorLogs,
    pipelineStatus,
    pipelineStep,
    lastIngestedHeadline,
    liveSignalStats,
    fetchLiveData,
    triggerLivePipeline,
    toggleConnector
  } = useARTHAMStore()

  const [syncing, setSyncing] = useState(false)
  const [rssItems, setRssItems] = useState<any[]>([])

  // Load news list on mount
  useEffect(() => {
    // Read from the feed alerts in store that were parsed, or use defaults
    const fetchNewsFromBackend = async () => {
      try {
        const res = await fetch('/api/connectors')
        const data = await res.json()
        if (data.news) {
          setRssItems(data.news)
        }
      } catch (err) {
        console.error('Error fetching RSS list in component:', err)
      }
    }
    fetchNewsFromBackend()
  }, [])

  const handleManualSync = async () => {
    setSyncing(true)
    toast.loading('Synchronizing live economic indices...', { id: 'sync' })
    await fetchLiveData()
    
    // Refresh news list
    try {
      const res = await fetch('/api/connectors')
      const data = await res.json()
      if (data.news) {
        setRssItems(data.news)
      }
    } catch (err) {}

    setSyncing(false)
    toast.success('System synchronized to live Bloomberg/FRED indicators.', { id: 'sync', icon: '⚡' })
  }

  const handleIngest = async (headline: string) => {
    if (pipelineStatus !== 'idle') {
      toast.error('Causal Engine pipeline is currently processing another signal.')
      return
    }
    toast.success(`Ingesting: "${headline.substring(0, 40)}..."`, { icon: '📥' })
    await triggerLivePipeline(headline)
  }

  // Latency rating helper
  const getLatencyColor = (ms: number) => {
    if (ms < 100) return 'text-accent-green'
    if (ms < 200) return 'text-accent-mint'
    return 'text-accent-amber'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise select-none">
      {/* HEADER SECTION */}
      <div className="lg:col-span-12 flex justify-between items-center border-b border-border/20 pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-text-3 font-heading text-[9px] uppercase tracking-widest font-semibold">Sovereign Data Orchestrator</span>
          <h1 className="text-xl font-bold text-text-1 font-heading">CONNECTOR HUB</h1>
        </div>
        <Button 
          onClick={handleManualSync} 
          disabled={syncing || pipelineStatus !== 'idle'} 
          variant="ghost" 
          size="sm"
          className="border-accent-purple/40 text-accent-purple hover:bg-accent-purple/5 font-sans font-semibold text-[10px] flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'SYNCING...' : 'FORCE GLOBAL SYNC'}
        </Button>
      </div>

      {/* LEFT COLUMN: Active Feeds Panel & Logs (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Core APIs Status Cards */}
        <Card className="border-l-[3px] border-l-accent-purple">
          <CardHeader className="pb-2">
            <h3 className="text-xs font-bold text-text-1 font-heading uppercase">External API Connectors</h3>
          </CardHeader>
          <CardBody className="p-4 flex flex-col gap-3 font-sans text-[10px]">
            {/* FRED */}
            <div className="p-3 bg-black/20 rounded border border-border/20 flex justify-between items-center hover:border-border-bright transition-all">
              <div className="flex items-center gap-3">
                <Database className="text-accent-amber" size={16} />
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-text-1">FRED Database (Market Indices)</span>
                  <span className="text-text-3 text-[8.5px] font-sans">API: query1.finance.yahoo.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {connectorStates.marketFeed && (
                  <span className={`text-[9px] font-semibold font-mono ${getLatencyColor(connectorLatency.marketFeed)}`}>
                    {connectorLatency.marketFeed}ms
                  </span>
                )}
                <button 
                  onClick={() => toggleConnector('marketFeed')}
                  className={`w-8 h-4 rounded-full relative transition-all ${
                    connectorStates.marketFeed ? 'bg-accent-green' : 'bg-border/40'
                  }`}
                >
                  <span className={`w-3 h-3 bg-black rounded-full absolute top-0.5 transition-all ${
                    connectorStates.marketFeed ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* NewsAPI / RSS */}
            <div className="p-3 bg-black/20 rounded border border-border/20 flex justify-between items-center hover:border-border-bright transition-all">
              <div className="flex items-center gap-3">
                <Newspaper className="text-accent-purple" size={16} />
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-text-1">Bloomberg RSS Intelligence Wire</span>
                  <span className="text-text-3 text-[8.5px] font-sans">API: news.google.com/rss</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {connectorStates.newsFeed && (
                  <span className={`text-[9px] font-semibold font-mono ${getLatencyColor(connectorLatency.newsFeed)}`}>
                    {connectorLatency.newsFeed}ms
                  </span>
                )}
                <button 
                  onClick={() => toggleConnector('newsFeed')}
                  className={`w-8 h-4 rounded-full relative transition-all ${
                    connectorStates.newsFeed ? 'bg-accent-green' : 'bg-border/40'
                  }`}
                >
                  <span className={`w-3 h-3 bg-black rounded-full absolute top-0.5 transition-all ${
                    connectorStates.newsFeed ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* OpenWeather */}
            <div className="p-3 bg-black/20 rounded border border-border/20 flex justify-between items-center hover:border-border-bright transition-all">
              <div className="flex items-center gap-3">
                <CloudSun className="text-accent-cyan" size={16} />
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-text-1">Open-Meteo Grid (Weather Feeds)</span>
                  <span className="text-text-3 text-[8.5px] font-sans">API: api.open-meteo.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {connectorStates.weatherFeed && (
                  <span className={`text-[9px] font-semibold font-mono ${getLatencyColor(connectorLatency.weatherFeed)}`}>
                    {connectorLatency.weatherFeed}ms
                  </span>
                )}
                <button 
                  onClick={() => toggleConnector('weatherFeed')}
                  className={`w-8 h-4 rounded-full relative transition-all ${
                    connectorStates.weatherFeed ? 'bg-accent-green' : 'bg-border/40'
                  }`}
                >
                  <span className={`w-3 h-3 bg-black rounded-full absolute top-0.5 transition-all ${
                    connectorStates.weatherFeed ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Gemini Cognitive Engine */}
            <div className="p-3 bg-black/20 rounded border border-border/20 flex justify-between items-center hover:border-border-bright transition-all">
              <div className="flex items-center gap-3">
                <Cpu className="text-accent-mint animate-pulse" size={16} />
                <div className="flex flex-col">
                  <span className="font-heading font-semibold text-text-1">Gemini AI Engine (Cognitive Reasoning)</span>
                  <span className="text-text-3 text-[8.5px] font-sans">Model: gemini-2.0-flash</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9.5px] text-accent-green font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
                  ACTIVE
                </span>
              </div>
            </div>

          </CardBody>
        </Card>

        {/* Live Ingestion Log Console */}
        <Card className="flex-1 min-h-[260px] flex flex-col">
          <CardHeader className="pb-1">
            <div className="flex items-center gap-2">
              <Server className="text-text-3" size={13} />
              <h3 className="text-xs font-bold text-text-1 font-heading uppercase">Connection Ingestion Feed Logs</h3>
            </div>
          </CardHeader>
          <CardBody className="p-4 flex-1 flex flex-col font-mono text-[9px] leading-relaxed">
            <div className="flex-1 bg-black/40 border border-border/25 rounded p-3 overflow-y-auto max-h-[210px] text-text-3 flex flex-col gap-1 pr-1.5">
              {connectorLogs.map((log, idx) => (
                <div key={idx} className={
                  log.includes('[ERROR]') ? 'text-accent-red' :
                  log.includes('[PIPELINE]') ? 'text-accent-purple' :
                  log.includes('[SYNC]') ? 'text-accent-mint' : 
                  'text-text-3'
                }>
                  {log}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

      </div>

      {/* RIGHT COLUMN: Pipeline Diagram & News Trigger board (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">

        {/* Flow Pipeline Display */}
        <Card className="border-accent-purple/20">
          <CardHeader className="pb-1">
            <h3 className="text-xs font-bold text-text-2 font-heading uppercase">Active Economic Flow Pipeline</h3>
          </CardHeader>
          <CardBody className="p-4 flex flex-col gap-4">
            
            {/* The Visual Pipeline Schematic */}
            <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-sans select-none">
              
              {/* Step 1: Signal Ingestion */}
              <div className={`p-2 rounded border transition-all flex flex-col justify-between h-20 ${
                pipelineStep >= 1 
                  ? 'border-accent-purple bg-accent-purple/10 text-text-1 shadow-glow-purple' 
                  : 'border-border/30 bg-black/10 text-text-4'
              }`}>
                <span className="font-heading font-semibold uppercase">1. Ingestion</span>
                <Newspaper className={`mx-auto ${pipelineStep >= 1 ? 'text-accent-purple' : 'text-text-4'}`} size={16} />
                <span className="text-[7.5px] uppercase tracking-tighter truncate font-sans">Live Signals Feed</span>
              </div>

              {/* Step 2: Causal Reasoning */}
              <div className={`p-2 rounded border transition-all flex flex-col justify-between h-20 ${
                pipelineStep >= 2 
                  ? 'border-accent-mint bg-accent-mint/10 text-text-1 shadow-glow-mint' 
                  : 'border-border/30 bg-black/10 text-text-4'
              }`}>
                <span className="font-heading font-semibold uppercase">2. Reasoning</span>
                <Cpu className={`mx-auto ${pipelineStep >= 2 ? 'text-accent-mint' : 'text-text-4'}`} size={16} />
                <span className="text-[7.5px] uppercase tracking-tighter truncate font-sans">PRIME Causal Graph</span>
              </div>

              {/* Step 3: Predictive Forecast */}
              <div className={`p-2 rounded border transition-all flex flex-col justify-between h-20 ${
                pipelineStep >= 3 
                  ? 'border-accent-cyan bg-accent-cyan/10 text-text-1 shadow-glow-cyan' 
                  : 'border-border/30 bg-black/10 text-text-4'
              }`}>
                <span className="font-heading font-semibold uppercase">3. Prediction</span>
                <Activity className={`mx-auto ${pipelineStep >= 3 ? 'text-accent-cyan' : 'text-text-4'}`} size={16} />
                <span className="text-[7.5px] uppercase tracking-tighter truncate font-sans">Forecast Scenarios</span>
              </div>

              {/* Step 4: strategic Action */}
              <div className={`p-2 rounded border transition-all flex flex-col justify-between h-20 ${
                pipelineStep >= 4 
                  ? 'border-accent-amber bg-accent-amber/10 text-text-1 shadow-glow-amber' 
                  : 'border-border/30 bg-black/10 text-text-4'
              }`}>
                <span className="font-heading font-semibold uppercase">4. Decision</span>
                <CheckCircle2 className={`mx-auto ${pipelineStep >= 4 ? 'text-accent-amber animate-pulse' : 'text-text-4'}`} size={16} />
                <span className="text-[7.5px] uppercase tracking-tighter truncate font-sans">Action Portfolio</span>
              </div>

            </div>

            {/* Pipeline Ingestion Overlay */}
            {pipelineStatus !== 'idle' ? (
              <div className="bg-accent-purple/5 border border-accent-purple/35 rounded p-3 font-sans text-[10px] animate-pulse flex flex-col gap-1.5 text-text-2">
                <div className="flex justify-between font-heading font-semibold">
                  <span>PIPELINE ENGINE: ACTIVE</span>
                  <span className="text-accent-purple uppercase">{pipelineStatus}...</span>
                </div>
                <div className="text-text-3 font-normal truncate">
                  Target Signal: <span className="text-text-1 italic font-semibold">"{lastIngestedHeadline}"</span>
                </div>
                {/* Visual loading bars */}
                <div className="w-full h-1.5 bg-black/40 rounded overflow-hidden mt-1">
                  <div 
                    className="h-full bg-accent-purple transition-all duration-300"
                    style={{ width: `${(pipelineStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-black/20 border border-border/20 rounded p-3 font-sans text-[9.5px] text-text-3 leading-relaxed flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-accent-mint" size={14} />
                  <span>Sovereign pipeline idle. Ready for news signal injection.</span>
                </div>
                <Badge variant="live" className="font-mono font-medium">System Sync</Badge>
              </div>
            )}

          </CardBody>
        </Card>

        {/* Live News Alert Board */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-1 flex justify-between items-center w-full">
            <div>
              <h3 className="text-xs font-bold text-text-1 font-heading uppercase">Live News Intelligence Feed</h3>
              <p className="text-[9px] text-text-3 font-sans mt-0.5">Click any live headline below to trigger the ARTHAM reasoning cascade</p>
            </div>
            {/* Live Signals Counter widget */}
            <div className="font-mono text-[8px] bg-black/40 border border-border/20 px-2 py-1 rounded flex items-center gap-3">
              <div>Signals Today: <span className="text-text-1 font-medium font-mono">{liveSignalStats.totalSignals}</span></div>
              <div className="w-px h-2 bg-border/40" />
              <div className="text-accent-red font-medium font-mono">High: {liveSignalStats.highImpact}</div>
              <div className="w-px h-2 bg-border/40" />
              <div className="text-accent-amber font-medium font-mono">Med: {liveSignalStats.medImpact}</div>
            </div>
          </CardHeader>
          <CardBody className="p-4 flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-2.5 pr-2 font-sans">
            {rssItems.map((item, idx) => {
              const isHighSeverity = item.title.toLowerCase().match(/(disrupt|deficit|delay|spike|strike|crisis|congestion|clog)/)
              
              return (
                <div 
                  key={idx}
                  className={`p-3 bg-black/25 rounded border transition-all hover:border-border-bright flex justify-between items-center gap-4 ${
                    isHighSeverity ? 'border-accent-red/20' : 'border-border/15'
                  }`}
                >
                  <div className="flex-1 text-[10.5px] leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[8.5px] bg-black/40 border border-border/10 text-text-3 py-0.5 px-1.5 rounded uppercase font-semibold font-heading">
                        {item.source}
                      </span>
                      {isHighSeverity ? (
                        <Badge variant="red" className="text-[8px] font-mono font-medium px-1 py-0 h-4">HIGH IMPACT</Badge>
                      ) : (
                        <Badge variant="amber" className="text-[8px] font-mono font-medium px-1 py-0 h-4">MED IMPACT</Badge>
                      )}
                      <span className="text-[8px] text-text-3 font-mono">{new Date(item.pubDate).toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-text-1 font-semibold font-heading text-[11px] leading-snug">{item.title}</p>
                  </div>
                  
                  <Button
                    onClick={() => handleIngest(item.title)}
                    disabled={pipelineStatus !== 'idle'}
                    variant="primary"
                    size="sm"
                    className="flex-shrink-0 font-sans font-semibold text-[9px] h-7 px-3 bg-accent-purple/20 text-accent-purple border border-accent-purple/35 hover:bg-accent-purple hover:text-text-1 shadow-glow-purple flex items-center gap-1"
                  >
                    <Play className="fill-current" size={8} />
                    INGEST
                  </Button>
                </div>
              )
            })}
          </CardBody>
        </Card>

      </div>
      
    </div>
  )
}
