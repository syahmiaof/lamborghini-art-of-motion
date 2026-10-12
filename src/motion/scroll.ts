import type Lenis from 'lenis'
import { ScrollTrigger } from './gsap'

let controller: Lenis | null = null
export function bindScrollController(value: Lenis | null) { controller = value }
export function pauseScroll(paused: boolean) { if (paused) controller?.stop(); else controller?.start() }
export function scrollToY(y: number, immediate = false) {
  const reduced = document.documentElement.dataset.motion === 'reduced'
  if (controller) controller.scrollTo(y, { immediate: immediate || reduced, force: true })
  else window.scrollTo({ top: y, behavior: immediate || reduced ? 'instant' : 'smooth' })
}
export function scrollToChapter(id: string, immediate = false) {
  const element = document.getElementById(id)
  if (!element) return
  const pin = ScrollTrigger.getAll().find(trigger => trigger.pin === element)
  const y = pin ? pin.start : window.scrollY + element.getBoundingClientRect().top - 72
  scrollToY(Math.max(0, y), immediate)
}
