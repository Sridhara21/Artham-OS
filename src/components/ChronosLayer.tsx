'use client'
import { useEffect, useRef } from 'react'
import { useARTHAMStore } from '@/lib/store'
import { CHRONOS_DISRUPTIONS } from '@/lib/mock-data'
import { Play, Pause, RotateCcw, AlertOctagon, HelpCircle, History, Zap, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ChronosLayer() {
  const {
    selectedChronosId, chronosPlaying, chronosCurrentDay, chronosLogTimeline,
    selectChronosDisruption, setChronosPlaying, resetChronos, advanceChronos
  } = useARTHAMStore()

  const intervalRef = useRef<any>(null)

  const selectedDisruption = CHRONOS_DISRUPTIONS.find(c => c.id === selectedChronosId) || null

  // Playback timer loop
  useEffect(() => {
    if (chronosPlaying && selectedChronosId) {
      intervalRef.current = setInterval(() => {
        advanceChronos()
      }, 2500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [chronosPlaying, selectedChronosId, advanceChronos])

  const handleTogglePlay = () => {
    if (!selectedChronosId) return
    setChronosPlaying(!chronosPlaying)
  }

  const handleSelect = (id: string) => {
    selectChronosDisruption(id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-rise">
      {/* Left panel: Chronos disruptions list - 4 cols */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="text-accent-purple" size={14} />
              <h2 className="text-base font-bold text-text-1">CHRONOS™</h2>
            </div>
            <Badge variant="purple">TIME MACHINE</Badge>
          </CardHeader>
          <CardBody>
            <span className="text-[9px] font-mono text-text-3 uppercase block tracking-wider mb-2.5">Select Historical Crisis Replay</span>
            <div className="flex flex-col gap-2">
              {CHRONOS_DISRUPTIONS.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d.id)}
                  className={`w-full py-2.5 px-3 rounded text-left text-xs font-semibold font-mono border transition-all flex items-center justify-between ${
                    selectedChronosId === d.id
                      ? 'bg-accent-purple/10 border-accent-purple text-accent-purple font-bold shadow-glow-purple'
                      : 'bg-black/20 border-border/40 text-text-3 hover:text-text-2 hover:border-border'
                  }`}
                >
                  <span>{d.name} ({d.year})</span>
                  <Badge variant={selectedChronosId === d.id ? 'purple' : 'ghost'}>Select</Badge>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-text-3 font-mono leading-relaxed mt-4 border-t border-border/10 pt-3">
              Chronos replays physical supply chain delays day-by-day, allowing comparison of standard historical actions against Autopilot alternate routes.
            </p>
          </CardBody>
        </Card>

        {/* Time machine playback panel */}
        {selectedDisruption && (
          <Card className="animate-fade-rise">
            <CardHeader>
              <h3 className="text-xs font-bold text-text-2 font-mono uppercase tracking-wider">Time Machine Controls</h3>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-black/20 p-3 rounded border border-border/10 font-mono text-xs">
                <span className="text-text-3">REPLAY DAY</span>
                <span className="text-base font-bold text-accent-purple">Day {chronosCurrentDay}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={chronosPlaying ? 'amber' : 'mint'}
                  onClick={handleTogglePlay}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2"
                >
                  {chronosPlaying ? <Pause size={13} /> : <Play size={13} />}
                  <span>{chronosPlaying ? 'Pause Replay' : 'Start Replay'}</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={resetChronos}
                  className="flex-shrink-0 px-3 py-2"
                >
                  <RotateCcw size={13} />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Right panel: Timeline & Comparative Analysis - 8 cols */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[440px]">
        <CardHeader className="border-b border-border/10 pb-3">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-xs font-bold text-text-1 font-mono uppercase">Replay Console logs</h3>
            {selectedDisruption && (
              <Badge variant="purple">{selectedDisruption.name} Timeline</Badge>
            )}
          </div>
        </CardHeader>
        <CardBody className="flex-1 p-5 flex flex-col justify-between">
          {selectedDisruption ? (
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              {/* Day logs stack - 7 cols */}
              <div className="flex-1 flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                {chronosLogTimeline.map((step, idx) => (
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
                          {step.day === 1 ? 'Deploy standard harbor tugboats; no bypass overrides.' : step.day === 5 ? 'Allow shipping backlog congestion; spot charter premiums surged.' : 'Wagons left idle at Jabalpur terminal.'}
                        </div>
                        <div className="bg-accent-purple/5 p-2 rounded border border-accent-purple/15 text-text-1">
                          <span className="text-accent-purple font-bold uppercase block text-[8px] mb-0.5">Autopilot Recommendations</span>
                          {step.day === 1 ? 'Instantly divert 12% cargo container traffic to dry rail bypass lines.' : step.day === 5 ? 'Reallocate 45 empty rail flat wagons to avoid spot container premiums.' : 'Secure advance CEPA custom classifications.'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status summary box - 5 cols */}
              <div className="w-full lg:w-60 bg-black/25 rounded border border-border/30 p-4 h-fit font-mono text-[11px] flex flex-col gap-4">
                <div className="border-b border-border/10 pb-2">
                  <span className="text-[9px] text-text-3 block uppercase">Active Event</span>
                  <span className="text-xs font-extrabold text-text-1 leading-tight">{selectedDisruption.name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-3 block uppercase mb-1">Empirical Assessment</span>
                  <p className="text-text-2 leading-relaxed bg-black/40 p-2.5 rounded border border-border/10 text-[10px]">
                    {selectedDisruption.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border/10 pt-3">
                  <span className="text-[9px] text-text-3 uppercase">Replay State</span>
                  {chronosCurrentDay >= selectedDisruption.timeline[selectedDisruption.timeline.length - 1].day ? (
                    <span className="text-accent-green font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> COMPLETE
                    </span>
                  ) : chronosPlaying ? (
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
