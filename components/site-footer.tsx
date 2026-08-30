'use client'

import type { DbSchema } from '@/lib/db'

interface ExtraSocial {
  label: string
  url: string
}

interface Props {
  socials: DbSchema['socials']
  siteSettings: DbSchema['siteSettings']
  hero: DbSchema['hero']
  customSocialLinks: DbSchema['customSocialLinks']
  /** Add other social channels here, e.g. [{ label: 'X / Twitter', url: 'https://x.com/...' }] */
  extraSocials?: ExtraSocial[]
}

export function SiteFooter({ socials, siteSettings, hero, customSocialLinks, extraSocials = [] }: Props) {
  const wordmark = siteSettings?.wordmark || 'IKRAM'
  const copyright = siteSettings?.copyright || '© 2026 Ikram Hamdani'
  const location = hero?.location || 'Chlef · Algeria'
  const title = hero?.title || 'Information Science Student · Web Developer'

  const githubUrl = socials?.github || '#'
  const linkedinUrl = socials?.linkedin || '#'
  const emailVal = socials?.email || ''

  const renderWordmark = () => {
    if (wordmark.length <= 1) return wordmark
    return (
      <>
        {wordmark.slice(0, -1)}
        <span className="text-accent">{wordmark.slice(-1)}</span>
        <span className="text-accent">.</span>
      </>
    )
  }

  return (
    <footer className="relative mt-24 border-t border-border pt-10">
      {/* Marquee band */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex -translate-y-1/2 overflow-hidden opacity-[0.06]">
        <div className="animate-marquee flex shrink-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap px-8 font-serif text-8xl font-medium">
              {wordmark} ·
            </span>
          ))}
        </div>
        <div className="animate-marquee flex shrink-0" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap px-8 font-serif text-8xl font-medium">
              {wordmark} ·
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-serif text-6xl font-medium tracking-tight">
            {renderWordmark()}
          </div>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {title.replace('&', '·')}
          </p>
        </div>

        <nav className="flex gap-6 sm:flex-col sm:items-end sm:gap-2">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              LinkedIn
            </a>
          )}
          {emailVal && (
            <a href={`mailto:${emailVal}`} className="text-sm text-muted-foreground transition-colors hover:text-accent">
              Email
            </a>
          )}
          {customSocialLinks?.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-accent">
              {link.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-border py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{copyright}</span>
        <span className="normal-case tracking-normal">
          Coded &amp; Designed by <span className="text-accent">Ikram</span>
        </span>
        <span className="flex items-center gap-2">
          {location.replace('·', '')} <span className="size-1.5 rounded-full bg-accent" />
        </span>
      </div>
    </footer>
  )
}
