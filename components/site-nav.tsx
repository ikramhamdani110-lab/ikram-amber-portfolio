'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import type { SectionId } from '@/lib/data'
import type { DbSchema } from '@/lib/db'
import { cn } from '@/lib/utils'
import { translations } from '@/lib/translations'

type Props = {
  active: SectionId
  onNavigate: (id: SectionId) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  socials: DbSchema['socials']
  navItems: { id: SectionId; num: string; label: string }[]
  wordmark?: string
}

export function SiteNav({
  active,
  onNavigate,
  theme,
  onToggleTheme,
  socials,
  navItems,
  wordmark = 'IKRAM',
}: Props) {
  const [open, setOpen] = useState(false)
  const t = translations.en

  const circleBtn =
    'flex size-10 items-center justify-center rounded-full border border-border bg-card/85 text-foreground shadow-[0_0_18px_rgba(240,170,205,0.2)] transition-colors hover:border-accent hover:text-accent dark:border-[#f5d2e3]/80 dark:bg-[#100d12]/80 dark:text-[#f8eff4] dark:hover:border-[#f8d9e6] dark:hover:text-[#ffd9eb]'

  const githubUrl = socials?.github || '#'
  const linkedinUrl = socials?.linkedin || '#'

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex min-w-0 max-w-[1100px] items-center justify-start gap-2 rounded-full border border-border bg-card/90 py-2 pl-3 pr-2 shadow-[0_0_25px_rgba(242,160,200,0.22)] backdrop-blur-xl sm:gap-4 sm:py-2.5 sm:pl-5 sm:pr-2.5 md:gap-6 dark:border-[#f5d2e3]/80 dark:bg-[#0d0b0f]/90">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Go to home"
          className="shrink-0 whitespace-nowrap font-serif text-[1.1rem] font-medium tracking-tight text-foreground min-[360px]:text-[1.25rem] sm:text-[1.8rem]"
        >
          Ikram Hamdani
        </button>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const translatedLabel = t.nav[item.id as keyof typeof t.nav] || item.label
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                  active === item.id
                    ? 'bg-accent/20 font-semibold text-foreground dark:bg-[#f5d2e3]/15 dark:text-[#f8eff4]'
                    : 'text-muted-foreground hover:text-foreground dark:text-[#c4aab5] dark:hover:text-[#f8eff4]',
                )}
              >
                {translatedLabel}
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className={cn(circleBtn, 'hidden sm:flex')}>
              <GithubIcon className="size-4" />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={cn(circleBtn, 'hidden sm:flex')}>
              <LinkedinIcon className="size-4" />
            </a>
          )}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={circleBtn}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className={cn(circleBtn, 'md:hidden')}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-[1100px] overflow-hidden rounded-3xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl dark:border-[#f5d2e3]/80 dark:bg-[#100d12]/90 md:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => {
                const translatedLabel = t.nav[item.id as keyof typeof t.nav] || item.label
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id)
                        setOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm transition-colors',
                        active === item.id ? 'bg-muted text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      <span className="font-mono text-[10px] text-accent">{item.num}</span>
                      {translatedLabel}
                    </button>
                  </li>
                )
              })}
              <li className="flex gap-2 px-4 pt-3 sm:hidden">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className={circleBtn}>
                    <GithubIcon className="size-4" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={circleBtn}>
                    <LinkedinIcon className="size-4" />
                  </a>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
