import type { ComponentType } from 'react'

export type ChapterId = 'ch01' | 'ch02' | 'ch03' | 'ch04' | 'ch05' | 'ch06' | 'ch07'

export interface ChapterMeta {
  id: ChapterId
  number: number
  title: string
  subtitle: string
}

export interface SlideMeta {
  id: string
  /** Zero-based position in the deck. */
  index: number
  chapterId: ChapterId
  title: string
  subtitle?: string
  isInteractive?: boolean
  component: ComponentType
}

export type NavigationDirection = 'next' | 'prev' | 'jump'
