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
        <span className="text-accent-purple font-mono text-[9px] uppercase tracking-widest leading-none font-bold">REPLAY // What actually happened?</span>
      </div>
      {/* Left panel: Chronos disruptions list - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="text-accent-purple" size={14} />
              <h2 className="text-base font-bold text-text-1">Historical Intelligence</h2>
            </div>
            <Badge variant="purple">CRISIS REPLAY</Badge>
          </CardHeader>
          <CardBody>
            <span className="text-[9px] font-mono text-text-3 uppercase block tracking-wider mb-2.5">Select Historical Crisis Replay</span>
            <div className="flex flex-col gap-2">
              {REPLAY_EVENTS.map(e => (
                <button
                  key={e.id}
                  onClick={() => selectReplayEvent(e.id)}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                    selectedReplayId === e.id
                      ? 'bg-accent-purple/10 border-accent-purple text-accent-purple font-bold shadow-glow-purple'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span>{e.name} ({e.year})</span>
                  <Badge variant={selectedReplayId === e.id ? 'purple' : 'ghost'}>Select</Badge>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-text-3 font-mono leading-relaxed mt-4 border-t border-border/10 pt-3">
              Replay historical supply chain disruptions day-by-day to observe how signals propagated and compare historical outcomes with Autopilot mitigations.
            </p>
          </CardBody>
        </Card>

        {/* Playback Controls */}
        {selectedEvent && (
          <Card className="animate-fade-rise">
            <CardHeader>
              <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Time Machine Controls</h3>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-black/20 p-3 rounded border border-border/10 font-mono text-xs">
                <span className="text-text-3">REPLAY DAY</span>
                <span className="text-base font-bold text-accent-purple">Day {replayCurrentDay}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={replayPlaying ? 'amber' : 'mint'}
                  onClick={handleTogglePlay}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold"
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
          <h3 className="text-xs font-bold text-text-1 font-mono uppercase">Replay Console logs</h3>
          {selectedEvent && (
            <Badge variant="purple">{selectedEvent.name} Timeline</Badge>
          )}
        </CardHeader>
        <CardBody className="flex-1 p-5 flex flex-col justify-between">
          {selectedEvent ? (
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              {/* Day logs stack */}
              <div className="flex-1 flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {replayLogTimeline.map((step, idx) => (
                  <div key={idx} className="p-3 bg-black/20 rounded border border-border/20 hover:border-border-bright transition-all animate-fade-rise flex gap-3">
                    <div className="flex-shrink-0 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple font-mono font-bold text-[10px] w-12 h-6 rounded flex items-center justify-center">
                      Day {step.day}
                    </div>
                    <div className="flex-1 font-mono text-[11px]">
                      <p className="text-text-1 leading-relaxed mb-2">{step.log}</p>
                      
                      {/* Comparative Box */}
                      <div className="grid grid-cols-2 gap-2 border-t border-border/10 pt-2 text-[10px] leading-relaxed">
                        <div className="bg-black/30 p-2 rounded border border-accent-red/15 text-text-2">
                          <span className="text-accent-red font-bold uppercase block text-[8px] mb-0.5">Historical Action Taken</span>
                          {step.day === 1 ? 'Deploy standard harbor tugs; wait for authority clearance.' : step.day === 3 ? 'Route cargo queues to nearby ports, overloading them.' : 'Spot charter premiums surcharges accepted.'}
                        </div>
                        <div className="bg-accent-purple/5 p-2 rounded border border-accent-purple/15 text-text-1 font-semibold">
                          <span className="text-accent-purple font-bold block text-[8px] mb-0.5">Autopilot Alternate Option</span>
                          {step.day === 1 ? 'Bypass customs checks via advance CEPA classifications.' : step.day === 3 ? 'Instantly redirect 12% container traffic to dry rail bypass lines.' : 'Reallocate empty wagons from central zones.'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status summary box */}
              <div className="w-full lg:w-64 bg-black/25 rounded border border-border/30 p-4 h-fit font-mono text-[11px] flex flex-col gap-3.5">
                <div className="border-b border-border/10 pb-2">
                  <span className="text-[9px] text-text-3 block uppercase">Active Event</span>
                  <span className="text-xs font-extrabold text-text-1 leading-tight">{selectedEvent.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-3 block uppercase mb-1">Empirical Assessment</span>
                  <p className="text-text-2 leading-relaxed bg-black/40 p-2.5 rounded border border-border/10 text-[9.5px]">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Forecast Accuracy Report Section */}
                <div className="border-t border-border/15 pt-3 flex flex-col gap-2 bg-black/10 p-2.5 rounded border border-border/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-accent-cyan font-bold block uppercase tracking-wider">Forecast Accuracy Report</span>
                    <Badge variant="live" className="text-[7.5px] px-1 h-3.5 leading-none animate-pulse bg-accent-green/20 border-accent-green/35 text-accent-green font-bold">LEARNING ACTIVE</Badge>
                  </div>
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span className="text-text-3">Predicted:</span>
                      <span className="font-bold text-accent-purple">
                        {selectedEvent.id === 'c-suez' ? 'Freight Cost +14%' : 'Freight Cost +9.4%'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-3">Actual:</span>
                      <span className="font-bold text-accent-green">
                        {selectedEvent.id === 'c-suez' ? 'Freight Cost +13.2%' : 'Freight Cost +9.1%'}
                      </span>
                    </div>
                    <div className="w-full h-px bg-border/20 my-1" />
                    <div className="flex justify-between font-bold text-accent-mint">
                      <span>Accuracy:</span>
                      <span>{selectedEvent.id === 'c-suez' ? '94%' : '96.8%'}</span>
                    </div>
                  </div>
                </div>

                {/* Historical Learning Stats */}
                <div className="border-t border-border/15 pt-3 flex flex-col gap-1 text-[9px] text-text-2">
                  <div className="flex justify-between">
                    <span className="text-text-3">Forecasts Evaluated:</span>
                    <span className="font-bold text-text-1">126</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Average Accuracy:</span>
                    <span className="font-bold text-accent-green">91%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Highest Accuracy:</span>
                    <span className="font-bold text-accent-green">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Learning Updates Applied:</span>
                    <span className="font-bold text-accent-purple">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Confidence Calibration Error:</span>
                    <span className="font-bold text-accent-red">4%</span>
                  </div>
                </div>

                <div className="text-[8.5px] text-accent-purple/80 bg-accent-purple/5 p-2 rounded border border-accent-purple/20 text-center font-bold tracking-wide italic">
                  &ldquo;ARTHAM does not merely predict. ARTHAM learns.&rdquo;
                </div>

                <div className="flex items-center justify-between border-t border-border/10 pt-3">
                  <span className="text-[9px] text-text-3 uppercase">Replay State</span>
                  {replayCurrentDay >= selectedEvent.timeline[selectedEvent.timeline.length - 1].day ? (
                    <span className="text-accent-green font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> COMPLETE
                    </span>
                  ) : replayPlaying ? (
                    <span className="text-accent-purple font-bold animate-pulse">STREAMING</span>
                  ) : (
                    <span className="text-text-3 font-bold">READY</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center font-mono text-xs text-text-3 gap-3">
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
  )
}
