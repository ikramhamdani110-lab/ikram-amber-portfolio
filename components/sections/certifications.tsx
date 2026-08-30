'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ArrowUpRight, X, ZoomIn } from 'lucide-react'
import type { Certification } from '@/lib/db'
import { SectionLabel } from '@/components/section-label'

interface Props {
  certifications: Certification[]
  num?: string
}

export function Certifications({ certifications, num = '04' }: Props) {
  const [viewerImage, setViewerImage] = useState<string | null>(null)
  const [viewerName, setViewerName] = useState<string>('')

  const visibleCerts = certifications.filter((c) => c.visible !== false)

  if (visibleCerts.length === 0) {
    return null
  }

  const openViewer = (cert: Certification) => {
    if (!cert.image) return
    setViewerImage(cert.image)
    setViewerName(cert.name)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }

  const closeViewer = () => {
    setViewerImage(null)
    setViewerName('')
    document.body.style.overflow = ''
  }

  return (
    <>
      <div>
        <SectionLabel num={num} label="Certifications" />

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl">
            Validated <span className="text-accent italic">expertise.</span>
          </h2>
          <p className="max-w-xs leading-relaxed text-muted-foreground">
            Certificates and credentials I have earned through coursework and examinations.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleCerts.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group flex flex-col rounded-3xl border border-border bg-card/50 p-7 transition-colors hover:border-accent ${
                cert.image ? 'cursor-pointer' : ''
              }`}
              onClick={() => cert.image && openViewer(cert)}
              role={cert.image ? 'button' : undefined}
              tabIndex={cert.image ? 0 : undefined}
              onKeyDown={(e) => {
                if (cert.image && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  openViewer(cert)
                }
              }}
              aria-label={cert.image ? `View ${cert.name} certificate` : undefined}
            >
              <div className="flex items-start justify-between">
                {cert.image ? (
                  <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#ffeaf3] shadow-md p-2 ring-1 ring-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.image}
                      alt={`${cert.name} logo`}
                      width={40}
                      height={40}
                      className="size-10 object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-accent">
                    <Award className="size-6" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {cert.image && (
                    <div className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                      <ZoomIn className="size-4" />
                    </div>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View credential for ${cert.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="mt-6 font-serif text-xl font-medium tracking-tight leading-tight group-hover:text-accent transition-colors">
                {cert.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground font-serif italic">
                {cert.organization}
              </p>

              <div className="mt-4 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
                <span>Issued: {cert.date}</span>
                {cert.credentialId && (
                  <span className="truncate">ID: {cert.credentialId}</span>
                )}
              </div>

              {cert.description && (
                <p className="mt-4 border-t border-border/50 pt-4 text-xs leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>
              )}

              {cert.image && (
                <p className="mt-4 font-mono text-[9px] uppercase tracking-widest text-accent/60">
                  Click to view full certificate
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Full-screen Certificate Viewer Modal ── */}
      <AnimatePresence>
        {viewerImage && (
          <motion.div
            key="cert-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={closeViewer}
            role="dialog"
            aria-modal="true"
            aria-label={`${viewerName} certificate viewer`}
          >
            {/* Close button */}
            <button
              onClick={closeViewer}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-black/80 z-10"
              aria-label="Close certificate viewer"
            >
              <X className="size-5" />
            </button>

            {/* Certificate name */}
            <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Certificate
              </p>
              <p className="font-serif text-base text-white/90 mt-0.5">{viewerName}</p>
            </div>

            {/* Certificate image — fills as much space as possible without distortion */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewerImage}
                alt={`${viewerName} certificate`}
                className="max-h-[85vh] max-w-[90vw] w-auto h-auto object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              />
            </motion.div>

            {/* Tap-outside hint on mobile */}
            <p className="absolute bottom-4 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-widest text-white/30">
              Tap outside to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
