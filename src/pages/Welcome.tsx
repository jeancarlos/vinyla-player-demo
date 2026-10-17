import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import { useWindowSize } from '@/hooks/useWindowSize'
import { homeDiskPx, welcomeDiskOffset } from '@/utils/diskLayout'

const SOURCE_URL = 'https://github.com/jeancarlos/vinyla-player-demo'

export function Welcome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { width, height } = useWindowSize()
  const diskVisible = homeDiskPx(width, height) - welcomeDiskOffset(width, height)

  const start = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.welcomed, '1')
    } catch {
      // private mode: the welcome screen just shows again next visit
    }
    void navigate('/', { replace: true })
  }

  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-6 px-8 overflow-hidden relative"
      style={{ paddingBottom: diskVisible + 24 }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <Fragment key={n}>
            <div className={`blob blob-${n}`} />
            <div className={`blob blob-${n} blob-tint`} />
          </Fragment>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="absolute top-5 right-5 z-10"
      >
        <LanguageSwitcher />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 text-6xl font-black tracking-tighter text-black font-sans"
      >
        Vinyla
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="relative z-10 text-sm text-black/60 text-center max-w-xs leading-relaxed font-mono"
      >
        {t('welcome.hint')}
        <span className="block whitespace-nowrap">{t('welcome.tag')}</span>
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        onClick={start}
        className="relative z-10 px-10 py-3.5 bg-primary text-ink font-mono text-sm rounded-full hover:bg-black hover:text-white transition-colors"
      >
        {t('welcome.button')}
      </motion.button>

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        href={SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 -translate-y-3.5 text-[11px] text-black no-underline hover:underline"
      >
        {t('nav.sourceCode')}
      </motion.a>
    </div>
  )
}
