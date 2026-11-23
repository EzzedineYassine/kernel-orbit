import type { ComponentType } from 'react'
import { createPlaceholderSlide } from '../slides/EnginePlaceholderSlide'
import { Slide01Awakening } from '../slides/ch01/Slide01Awakening'
import { Slide02CentralQuestion } from '../slides/ch01/Slide02CentralQuestion'
import { Slide03ArtificialIntelligence } from '../slides/ch01/Slide03ArtificialIntelligence'
import { Slide04MachineLearning } from '../slides/ch01/Slide04MachineLearning'
import { Slide05TraditionalVsML } from '../slides/ch01/Slide05TraditionalVsML'
import { Slide06WhatIsModel } from '../slides/ch02/Slide06WhatIsModel'
import { Slide07AlgorithmVsModel } from '../slides/ch02/Slide07AlgorithmVsModel'
import { Slide08DatasetAnatomy } from '../slides/ch02/Slide08DatasetAnatomy'
import { Slide09LearningParadigms } from '../slides/ch02/Slide09LearningParadigms'
import { Slide10SupervisedClassification } from '../slides/ch02/Slide10SupervisedClassification'
import { Slide11MLLifecycle } from '../slides/ch03/Slide11MLLifecycle'
import { Slide12PreprocessingScaling } from '../slides/ch03/Slide12PreprocessingScaling'
import { Slide13TrainTestSplit } from '../slides/ch03/Slide13TrainTestSplit'
import { Slide14Generalization } from '../slides/ch03/Slide14Generalization'
import { Slide15LazyLearning } from '../slides/ch03/Slide15LazyLearning'
import { Slide16MeetCollaborativeFiltering } from '../slides/ch04/Slide16MeetCollaborativeFiltering'
import { Slide17InteractionMatrix } from '../slides/ch04/Slide17InteractionMatrix'
import { Slide18MatrixFactorizationMath } from '../slides/ch04/Slide18MatrixFactorizationMath'
import { Slide19LatentFactors } from '../slides/ch04/Slide19LatentFactors'
import { Slide20HowALSWorks } from '../slides/ch04/Slide20HowALSWorks'
import { Slide21FactorsToRecommendations } from '../slides/ch04/Slide21FactorsToRecommendations'
import { Slide23WhatMakesModelGood } from '../slides/ch06/Slide23WhatMakesModelGood'
import { Slide24Metrics } from '../slides/ch06/Slide24Metrics'
import { Slide25ConfusionMatrix } from '../slides/ch06/Slide25ConfusionMatrix'
import { Slide26OverfittingUnderfitting } from '../slides/ch06/Slide26OverfittingUnderfitting'
import { Slide27ModelLimitations } from '../slides/ch06/Slide27ModelLimitations'
import { Slide28RealWorldApplications } from '../slides/ch07/Slide28RealWorldApplications'
import { Slide29WhatWeLearned } from '../slides/ch07/Slide29WhatWeLearned'
import { Slide30Conclusion } from '../slides/ch07/Slide30Conclusion'
import type { ChapterId, ChapterMeta, SlideMeta } from '../types/presentation'

/* ── Chapters ──────────────────────────────────────────────────────────── */

export const chapters: readonly ChapterMeta[] = [
  { id: 'ch01', number: 1, title: 'The Awakening', subtitle: 'Why machines that learn matter' },
  { id: 'ch02', number: 2, title: 'Understanding the Model', subtitle: 'Scoring functions and implicit retail data' },
  { id: 'ch03', number: 3, title: 'How Learning Happens', subtitle: 'Cleaning, time splits, and sparse matrices' },
  { id: 'ch04', number: 4, title: 'Meet Matrix Factorization', subtitle: 'Collaborative filtering via Implicit ALS' },
  { id: 'ch05', number: 5, title: 'The ORBIT Laboratory', subtitle: 'Explore live ALS recommendations' },
  { id: 'ch06', number: 6, title: 'Evaluation', subtitle: 'Chronological ranking vs. popularity baseline' },
  { id: 'ch07', number: 7, title: 'Beyond the Algorithm', subtitle: 'Applications, limits, and takeaways' },
]

/* ── Slides (syllabus order — 30 slides preserved) ─────────────────────── */

interface SlideSpec {
  id: string
  chapterId: ChapterId
  title: string
  subtitle?: string
  isInteractive?: boolean
  component?: ComponentType
}

