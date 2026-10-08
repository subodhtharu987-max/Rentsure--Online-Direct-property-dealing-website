/**
 * LoadingSpinner
 * Props:
 *   size  — 'sm' | 'md' | 'lg'  (default: 'md')
 *   color — 'primary' | 'white' | 'slate'  (default: 'primary')
 *   text  — optional label below spinner
 *   inline — when true, removes the padding wrapper (use inside buttons)
 */
export default function LoadingSpinner({ size = 'md', color = 'primary', text = '', inline = false }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const colors = {
    primary: 'border-primary-200 border-t-primary-500',
    white:   'border-white/30 border-t-white',
    slate:   'border-slate-200 border-t-slate-500',
  }

  const spinner = (
    <div
      className={`${sizes[size]} border-2 rounded-full animate-spin shrink-0 ${colors[color]}`}
      style={{ borderWidth: '2px' }}
      role="status"
      aria-label="Loading"
    />
  )

  if (inline) return spinner

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {spinner}
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}
