import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/shared/Tooltip'

interface DeezerAttributionProps {
  href?: string
  label?: string
  className?: string
}

export function DeezerAttribution({
  href = 'https://www.deezer.com',
  label,
  className,
}: DeezerAttributionProps) {
  const { t } = useTranslation()
  return (
    <Tooltip content={t('common.poweredByDeezer')}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label ? `${label} Deezer` : t('common.poweredByDeezer')}
        className={cn(
          'inline-flex items-center gap-1.5 pt-2.5 text-xs font-medium opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded',
          className
        )}
      >
        {label && <span className="-mt-1">{label}</span>}
        <img src="/deezer-logo.png" alt="" className="block h-4 w-auto shrink-0" />
      </a>
    </Tooltip>
  )
}
