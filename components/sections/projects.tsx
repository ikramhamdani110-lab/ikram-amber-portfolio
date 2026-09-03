'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Folder } from 'lucide-react'
import type { Project } from '@/lib/db'
import type { DbSchema } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface Props {
  projects: Project[]
  projectsSettings?: DbSchema['projectsSettings']
  num?: string
}

export function Projects({ projects, projectsSettings, num = '05' }: Props) {
  const visibleProjects = [...projects]
    .filter((p) => p.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const [selected, setSelected] = useState<Project | null>(null)

  if (visibleProjects.length === 0) {
    return null
  }

  const openDetail = (project: Project) => {
    setSelected(project)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const backToList = () => {
    setSelected(null)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="min-w-0">
      <SectionLabel num={num} label={projectsSettings?.sectionLabel ?? ''} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className="max-w-full break-words font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
          {projectsSettings?.title ?? ''}
        </h2>
        <p className="max-w-xs leading-relaxed text-muted-foreground">
          {projectsSettings?.description ?? ''}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="project-detail"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <button
              onClick={backToList}
              className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" /> Back to all projects
            </button>

            <article>
              <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-semibold text-foreground">
                {selected.category}
              </span>
              <h3 className="mt-4 break-words font-serif text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                {selected.title}
              </h3>
              <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                {selected.description}
              </p>

              {selected.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {selected.demoUrl && (
                  <a
                    href={selected.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full bg-accent-soft px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 dark:text-black"
                  >
                    Live Demo
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
                {selected.sourceUrl && (
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-accent"
                  >
                    Source Code
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>

              {selected.image && (
                <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="h-auto max-h-[480px] w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {selected.additionalImages.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {selected.additionalImages.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${selected.title} screenshot ${i + 1}`}
                        className="h-auto w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="projects-grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex min-w-0 cursor-pointer flex-col rounded-3xl border border-border bg-card/50 transition-colors hover:border-accent"
                onClick={() => openDetail(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openDetail(project)
                  }
                }}
                aria-label={`View ${project.title} details`}
              >
                {project.image ? (
                  <div className="overflow-hidden rounded-t-3xl border-b border-border bg-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-t-3xl border-b border-border bg-accent-soft/40 text-accent">
                    <Folder className="size-10" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest font-semibold text-foreground">
                      {project.category}
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>

                  <h3 className="mt-3 break-words font-serif text-xl font-medium tracking-tight leading-snug">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
