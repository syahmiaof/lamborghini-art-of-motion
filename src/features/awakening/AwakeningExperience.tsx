import { useRef } from 'react'
import { ScrollImageSequence } from '../sequence'
import { awakeningManifest } from '../../data/sequences'
import { useCinematicScene } from '../cinematic/useCinematicScene'

export function AwakeningExperience({ onOpenVideoModal }: { onOpenVideoModal?: (src: string, title: string) => void }) {
  const root = useRef<HTMLElement>(null)
  const controller = useCinematicScene(root, awakeningManifest, 'awakening')
  return (
    <section ref={root} id="awakening" className="cinematic-stage cinematic-awakening chapter" aria-labelledby="awakening-title">
      <ScrollImageSequence
        controllerRef={controller}
        manifest={awakeningManifest}
        poster={awakeningManifest.poster}
        alt={awakeningManifest.alt}
        fit="contain"
        className="scene-media"
      />
      <div className="scene-shade" aria-hidden="true" />
      <div className="scene-chapter-label tech-font">
        <span>01 / THE AWAKENING</span>
        <span>AN INDEPENDENT AUTOMOTIVE STUDY</span>
      </div>
      <div className="scene-opening scene-heading">
        <h2 id="awakening-title" className="display-font">THE ART<br />OF MOTION.</h2>
        <p>Sant&apos;Agata Bolognese · V12 Hybrid Architecture</p>
      </div>
      <div className="scene-detail scene-detail-one">
        <span className="tech-font">01 / ILLUMINATION</span>
        <h3>FRONT LIGHT SIGNATURE</h3>
        <p>Hexagonal Y-shape optics slice the dark underground garage.</p>
      </div>
      <div className="scene-ending">
        <span className="scene-engineering-line" aria-hidden="true" />
        <h3 className="display-font">BLACK / GOLD<br />STUDY</h3>
      </div>
      <div className="scene-footer tech-font">
        <span>SCROLL TO EXPLORE FORM</span>
        {onOpenVideoModal && (
          <button onClick={() => onOpenVideoModal('/media/video-awakening-full.mp4', 'The Awakening — Original 10s Clip')}>
            Watch source clip <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      <p className="scene-static-note">Dark underground reveal to lights-on. Black-and-gold Lamborghini Revuelto custom study.</p>
      <div className="scene-progress" aria-hidden="true"><span className="scene-progress-fill" /></div>
    </section>
  )
}
