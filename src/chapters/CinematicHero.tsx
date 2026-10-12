import { useRef } from 'react'
import { media } from '../data/media'
import { gsap, useGSAP } from '../motion/gsap'
import { useMotion } from '../motion/MotionContext'
import { ScrollImageSequence } from '../features/sequence'
import { Arrow } from '../components/Icons'

function HeroLetters({ text }: { text: string }) {
  return <>{Array.from(text).map((letter, index) => <span className={'hero-letter' + (letter === '.' ? ' accent' : '')} key={index}>{letter === ' ' ? '\u00a0' : letter}</span>)}</>
}

export function CinematicHero() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.hero-veil', { opacity: 0.94, duration: 1.7 })
      .from('.hero-letter', { yPercent: 110, stagger: 0.035, duration: 1.1 }, 0.2)
      .from('.hero-rule', { scaleX: 0, transformOrigin: 'left', duration: 1.15 }, 0.65)
      .from('.hero-topline, .hero-caption, .hero-bottom', { opacity: 0, y: 16, stagger: 0.1, duration: 0.9 }, 0.9)
    gsap.to('.hero-photograph', { yPercent: 10, scale: 1.035, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    gsap.to('.hero-title', { yPercent: -25, opacity: 0.15, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 15%', scrub: true } })
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true })
  return <section className="hero chapter" id="awakening" ref={root} aria-labelledby="hero-title">
    <div className="hero-photograph"><ScrollImageSequence poster={media.revueltoDark.src} alt={media.revueltoDark.alt} priority disabled={reduced} focalPoint={{ x: 0.54, y: 0.58 }} /></div>
    <div className="hero-veil" aria-hidden="true" />
    <div className="hero-content">
      <div className="hero-topline"><span>An independent automotive experience</span><span>Sant’Agata Bolognese, Italy</span></div>
      <h1 className="hero-title" id="hero-title" aria-label="The art of motion."><span className="hero-line" aria-hidden="true"><HeroLetters text="THE ART" /></span><span className="hero-line hero-line--second" aria-hidden="true"><HeroLetters text="OF MOTION." /></span></h1>
      <div className="hero-rule" aria-hidden="true" />
      <div className="hero-caption"><span className="small-label">Lamborghini Revuelto</span><p>Before the road.<br />A pulse.</p></div>
      <div className="hero-bottom"><a className="scroll-cue" href="#presence"><span className="scroll-cue__line" />Scroll to feel it</a><a className="hero-explore" href="#showroom">Explore the collection <Arrow diagonal /></a></div>
    </div>
    <a href="#presence" className="hero-skip">Skip opening <Arrow /></a>
  </section>
}
