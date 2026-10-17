import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  align?: 'center' | 'start' | 'end'
  maxWidth?: string
  className?: string
}

const ALIGN = {
  center: 'left-1/2 -translate-x-1/2',
  start: 'left-0',
  end: 'right-0',
}

const EDGE = 8
const GAP = 12
const TAIL_INSET = 14

interface Placement {
  side: 'top' | 'bottom'
  shift: number
  tail: number
}

export function Tooltip({
  content,
  children,
  align = 'center',
  maxWidth,
  className,
}: TooltipProps) {
  const widthClass = maxWidth ? cn('whitespace-normal w-max', maxWidth) : 'whitespace-nowrap'
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)

  // flip to the side with room, slide inside the viewport, keep the tail on the trigger
  const place = () => {
    const wrapper = wrapperRef.current
    const bubble = bubbleRef.current
    if (!wrapper || !bubble) return
    const r = wrapper.getBoundingClientRect()
    const w = bubble.offsetWidth
    const h = bubble.offsetHeight
    const natural = { center: r.left + r.width / 2 - w / 2, start: r.left, end: r.right - w }[align]
    const left = Math.max(EDGE, Math.min(natural, window.innerWidth - w - EDGE))
    const triggerCenter = r.left + r.width / 2
    const above = r.top
    const below = window.innerHeight - r.bottom
    setPlacement({
      side: above >= h + GAP || above >= below ? 'top' : 'bottom',
      shift: left - natural,
      tail: Math.max(TAIL_INSET, Math.min(triggerCenter - left, w - TAIL_INSET)),
    })
  }

  const style = placement
    ? ({
        translate: `${placement.shift}px 0`,
        '--tt-tail': `${placement.tail - 4}px`,
      } as CSSProperties)
    : undefined

  return (
    <span
      ref={wrapperRef}
      onPointerEnter={place}
      onFocus={place}
      className={cn('relative group/tooltip inline-block', className)}
    >
      {children}
      <span
        ref={bubbleRef}
        role="tooltip"
        data-side={placement?.side ?? 'top'}
        style={style}
        className={cn(
          'pointer-events-none absolute bottom-full mb-2 z-50 rounded-xl bg-primary px-2.5 py-1 shadow-lg',
          'text-xs font-medium leading-snug text-ink origin-bottom',
          "after:absolute after:top-full after:left-[var(--tt-tail,16px)] after:border-4 after:border-transparent after:border-t-primary after:content-['']",
          'data-[side=bottom]:bottom-auto data-[side=bottom]:top-full data-[side=bottom]:mb-0 data-[side=bottom]:mt-2 data-[side=bottom]:origin-top',
          'data-[side=bottom]:after:top-auto data-[side=bottom]:after:bottom-full data-[side=bottom]:after:border-t-transparent data-[side=bottom]:after:border-b-primary',
          'scale-50 opacity-0 translate-y-1 data-[side=bottom]:-translate-y-1',
          'transition duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          'group-hover/tooltip:scale-100 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100',
          'group-focus-within/tooltip:scale-100 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100',
          'group-focus-within/tipfocus:scale-100 group-focus-within/tipfocus:translate-y-0 group-focus-within/tipfocus:opacity-100',
          'motion-reduce:transition-opacity motion-reduce:scale-100 motion-reduce:translate-y-0',
          ALIGN[align],
          widthClass
        )}
      >
        {content}
      </span>
    </span>
  )
}
