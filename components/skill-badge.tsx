'use client'

import { motion } from 'framer-motion'
import type { Skill } from '@/lib/data'

export function SkillBadge({ skill, index = 0 }: { skill: Skill; index?: number }) {
  return (
    <motion.div
      className="group relative flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {/* tooltip note */}
      <div className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 scale-95 whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
        {skill.note}
      </div>

      <div className="relative">
        <div className="flex size-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-white to-[#ffeaf3] shadow-[0_8px_24px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={skill.icon || '/placeholder.svg'}
            alt={`${skill.name} logo`}
            width={34}
            height={34}
            className="size-[34px] object-contain"
            crossOrigin="anonymous"
          />
        </div>
        {/* pink dot */}
        <span className="absolute -right-1 -top-1 size-3 rounded-full bg-accent-soft ring-2 ring-background" />
      </div>

      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {skill.name}
      </span>
    </motion.div>
  )
}
