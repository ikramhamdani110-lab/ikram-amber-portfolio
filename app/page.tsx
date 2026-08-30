'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [data, setData] = useState<DbSchema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await fetch('/api/portfolio')
        if (res.ok) {
          const fetchedData = await res.json()
          setData(fetchedData)
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err)
      } finally {
        setLoading(false)
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

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141013] text-foreground font-serif text-3xl">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          IKRAM<span className="text-accent">.</span>
        </motion.div>
      </div>
    )
  }

  // Build nav items — only show sections that have content
  const rawNavItems: { id: SectionId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
  ]

  const visibleCerts = data.certifications?.filter((c) => c.visible !== false) || []
  if (visibleCerts.length > 0) {
    rawNavItems.push({ id: 'certifications', label: 'Certifications' })
  }

  rawNavItems.push({ id: 'journey', label: 'Journey' })

  const visibleUpdates = data.updates?.filter((u) => u.visible !== false) || []
  if (visibleUpdates.length > 0) {
    rawNavItems.push({ id: 'updates', label: 'Updates' })
  }

  rawNavItems.push({ id: 'connect', label: 'Connect' })

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
      <SiteNav
        active={active}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        socials={data.socials}
        navItems={navItems}
        wordmark={data.siteSettings?.wordmark}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
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
            {active === 'certifications' && <Certifications certifications={data.certifications} num={certNum} />}
            {active === 'journey' && <Journey data={data.journey} linkedinUrl={data.socials?.linkedin} num={journeyNum} />}
            {active === 'updates' && <Updates updates={data.updates} num={updatesNum} />}
            {active === 'connect' && <Connect socials={data.socials} connect={data.connect} num={connectNum} />}
          </motion.section>
        </AnimatePresence>

        {active === 'connect' && (
          <SiteFooter socials={data.socials} siteSettings={data.siteSettings} hero={data.hero} customSocialLinks={data.customSocialLinks} />
        )}
      </main>
    </div>
  )
}
