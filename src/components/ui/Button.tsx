import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'mint' | 'ghost' | 'danger' | 'amber'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-accent-purple to-[#8B84E0] text-[#0f0c29] font-bold shadow-[0_4px_14px_rgba(175,169,236,0.35)] hover:shadow-[0_6px_20px_rgba(175,169,236,0.5)] hover:-translate-y-0.5',
  mint:    'bg-gradient-to-br from-accent-mint to-[#6EC9B5] text-[#031A14] font-bold shadow-[0_4px_14px_rgba(159,216,197,0.30)] hover:shadow-[0_6px_20px_rgba(159,216,197,0.45)] hover:-translate-y-0.5',
  ghost:   'bg-transparent text-accent-purple border border-[rgba(175,169,236,0.45)] hover:bg-[rgba(175,169,236,0.08)]',
  danger:  'bg-[rgba(255,107,107,0.15)] text-accent-red border border-[rgba(255,107,107,0.30)] hover:bg-[rgba(255,107,107,0.25)]',
  amber:   'bg-[rgba(255,179,71,0.15)] text-accent-amber border border-[rgba(255,179,71,0.30)] hover:bg-[rgba(255,179,71,0.25)]',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, disabled, ...props }: ButtonProps) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Processing...
        </span>
      ) : children}
    </button>
  )
}
