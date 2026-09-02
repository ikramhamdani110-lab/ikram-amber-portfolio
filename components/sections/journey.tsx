'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { JourneyStage } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface JourneyData {
  title: string
  stages: JourneyStage[]
  ctaTitle: string
  ctaButtonText: string
  sectionLabel?: string
}

interface Props {
  data: JourneyData
  linkedinUrl?: string
  num?: string
}

export function Journey({ data, linkedinUrl, num = '05' }: Props) {
  return (
    <div className="min-w-0">
      <SectionLabel num={num} label={data.sectionLabel ?? ''} />

      <h2 className="max-w-full break-words font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
        {data.title ?? ''}
      </h2>

      <div className="mt-14 relative before:absolute before:bottom-0 before:left-6 before:top-4 before:w-px before:bg-border/60">
        <div className="space-y-12">
          {data.stages.map((stage, i) => (
            <motion.div
              key={stage.num}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative pl-16 md:pl-20"
            >
              {/* Marker */}
              <div className="absolute left-2.5 top-0.5 flex size-8 items-center justify-center rounded-xl border border-border bg-card font-mono text-[10px] text-accent shadow-sm ring-4 ring-background z-10">
                {stage.num}
              </div>

              <div className="grid min-w-0 gap-6 md:grid-cols-[180px_1fr] md:gap-10">
                {/* Stage label column */}
                <div className="pt-1.5">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {stage.stage}
                  </span>
                  <span className="ml-2.5 rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground font-semibold md:block md:w-fit md:ml-0 md:mt-2">
                    {stage.short}
                  </span>
                </div>

                {/* Content column */}
                <div className="min-w-0 rounded-3xl border border-border bg-card/40 p-6 md:p-8">
                  <h3 className="font-serif text-2xl tracking-tight leading-snug">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {stage.body}
                  </p>

                  {stage.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {stage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {linkedinUrl && linkedinUrl.includes('linkedin.com') && (
        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl border border-border bg-card/40 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="font-serif text-2xl tracking-tight">{data.ctaTitle}</p>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-accent-foreground font-semibold transition-transform hover:scale-[1.03]"
          >
            {data.ctaButtonText}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      )}
    </div>
  )
}
