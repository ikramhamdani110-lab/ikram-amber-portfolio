'use client'

import { motion } from 'framer-motion'
import { Bell, Sparkles, Award, GraduationCap, Briefcase, RefreshCw } from 'lucide-react'
import type { PortfolioUpdate } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface Props {
  updates: PortfolioUpdate[]
  num?: string
}

export function Updates({ updates, num = '05' }: Props) {
  const visibleUpdates = updates.filter((u) => u.visible !== false)

  if (visibleUpdates.length === 0) {
    return null
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certification':
        return <Award className="size-4" />
      case 'achievement':
        return <Sparkles className="size-4" />
      case 'experience':
        return <Briefcase className="size-4" />
      case 'skill':
        return <RefreshCw className="size-4" />
      default:
        return <Bell className="size-4" />
    }
  }

  return (
    <div>
      <SectionLabel num={num} label="Updates" />

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className="font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
          What&apos;s <span className="text-accent italic">new.</span>
        </h2>
        <p className="max-w-xs leading-relaxed text-muted-foreground">
          Recent highlights, completed projects, and notifications of my progress.
        </p>
      </div>

      <div className="mt-14 relative before:absolute before:bottom-0 before:left-6 before:top-4 before:w-px before:bg-border/60">
        <div className="space-y-12">
          {visibleUpdates.map((update, i) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-16 md:pl-20"
            >
              {/* Icon Marker */}
              <div className="absolute left-2.5 top-0.5 flex size-8 items-center justify-center rounded-xl border border-border bg-card text-accent shadow-sm ring-4 ring-background z-10">
                {getCategoryIcon(update.category)}
              </div>

              <div className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-10">
                {/* Date column */}
                <div className="pt-1.5">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {update.date}
                  </span>
                  <span className="ml-2.5 rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground font-semibold md:block md:w-fit md:ml-0 md:mt-2">
                    {update.category}
                  </span>
                </div>

                {/* Content column */}
                <div className="rounded-3xl border border-border bg-card/40 p-6 md:p-8">
                  <h3 className="font-serif text-2xl tracking-tight leading-snug">
                    {update.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {update.description}
                  </p>
                  
                  {update.image && (
                    <div className="mt-5 max-w-md overflow-hidden rounded-2xl border border-border bg-black/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={update.image}
                        alt=""
                        className="w-full max-h-60 object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

