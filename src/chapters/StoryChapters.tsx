import { useRef } from 'react'
import { media } from '../data/media'
import { MediaFrame } from '../components/MediaFrame'
import { Arrow } from '../components/Icons'
import { gsap, useGSAP } from '../motion/gsap'
import { useMotion } from '../motion/MotionContext'

export function VehicleReveal() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + window.innerHeight * 0.7, pin: true, scrub: true, invalidateOnRefresh: true } })
        .fromTo('.presence-photo', { clipPath: 'inset(14% 18% 14% 18%)', scale: 0.94 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1, ease: 'none' })
        .to('.presence-word', { xPercent: -10, duration: 1, ease: 'none' }, 0)
        .from('.presence-copy', { y: 35, opacity: 0.3, duration: 0.5 }, 0.4)
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true })
  return <section ref={root} id="presence" className="presence chapter" aria-labelledby="presence-title">
    <div className="chapter-top"><span>01 / The reveal</span><span>Form follows instinct</span></div>
    <h2 className="presence-word" id="presence-title">IMPOSSIBLE<br /><span>TO IGNORE.</span></h2>
    <MediaFrame asset={media.revueltoPresence} className="presence-photo" />
    <div className="presence-copy"><p>A line that never<br />learned to follow.</p><span>Low. Angular. Unmistakable.<br />The Revuelto makes its presence felt<br />before a wheel turns.</span><a className="text-link" href="#benchmarks">Performance benchmarks <Arrow /></a></div>
  </section>
}

const benchmarkBars = [
  { label: 'SYSTEM OUTPUT INDEX (1,015 CV)', value: '100%', fill: 100, note: 'Flagship HPEV class benchmark' },
  { label: 'COMBINED MECHANICAL TORQUE (1,062 NM)', value: '88%', fill: 88, note: 'Internal combustion + 3x axial flux drive' },
  { label: 'AERODYNAMIC DOWNFORCE (+61% VS ULTIMAE)', value: '92%', fill: 92, note: 'Integrated active aero wing at 250 km/h' },
  { label: 'MONOFUSELAGE TORSIONAL RIGIDITY', value: '95%', fill: 95, note: '40,000 Nm/° carbon composite chassis' },
]

export function PerformanceBenchmarksSection() {
  const container = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.utils.toArray<HTMLElement>('.bar-fill').forEach((bar) => {
      const fill = parseFloat(bar.dataset.fill || '0') / 100
      gsap.to(bar, {
        scaleX: fill,
        duration: 1.4,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      })
    })
  }, { scope: container, dependencies: [reduced], revertOnUpdate: true })

  return (
    <section ref={root} id="benchmarks" className="benchmarks chapter" aria-labelledby="benchmarks-title">
      <span id="engineering" style={{ position: 'absolute', top: 0, pointerEvents: 'none' }} aria-hidden="true" />
      <div className="chapter-top"><span>02 / Benchmarks</span><span>Dynamic performance</span></div>
      <div className="section-bars" ref={container}>
        <div className="section-bars__header">
          <span className="small-label tech-font gold-text">DYNAMIC PERFORMANCE BENCHMARKS</span>
          <h2 id="benchmarks-title" className="display-font">ENGINEERING APEX</h2>
          <p className="section-bars__caption">
            Normalized comparison metrics against hypercar benchmarks. Verified factory figures.
          </p>
        </div>
        <div className="bar-container">
          {benchmarkBars.map((bar) => (
            <div className="bar-group" key={bar.label}>
              <div className="bar-header tech-font">
                <span className="bar-label">{bar.label} <small>({bar.note})</small></span>
                <span className="bar-value">{bar.value}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  data-fill={bar.fill}
                  style={reduced ? { transform: `scaleX(${bar.fill / 100})` } : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const EngineeringBenchmarkBars = PerformanceBenchmarksSection
