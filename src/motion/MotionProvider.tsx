import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionContext } from './MotionContext'
import { gsap, ScrollTrigger } from './gsap'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { bindScrollController, scrollToChapter } from './scroll'

const query = '(prefers-reduced-motion: reduce)'
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
const snapshot = () => window.matchMedia(query).matches

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useSyncExternalStore(subscribe, snapshot, () => false)
  const [motionOff, setMotionOff] = useState(() => {
    try { return sessionStorage.getItem('art-of-motion:motion') === 'off' } catch { return false }
  })
  const reduced = systemReduced || motionOff
  useEffect(() => {
    const mm = gsap.matchMedia()
    if (!reduced) mm.add('(min-width: 900px) and (pointer: fine)', () => {
      const lenis = new Lenis({ autoRaf: false, duration: 1.05, smoothWheel: true })
      bindScrollController(lenis)
      const tick = (time: number) => lenis.raf(time * 1000)
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      return () => { gsap.ticker.remove(tick); bindScrollController(null); lenis.destroy() }
    })
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const id = anchor.hash.slice(1)
      if (!document.getElementById(id)) return
      event.preventDefault()
      history.pushState(null, '', '#' + id)
      scrollToChapter(id)
      const heading = document.getElementById(id)?.querySelector<HTMLElement>('h1, h2')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    }
    const restore = () => scrollToChapter(window.location.hash.slice(1) || 'awakening', true)
    document.addEventListener('click', navigate)
    window.addEventListener('popstate', restore)
    return () => { mm.revert(); document.removeEventListener('click', navigate); window.removeEventListener('popstate', restore) }
  }, [reduced])
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [reduced])
  function toggleMotion() {
    // An OS reduced-motion preference remains authoritative.
    if (systemReduced) return
    setMotionOff(value => {
      try { sessionStorage.setItem('art-of-motion:motion', value ? 'on' : 'off') } catch { /* Private browsing may deny storage. */ }
      return !value
    })
  }
  return <MotionContext value={{ reduced, toggleMotion }}>{children}</MotionContext>
}
