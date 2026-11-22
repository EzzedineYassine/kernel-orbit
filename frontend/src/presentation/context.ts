import { createContext } from 'react'
import type { ChapterMeta, NavigationDirection, SlideMeta } from '../types/presentation'

export interface PresentationState {
  currentIndex: number
  totalSlides: number
  direction: NavigationDirection
  isTransitioning: boolean
  isOverviewOpen: boolean
  isFullscreen: boolean
}

export interface PresentationActions {
  nextSlide: () => void
  prevSlide: () => void
  goToSlide: (index: number) => void
  firstSlide: () => void
  lastSlide: () => void
  setOverviewOpen: (open: boolean) => void
  setTransitioning: (val: boolean) => void
  setFullscreen: (val: boolean) => void
}

export interface PresentationDerived {
  slides: readonly SlideMeta[]
  chapters: readonly ChapterMeta[]
  currentSlide: SlideMeta
  currentChapter: ChapterMeta
  isFirst: boolean
  isLast: boolean
}

export type PresentationContextValue = PresentationState & PresentationActions & PresentationDerived

/** Context object lives in its own module so PresentationContext.tsx only exports components (Fast Refresh). */
export const PresentationContext = createContext<PresentationContextValue | null>(null)
