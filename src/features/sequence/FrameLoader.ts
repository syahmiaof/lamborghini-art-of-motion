import { frameUrl } from './types.ts'
import type { SequenceVariant } from './types.ts'

export interface DecodedFrame {
  source: CanvasImageSource
  width: number
  height: number
  close: () => void
}
export type DecodeFrame = (url: string, signal: AbortSignal) => Promise<DecodedFrame>
export interface FrameLoaderStats { cached: number; pending: number; queued: number; failed: number; target: number; displayed: number }

export async function decodeFrame(url: string, signal: AbortSignal): Promise<DecodedFrame> {
  const response = await fetch(url, { signal, priority: 'low' })
  if (!response.ok) throw new Error(`Sequence frame HTTP ${response.status}`)
  const blob = await response.blob()
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob)
      if (signal.aborted) { bitmap.close(); throw new DOMException('Aborted', 'AbortError') }
      return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() }
    } catch (error) { if (signal.aborted) throw error }
  }
  const objectUrl = URL.createObjectURL(blob)
  const image = new Image()
  const abort = () => { image.src = '' }
  signal.addEventListener('abort', abort, { once: true })
  try {
    image.src = objectUrl
    await image.decode()
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => { image.src = '' } }
  } finally {
    signal.removeEventListener('abort', abort)
    URL.revokeObjectURL(objectUrl)
  }
}

/** A bounded decoding window with last-valid retention and stale-completion safety. */
export class FrameLoader {
  private readonly variant: SequenceVariant
  private readonly decode: DecodeFrame
  private readonly ready: (frame: DecodedFrame, index: number) => void
  private readonly failed: (index: number) => void
  private readonly changed: (stats: FrameLoaderStats) => void
  private readonly capacity: number
  private readonly concurrency: number
  private cache = new Map<number, DecodedFrame>()
  private jobs = new Map<number, AbortController>()
  private failures = new Map<number, number>()
  private queue: number[] = []
  private wanted = new Set<number>()
  private target = 0
  private displayed = -1
  private active = true
  private disposed = false

  constructor(variant: SequenceVariant, ready: (frame: DecodedFrame, index: number) => void, options: { decode?: DecodeFrame; capacity?: number; concurrency?: number; onFailure?: (index: number) => void; onChange?: (stats: FrameLoaderStats) => void } = {}) {
    this.variant = variant
    this.ready = ready
    this.decode = options.decode ?? decodeFrame
    this.capacity = Math.max(2, Math.min(16, options.capacity ?? 10))
    this.concurrency = Math.max(1, Math.min(4, options.concurrency ?? 3))
    this.failed = options.onFailure ?? (() => {})
    this.changed = options.onChange ?? (() => {})
  }

  request(index: number) {
    if (!this.active || this.disposed) return
    const target = Math.max(0, Math.min(this.variant.frameCount - 1, Math.round(Number.isFinite(index) ? index : 0)))
    const direction = target >= this.target ? 1 : -1
    this.target = target
    const nearby = [target]
    for (let distance = 1; nearby.length < this.capacity && distance < this.variant.frameCount; distance++) {
      for (const next of [target + distance * direction, target - distance * direction]) {
        if (next >= 0 && next < this.variant.frameCount && nearby.length < this.capacity) nearby.push(next)
      }
    }
    this.wanted = new Set(nearby)
    for (const [index, controller] of this.jobs) if (!this.wanted.has(index)) controller.abort()
    this.queue = nearby.filter(n => !this.cache.has(n) && !this.jobs.has(n) && (this.failures.get(n) ?? 0) < 2)
    this.drawAvailable()
    this.pump()
  }

  /** Redraw the retained source after a resize even while the exact target is missing. */
  redraw() {
    if (this.disposed) return
    const index = this.cache.has(this.target) ? this.target : this.displayed
    const frame = this.cache.get(index)
    if (frame) this.ready(frame, index)
  }

  suspend() {
    this.active = false
    this.queue = []
    for (const controller of this.jobs.values()) controller.abort()
    // One retained bitmap allows a resize to repaint the actual last frame.
    for (const [index, frame] of this.cache) if (index !== this.displayed) { frame.close(); this.cache.delete(index) }
    this.notify()
  }

  resume(index: number) { if (!this.disposed) { this.active = true; this.request(index) } }
  dispose() {
    this.disposed = true
    this.suspend()
    for (const frame of this.cache.values()) frame.close()
    this.cache.clear()
  }
  get stats(): FrameLoaderStats { return { cached: this.cache.size, pending: this.jobs.size, queued: this.queue.length, failed: this.failures.size, target: this.target, displayed: this.displayed } }
  private notify() { if (!this.disposed) this.changed(this.stats) }

  private drawAvailable() {
    let index = this.target
    if (!this.cache.has(index)) {
      // Hold a drawn image rather than oscillating among arriving neighbours.
      if (this.displayed >= 0) return
      const nearby = [...this.cache.keys()].filter(key => this.wanted.has(key)).sort((a, b) => Math.abs(a - this.target) - Math.abs(b - this.target))
      if (!nearby.length) return
      index = nearby[0]
    }
    const frame = this.cache.get(index)!
    this.cache.delete(index)
    this.cache.set(index, frame)
    this.displayed = index
    this.ready(frame, index)
  }

  private pump() {
    while (this.active && !this.disposed && this.jobs.size < this.concurrency && this.queue.length) {
      const index = this.queue.shift()!
      const controller = new AbortController()
      this.jobs.set(index, controller)
      void Promise.resolve().then(() => this.decode(frameUrl(this.variant, index), controller.signal)).then(frame => {
        if (this.disposed || !this.active || controller.signal.aborted) { frame.close(); return }
        if (frame.width !== this.variant.width || frame.height !== this.variant.height) { frame.close(); throw new Error('Sequence dimensions differ from manifest') }
        this.cache.set(index, frame)
        this.drawAvailable()
        while (this.cache.size > this.capacity) {
          const oldest = [...this.cache.keys()].find(key => key !== this.displayed && key !== this.target)!
          this.cache.get(oldest)?.close()
          this.cache.delete(oldest)
        }
      }).catch(() => {
        if (controller.signal.aborted || this.disposed) return
        const attempts = (this.failures.get(index) ?? 0) + 1
        this.failures.set(index, attempts)
        this.failed(index)
        // Retry the requested frame once; an isolated failure never stops a scene.
        if (index === this.target && attempts < 2 && this.active) this.queue.unshift(index)
      }).finally(() => {
        this.jobs.delete(index)
        if (controller.signal.aborted && this.active && this.wanted.has(index) && !this.cache.has(index) && !this.queue.includes(index)) this.queue.push(index)
        this.pump()
      })
    }
    this.notify()
  }
}
