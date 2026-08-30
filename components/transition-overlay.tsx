'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'

/**
 * Full-screen brand transition shown the instant a nav link is clicked.
 * Wordmark + thin loading line sweeping 0% -> 100% with a live counter.
 * When the line completes, the destination section is revealed underneath
 * and the overlay disappears.
 */
export function TransitionOverlay({ show }: { show: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!show) {
      setProgress(0)
      return
    }
    const controls = animate(0, 100, {
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
    })
    return () => controls.stop()
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl">
            IKRAM<span className="text-accent">.</span>
          </div>

          <div className="mt-5 h-[2px] w-48 overflow-hidden rounded-full bg-border sm:w-56">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-accent shadow-[0_0_12px_rgba(230,164,196,0.6)]"
            />
          </div>

          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
