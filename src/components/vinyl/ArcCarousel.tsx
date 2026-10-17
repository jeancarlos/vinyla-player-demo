import { useEffect, useId, useState } from 'react'
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { calcArcPositions } from '@/utils/arcAngles'

interface ArcItem {
  id: string
  content: React.ReactNode
}

interface ArcTab {
  id: string
  label: string
}

interface ArcCarouselProps {
  items: ArcItem[]
  radius?: number
  arcDeg?: number
  offsetDeg?: number
  baseDelay?: number
  title?: string
  tabs?: ArcTab[]
  activeTab?: string
  onTab?: (id: string) => void
}

const TAB_FRACTIONS = [0.3, 0.7]
const TAB_EXTRA_R = 70
const TAB_DROP_Y = 50

interface ArcTabsProps {
  tabs: ArcTab[]
  activeTab?: string
  onTab?: (id: string) => void
  pathId: string
  radius: number
  arcDeg: number
}

function ArcTabs({ tabs, activeTab, onTab, pathId, radius, arcDeg }: ArcTabsProps) {
  const cy = radius + 70
  const arrowR = radius + 46 + TAB_EXTRA_R + 30
  const activeIdx = Math.max(
    0,
    tabs.findIndex((tb) => tb.id === activeTab)
  )
  const targetDeg = ((TAB_FRACTIONS[activeIdx] ?? 0.5) - 0.5) * arcDeg
  const angle = useSpring(targetDeg, { stiffness: 120, damping: 20 })
  const hop = useMotionValue(0)
  const arrowX = useTransform(
    [angle, hop],
    ([a, h]: number[]) => radius + (arrowR + h) * Math.sin((a * Math.PI) / 180)
  )
  const arrowY = useTransform(
    [angle, hop],
    ([a, h]: number[]) => cy - (arrowR + h) * Math.cos((a * Math.PI) / 180)
  )

  useEffect(() => {
    angle.set(targetDeg)
  }, [targetDeg, angle])

  useEffect(() => {
    const bob = animate(hop, [0, 6], {
      duration: 1.4,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    })
    return () => {
      bob.stop()
    }
  }, [hop])

  return (
    <>
      <text fontSize="11" fontWeight="600" letterSpacing="1.4" fontFamily="monospace">
        {tabs.map((tb, i) => (
          <textPath
            key={tb.id}
            href={`#${pathId}`}
            startOffset={`${(TAB_FRACTIONS[i] ?? 0.5) * 100}%`}
            textAnchor="middle"
            fill={tb.id === activeTab ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.35)'}
            className="pointer-events-auto cursor-pointer"
            onClick={() => onTab?.(tb.id)}
          >
            {tb.label.toUpperCase()}
          </textPath>
        ))}
      </text>
      <motion.g style={{ x: arrowX, y: arrowY, rotate: angle }}>
        <path d="M -7 -4 L 0 5 L 7 -4 Z" className="fill-primary" />
      </motion.g>
    </>
  )
}

function useEntryDelay(baseDelay: number) {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const id = setTimeout(
      () => {
        setEntered(true)
      },
      (baseDelay + 1) * 1000
    )
    return () => {
      clearTimeout(id)
    }
  }, [baseDelay])
  return entered ? 0 : baseDelay
}

interface ArcLabelProps extends Omit<ArcTabsProps, 'pathId' | 'tabs'> {
  tabs?: ArcTab[]
  title?: string
  delay: number
}

function ArcLabel({ tabs, title, activeTab, onTab, radius, arcDeg, delay }: ArcLabelProps) {
  const pathId = `arc-${useId()}`
  const hasTabs = !!tabs
  const tR = radius + 46 + (hasTabs ? TAB_EXTRA_R : 0)
  const halfRad = ((arcDeg / 2) * Math.PI) / 180
  const x1 = radius - tR * Math.sin(halfRad)
  const x2 = radius + tR * Math.sin(halfRad)
  const y = radius + 70 - tR * Math.cos(halfRad)

  return (
    <motion.svg
      className="absolute top-[-120px] inset-0 pointer-events-none"
      width={radius * 2}
      height={radius + 120}
      style={{ overflow: 'visible', y: hasTabs ? TAB_DROP_Y : 0 }}
      overflow="visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <defs>
        <path id={pathId} d={`M ${x1} ${y} A ${tR} ${tR} 0 0 1 ${x2} ${y}`} />
      </defs>
      {tabs ? (
        <ArcTabs
          tabs={tabs}
          activeTab={activeTab}
          onTab={onTab}
          pathId={pathId}
          radius={radius}
          arcDeg={arcDeg}
        />
      ) : (
        <text
          fontSize="11"
          fill="rgba(0,0,0,0.6)"
          fontWeight="600"
          letterSpacing="1.4"
          fontFamily="monospace"
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {title?.toUpperCase()}
          </textPath>
        </text>
      )}
    </motion.svg>
  )
}

export function ArcCarousel({
  items,
  radius = 300,
  arcDeg = 150,
  offsetDeg = 0,
  baseDelay = 0,
  title,
  tabs,
  activeTab,
  onTab,
}: ArcCarouselProps) {
  const entryDelay = useEntryDelay(baseDelay)
  const positions = calcArcPositions(items.length, radius + 70, arcDeg, offsetDeg)

  return (
    <div className="relative" style={{ width: radius * 2, height: radius + 70 }}>
      <div className="absolute inset-0 flex items-end justify-center">
        <AnimatePresence mode="wait">
          {items.map((item, i) => {
            const pos = positions[i]

            return (
              <motion.div
                key={item.id}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: pos.x, y: pos.y + 40, opacity: 1, scale: 1 }}
                exit={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0.4,
                  transition: { duration: 0.18, ease: 'easeIn' },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 22,
                  delay: entryDelay + i * 0.04,
                }}
                style={{ rotate: pos.tilt }}
              >
                {item.content}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {(Boolean(title) || !!tabs) && (
        <ArcLabel
          tabs={tabs}
          title={title}
          activeTab={activeTab}
          onTab={onTab}
          radius={radius}
          arcDeg={arcDeg}
          delay={baseDelay + items.length * 0.06 + 0.3}
        />
      )}
    </div>
  )
}
