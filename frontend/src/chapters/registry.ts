import { createPlaceholderSlide } from '../slides/EnginePlaceholderSlide'
import type { ChapterId, ChapterMeta, SlideMeta } from '../types/presentation'

/* ── Chapters ──────────────────────────────────────────────────────────── */

export const chapters: readonly ChapterMeta[] = [
  { id: 'ch01', number: 1, title: 'The Awakening', subtitle: 'Why machines that learn matter' },
  { id: 'ch02', number: 2, title: 'Understanding the Model', subtitle: 'What a model actually is' },
  { id: 'ch03', number: 3, title: 'How Learning Happens', subtitle: 'From examples to predictions' },
  { id: 'ch04', number: 4, title: 'Meet KNN', subtitle: 'K-Nearest Neighbors, step by step' },
  { id: 'ch05', number: 5, title: 'The KERNEL Laboratory', subtitle: 'Train and probe a live model' },
  { id: 'ch06', number: 6, title: 'The Reality Check', subtitle: 'Evaluating what the model learned' },
  { id: 'ch07', number: 7, title: 'Beyond the Algorithm', subtitle: 'Where this takes us next' },
]

/* ── Slides (syllabus order) ───────────────────────────────────────────── */
// NOTE: titles for Ch 01–04 are provisional working titles; they will be
// finalised with real content in Phases 5–6.

type SlideSpec = Pick<SlideMeta, 'id' | 'chapterId' | 'title' | 'subtitle' | 'isInteractive'>

const slideSpecs: readonly SlideSpec[] = [
  // Ch 01 — The Awakening (1–5)
  { id: 's01', chapterId: 'ch01', title: 'KERNEL', subtitle: 'Inside the Machine Learning Model' },
  { id: 's02', chapterId: 'ch01', title: 'A Question Worth Asking', subtitle: 'Can a machine learn from experience?' },
  { id: 's03', chapterId: 'ch01', title: 'Machines That Learn' },
  { id: 's04', chapterId: 'ch01', title: 'Data Is Everywhere' },
  { id: 's05', chapterId: 'ch01', title: 'The Journey Ahead' },
  // Ch 02 — Understanding the Model (6–10)
  { id: 's06', chapterId: 'ch02', title: 'What Is a Model?' },
  { id: 's07', chapterId: 'ch02', title: 'Features & Labels' },
  { id: 's08', chapterId: 'ch02', title: 'From Input to Prediction' },
  { id: 's09', chapterId: 'ch02', title: 'Classification vs Regression' },
  { id: 's10', chapterId: 'ch02', title: 'The Feature Space' },
  // Ch 03 — How Learning Happens (11–15)
  { id: 's11', chapterId: 'ch03', title: 'Learning From Examples' },
  { id: 's12', chapterId: 'ch03', title: 'Training & Testing Data' },
  { id: 's13', chapterId: 'ch03', title: 'Patterns, Not Rules' },
  { id: 's14', chapterId: 'ch03', title: 'Measuring Error' },
  { id: 's15', chapterId: 'ch03', title: 'Generalization' },
  // Ch 04 — Meet KNN (16–21)
  { id: 's16', chapterId: 'ch04', title: 'Meet KNN', subtitle: 'K-Nearest Neighbors' },
  { id: 's17', chapterId: 'ch04', title: 'Similarity as Distance' },
  { id: 's18', chapterId: 'ch04', title: 'Distance Metrics' },
  { id: 's19', chapterId: 'ch04', title: 'Choosing K' },
  { id: 's20', chapterId: 'ch04', title: 'The Neighbors Vote' },
  { id: 's21', chapterId: 'ch04', title: 'Decision Boundaries' },
  // Ch 05 — The KERNEL Laboratory (22)
  { id: 's22', chapterId: 'ch05', title: 'The KERNEL Laboratory', subtitle: 'Interactive model playground', isInteractive: true },
  // Ch 06 — The Reality Check (23–27)
  { id: 's23', chapterId: 'ch06', title: 'What Makes a Model Good?' },
  { id: 's24', chapterId: 'ch06', title: 'Metrics' },
  { id: 's25', chapterId: 'ch06', title: 'The Confusion Matrix' },
  { id: 's26', chapterId: 'ch06', title: 'Overfitting vs Underfitting' },
  { id: 's27', chapterId: 'ch06', title: 'Limitations' },
  // Ch 07 — Beyond the Algorithm (28–30)
  { id: 's28', chapterId: 'ch07', title: 'Real-World Applications' },
  { id: 's29', chapterId: 'ch07', title: 'What We Learned' },
  { id: 's30', chapterId: 'ch07', title: 'Conclusion', subtitle: 'Inside the machine, and beyond' },
]

/* ── Derived registry ──────────────────────────────────────────────────── */

const chapterById = new Map<ChapterId, ChapterMeta>(chapters.map((c) => [c.id, c]))

export function getChapter(id: ChapterId): ChapterMeta {
  const chapter = chapterById.get(id)
  if (!chapter) throw new Error(`Unknown chapter: ${id}`)
  return chapter
}

export const slides: readonly SlideMeta[] = slideSpecs.map((spec, index) => {
  const meta = { ...spec, index }
  return { ...meta, component: createPlaceholderSlide(meta, getChapter(spec.chapterId), slideSpecs.length) }
})

/** Zero-based index of the first slide of each chapter. */
export const chapterStartIndex: Readonly<Record<ChapterId, number>> = chapters.reduce(
  (acc, c) => {
    acc[c.id] = slides.findIndex((s) => s.chapterId === c.id)
    return acc
  },
  {} as Record<ChapterId, number>,
)

export const TOTAL_SLIDES = slides.length
