/**
 * DOM guard helpers shared by keyboard and wheel navigation.
 */

/** Elements inside which presentation navigation keys / wheel must never fire. */
export const INTERACTIVE_ZONE_SELECTOR = [
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[role="slider"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[data-interactive-zone="true"]',
].join(', ')

/** Focusable / activatable elements that should keep native Enter behaviour. */
const ACTIVATABLE_SELECTOR = [
  'button',
  'a[href]',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="switch"]',
].join(', ')

export function isInsideInteractiveZone(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE_ZONE_SELECTOR) !== null
}

export function isInsideDataInteractiveZone(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest('[data-interactive-zone="true"]') !== null
}

/** True when the focused element is body / nothing / a non-interactive node. */
export function isFocusOnNonInteractive(): boolean {
  const active = document.activeElement
  if (!active || active === document.body || active === document.documentElement) return true
  return active.closest(ACTIVATABLE_SELECTOR) === null
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
