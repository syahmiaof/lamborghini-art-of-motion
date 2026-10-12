import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { chapters, type ChapterId } from '../data/chapters'
import { useMotion } from '../motion/MotionContext'
import { Arrow } from './Icons'
import { pauseScroll, scrollToChapter } from '../motion/scroll'

export function SiteNavigation() {
  const { reduced, toggleMotion } = useMotion()
  const [active, setActive] = useState<ChapterId>('awakening')
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const progress = useRef<HTMLDivElement>(null)
  const header = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.style.transform = 'scaleX(' + (total > 0 ? window.scrollY / total : 0) + ')'
      header.current?.classList.toggle('is-scrolled', window.scrollY > 70)
      let current: ChapterId = 'awakening'
      for (const chapter of chapters) {
        const element = document.getElementById(chapter.id)
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.46) current = chapter.id
      }
      setActive(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    if (!open) return
    const element = dialog.current
    element?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseScroll(true)
    return () => { element?.close(); document.body.style.overflow = previous; pauseScroll(false) }
  }, [open])

  function close() { setOpen(false); menuButton.current?.focus() }
  function navigate(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    setOpen(false)
    // Dialog scroll locking must be released before native anchor navigation.
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (!target) return
      history.pushState(null, '', '#' + id)
      scrollToChapter(id, reduced)
      const heading = target.querySelector<HTMLElement>('h1, h2')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    })
  }

  return <>
    <header className="site-header" ref={header}>
      <a className="wordmark" href="#awakening" onClick={event => navigate(event, 'awakening')} aria-label="The Art of Motion, back to beginning">
        LAMBORGHINI<span>AN INDEPENDENT STUDY</span>
      </a>
      <nav className="header-links" aria-label="Main navigation">
        <a href="#presence" onClick={event => navigate(event, 'presence')}>The story</a>
        <a href="#showroom" onClick={event => navigate(event, 'showroom')}>The collection</a>
      </nav>
      <div className="header-actions">
        <button className="motion-toggle" onClick={toggleMotion} aria-pressed={!reduced} aria-label={reduced ? 'Motion disabled. Enable motion unless limited by system preference' : 'Disable motion'} title={reduced ? 'Motion off (system preference respected)' : 'Motion on'}>
          <span className={'motion-bars ' + (reduced ? 'is-off' : '')} aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="motion-label">Motion {reduced ? 'off' : 'on'}</span>
        </button>
        <button ref={menuButton} className="menu-toggle" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="chapter-menu" aria-label="Menu">
          <span>Menu</span><span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
    </header>
    <nav className="chapter-rail" aria-label="Chapter navigation">
      {chapters.map(chapter => <a key={chapter.id} href={'#' + chapter.id} onClick={event => navigate(event, chapter.id)}
        aria-label={chapter.number + '. ' + chapter.title} aria-current={active === chapter.id ? 'location' : undefined}>
        <span>{chapter.title}</span><i /><b>{chapter.number}</b>
      </a>)}
    </nav>
    <dialog id="chapter-menu" className="chapter-menu" data-lenis-prevent ref={dialog} onCancel={event => { event.preventDefault(); close() }} onClick={event => { if (event.target === event.currentTarget) close() }}>
      <div className="menu-top"><span className="small-label">The art of motion / chapters</span><button className="text-button" onClick={close}>Close <span aria-hidden="true">×</span></button></div>
      <nav aria-label="All chapters">
        {chapters.map(chapter => <a key={chapter.id} href={'#' + chapter.id} onClick={event => navigate(event, chapter.id)}>
          <span className="menu-number">{chapter.number}</span><span>{chapter.title}</span><Arrow diagonal />
        </a>)}
      </nav>
      <p className="menu-footnote">An independent automotive experience.<br />Six chapters. One unmistakable attitude.</p>
    </dialog>
  </>
}
