import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glowColor?: 'purple' | 'mint' | 'red'
  gradientBorder?: boolean
}

export function Card({ children, className, hover = true, glowColor, gradientBorder }: CardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-[rgba(175,169,236,0.12)] backdrop-blur-xl',
      'bg-[rgba(255,255,255,0.03)] shadow-card',
      hover && 'card-hover cursor-default',
      glowColor === 'purple' && 'shadow-glow-purple border-accent-purple/40',
      glowColor === 'mint' && 'shadow-glow-mint border-accent-mint/40',
      glowColor === 'red' && 'shadow-glow-red border-accent-red/40',
      gradientBorder && 'gradient-border',
      className
    )}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.06)]', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>
}
