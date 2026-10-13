import { useCallback, useEffect, useRef, useState } from 'react'
import { Experience } from './Experience'
import { CinematicIntro } from '../features/intro/CinematicIntro'
import { PlaybackContext } from '../motion/PlaybackContext'
import { pauseScroll } from '../motion/scroll'
import { ScrollTrigger } from '../motion/gsap'
export function ExperienceShell() {
  const [intro, setIntro] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const content = useRef<HTMLDivElement>(null)
  const reveal = useCallback(() => setRevealed(true), [])
  const finish = useCallback(() => {
    setRevealed(true)
    setIntro(false)
  }, [])
  useEffect(() => {
    if (!intro) {
      const frame = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh() })
      return () => cancelAnimationFrame(frame)
    }
    const previous = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    pauseScroll(true)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { if (media.matches) finish() }
    media.addEventListener('change', change)
    return () => {
      document.documentElement.style.overflow = previous
      document.body.style.overflow = bodyOverflow
      pauseScroll(false)
      media.removeEventListener('change', change)
    }
  }, [intro, finish])
  function replay() {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setRevealed(false)
    setIntro(true)
  }
  return <>
    <PlaybackContext value={!intro}>
      <div ref={content} inert={intro} aria-hidden={intro || undefined}>
        <Experience ready={revealed || !intro} onReplayIntro={replay} />
      </div>
    </PlaybackContext>
    {intro && <CinematicIntro onReveal={reveal} onComplete={finish} />}
  </>
}
