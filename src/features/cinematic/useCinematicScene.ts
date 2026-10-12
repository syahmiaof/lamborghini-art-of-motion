import { useContext, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap'
import { supportsSequencePlayback, type SequenceController } from '../sequence'
import type { SequenceManifest } from '../sequence/types'
import './cinematic.css'
import { PlaybackContext } from '../../motion/PlaybackContext'

type Scene = 'hero' | 'awakening' | 'presence' | 'cockpit'
/** One scene clock owns the pin, overlays and deterministic source-frame progress. */
export function useCinematicScene(root: RefObject<HTMLElement | null>, manifest: SequenceManifest, scene: Scene) {
  const controller = useRef<SequenceController>(null)
  const playbackEnabled = useContext(PlaybackContext)
  useGSAP(() => {
    const element = root.current
    if (!element || !playbackEnabled) return
    const match = gsap.matchMedia()
    match.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 900px)', tall: '(min-height: 500px)' }, context => {
      const playable = !!context.conditions?.motion && !!context.conditions?.tall && supportsSequencePlayback(manifest)
      element.dataset.playback = playable ? 'sequence' : 'poster'
      if (!playable) { controller.current?.setProgress(0); return }
      const select = gsap.utils.selector(element)
      const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      // A fixed unit duration lets overlay beats use normalized scroll positions.
      timeline.to({}, { duration: 1 })
      if (scene === 'hero') {
        timeline.to(select('.hero-ui'), { autoAlpha: 0, y: -25, duration: .23 }, .08)
          .to(select('.hero-overlay'), { opacity: .22, duration: .28 }, .05)
      } else {
        const slow = scene === 'cockpit'
        const opening = select('.scene-opening')
        timeline.fromTo(opening, { autoAlpha: 1 }, { autoAlpha: 0, y: -12, duration: .07 }, .26)
        timeline.fromTo(select('.scene-opening h2'), { clipPath: 'inset(0 0 100% 0)', y: slow ? 8 : 14 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: slow ? .1 : .07, ease: 'power2.out' }, 0)
        timeline.fromTo(select('.scene-detail-one'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .06 }, .36)
          .to(select('.scene-detail-one'), { autoAlpha: 0, y: -8, duration: .05 }, .49)
        if (select('.scene-detail-two').length) timeline.fromTo(select('.scene-detail-two'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .06 }, .57)
          .to(select('.scene-detail-two'), { autoAlpha: 0, duration: .05 }, .72)
        timeline.fromTo(select('.scene-ending'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: slow ? .1 : .07 }, .81)
        if (select('.scene-engineering-line').length) timeline.fromTo(select('.scene-engineering-line'), { scaleX: 0 }, { scaleX: 1, duration: .12 }, .79)
        if (!slow) timeline.to(select('.scene-ending'), { autoAlpha: 0, duration: .05 }, .95)
      }
      const progressLine = element.querySelector<HTMLElement>('.scene-progress-fill')
      const apply = (p: number) => {
        controller.current?.setProgress(p)
        timeline.progress(p)
        element.dataset.progress = p.toFixed(4)
        if (progressLine) progressLine.style.transform = `scaleX(${p})`
        const ui = element.querySelector<HTMLElement>('.hero-ui')
        if (ui) ui.inert = p > .32
      }
      const trigger = ScrollTrigger.create({
        id: `scene-${scene}`, trigger: element, start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (scene === 'cockpit' ? 2.4 : 2))}`,
        pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
        refreshPriority: scene === 'hero' ? 30 : scene === 'awakening' ? 25 : scene === 'presence' ? 20 : 0,
        onUpdate: self => apply(self.progress), onRefresh: self => apply(self.progress),
      })
      apply(trigger.progress)
      return () => { trigger.kill(); timeline.revert(); element.querySelector<HTMLElement>('.hero-ui')?.removeAttribute('inert'); delete element.dataset.progress }
    })
    return () => { match.revert(); delete element.dataset.playback }
  }, { scope: root, dependencies: [manifest, scene, playbackEnabled], revertOnUpdate: true })
  return controller
}
