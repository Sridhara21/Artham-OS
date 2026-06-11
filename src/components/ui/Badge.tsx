import { cn } from '@/lib/utils'

type BadgeVariant = 'purple' | 'mint' | 'amber' | 'red' | 'green' | 'cyan' | 'live' | 'ghost'

const variants: Record<BadgeVariant, string> = {
  purple: 'bg-[rgba(175,169,236,0.15)] text-accent-purple border border-[rgba(175,169,236,0.25)]',
  mint:   'bg-[rgba(159,216,197,0.15)] text-accent-mint   border border-[rgba(159,216,197,0.25)]',
  amber:  'bg-[rgba(255,179,71,0.15)]  text-accent-amber  border border-[rgba(255,179,71,0.25)]',
  red:    'bg-[rgba(255,107,107,0.15)] text-accent-red    border border-[rgba(255,107,107,0.25)]',
  green:  'bg-[rgba(126,231,135,0.15)] text-accent-green  border border-[rgba(126,231,135,0.25)]',
  cyan:   'bg-[rgba(103,232,249,0.15)] text-accent-cyan   border border-[rgba(103,232,249,0.25)]',
  live:   'bg-[rgba(126,231,135,0.10)] text-accent-green  border border-[rgba(126,231,135,0.20)] animate-pulse',
  ghost:  'bg-transparent text-text-2 border border-[rgba(255,255,255,0.12)]',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ variant = 'ghost', children, className, dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase',
      variants[variant], className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'live' ? 'bg-accent-green animate-live-dot' : 'bg-current')} />}
      {children}
    </span>
  )
}
