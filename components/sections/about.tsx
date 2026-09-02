'use client'

import { motion } from 'framer-motion'
import { BriefcaseBusiness, CalendarDays, GraduationCap, Languages, MapPin, UserRound } from 'lucide-react'
import type { DbSchema } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface Props {
  data: DbSchema['about']
  aboutSkills?: DbSchema['skills']['aboutSkills']
}

const profileRows = [
  ['dateOfBirth', CalendarDays],
  ['age', UserRound],
  ['location', MapPin],
  ['nationality', UserRound],
  ['education', GraduationCap],
  ['university', GraduationCap],
  ['expectedGraduation', CalendarDays],
  ['languages', Languages],
] as const

export function About({ data }: Props) {
  const profile = data || ({} as DbSchema['about'])

  return (
    <div className="min-w-0">
      <SectionLabel num="02" label={profile.sectionLabel ?? ''} />
      <div className="grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(280px,400px)_1fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:mx-0 lg:max-w-[400px]">
          <div className="rounded-[1.25rem] border border-[#e6a4c4]/60 bg-[#e6a4c4]/10 p-1.5 shadow-[0_0_32px_rgba(230,164,196,0.14)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {profile.photo ? <img src={profile.photo} alt={profile.fullName ?? ''} className="aspect-[4/5] w-full rounded-[0.9rem] object-cover object-center" /> : null}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }} className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">{profile.profileLabel ?? ''}</p>
          <h2 className="mt-3 max-w-2xl break-words font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">{profile.fullName ?? ''}</h2>
          <h3 className="mt-6 font-serif text-2xl italic text-accent">{profile.title ?? ''}</h3>
          <p className="mt-4 max-w-2xl break-words leading-relaxed text-muted-foreground">{profile.bio ?? ''}</p>
          <div className="mt-9 grid min-w-0 gap-x-8 gap-y-5 sm:grid-cols-2">
            {profileRows.map(([key, Icon]) => (
              <div key={key} className="min-w-0 border-b border-border/70 pb-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent"><Icon className="size-3.5" /> {key === 'expectedGraduation' ? 'Expected Graduation' : key}</div>
                <p className="mt-2 break-words text-sm leading-relaxed text-foreground/90">{profile[key] ?? ''}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="border-l-2 border-[#e6a4c4] pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">{profile.statusLabel ?? ''}</p><p className="mt-2 break-words text-sm leading-relaxed">{profile.status ?? ''}</p></div>
            <div className="border-l-2 border-[#e6a4c4] pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">{profile.interestsLabel ?? ''}</p><p className="mt-2 break-words text-sm leading-relaxed">{profile.interests ?? ''}</p></div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="border-l-2 border-[#e6a4c4] pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">{profile.currentlyLabel ?? ''}</p><p className="mt-2 break-words text-sm leading-relaxed">{profile.currently ?? ''}</p></div>
            <div className="border-l-2 border-[#e6a4c4] pl-4"><p className="font-mono text-[10px] uppercase tracking-widest text-accent">{profile.focusLabel ?? ''}</p><p className="mt-2 flex flex-wrap gap-2">{(profile.focus ?? []).map((item) => <span key={item} className="rounded-full border border-border px-3 py-1 text-xs">{item}</span>)}</p></div>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e6a4c4]/40 bg-[#e6a4c4]/10 p-4"><BriefcaseBusiness className="mt-0.5 size-4 shrink-0 text-accent" /><p className="break-words text-sm leading-relaxed">{profile.availability ?? ''}</p></div>
        </motion.div>
      </div>
    </div>
  )
}
