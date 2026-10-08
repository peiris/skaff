'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type MotionRevealProps = { children: ReactNode; className?: string; delay?: number }

export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
