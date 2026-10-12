import { useImperativeHandle, useRef } from 'react'
import type { CSSProperties, ReactNode, Ref } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap'
import { FrameLoader } from './FrameLoader'
import { drawBounds, frameIndex, isPlayableManifest, isPlayableVariant } from './types'
import type { FocalPoint, SequenceController, SequenceManifest } from './types'
import './sequence.css'

interface Props {
  poster: string
  alt: string
  manifest?: SequenceManifest
  className?: string
  children?: ReactNode
  fit?: 'cover' | 'contain'
  focalPoint?: FocalPoint
  priority?: boolean
  disabled?: boolean
  pin?: boolean
  scrollDistance?: number | string
  triggerElement?: string | HTMLElement | null
  refreshPriority?: number
  onProgress?: (progress: number) => void
  /** When supplied, the chapter owns scroll progress and this component creates no trigger. */
  controllerRef?: Ref<SequenceController>
}

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string }

export function ScrollImageSequence({ poster, alt, manifest, className = '', children, fit = 'cover', focalPoint, priority = false, disabled = false, pin = false, scrollDistance, triggerElement, refreshPriority = 0, onProgress, controllerRef }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const image = useRef<HTMLImageElement>(null)
  const progress = useRef(0)
  const updateProgress = useRef<(() => void) | null>(null)
  const focalX = focalPoint?.x ?? 0.5
  const focalY = focalPoint?.y ?? 0.5
  const externallyControlled = !!controllerRef

  useImperativeHandle(controllerRef, () => ({
    setProgress(value) {
      progress.current = Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0))
      updateProgress.current?.()
    },
  }), [])

  useGSAP(() => {
    const element = root.current
    const surface = canvas.current
    const posterImage = image.current
    if (disabled || !isPlayableManifest(manifest) || !element || !surface || !posterImage) return
    const context = surface.getContext('2d')
    if (!context) return
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 900px)', compact: '(max-width: 899px)', reduced: '(prefers-reduced-motion: reduce)' }, mediaContext => {
      if (mediaContext.conditions?.reduced) return
      const compact = !!mediaContext.conditions?.compact
      const variant = compact ? manifest.mobile : manifest.desktop
      if (!isPlayableVariant(variant)) return
      const connection = (navigator as Navigator & { connection?: Connection }).connection
      const constrained = () => connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType ?? '')
      if (constrained()) return
      let near = false
      let posterSettled = posterImage.complete
      let width = 0
      let height = 0
      let lastIndex = -1
      let disposed = false
      surface.dataset.variant = compact ? 'mobile' : 'desktop'
      const loader = new FrameLoader(variant, (frame, index) => {
        if (disposed || lastIndex === index || !width || !height) return
        const bounds = drawBounds(frame.width, frame.height, width, height, fit, { x: focalX, y: focalY })
        try {
          // drawImage replaces opaque frames atomically; clear only letterbox gutters.
          if (fit === 'contain') context.clearRect(0, 0, width, height)
          context.drawImage(frame.source, bounds.x, bounds.y, bounds.width, bounds.height)
          lastIndex = index
          surface.dataset.ready = 'true'
          surface.dataset.frame = String(index)
        } catch { surface.dataset.drawError = 'true' }
      }, {
        capacity: compact ? 8 : 10,
        concurrency: compact ? 2 : 3,
        onFailure: index => { surface.dataset.failedFrame = String(index) },
        onChange: stats => {
          surface.dataset.cache = String(stats.cached)
          surface.dataset.pending = String(stats.pending)
          surface.dataset.failed = String(stats.failed)
          surface.dataset.target = String(stats.target)
        },
      })
      loader.suspend()
      const update = () => {
        const target = frameIndex(progress.current, variant.frameCount)
        if (near && posterSettled && !constrained() && !document.hidden) loader.resume(target)
        else loader.suspend()
        surface.dataset.target = String(target)
      }
      updateProgress.current = update
      const resize = new ResizeObserver(() => {
        const rect = element.getBoundingClientRect()
        const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5)
        const nextWidth = Math.round(rect.width * ratio)
        const nextHeight = Math.round(rect.height * ratio)
        if (!nextWidth || !nextHeight || (width === nextWidth && height === nextHeight)) return
        // Backing-store resize clears the canvas. Preserve its valid pixels and
        // synchronously repaint a retained decoded source before the next paint.
        let snapshot: HTMLCanvasElement | undefined
        if (surface.dataset.ready === 'true' && surface.width && surface.height) {
          snapshot = document.createElement('canvas')
          snapshot.width = surface.width
          snapshot.height = surface.height
          snapshot.getContext('2d')?.drawImage(surface, 0, 0)
        }
        width = nextWidth
        height = nextHeight
        surface.width = width
        surface.height = height
        lastIndex = -1
        if (snapshot) context.drawImage(snapshot, 0, 0, width, height)
        loader.redraw()
      })
      resize.observe(element)
      const intersection = new IntersectionObserver(entries => { near = entries[0].isIntersecting; update() }, { rootMargin: priority ? '100% 0px' : '60% 0px' })
      intersection.observe(element)
      let trigger: ScrollTrigger | undefined
      if (!externallyControlled) {
        trigger = ScrollTrigger.create({
          trigger: triggerElement || element,
          start: pin ? 'top top' : 'top bottom',
          end: pin ? (typeof scrollDistance === 'number' ? `+=${scrollDistance}` : scrollDistance ?? (() => `+=${window.innerHeight}`)) : 'bottom top',
          pin,
          pinSpacing: pin,
          refreshPriority,
          onUpdate: self => { progress.current = self.progress; onProgress?.(self.progress); update() },
          onRefresh: self => { progress.current = self.progress; update() },
        })
        progress.current = trigger.progress
      }
      const posterReady = () => { posterSettled = true; update() }
      const preferenceChanged = () => {
        if (constrained()) { surface.dataset.ready = 'false'; trigger?.kill() }
        update()
      }
      posterImage.addEventListener('load', posterReady)
      posterImage.addEventListener('error', posterReady)
      document.addEventListener('visibilitychange', update)
      connection?.addEventListener('change', preferenceChanged)
      return () => {
        disposed = true
        if (updateProgress.current === update) updateProgress.current = null
        trigger?.kill()
        loader.dispose()
        resize.disconnect()
        intersection.disconnect()
        posterImage.removeEventListener('load', posterReady)
        posterImage.removeEventListener('error', posterReady)
        document.removeEventListener('visibilitychange', update)
        connection?.removeEventListener('change', preferenceChanged)
        surface.dataset.ready = 'false'
        surface.dataset.cache = '0'
        surface.dataset.pending = '0'
      }
    })
    return () => media.revert()
  }, { scope: root, dependencies: [manifest, disabled, pin, fit, focalX, focalY, scrollDistance, triggerElement, refreshPriority, onProgress, externallyControlled, priority], revertOnUpdate: true })

  return (
    <div ref={root} className={`scroll-image-sequence ${className}`} data-sequence={manifest?.id} style={{ '--sequence-fit': fit, '--sequence-focal': `${focalX * 100}% ${focalY * 100}%`, '--sequence-aspect': isPlayableManifest(manifest) ? `${manifest.desktop.width} / ${manifest.desktop.height}` : '16 / 9' } as CSSProperties}>
      <img ref={image} className="scroll-image-sequence__poster" src={poster} alt={alt} width={manifest?.desktop?.width} height={manifest?.desktop?.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
      {manifest && <canvas ref={canvas} className="scroll-image-sequence__canvas" aria-hidden="true" />}
      {children && <div className="scroll-image-sequence__content">{children}</div>}
    </div>
  )
}
