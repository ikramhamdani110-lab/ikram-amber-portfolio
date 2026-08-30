'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import type { DbSchema } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface Props {
  socials: DbSchema['socials']
  num?: string
}

export function Connect({ socials, num = '06' }: Props) {
  const githubUrl = socials?.github || ''
  const linkedinUrl = socials?.linkedin || ''
  const emailVal = socials?.email || ''

  const getGithubHandle = (url: string) => {
    if (!url) return ''
    try {
      const cleaned = url.replace(/\/$/, '')
      const parts = cleaned.split('/')
      return parts[parts.length - 1] || ''
    } catch {
      return ''
    }
  }

  const getLinkedinHandle = (url: string) => {
    if (!url) return ''
    if (url.includes('REPLACE-WITH-YOUR-LINKEDIN')) return 'Add your LinkedIn URL'
    try {
      const cleaned = url.replace(/\/$/, '')
      const parts = cleaned.split('/')
      return parts[parts.length - 1] || ''
    } catch {
      return ''
    }
  }

  const cards = [
    {
      icon: GithubIcon,
      title: 'GitHub',
      sub: 'Explore my code',
      handle: getGithubHandle(githubUrl) || 'github',
      cta: 'Visit GitHub',
      href: githubUrl || '#',
    },
    {
      icon: LinkedinIcon,
      title: 'LinkedIn',
      sub: 'See my journey & experiences',
      handle: getLinkedinHandle(linkedinUrl) || 'linkedin',
      cta: 'Visit LinkedIn',
      href: linkedinUrl || '#',
    },
    {
      icon: Mail,
      title: 'Email',
      sub: 'Say hello directly',
      handle: emailVal || 'email',
      cta: 'Send Email',
      href: emailVal ? `mailto:${emailVal}` : '#',
    },
  ]

  return (
    <div>
      <SectionLabel num={num} label="Connect" />

      <h2 className="font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
        Find me around the <span className="text-accent italic">web.</span>
      </h2>

      <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
        No forms, no fuss — just the places I actually live online. Follow along, or reach
        out whenever you like.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {cards.map((card, i) => (
          <motion.a
            key={card.title}
            href={card.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group flex flex-col rounded-3xl border border-border bg-card/50 p-7 transition-colors hover:border-accent"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border text-accent">
                <card.icon className="size-5" />
              </div>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </div>

            <h3 className="mt-6 font-serif text-2xl">{card.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{card.sub}</p>
            <p className="mt-5 font-mono text-xs text-muted-foreground">{card.handle}</p>

            <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-[#201319]">
              {card.cta}
              <ArrowUpRight className="size-3.5" />
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
