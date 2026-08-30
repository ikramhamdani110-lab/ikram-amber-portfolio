'use client'

import type { DbSchema } from '@/lib/db'
import { SkillBadge } from '@/components/skill-badge'
import { SectionLabel } from '@/components/section-label'

interface Props {
  data: DbSchema['skills']
}

export function Skills({ data }: Props) {
  const groups = data?.groups || []
  const title = data?.title || 'My digital toolbox.'
  const sectionLabel = data?.sectionLabel || 'Skills'

  // Render title with custom accent styling
  const renderTitle = () => {
    if (title.includes('toolbox.')) {
      const parts = title.split('toolbox.')
      return (
        <>
          {parts[0]}
          <span className="text-accent italic">toolbox.</span>
          {parts[1]}
        </>
      )
    }
    const lastWordIndex = title.lastIndexOf(' ')
    if (lastWordIndex !== -1) {
      return (
        <>
          {title.substring(0, lastWordIndex)}
          <span className="text-accent italic"> {title.substring(lastWordIndex + 1)}</span>
        </>
      )
    }
    return title
  }

  return (
    <div>
      <SectionLabel num="03" label={sectionLabel} />

      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className="font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
          {renderTitle()}
        </h2>
        <p className="max-w-xs leading-relaxed text-muted-foreground">
          {data?.description || ''}
        </p>
      </div>

      <div className="mt-14 space-y-10">
        {groups.map((group) => (
          <div
            key={group.num}
            className="grid gap-6 border-t border-border pt-8 md:grid-cols-[220px_1fr] md:gap-10"
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs text-accent">{group.num}</span>
              <h3 className="font-serif text-2xl">{group.title}</h3>
            </div>

            <div className="flex flex-wrap items-start gap-x-8 gap-y-6">
              {(group.skills || []).map((skill, i) => (
                <SkillBadge key={skill.name} skill={skill} index={i} />
              ))}

              {group.title === 'Databases' && data.dbTextBadge && (
                <div className="flex h-16 items-center rounded-full border border-border bg-card/50 px-6 font-serif text-lg">
                  {data.dbTextBadge}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
