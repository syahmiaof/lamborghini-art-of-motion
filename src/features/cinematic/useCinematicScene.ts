import { useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap'
import { supportsSequencePlayback, type SequenceController } from '../sequence'
import type { SequenceManifest } from '../sequence/types'
import './cinematic.css'

type Scene = 'hero' | 'awakening' | 'presence' | 'cockpit'
/** One scene clock owns the pin, overlays and deterministic source-frame progress. */
export function useCinematicScene(root: RefObject<HTMLElement | null>, manifest: SequenceManifest, scene: Scene) {
  const controller = useRef<SequenceController>(null)
  useGSAP(() => {
    const element = root.current
    if (!element) return
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
      } else if (scene === 'awakening') {
        timeline.fromTo(select('.scene-opening'), { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .08 }, .18)
          .to(select('.scene-opening'), { autoAlpha: 0, y: -15, duration: .08 }, .52)
          .fromTo(select('.scene-detail-one'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .06 }, .32)
          .to(select('.scene-detail-one'), { autoAlpha: 0, duration: .05 }, .52)
          .fromTo(select('.scene-ending'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .08 }, .65)
          .fromTo(select('.scene-engineering-line'), { scaleX: 0 }, { scaleX: 1, duration: .1 }, .65)
          .to(select('.scene-ending'), { autoAlpha: 0, duration: .06 }, .92)
      } else if (scene === 'presence') {
        timeline.fromTo(select('.scene-opening'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -18, duration: .08 }, .2)
          .fromTo(select('.scene-detail-one'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .06 }, .25)
          .to(select('.scene-detail-one'), { autoAlpha: 0, y: -8, duration: .05 }, .4)
          .fromTo(select('.scene-detail-two'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .06 }, .46)
          .to(select('.scene-detail-two'), { autoAlpha: 0, duration: .05 }, .65)
          .fromTo(select('.scene-ending'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .06 }, .7)
          .fromTo(select('.scene-engineering-line'), { scaleX: 0 }, { scaleX: 1, duration: .12 }, .7)
          .to(select('.scene-ending'), { autoAlpha: 0, duration: .05 }, .9)
      } else {
        timeline.fromTo(select('.scene-opening'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -18, duration: .08 }, .25)
          .fromTo(select('.scene-detail-one'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .06 }, .3)
          .to(select('.scene-detail-one'), { autoAlpha: 0, duration: .05 }, .47)
          .fromTo(select('.scene-detail-two'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .06 }, .52)
          .to(select('.scene-detail-two'), { autoAlpha: 0, duration: .06 }, .7)
          .fromTo(select('.scene-ending'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .1 }, .78)
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
  }, { scope: root, dependencies: [manifest, scene], revertOnUpdate: true })
  return controller
}
