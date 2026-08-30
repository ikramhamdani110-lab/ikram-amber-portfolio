'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import type { SectionId } from '@/lib/data'
import type { DbSchema } from '@/lib/db'
import { cn } from '@/lib/utils'

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

  const circleBtn =
    'flex size-10 items-center justify-center rounded-full border border-[#f5d2e3]/80 bg-[#100d12]/80 text-[#f8eff4] shadow-[0_0_18px_rgba(240,170,205,0.15)] transition-colors hover:border-[#f8d9e6] hover:text-[#ffd9eb]'

  const githubUrl = socials?.github || '#'
  const linkedinUrl = socials?.linkedin || '#'

  const renderWordmark = () => {
    if (wordmark.length <= 1) return wordmark
    return (
      <>
        {wordmark.slice(0, -1)}
        <span className="text-[#f4bfd7]">{wordmark.slice(-1)}</span>
        <span className="text-[#f4bfd7]">.</span>
      </>
    )
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-start gap-6 rounded-full border border-[#f5d2e3]/80 bg-[#0d0b0f]/90 py-2.5 pl-5 pr-2.5 shadow-[0_0_25px_rgba(242,160,200,0.16)] backdrop-blur-xl">
        <button
          onClick={() => onNavigate('home')}
          aria-label="Go to home"
          className="font-serif text-[2rem] font-medium tracking-tight text-[#f5ebf1] sm:text-[2.2rem]"
        >
          {renderWordmark()}
        </button>

        {/* Desktop navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'rounded-full px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                active === item.id
                  ? 'bg-[#f5d2e3]/15 text-[#f8eff4]'
                  : 'text-[#c4aab5] hover:text-[#f8eff4]',
              )}
            >
              {item.label}
            </button>
          ))}
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
            className="mx-auto mt-2 max-w-[1100px] overflow-hidden rounded-3xl border border-[#f5d2e3]/80 bg-[#100d12]/90 p-2 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onNavigate(item.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm transition-colors',
                      active === item.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="font-mono text-[10px] text-accent">{item.num}</span>
                    {item.label}
                  </button>
                </li>
              ))}
              <li className="mt-1 flex gap-2 border-t border-border px-4 pt-3 sm:hidden">
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
