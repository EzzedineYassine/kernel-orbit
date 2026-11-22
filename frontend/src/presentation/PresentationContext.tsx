import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { chapters, getChapter, slides } from '../chapters/registry'
import type { NavigationDirection } from '../types/presentation'
import { PresentationContext } from './context'
import type { PresentationContextValue } from './context'

export type {
  PresentationActions,
  PresentationContextValue,
  PresentationDerived,
  PresentationState,
} from './context'

const clampIndex = (index: number, total: number) => Math.min(Math.max(Math.trunc(index), 0), total - 1)

export function PresentationProvider({ children }: { children: ReactNode }) {
  const totalSlides = slides.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<NavigationDirection>('next')
  const [isTransitioning, setTransitioning] = useState(false)
  const [isOverviewOpen, setOverviewOpen] = useState(false)
  const [isFullscreen, setFullscreen] = useState(false)

  const navigate = useCallback(
    (target: number, dir: NavigationDirection) => {
      if (!Number.isFinite(target) || totalSlides === 0) return
      const bounded = clampIndex(target, totalSlides)
      if (bounded === currentIndex) return
      setDirection(dir)
      setCurrentIndex(bounded)
    },
    [currentIndex, totalSlides],
  )

  const nextSlide = useCallback(() => navigate(currentIndex + 1, 'next'), [navigate, currentIndex])
  const prevSlide = useCallback(() => navigate(currentIndex - 1, 'prev'), [navigate, currentIndex])
  const goToSlide = useCallback((index: number) => navigate(index, 'jump'), [navigate])
  const firstSlide = useCallback(() => navigate(0, 'jump'), [navigate])
  const lastSlide = useCallback(() => navigate(totalSlides - 1, 'jump'), [navigate, totalSlides])

  const value = useMemo<PresentationContextValue>(() => {
    const currentSlide = slides[currentIndex]
    return {
      currentIndex,
      totalSlides,
      direction,
      isTransitioning,
      isOverviewOpen,
      isFullscreen,
      nextSlide,
      prevSlide,
      goToSlide,
      firstSlide,
      lastSlide,
      setOverviewOpen,
      setTransitioning,
      setFullscreen,
      slides,
      chapters,
      currentSlide,
      currentChapter: getChapter(currentSlide.chapterId),
      isFirst: currentIndex === 0,
      isLast: currentIndex === totalSlides - 1,
    }
  }, [
    currentIndex,
    totalSlides,
    direction,
    isTransitioning,
    isOverviewOpen,
    isFullscreen,
    nextSlide,
    prevSlide,
    goToSlide,
    firstSlide,
    lastSlide,
  ])

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>
}
