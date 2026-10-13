import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../motion/gsap'
import './intro.css'

type CinematicIntroProps = {
  onReveal: () => void
  onComplete: () => void
}

/** Native film playback owns this clock. ScrollTrigger never controls the intro. */
export function CinematicIntro({ onReveal, onComplete }: CinematicIntroProps) {
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const skip = useRef<HTMLButtonElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const elapsed = useRef<HTMLSpanElement>(null)
  const actions = useRef({ finish: () => {}, play: () => {} })
  const callbacks = useRef({ onReveal, onComplete })
  const [blocked, setBlocked] = useState(false)
  const [source] = useState(() => {
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
    return `/media/intro/awakening-${mobile ? 'mobile' : 'desktop'}-v1.mp4`
  })

  useEffect(() => { callbacks.current = { onReveal, onComplete } }, [onReveal, onComplete])

  useGSAP(() => {
    const film = video.current
    const overlay = root.current
    if (!film || !overlay) return

    let disposed = false
    let closing = false
    let revealed = false
    let completed = false
    let hasPlayed = false
    let playPending = false
    let autoplayBlocked = false
    let resumeAfterHidden = false
    let frameId: number | undefined
    let rafId: number | undefined
    let exit: gsap.core.Tween | undefined
    let lastPercent = -1
    let lastSecond = -1
    let lastPhase = ''
    let lastMediaTime = film.currentTime
    let idleMs = 0
    let visibleMs = 0
    let guardStamp = performance.now()

    const typography = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    typography
      .set('.intro-stage', { autoAlpha: 0 }, 0)
      .set('.intro-stage__line', { yPercent: 110 }, 0)
      .set('.intro-standby', { autoAlpha: 1 }, 0)
      .fromTo('.intro-structural-line', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
      .to('.intro-standby', { autoAlpha: 0, duration: 0.18 }, 0.82)
      .set('.intro-stage--initializing', { autoAlpha: 1 }, 1)
      .to('.intro-stage--initializing .intro-stage__line', { yPercent: 0, duration: 0.65, stagger: 0.08 }, 1)
      .to('.intro-stage--initializing', { autoAlpha: 0, duration: 0.18 }, 2.82)
      .set('.intro-stage--ignition', { autoAlpha: 1 }, 3)
      .to('.intro-stage--ignition .intro-stage__line', { yPercent: 0, duration: 0.6, stagger: 0.06 }, 3)
      .to('.intro-progress', { autoAlpha: 1, duration: 0.35 }, 3)
      .to('.intro-stage--ignition', { autoAlpha: 0, duration: 0.18 }, 4.82)
      .set('.intro-stage--motion', { autoAlpha: 1 }, 5)
      .to('.intro-stage--motion .intro-stage__line', { yPercent: 0, duration: 0.75, stagger: 0.09 }, 5)
      .to('.intro-stage--motion', { autoAlpha: 0, duration: 0.3 }, 7.5)
      .to('.intro-brand, .intro-progress', { autoAlpha: 0, duration: 0.4 }, 7.5)
      .fromTo('.intro-final-divider', { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: 'power2.inOut' }, 7.5)
      .to('.intro-final-divider, .intro-structural-line', { autoAlpha: 0, duration: 0.5 }, 9.5)
    typography.time(0)

    const reveal = () => {
      if (revealed || disposed) return
      revealed = true
      callbacks.current.onReveal()
    }

    const cancelClock = () => {
      if (frameId !== undefined && typeof film.cancelVideoFrameCallback === 'function') film.cancelVideoFrameCallback(frameId)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
      frameId = undefined
      rafId = undefined
    }

    const complete = () => {
      if (completed || disposed) return
      completed = true
      callbacks.current.onComplete()
      // Intentional post-unmount handoff: React removes the modal before focus moves.
      requestAnimationFrame(() => {
        if (document.querySelector('.cinematic-intro')) return
        const target = document.querySelector<HTMLElement>('#main-content, main')
        if (!target) return
        const previousTabIndex = target.getAttribute('tabindex')
        if (previousTabIndex === null) target.tabIndex = -1
        target.focus({ preventScroll: true })
        if (previousTabIndex === null) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
      })
    }

    const finish = () => {
      if (closing || disposed) return
      closing = true
      cancelClock()
      // Fade out the intro interface typography/controls first so only pure automotive footage dissolves
      gsap.to('.intro-interface', { opacity: 0, duration: 0.3, ease: 'power2.out' })
      // Trigger the hero section entrance in sync with the crossfade so the user sees the hero emerge smoothly
      reveal()
      // Keep the final decoded frame mounted while dissolving into the hero with luxurious ease
      exit = gsap.to(overlay, {
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
          film.pause()
          complete()
        },
      })
    }

    const sync = () => {
      if (disposed || closing) return
      const time = Math.max(0, Math.min(10, film.currentTime))
      typography.time(time, true)
      const ratio = Math.min(1, time / (Number.isFinite(film.duration) && film.duration > 0 ? film.duration : 10))
      if (progress.current) {
        progress.current.style.transform = `scaleX(${ratio})`
        const percent = Math.round(ratio * 100)
        if (percent !== lastPercent) {
          progress.current.parentElement?.setAttribute('aria-valuenow', String(percent))
          lastPercent = percent
        }
      }
      const second = Math.floor(time)
      if (elapsed.current && second !== lastSecond) {
        elapsed.current.textContent = `00:${String(second).padStart(2, '0')} / 00:10`
        lastSecond = second
      }
      const phase = time < 1 ? 'standby' : time < 3 ? 'initializing' : time < 5 ? 'ignition' : time < 7.5 ? 'reveal' : time < 9.5 ? 'final' : 'handoff'
      if (phase !== lastPhase) { overlay.dataset.phase = phase; lastPhase = phase }
      if (time >= 9.4) finish()
    }

    const clock = () => {
      frameId = undefined
      rafId = undefined
      if (disposed || closing || film.paused || document.hidden) return
      sync()
      if (typeof film.requestVideoFrameCallback === 'function') frameId = film.requestVideoFrameCallback(clock)
      else rafId = requestAnimationFrame(clock)
    }

    const tryPlay = () => {
      if (disposed || closing || playPending || document.hidden) return
      playPending = true
      idleMs = 0
      film.muted = true
      void film.play().then(() => {
        playPending = false
        if (disposed || closing) return
        autoplayBlocked = false
        setBlocked(false)
      }).catch((error: unknown) => {
        playPending = false
        if (disposed || closing || document.hidden) return
        if (error instanceof DOMException && error.name === 'NotSupportedError') { finish(); return }
        autoplayBlocked = true
        setBlocked(true)
      })
    }

    const playing = () => {
      if (disposed || closing) return
      hasPlayed = true
      autoplayBlocked = false
      setBlocked(false)
      idleMs = 0
      cancelClock()
      if (document.hidden) { resumeAfterHidden = true; film.pause(); return }
      clock()
    }

    const canPlay = () => {
      if (!hasPlayed && !autoplayBlocked) tryPlay()
    }
    const ended = () => { sync(); finish() }
    const visibility = () => {
      guardStamp = performance.now()
      if (document.hidden) {
        resumeAfterHidden = !film.paused || playPending
        film.pause()
        cancelClock()
      } else if (resumeAfterHidden || (!hasPlayed && !autoplayBlocked)) {
        resumeAfterHidden = false
        tryPlay()
      }
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); finish(); return }
      if (event.key !== 'Tab') return
      const buttons = Array.from(overlay.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')).filter((button) => button.getClientRects().length > 0)
      const first = buttons[0]
      const last = buttons.at(-1)
      if (!first || !last) return
      if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }

    film.addEventListener('canplay', canPlay)
    film.addEventListener('playing', playing)
    film.addEventListener('timeupdate', sync)
    film.addEventListener('ended', ended)
    film.addEventListener('error', finish)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('keydown', keydown)
    const guard = window.setInterval(() => {
      const now = performance.now()
      const delta = now - guardStamp
      guardStamp = now
      if (document.hidden || closing || disposed) return
      visibleMs += delta
      if (Math.abs(film.currentTime - lastMediaTime) > 0.02) { lastMediaTime = film.currentTime; idleMs = 0 }
      else idleMs += delta
      // These are escape deadlines, not artificial playback delays.
      if (idleMs >= (autoplayBlocked ? 12000 : hasPlayed ? 5000 : 8000) || visibleMs >= 25000) finish()
    }, 500)
    actions.current = { finish, play: tryPlay }
    skip.current?.focus({ preventScroll: true })
    tryPlay()

    return () => {
      disposed = true
      actions.current = { finish: () => {}, play: () => {} }
      window.clearInterval(guard)
      cancelClock()
      exit?.kill()
      film.removeEventListener('canplay', canPlay)
      film.removeEventListener('playing', playing)
      film.removeEventListener('timeupdate', sync)
      film.removeEventListener('ended', ended)
      film.removeEventListener('error', finish)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('keydown', keydown)
      film.pause()
    }
  }, { scope: root })

  return (
    <div ref={root} className="cinematic-intro" role="dialog" aria-modal="true" aria-label="The machine awakens. A ten-second automotive film." data-phase="standby" data-playback={blocked ? 'blocked' : 'playing'}>
      <video ref={video} className="intro-film" src={source} poster={`/media/intro/${source.includes('mobile') ? 'poster-mobile' : 'poster'}.webp`} autoPlay muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
      <div className="intro-shade" aria-hidden="true" />
      <div className="intro-interface">
        <div className="intro-brand" aria-hidden="true">
          <p>SYAHMIAOF <span>/ AUTOMOTIVE EXPERIENCE</span></p>
          <span className="intro-structural-line" />
        </div>
        <button ref={skip} className="intro-skip" type="button" onClick={() => actions.current.finish()}>
          Skip intro <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3" /></svg>
        </button>
        <div className="intro-copy" aria-hidden="true">
          <p className="intro-standby">SYSTEM 01 — STANDBY</p>
          <div className="intro-stage intro-stage--initializing">
            <div className="intro-stage__mask"><p className="intro-stage__line intro-stage__title">INITIALIZING</p></div>
            <div className="intro-stage__mask"><p className="intro-stage__line intro-stage__label">V12 HYBRID SYSTEM</p></div>
          </div>
          <div className="intro-stage intro-stage--ignition">
            <div className="intro-stage__mask"><p className="intro-stage__line intro-stage__title">IGNITION SEQUENCE</p></div>
          </div>
          <div className="intro-stage intro-stage--motion">
            <div className="intro-stage__mask"><p className="intro-stage__line intro-stage__title">THE ART OF MOTION</p></div>
            <div className="intro-stage__mask"><p className="intro-stage__line intro-stage__label">NERO × ORO</p></div>
          </div>
          <span className="intro-final-divider" />
        </div>
        <div className="intro-progress">
          <div className="intro-progress__labels"><span>Film playback</span><span ref={elapsed}>00:00 / 00:10</span></div>
          <div className="intro-progress__track" role="progressbar" aria-label="Intro video playback" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><div ref={progress} className="intro-progress__fill" /></div>
        </div>
        {blocked && <div className="intro-playback-fallback" role="status">
          <p>Play the opening film, or enter the experience.</p>
          <div><button type="button" onClick={() => actions.current.play()}>Play film</button><button type="button" onClick={() => actions.current.finish()}>Continue to website</button></div>
        </div>}
      </div>
    </div>
  )
}
