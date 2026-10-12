import { useRef } from 'react'
import { ScrollImageSequence } from '../sequence'
import { cockpitManifest } from '../../data/sequences'
import { useCinematicScene } from '../cinematic/useCinematicScene'

export function CockpitExperience({ onOpenVideoModal }: { onOpenVideoModal?: (src: string, title: string) => void }) {
  const root = useRef<HTMLElement>(null)
  const controller = useCinematicScene(root, cockpitManifest, 'cockpit')
  return <section ref={root} id="cockpit" className="cinematic-stage cinematic-cockpit" aria-labelledby="cockpit-title">
    <ScrollImageSequence controllerRef={controller} manifest={cockpitManifest} poster={cockpitManifest.poster} alt={cockpitManifest.alt} fit="cover" className="scene-media" />
    <div className="scene-shade" aria-hidden="true" />
    <div className="scene-chapter-label tech-font"><span>03 / THE COCKPIT</span><span>A QUIETER PERSPECTIVE</span></div>
    <div className="scene-opening scene-heading"><h2 id="cockpit-title" className="display-font">CRAFTED AROUND<br />THE DRIVER.</h2></div>
    <div className="scene-detail scene-detail-one"><span className="tech-font">01 / CABIN ARCHITECTURE</span><h3>DRIVER-CENTRIC COCKPIT</h3><p>The wheel, instruments and centre console in one view.</p></div>
    <div className="scene-detail scene-detail-two"><span className="tech-font">02 / IN FOCUS</span><h3>DIGITAL INSTRUMENTATION</h3><p>The camera moves closer to the driving controls.</p></div>
    <div className="scene-ending"><h3 className="display-font">DESIGNED TO BE FELT.</h3></div>
    <div className="scene-footer tech-font"><span>Scroll to move closer</span>{onOpenVideoModal && <button onClick={() => onOpenVideoModal('/media/cockpit-push.mp4', 'The Cockpit — Original 10s Clip')}>Watch source clip <span aria-hidden="true">↗</span></button>}</div>
    <p className="scene-static-note">A view of the steering wheel, digital instruments and centre console. Black-and-tan cabin study.</p>
    <div className="scene-progress" aria-hidden="true"><span className="scene-progress-fill" /></div>
  </section>
}
