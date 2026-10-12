import { useEffect, useRef } from 'react'
import './video-modal.css'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  title: string
}

export function VideoModal({ isOpen, onClose, videoSrc, title }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      videoRef.current?.play().catch(() => {})
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="video-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div className="video-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="video-modal-header">
          <div className="video-modal-title tech-font">
            <span className="gold-text">ORIGINAL SOURCE FOOTAGE //</span> {title}
          </div>
          <button
            type="button"
            className="video-modal-close"
            onClick={onClose}
            aria-label="Close video inspection"
          >
            ✕
          </button>
        </div>

        <div className="video-modal-player-wrap">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="video-modal-player"
          />
        </div>

        <div className="video-modal-footer tech-font">
          <span>ORIGINAL 1920×1080 · 24 FPS · BESPOKE BLACK/GOLD SUPERCAR STUDY</span>
          <span className="gold-text">ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  )
}
