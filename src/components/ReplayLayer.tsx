'use client'
import { useEffect, useRef } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { REPLAY_EVENTS } from '@/lib/mock-data'
import { Play, Pause, RotateCcw, CheckCircle2, History, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ReplayLayer() {
  const {
    selectedReplayId, replayPlaying, replayCurrentDay, replayLogTimeline,
    selectReplayEvent, setReplayPlaying, resetReplay, advanceReplay
  } = useARTHAMStore()

  const intervalRef = useRef<any>(null)

  const selectedEvent = REPLAY_EVENTS.find(e => e.id === selectedReplayId) || null

  // Playback timer loop
  useEffect(() => {
    if (replayPlaying && selectedReplayId) {
      intervalRef.current = setInterval(() => {
        advanceReplay()
      }, 2500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [replayPlaying, selectedReplayId, advanceReplay])

  const handleTogglePlay = () => {
    if (!selectedReplayId) return
    setReplayPlaying(!replayPlaying)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      <div className="lg:col-span-12 flex flex-col gap-1 border-b border-border/20 pb-2 mb-2">
        <span className="text-accent-purple font-heading text-[9px] uppercase tracking-widest leading-none font-semibold">REPLAY // What actually happened?</span>
      </div>
      {/* Left panel: Chronos disruptions list - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="text-accent-purple" size={14} />
              <h2 className="text-base font-semibold text-text-1 font-heading">Historical Intelligence</h2>
            </div>
            <Badge variant="purple">CRISIS REPLAY</Badge>
          </CardHeader>
          <CardBody className="font-sans">
            <span className="text-[9px] font-heading font-semibold text-text-3 uppercase block tracking-wider mb-2.5">Select Historical Crisis Replay</span>
            <div className="flex flex-col gap-2">
              {REPLAY_EVENTS.map(e => (
                <button
                  key={e.id}
                  onClick={() => selectReplayEvent(e.id)}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold font-heading border transition-all flex items-center justify-between ${
                    selectedReplayId === e.id
                      ? 'bg-accent-purple/10 border-accent-purple text-accent-purple shadow-glow-purple'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span className="font-heading font-semibold">{e.name} (<span className="font-mono">{e.year}</span>)</span>
                  <Badge variant={selectedReplayId === e.id ? 'purple' : 'ghost'} className="font-mono">Select</Badge>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-text-3 leading-relaxed mt-4 border-t border-border/10 pt-3">
              Replay historical supply chain disruptions day-by-day to observe how signals propagated and compare historical outcomes with Autopilot mitigations.
            </p>
          </CardBody>
        </Card>

        {/* Playback Controls */}
        {selectedEvent && (
          <Card className="animate-fade-rise">
            <CardHeader>
              <h3 className="text-xs font-semibold text-text-2 font-heading uppercase tracking-wider">Time Machine Controls</h3>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 font-sans">
              <div className="flex items-center justify-between bg-black/20 p-3 rounded border border-border/10 text-xs">
                <span className="text-text-3 font-heading font-semibold uppercase tracking-wider">REPLAY DAY</span>
                <span className="text-base font-semibold font-mono text-accent-purple">Day {replayCurrentDay}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={replayPlaying ? 'amber' : 'mint'}
                  onClick={handleTogglePlay}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold font-heading"
                >
                  {replayPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{replayPlaying ? 'Pause Replay' : 'Start Replay'}</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetReplay}
                  className="flex-shrink-0 px-3 py-2"
                >
                  <RotateCcw size={13} />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Right panel: Timeline Logs - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[440px]">
        <CardHeader className="border-b border-border/10 pb-3 flex justify-between items-center w-full">
          <h3 className="text-xs font-semibold text-text-1 font-heading uppercase">Replay Console logs</h3>
          {selectedEvent && (
            <Badge variant="purple" className="font-heading font-semibold">{selectedEvent.name} Timeline</Badge>
          )}
        </CardHeader>
        <CardBody className="flex-1 p-5 flex flex-col justify-between font-sans">
          {selectedEvent ? (
            (() => {
              const eventDetails = selectedEvent.id === 'c-suez' ? {
                eventSummary: 'Geopolitical and physical blockade of the Suez Canal by the Ever Given container vessel, disrupting 12% of global trade and freezing Indian westward shipping lanes.',
                decisionTaken: 'Delayed rerouting decisions, waiting for salvage clearance. Downstream cargo rakes halted at dry ports due to schedule confusion.',
                economicImpact: 'Container charter rates spiked +240%, import fertilizer costs rose +9.4%, and average logistics dwell times expanded by 14.5 days.',
                arthamAlternative: 'Instant detection of vessel telemetry anomaly; trigger advance CEPA Customs bypass filings; reallocate empty rakes to alternative gateways.',
                projectedOutcome: 'Logistics dwell bottleneck reduced by 5.2 days; fertilizer input cost volatility minimized by ₹18.2 Cr in agricultural zones.',
                lessonsLearned: 'Sovereign supply buffers must scale dynamically in response to global maritime transshipment bottlenecks before cargo vessels arrive at harbor.'
              } : {
                eventSummary: 'Red Sea drone strikes forcing global container cargo to bypass Suez routes in 2024, causing shipping rate spikes and fertilizer supply delays.',
                decisionTaken: 'Standard marine carriers rerouted cargo around the Cape of Good Hope, while trade departments responded reactively to input price surges.',
                economicImpact: 'Raw fertilizer import prices rose +9.4%, increasing agricultural input costs by +6.2% at regional mandis, raising food CPI pressure.',
                arthamAlternative: 'Establish Cape route transit windows; procure cargo hedges; unlock national fertilizer reserves in northern states to stabilize prices.',
                projectedOutcome: 'Mandi price surges stabilized within 5 days; food inflation offsets minimized by 24 bps, preventing MPC rate hiking triggers.',
                lessonsLearned: 'Climatic and geopolitical risks pass through to mandi prices rapidly. Strategic fuel credit subsidies absorb freight costs early.'
              }

              return (
                <div className="flex-1 flex flex-col lg:flex-row gap-6">
                  {/* Day logs stack */}
                  <div className="flex-1 flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {replayLogTimeline.map((step, idx) => (
                      <div key={idx} className="p-3 bg-black/20 rounded border border-border/20 hover:border-border-bright transition-all animate-fade-rise flex gap-3">
                        <div className="flex-shrink-0 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-mono font-bold text-[10px] w-12 h-6 rounded flex items-center justify-center">
                          Day {step.day}
                        </div>
                        <div className="flex-1 text-[11px]">
                          <p className="text-text-1 leading-relaxed mb-2 font-medium">{step.log}</p>
                          
                          {/* Comparative Box */}
                          <div className="grid grid-cols-2 gap-2 border-t border-border/10 pt-2 text-[10px] leading-relaxed">
                            <div className="bg-black/30 p-2 rounded border border-accent-red/15 text-text-2">
                              <span className="text-accent-red font-semibold uppercase block text-[8px] mb-0.5 font-heading">Historical Action Taken</span>
                              {step.day === 1 ? 'Deploy standard harbor tugs; wait for authority clearance.' : step.day === 3 ? 'Route cargo queues to nearby ports, overloading them.' : 'Spot charter premiums surcharges accepted.'}
                            </div>
                            <div className="bg-accent-purple/5 p-2 rounded border border-accent-purple/15 text-text-1 font-semibold">
                              <span className="text-accent-purple font-semibold block text-[8px] mb-0.5 font-heading">Autopilot Alternate Option</span>
                              {step.day === 1 ? 'Bypass customs checks via advance CEPA classifications.' : step.day === 3 ? 'Instantly redirect 12% container traffic to dry rail bypass lines.' : 'Reallocate empty wagons from central zones.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status summary box */}
                  <div className="w-full lg:w-80 bg-black/25 rounded border border-border/30 p-4 h-fit flex flex-col gap-4">
                    <div className="border-b border-border/10 pb-2 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-text-3 block uppercase font-heading tracking-wider font-semibold">Historical intelligence</span>
                        <span className="text-xs font-semibold text-text-1 font-heading uppercase">{selectedEvent.name} (<span className="font-mono">{selectedEvent.year}</span>)</span>
                      </div>
                      <Badge variant="red" className="text-[7px] font-semibold font-mono">AFTER ACTION REPORT</Badge>
                    </div>
                    
                    {/* Event Summary */}
                    <div className="flex flex-col gap-1 text-[9.5px]">
                      <span className="text-[8px] text-text-3 font-semibold font-heading uppercase tracking-wider">Historical Event Summary</span>
                      <p className="text-text-2 leading-relaxed text-justify font-sans">{eventDetails.eventSummary}</p>
                    </div>

                    {/* Decision Taken */}
                    <div className="flex flex-col gap-1 text-[9.5px] border-t border-border/10 pt-2.5">
                      <span className="text-[8px] text-accent-red font-semibold font-heading uppercase tracking-wider">Decision Taken (Baseline)</span>
                      <p className="text-text-2 leading-relaxed text-justify font-sans">{eventDetails.decisionTaken}</p>
                    </div>

                    {/* Economic Impact */}
                    <div className="flex flex-col gap-1 text-[9.5px] border-t border-border/10 pt-2.5">
                      <span className="text-[8px] text-accent-red font-semibold font-heading uppercase tracking-wider">Economic Impact</span>
                      <p className="text-text-2 leading-relaxed text-justify font-sans">{eventDetails.economicImpact}</p>
                    </div>

                    {/* ARTHAM Alternative */}
                    <div className="flex flex-col gap-1 text-[9.5px] border-t border-border/10 pt-2.5">
                      <span className="text-[8px] text-accent-purple font-semibold font-heading uppercase tracking-wider">ARTHAM Alternative</span>
                      <p className="text-text-1 leading-relaxed text-justify font-sans font-medium">{eventDetails.arthamAlternative}</p>
                    </div>

                    {/* Projected Alternative Outcome */}
                    <div className="flex flex-col gap-1 text-[9.5px] border-t border-border/10 pt-2.5">
                      <span className="text-[8px] text-accent-mint font-semibold font-heading uppercase tracking-wider">Projected Alternative Outcome</span>
                      <p className="text-accent-mint leading-relaxed text-justify font-sans font-medium">{eventDetails.projectedOutcome}</p>
                    </div>

                    {/* Lessons Learned */}
                    <div className="flex flex-col gap-1 text-[9.5px] border-t border-border/10 pt-2.5">
                      <span className="text-[8px] text-accent-cyan font-semibold font-heading uppercase tracking-wider">Lessons Learned</span>
                      <p className="text-text-2 leading-relaxed text-justify font-sans italic">{eventDetails.lessonsLearned}</p>
                    </div>

                    {/* Forecast Accuracy Report Section */}
                    <div className="border-t border-border/15 pt-3 flex flex-col gap-2 bg-black/35 p-2.5 rounded border border-border/10 text-[9.5px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-accent-cyan font-semibold block uppercase tracking-wider font-heading">Forecast Accuracy</span>
                        <Badge variant="live" className="text-[7.5px] px-1 h-3.5 leading-none animate-pulse bg-accent-green/20 border-accent-green/35 text-accent-green font-semibold">LEARNING ACTIVE</Badge>
                      </div>
                      <div className="flex flex-col gap-1 font-mono text-[9px] font-semibold">
                        <div className="flex justify-between">
                          <span className="text-text-3 font-sans font-medium">Predicted:</span>
                          <span className="text-accent-purple font-semibold font-mono">
                            {selectedEvent.id === 'c-suez' ? 'Freight Cost +14.0%' : 'Freight Cost +9.4%'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-3 font-sans font-medium">Actual:</span>
                          <span className="text-accent-green font-semibold font-mono">
                            {selectedEvent.id === 'c-suez' ? 'Freight Cost +13.2%' : 'Freight Cost +9.1%'}
                          </span>
                        </div>
                        <div className="w-full h-px bg-border/20 my-1" />
                        <div className="flex justify-between text-accent-mint font-bold font-mono">
                          <span className="font-sans font-medium">Accuracy:</span>
                          <span>{selectedEvent.id === 'c-suez' ? '94.0%' : '96.8%'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/10 pt-3">
                      <span className="text-[9px] text-text-3 uppercase font-heading font-semibold tracking-wider">Replay State</span>
                      {replayCurrentDay >= selectedEvent.timeline[selectedEvent.timeline.length - 1].day ? (
                        <span className="text-accent-green font-semibold flex items-center gap-1 font-heading text-[10px]">
                          <CheckCircle2 size={12} /> COMPLETE
                        </span>
                      ) : replayPlaying ? (
                        <span className="text-accent-purple font-semibold animate-pulse font-heading text-[10px]">STREAMING</span>
                      ) : (
                        <span className="text-text-3 font-semibold font-heading text-[10px]">READY</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-3 text-xs gap-3.5 py-16 text-center">
              <History size={32} className="text-border-bright animate-pulse" />
              <span>Economic Replay Engine Idle.</span>
              <p className="text-[11px] text-center max-w-sm leading-relaxed">
                Choose a historical crisis from the left panel to load the time-series logs and start the replayer.
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