const slideSpecs: readonly SlideSpec[] = [
  // Ch 01 — The Awakening (1–5)
  { id: 's01', chapterId: 'ch01', title: 'Machines Can Learn', subtitle: 'Discover what customers will want next', component: Slide01Awakening },
  { id: 's02', chapterId: 'ch01', title: 'The Central Question', component: Slide02CentralQuestion },
  { id: 's03', chapterId: 'ch01', title: 'Artificial Intelligence', component: Slide03ArtificialIntelligence },
  { id: 's04', chapterId: 'ch01', title: 'Machine Learning', component: Slide04MachineLearning },
  { id: 's05', chapterId: 'ch01', title: 'Traditional Programming vs. ML', component: Slide05TraditionalVsML },

  // Ch 02 — Understanding the Model (6–10)
  { id: 's06', chapterId: 'ch02', title: 'What Is a Recommendation Model?', component: Slide06WhatIsModel },
  { id: 's07', chapterId: 'ch02', title: 'Algorithm vs. Model', component: Slide07AlgorithmVsModel },
  { id: 's08', chapterId: 'ch02', title: 'UCI Online Retail Dataset', component: Slide08DatasetAnatomy },
  { id: 's09', chapterId: 'ch02', title: 'Learning Paradigms', component: Slide09LearningParadigms },
  { id: 's10', chapterId: 'ch02', title: 'Explicit vs. Implicit Feedback', component: Slide10SupervisedClassification },

  // Ch 03 — How Learning Happens (11–15)
  { id: 's11', chapterId: 'ch03', title: 'The Recommendation Lifecycle', component: Slide11MLLifecycle },
  { id: 's12', chapterId: 'ch03', title: 'Cleaning & Confidence Scaling', component: Slide12PreprocessingScaling },
  { id: 's13', chapterId: 'ch03', title: 'Chronological 80 / 20 Split', component: Slide13TrainTestSplit },
  { id: 's14', chapterId: 'ch03', title: 'Generalization & Regularization', component: Slide14Generalization },
  { id: 's15', chapterId: 'ch03', title: 'Sparse Matrix to Dense Factors', component: Slide15LazyLearning },

  // Ch 04 — Meet Matrix Factorization (16–21)
  { id: 's16', chapterId: 'ch04', title: 'Meet Collaborative Filtering', component: Slide16MeetCollaborativeFiltering },
  { id: 's17', chapterId: 'ch04', title: 'Customer–Product Matrix R', component: Slide17InteractionMatrix },
  { id: 's18', chapterId: 'ch04', title: 'Mathematics of Matrix Factorization', component: Slide18MatrixFactorizationMath },
  { id: 's19', chapterId: 'ch04', title: 'Discovering Latent Factors', component: Slide19LatentFactors },
  { id: 's20', chapterId: 'ch04', title: 'How Alternating Least Squares Works', component: Slide20HowALSWorks },
  { id: 's21', chapterId: 'ch04', title: 'From Factors to Recommendations', component: Slide21FactorsToRecommendations },

  // Ch 05 — The ORBIT Laboratory (22 — wired in Phase D)
  { id: 's22', chapterId: 'ch05', title: 'The ORBIT Laboratory', subtitle: 'Interactive ALS recommendation engine', isInteractive: true },

  // Ch 06 — Evaluation (23–27)
  { id: 's23', chapterId: 'ch06', title: 'Evaluating Recommendations', component: Slide23WhatMakesModelGood },
  { id: 's24', chapterId: 'ch06', title: 'Precision, Recall, MAP & NDCG', component: Slide24Metrics },
  { id: 's25', chapterId: 'ch06', title: 'Catalog Coverage & Popularity Bias', component: Slide25ConfusionMatrix },
  { id: 's26', chapterId: 'ch06', title: 'ALS vs. Popularity Holdout', component: Slide26OverfittingUnderfitting },
  { id: 's27', chapterId: 'ch06', title: 'Collaborative Filtering Limitations', component: Slide27ModelLimitations },

  // Ch 07 — Beyond the Algorithm (28–30)
  { id: 's28', chapterId: 'ch07', title: 'Real-World Applications', component: Slide28RealWorldApplications },
  { id: 's29', chapterId: 'ch07', title: 'What We Learned', component: Slide29WhatWeLearned },
  { id: 's30', chapterId: 'ch07', title: 'Beyond the Algorithm', subtitle: 'End of experience', component: Slide30Conclusion },
]

/* ── Derived registry ──────────────────────────────────────────────────── */

const chapterById = new Map<ChapterId, ChapterMeta>(chapters.map((c) => [c.id, c]))

export function getChapter(id: ChapterId): ChapterMeta {
  const chapter = chapterById.get(id)
  if (!chapter) throw new Error(`Unknown chapter: ${id}`)
  return chapter
}

export const slides: readonly SlideMeta[] = slideSpecs.map((spec, index) => {
  const { component, ...rest } = spec
  const meta = { ...rest, index }
  return {
    ...meta,
    component: component ?? createPlaceholderSlide(meta, getChapter(spec.chapterId), slideSpecs.length),
  }
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
