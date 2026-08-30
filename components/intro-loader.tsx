'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onComplete: () => void
}

export function IntroLoader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const isFinishedRef = useRef(false)
  const maxProgressRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let animId: number
    const DURATION = 1350

    const frame = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now
      }

      const elapsed = now - startTimeRef.current
      const ratio = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - ratio, 2.8)
      const targetPercent = Math.round(eased * 100)

      const nextProgress = Math.min(100, Math.max(maxProgressRef.current, targetPercent))
      maxProgressRef.current = nextProgress
      setProgress(nextProgress)

      if (ratio < 1) {
        animId = requestAnimationFrame(frame)
      } else {
        if (!isFinishedRef.current) {
          isFinishedRef.current = true
          setTimeout(() => {
            onCompleteRef.current()
          }, 160)
        }
      }
    }

    animId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground select-none"
    >
      <div className="pointer-events-none absolute size-80 rounded-full bg-accent/20 blur-3xl dark:bg-accent/15" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="font-serif text-5xl font-light tracking-tight sm:text-6xl"
      >
        IKRAM<span className="text-accent">.</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-8 flex flex-col items-center gap-2.5 sm:mt-10"
      >
        <div className="flex w-48 items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:w-56">
          <span className="tracking-[0.2em]">Loading</span>
          <span className="font-semibold text-accent">{progress}%</span>
        </div>

        <div className="h-[2.5px] w-48 overflow-hidden rounded-full bg-accent/20 dark:bg-white/10 sm:w-56">
          <div
            className="h-full rounded-full bg-accent shadow-[0_0_12px_rgba(201,74,126,0.7)] dark:shadow-[0_0_14px_rgba(230,164,196,0.85)]"
            style={{
              width: `${progress}%`,
              transition: 'width 60ms linear',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
