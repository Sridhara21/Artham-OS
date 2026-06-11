import CountUp from 'react-countup'
import { cn } from '@/lib/utils'

type MetricColor = 'purple' | 'mint' | 'amber' | 'red' | 'green' | 'cyan'

const colorMap: Record<MetricColor, string> = {
  purple: 'text-accent-purple',
  mint:   'text-accent-mint',
  amber:  'text-accent-amber',
  red:    'text-accent-red',
  green:  'text-accent-green',
  cyan:   'text-accent-cyan',
}

interface MetricCardProps {
  label: string
  value: number | string
  suffix?: string
  prefix?: string
  decimals?: number
  color?: MetricColor
  subtitle?: string
  delta?: string
  deltaPositive?: boolean
  className?: string
  animate?: boolean
}

export function MetricCard({
  label, value, suffix = '', prefix = '', decimals = 0,
  color = 'purple', subtitle, delta, deltaPositive, className, animate = true
}: MetricCardProps) {
  return (
    <div className={cn('rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] p-4', className)}>
      <p className="text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1.5">{label}</p>
      <div className={cn('text-[28px] font-mono font-bold leading-none', colorMap[color])}>
        {prefix}
        {typeof value === 'number' && animate ? (
          <CountUp start={0} end={value} duration={1.5} separator="," decimals={decimals} suffix={suffix} />
        ) : (
          <span>{value}{suffix}</span>
        )}
      </div>
      {(subtitle || delta) && (
        <div className="flex items-center justify-between mt-2 text-xs">
          {subtitle && <span className="text-text-3 font-mono">{subtitle}</span>}
          {delta && (
            <span className={cn('font-mono font-semibold', deltaPositive ? 'text-accent-green' : 'text-accent-red')}>
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
