import { useRef } from 'react'
import { ScrollImageSequence } from '../sequence'
import { presenceManifest } from '../../data/sequences'
import { useCinematicScene } from '../cinematic/useCinematicScene'

export function PresenceExperience({ onOpenVideoModal }: { onOpenVideoModal?: (src: string, title: string) => void }) {
  const root = useRef<HTMLElement>(null)
  const controller = useCinematicScene(root, presenceManifest, 'presence')
  return <section ref={root} id="presence" className="cinematic-stage cinematic-presence chapter" aria-labelledby="presence-title">
    <ScrollImageSequence controllerRef={controller} manifest={presenceManifest} poster={presenceManifest.poster} alt={presenceManifest.alt} fit="cover" mobileFit="cover" className="scene-media" />
    <div className="scene-shade" aria-hidden="true" />
    <div className="scene-chapter-label tech-font"><span>02 / THE GOLDEN REVEAL</span><span>SYAHMIAOF / VISUAL STUDY</span></div>
    <div className="scene-opening scene-heading"><h2 id="presence-title" className="display-font">SCULPTED<br />FOR SPEED.</h2><p>A study in black, gold and proportion.</p></div>
    <div className="scene-detail scene-detail-one"><span className="tech-font">01 / EXTERIOR DETAIL</span><h3>GOLD-FINISHED WHEELS</h3><p>Light traces the spokes as the camera moves.</p></div>
    <div className="scene-detail scene-detail-two"><span className="tech-font">02 / BODYWORK</span><h3>SCULPTED SIDE SURFACES</h3><p>Angular openings. A continuous gold accent.</p></div>
    <div className="scene-ending"><span className="scene-engineering-line" aria-hidden="true" /><h3 className="display-font">SYAHMIAOF<br />CUSTOM EDITION</h3></div>
    <div className="scene-footer tech-font"><span>Scroll to follow the camera</span>{onOpenVideoModal && <button onClick={() => onOpenVideoModal('/media/video-presence-full.mp4', 'The Golden Reveal — Original 10s Clip')}>Watch source clip <span aria-hidden="true">↗</span></button>}</div>
    <p className="scene-static-note">Black-and-gold exterior study. Gold wheels, angular side surfaces and the syahmiaof door livery.</p>
    <div className="scene-progress" aria-hidden="true"><span className="scene-progress-fill" /></div>
  </section>
}
