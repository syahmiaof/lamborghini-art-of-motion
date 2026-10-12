export interface SequenceVariant {
  frameCount: number
  width: number
  height: number
  extension: 'webp' | 'png'
  /** Absolute public URL containing exactly one {frame} placeholder. */
  urlTemplate: string
  totalBytes: number
  startIndex?: number
  padLength?: number
}

export interface SequenceManifest {
  id: string
  assetRegisterId: string
  rightsStatus: 'approved'
  derivativeFramesAllowed: true
  poster: string
  alt: string
  desktop: SequenceVariant
  mobile?: SequenceVariant
}

export interface FocalPoint { x: number; y: number }

export interface SequenceController {
  /** Uses normalized scene progress; stores it even before frames finish loading. */
  setProgress: (progress: number) => void
}

export function frameIndex(progress: number, count: number): number {
  return Math.min(Math.max(0, count - 1), Math.max(0, Math.round((Number.isFinite(progress) ? progress : 0) * (count - 1))))
}

export function frameUrl(variant: SequenceVariant, index: number): string {
  return variant.urlTemplate.replace('{frame}', String(index + (variant.startIndex ?? 0)).padStart(variant.padLength ?? 5, '0'))
}

export function drawBounds(sourceWidth: number, sourceHeight: number, width: number, height: number, fit: 'cover' | 'contain', focal: FocalPoint) {
  const scale = (fit === 'cover' ? Math.max : Math.min)(width / sourceWidth, height / sourceHeight)
  const drawnWidth = sourceWidth * scale
  const drawnHeight = sourceHeight * scale
  return { x: (width - drawnWidth) * Math.min(1, Math.max(0, focal.x)), y: (height - drawnHeight) * Math.min(1, Math.max(0, focal.y)), width: drawnWidth, height: drawnHeight }
}

export function isPlayableManifest(manifest: SequenceManifest | undefined): manifest is SequenceManifest {
  if (!manifest || manifest.rightsStatus !== 'approved' || !manifest.derivativeFramesAllowed || !manifest.assetRegisterId) return false
  return isPlayableVariant(manifest.desktop)
}

export function isPlayableVariant(v: SequenceVariant | undefined): v is SequenceVariant {
  return !!v && Number.isInteger(v.frameCount) && v.frameCount > 1 && v.frameCount <= 10000
    && Number.isInteger(v.width) && Number.isInteger(v.height) && v.width > 0 && v.height > 0
    && v.width * v.height <= 4096 * 2160 && ['png', 'webp'].includes(v.extension)
    && typeof v.urlTemplate === 'string' && v.urlTemplate.startsWith('/') && !v.urlTemplate.startsWith('//')
    && !v.urlTemplate.includes('..') && v.urlTemplate.split('{frame}').length === 2
    && Number.isInteger(v.startIndex ?? 0) && (v.startIndex ?? 0) >= 0
    && Number.isInteger(v.padLength ?? 5) && (v.padLength ?? 5) >= 1 && (v.padLength ?? 5) <= 8
}

export function supportsSequencePlayback(manifest: SequenceManifest | undefined): boolean {
  if (typeof window === 'undefined' || !isPlayableManifest(manifest) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType ?? '')) return false
  return window.innerWidth >= 900 || isPlayableVariant(manifest.mobile)
}
