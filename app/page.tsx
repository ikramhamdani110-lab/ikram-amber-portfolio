'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IntroLoader } from '@/components/intro-loader'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Skills } from '@/components/sections/skills'
import { Certifications } from '@/components/sections/certifications'
import { Journey } from '@/components/sections/journey'
import { Updates } from '@/components/sections/updates'
import { Connect } from '@/components/sections/connect'
import type { SectionId } from '@/lib/data'
import type { DbSchema } from '@/lib/db'

export default function Page() {
  const [active, setActive] = useState<SectionId>('home')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [data, setData] = useState<DbSchema | null>(null)
  const [introFinished, setIntroFinished] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Synchronize with stored theme on mount if present
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme)
      }
    } catch (err) {
      console.error('Error reading theme from localStorage:', err)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', nextTheme)
      } catch (err) {
        console.error('Error saving theme to localStorage:', err)
      }
      return nextTheme
    })
  }

  useEffect(() => {
    async function loadPortfolio() {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 10000)
      try {
        const res = await fetch('/api/portfolio', { cache: 'no-store', signal: controller.signal })
        if (res.ok) {
          const fetchedData = await res.json()
          setData(fetchedData)
        } else {
          setLoadError('Portfolio content is temporarily unavailable.')
        }
      } catch {
        setLoadError('Portfolio content is temporarily unavailable.')
      } finally {
        window.clearTimeout(timeout)
      }
    }
    loadPortfolio()
  }, [])

  // Section navigation — NO loading screen, just switch section
  const navigate = (id: SectionId) => {
    if (id === active) return
    setActive(id)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const isReady = introFinished && data !== null

  if (loadError) {
    return <main className="flex min-h-screen items-center justify-center px-6 text-center font-mono text-sm text-muted-foreground">{loadError}</main>
  }

  // Build nav items — only show sections that have content
  const rawNavItems: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: data?.about?.sectionLabel || 'About' },
  ]

  rawNavItems.push({ id: 'journey', label: data?.journey?.sectionLabel || 'Journey' })
  rawNavItems.push({ id: 'skills', label: data?.skills?.sectionLabel || 'Skills' })

  const visibleCerts = data?.certifications?.filter((c) => c.visible !== false) || []
  if (visibleCerts.length > 0) {
    rawNavItems.push({ id: 'certifications', label: data?.certificationsSettings?.sectionLabel || 'Certifications' })
  }

  const visibleUpdates = data?.updates?.filter((u) => u.visible !== false) || []
  if (visibleUpdates.length > 0) {
    rawNavItems.push({ id: 'updates', label: data?.updatesSettings?.sectionLabel || 'Updates' })
  }

  rawNavItems.push({ id: 'connect', label: data?.connect?.sectionLabel || 'Connect' })

  const navItems = rawNavItems.map((item, index) => ({
    id: item.id,
    label: item.label,
    num: String(index + 1).padStart(2, '0'),
  }))

  const certNum = navItems.find((n) => n.id === 'certifications')?.num || '04'
  const journeyNum = navItems.find((n) => n.id === 'journey')?.num || '05'
  const updatesNum = navItems.find((n) => n.id === 'updates')?.num || '06'
  const connectNum = navItems.find((n) => n.id === 'connect')?.num || '07'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {!isReady && (
          <IntroLoader
            key="intro-loader"
            onComplete={() => setIntroFinished(true)}
          />
        )}
      </AnimatePresence>

      {data && (
        <div className={`transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <SiteNav
            active={active}
            onNavigate={navigate}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            socials={data.socials}
            navItems={navItems}
            wordmark={data.siteSettings?.wordmark}
          />

          <main className="mx-auto min-w-0 max-w-6xl overflow-x-clip px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
            <AnimatePresence mode="wait">
              <motion.section
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {active === 'home' && <Hero onNavigate={navigate} data={data.hero} />}
                {active === 'about' && <About data={data.about} aboutSkills={data.skills?.aboutSkills} />}
                {active === 'skills' && <Skills data={data.skills} />}
                {active === 'certifications' && <Certifications certifications={data.certifications} certificationsSettings={data.certificationsSettings} num={certNum} />}
                {active === 'journey' && <Journey data={data.journey} linkedinUrl={data.socials?.linkedin} num={journeyNum} />}
                {active === 'updates' && <Updates updates={data.updates} updatesSettings={data.updatesSettings} num={updatesNum} />}
                {active === 'connect' && <Connect socials={data.socials} connect={data.connect} num={connectNum} />}
              </motion.section>
            </AnimatePresence>

            {active === 'connect' && (
              <SiteFooter socials={data.socials} siteSettings={data.siteSettings} hero={data.hero} customSocialLinks={data.customSocialLinks} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}
