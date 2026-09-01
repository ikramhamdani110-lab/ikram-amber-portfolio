'use client'

import { motion } from 'framer-motion'
import { Layers, MapPin, Sparkles, User } from 'lucide-react'
import type { Skill, DbSchema } from '@/lib/db'
import { SkillBadge } from '@/components/skill-badge'
import { SectionLabel } from '@/components/section-label'
import { useLanguage } from '@/contexts/language-context'
import { translations } from '@/lib/translations'

interface Props {
  data: DbSchema['about']
  aboutSkills: Skill[]
}

export function About({ data, aboutSkills }: Props) {
  const { language } = useLanguage()
  const t = translations[language]
  const focusItems = data?.focus || ['Web', 'Software', 'Databases']
  const title = data?.title || 'Curious by nature. Always learning.'
  const profileLabel = data?.profileLabel || t.about.profile
  const currentlyLabel = data?.currentlyLabel || t.about.currently
  const basedInLabel = data?.basedInLabel || t.about.basedIn
  const focusLabel = data?.focusLabel || t.about.focus

  // Render title with custom accent styling
  const renderTitle = () => {
    if (title.includes('Always learning.')) {
      const parts = title.split('Always learning.')
      return (
        <>
          {parts[0]}
          <br />
          <span className="text-accent italic">Always learning.</span>
          {parts[1]}
        </>
      )
    }
    // General fallback: if title has a dot, make everything after the first dot italic/accent
    const dotIndex = title.indexOf('.')
    if (dotIndex !== -1 && dotIndex < title.length - 1) {
      return (
        <>
          {title.substring(0, dotIndex + 1)}
          <br />
          <span className="text-accent italic">{title.substring(dotIndex + 1).trim()}</span>
        </>
      )
    }
    return title
  }

  return (
    <div>
      <SectionLabel num="02" label={t.about.label} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <div>
          <h2 className="font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
            {renderTitle()}
          </h2>

          <p className="mt-8 max-w-lg leading-relaxed text-muted-foreground">
            {data?.bio || ''}
          </p>

          <div className="mt-10 flex flex-wrap gap-6">
            {(aboutSkills || []).map((skill, i) => (
              <SkillBadge key={skill.name} skill={skill} index={i} />
            ))}
          </div>
        </div>

        {/* Right — profile card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-3xl border border-border bg-card/50 p-7 sm:p-9"
        >
          <div className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <User className="size-3.5" /> {profileLabel}
          </div>

          <div className="space-y-7">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                <Sparkles className="size-3.5" /> {currentlyLabel}
              </div>
              <p className="font-serif text-xl">
                {data?.currently ? (
                  // Support rendering arrow styling if arrows exist in currently string
                  data.currently.includes('→') ? (
                    data.currently.split('→').map((part, index, arr) => (
                      <span key={index}>
                        {part.trim()}
                        {index < arr.length - 1 && <span className="text-muted-foreground mx-1.5">→</span>}
                      </span>
                    ))
                  ) : (
                    data.currently
                  )
                ) : (
                  language === 'ar' ? 'أتعلم → أبني → أجرب' : 'Learning → Building → Experimenting'
                )}
              </p>
            </div>

            <div className="h-px bg-border" />

            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                <MapPin className="size-3.5" /> {basedInLabel}
              </div>
              <p className="font-serif text-xl">{data?.location || (language === 'ar' ? 'الشلف، الجزائر' : 'Chlef, Algeria')}</p>
            </div>

            <div className="h-px bg-border" />

            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
                <Layers className="size-3.5" /> {focusLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {focusItems.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-border px-4 py-1.5 text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
