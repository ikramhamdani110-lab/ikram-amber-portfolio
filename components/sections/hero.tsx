'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkle } from 'lucide-react'
import type { SectionId } from '@/lib/data'
import type { DbSchema } from '@/lib/db'

interface Props {
  onNavigate: (id: SectionId) => void
  data: DbSchema['hero']
}

export function Hero({ onNavigate, data }: Props) {
  const codeLines = data?.codeLines || []
  const name = data?.name || 'IKRAM'

  // Render name: last char in accent colour, with shine class
  const renderName = () => {
    if (name.length <= 1) return name
    const main = name.slice(0, -1)
    const last = name.slice(-1)
    return (
      <>
        {main}
        <span className="text-accent">{last}</span>
      </>
    )
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
      {/* ── Left column ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {data?.hello || "Hello, I'm"} <Sparkle className="size-4 text-accent" />
        </div>

        {/* IKRAM with premium shine sweep */}
        <h1 className="animate-name-shine font-serif text-[19vw] font-light leading-[0.85] tracking-tight sm:text-[13vw] lg:text-[9.5rem]">
          {renderName()}
        </h1>

        {/* Animated typewriter subtitle */}
        <TypewriterTitle />

        <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
          {data?.bio || ''}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('skills')}
            aria-label="Explore skills"
            className="group flex items-center gap-2 rounded-full bg-accent-soft px-6 py-3 text-sm font-medium text-[#201319] transition-transform hover:-translate-y-0.5"
          >
            Explore
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            onClick={() => onNavigate('about')}
            aria-label="About me"
            className="group flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-accent"
          >
            About Me
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>{data?.location || 'Chlef · Algeria'}</span>
          <span className="size-1.5 rounded-full bg-accent" />
          <span>{'</>'} {data?.creativeTechnologist || 'Creative Technologist'}</span>
        </div>

        {/* "Coded and designed by Ikram" — subtle author tag */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50">
          Coded &amp; designed by Ikram
        </p>
      </motion.div>

      {/* ── Right column — code window ── */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {/* soft glow — purely decorative, no layout impact */}
        <div className="pointer-events-none absolute inset-6 -z-10 rounded-[3rem] bg-accent/15 blur-3xl" />

        <div className="mx-auto max-w-md rounded-2xl border border-border bg-[#0e0b0d] shadow-2xl">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-xs text-[#8a7680]">{data?.codeWindowFilename || 'ikram.js'}</span>
          </div>

          {/* Code lines */}
          <div className="space-y-1 p-5 font-mono text-sm">
            {codeLines.map((line) => (
              <div key={line.n} className="flex gap-4">
                <span className="w-4 select-none text-right text-[#5a4750]">{line.n}</span>
                <code className="text-[#e6a4c4]">
                  {line.code}
                  {line.n === codeLines.length && (
                    <span className="animate-blink ml-0.5 text-white">▍</span>
                  )}
                </code>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-serif italic text-muted-foreground">
          <Sparkle className="size-3.5 text-accent" /> {data?.codeWindowCaption || 'built with curiosity'}
        </p>

        {/* Floating tech icon badges — these are static positions, no flickering SVG lines */}
        {(data?.floaters || []).map((f, i) => (
          <div
            key={i}
            className={`animate-floaty absolute ${f.className} flex size-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-white to-[#ffeaf3] shadow-xl ring-1 ring-black/5`}
            style={{ animationDelay: f.delay }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.icon || '/placeholder.svg'}
              alt=""
              width={28}
              height={28}
              className="size-7 object-contain"
              crossOrigin="anonymous"
            />
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent-soft ring-2 ring-background" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────
// Typewriter title — cycles through roles
// ─────────────────────────────────────────────────────
const HERO_TITLES = [
  'Information Science Student',
  'Web Developer',
  'Curious Learner',
  'Database Explorer',
  'Designer',
]

function TypewriterTitle() {
  const reducedMotion = useReducedMotion()
  const [titleIndex, setTitleIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  useEffect(() => {
    if (reducedMotion) return
    const full = HERO_TITLES[titleIndex % HERO_TITLES.length]
    let timer: ReturnType<typeof setTimeout> | undefined

    if (phase === 'typing') {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 60)
      } else {
        timer = setTimeout(() => setPhase('deleting'), 1500)
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 28)
      } else {
        setTitleIndex((i) => (i + 1) % HERO_TITLES.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timer)
  }, [text, phase, titleIndex, reducedMotion])

  if (reducedMotion) {
    return (
      <p className="mt-6 min-h-[4.6rem] font-serif text-2xl italic sm:min-h-[3.2rem] sm:text-3xl">
        {HERO_TITLES[0]}
      </p>
    )
  }

  return (
    <p
      className="mt-6 min-h-[4.6rem] font-serif text-2xl italic sm:min-h-[3.2rem] sm:text-3xl"
      aria-label={HERO_TITLES[titleIndex % HERO_TITLES.length]}
    >
      <span aria-hidden="true">{text}</span>
      <motion.span
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] rounded-full bg-accent"
      />
    </p>
  )
}
