'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkle } from 'lucide-react'
import { GithubIcon, Html5Icon, Css3Icon, JavascriptIcon } from '@/components/brand-icons'
import type { SectionId } from '@/lib/data'
import type { DbSchema } from '@/lib/db'

// 4 Corner Floating Tech Icons around the Hero Code Window
const FLOATING_HERO_ICONS = [
  {
    id: 'html5',
    name: 'HTML5',
    icon: Html5Icon,
    side: 'left',
    size: 'large',
    className: '-top-5 -left-3 sm:-top-6 sm:-left-5',
    containerClass: 'size-12 sm:size-14 rounded-2xl',
    iconClass: 'size-5.5 sm:size-6.5',
    yAnim: [0, -8, 0],
    rotateAnim: [0, 1.5, 0],
    duration: 5.2,
    delay: 0,
  },
  {
    id: 'css3',
    name: 'CSS3',
    icon: Css3Icon,
    side: 'left',
    size: 'small',
    className: '-bottom-4 -left-2 sm:-bottom-5 sm:-left-4',
    containerClass: 'size-9.5 sm:size-10.5 rounded-xl',
    iconClass: 'size-4.5 sm:size-5',
    yAnim: [0, 7, 0],
    rotateAnim: [0, -2, 0],
    duration: 4.6,
    delay: 0.5,
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: GithubIcon,
    side: 'right',
    size: 'small',
    className: '-top-4 -right-2 sm:-top-5 sm:-right-4',
    containerClass: 'size-9.5 sm:size-10.5 rounded-xl',
    iconClass: 'size-4.5 sm:size-5',
    yAnim: [0, -7, 0],
    rotateAnim: [0, -1.5, 0],
    duration: 4.9,
    delay: 0.3,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: JavascriptIcon,
    side: 'right',
    size: 'large',
    className: '-bottom-5 -right-3 sm:-bottom-6 sm:-right-5',
    containerClass: 'size-12 sm:size-14 rounded-2xl',
    iconClass: 'size-5.5 sm:size-6.5',
    yAnim: [0, 8, 0],
    rotateAnim: [0, 2, 0],
    duration: 5.5,
    delay: 0.8,
  },
]

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
            className="group flex items-center gap-2 rounded-full bg-accent-soft px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
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
      </motion.div>

      {/* ── Right column — code window ── */}
      <motion.div
        className="relative px-2 sm:px-4 lg:-translate-x-6"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {/* soft glow — purely decorative, no layout impact */}
        <div className="pointer-events-none absolute inset-6 -z-10 rounded-[3rem] bg-accent/15 blur-3xl" />

        <div className="relative mx-auto max-w-[340px] rotate-[-8deg] transform-gpu py-3 sm:max-w-[370px] sm:py-4">
          {/* Main code window — light/pink in light mode, deep dark in dark mode */}
          <div className="rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-md dark:bg-[#0e0b0d]">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border/80 px-3.5 py-2.5 dark:border-white/5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2.5 font-mono text-[11px] text-muted-foreground">{data?.codeWindowFilename || 'ikram.js'}</span>
            </div>

            {/* Code lines */}
            <div className="space-y-1 p-4 font-mono text-[13px] sm:p-4.5 sm:text-sm">
              {codeLines.map((line) => (
                <div key={line.n} className="flex gap-3">
                  <span className="w-3.5 select-none text-right text-muted-foreground/60 dark:text-[#5a4750]">{line.n}</span>
                  <code className="font-medium text-accent dark:text-[#e6a4c4]">
                    {line.code}
                    {line.n === codeLines.length && (
                      <span className="animate-blink ml-0.5 text-foreground dark:text-white">▍</span>
                    )}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Floating Programming Icons (White Containers + Authentic Logos + Baby-Pink Glow) */}
          {FLOATING_HERO_ICONS.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                title={item.name}
                aria-label={item.name}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: item.yAnim,
                  rotate: item.rotateAnim,
                }}
                transition={{
                  opacity: { duration: 0.5, delay: item.delay },
                  scale: { duration: 0.5, delay: item.delay },
                  y: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
                  rotate: { duration: item.duration, repeat: Infinity, ease: 'easeInOut', delay: item.delay },
                }}
                whileHover={{ scale: 1.15, rotate: 0, transition: { duration: 0.2 } }}
                className={`group absolute ${item.className} z-20 flex ${item.containerClass} items-center justify-center border border-border bg-white/95 text-[#24292e] shadow-[0_10px_24px_-2px_rgba(243,180,210,0.5),0_0_18px_rgba(230,164,196,0.35)] backdrop-blur-md transition-all hover:border-accent hover:shadow-[0_14px_32px_0px_rgba(243,180,210,0.7)] cursor-default select-none dark:bg-white/95`}
              >
                {/* Soft baby-pink glow underneath each logo */}
                <div className="pointer-events-none absolute -inset-1 -z-10 rounded-2xl bg-[#f3c9dc]/45 blur-md transition-all group-hover:bg-[#f3c9dc]/70 group-hover:blur-lg" />

                {/* Recognizable Logo / Icon */}
                <Icon className={`${item.iconClass} ${item.id === 'github' ? 'text-[#24292e]' : ''} drop-shadow-[0_2px_8px_rgba(243,201,220,0.4)] transition-transform group-hover:scale-105`} />

                {/* Decorative subtle accent dot */}
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-accent-soft ring-2 ring-card" />
              </motion.div>
            )
          })}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center font-serif italic text-muted-foreground">
          <Sparkle className="size-3.5 text-accent" /> {data?.codeWindowCaption || 'built with curiosity'}
        </p>
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
