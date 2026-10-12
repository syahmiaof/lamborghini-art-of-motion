import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { models, type ModelId } from '../../data/models'
import type { MediaAsset } from '../../data/media'
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap'
import { useMotion } from '../../motion/MotionContext'
import { scrollToChapter, scrollToY } from '../../motion/scroll'
import { VehicleCollection } from './VehicleCollection'
import './showroom.css'

const travelQuery = '(min-width: 1024px) and (min-height: 560px) and (pointer: fine)'
function subscribeTravel(callback: () => void) {
  const query = window.matchMedia(travelQuery)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const travelSnapshot = () => window.matchMedia(travelQuery).matches

export type ModelSelectionProps = {
  selectedModelId: ModelId
  onSelectModel: (id: ModelId) => void
}

export function VehicleImage({ asset, className = '' }: { asset: MediaAsset; className?: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)
  return (
    <div className={`vehicle-image ${loaded ? 'vehicle-image--loaded' : ''} ${className}`} aria-busy={!loaded && !failed}>
      {failed ? (
        <div className="vehicle-image__error" role="status">
          <p>This view could not be loaded.</p>
          <button type="button" onClick={() => { setFailed(false); setAttempt((value) => value + 1) }}>Try again</button>
          <a href={asset.sourceUrl} target="_blank" rel="noreferrer">View the original photograph</a>
        </div>
      ) : (
        <picture key={attempt}>
          {asset.srcSmall && <source media="(max-width: 700px)" srcSet={asset.srcSmall} />}
          <img src={asset.src} width={asset.width} height={asset.height} alt={asset.alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
        </picture>
      )}
      {!loaded && !failed && <span className="vehicle-image__loading" aria-hidden="true">Loading photograph</span>}
    </div>
  )
}

export function Arrow({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
}

export function ModelSelector({ selectedModelId, onSelectModel }: ModelSelectionProps) {
  return (
    <div className="model-selector" role="group" aria-label="Choose a Lamborghini model">
      {models.map((model, index) => (
        <button key={model.id} type="button" aria-pressed={selectedModelId === model.id} onClick={() => onSelectModel(model.id)}>
          <span className="model-selector__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span>{model.name}</span>
          <span className="model-selector__mark" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

function ShowroomBay({ model, active, onExplore }: { model: (typeof models)[number]; active: boolean; onExplore: () => void }) {
  const [viewIndex, setViewIndex] = useState(0)
  const views = [model.image, ...model.gallery.filter((asset) => asset.src !== model.image.src)]
  const asset = views[viewIndex] ?? model.image
  function step(direction: number) {
    setViewIndex((current) => (current + direction + views.length) % views.length)
  }
  return (
    <div className="showroom-bay">
      <div className="showroom-bay__giant-name display-font" aria-hidden="true">{model.name}</div>
      <div className="showroom-bay__identity">
        {active ? (
          <h3>{model.name}</h3>
        ) : (
          <span className="showroom-bay__inactive-name display-font" aria-hidden="true">{model.name}</span>
        )}
        <p>{model.powertrain}</p>
      </div>
      <div className="showroom-bay__photograph">
        <VehicleImage key={asset.src} asset={asset} />
        {active && (
          <div className="showroom-bay__view-controls">
            <span aria-live="polite">{String(viewIndex + 1).padStart(2, '0')} <span className="showroom-bay__count">/ {String(views.length).padStart(2, '0')}</span></span>
            <button type="button" onClick={() => step(-1)} disabled={views.length < 2} aria-label={`Previous ${model.name} photograph`}><Arrow direction="left" /></button>
            <button type="button" onClick={() => step(1)} disabled={views.length < 2} aria-label={`Next ${model.name} photograph`}><Arrow /></button>
          </div>
        )}
      </div>
      <div className="showroom-bay__caption"><span>{model.description}</span><a href={asset.sourceUrl} target="_blank" rel="noreferrer">Photo: {asset.credit}</a></div>
      <dl className="showroom-specs">
        <div><dt>Combined power</dt><dd>{model.power.toLocaleString('en')} <span>CV</span></dd></div>
        <div><dt>0–100 km/h</dt><dd>{model.acceleration.toFixed(1)} <span>seconds</span></dd></div>
        <div><dt>Top speed</dt><dd>{model.topSpeed} <span>km/h</span></dd></div>
        <div className="showroom-specs__price"><dt>Malaysia</dt><dd>{model.priceLabel}</dd></div>
      </dl>
      <div className="showroom-bay__actions">
        <a className="collection-link" href="#configure" onClick={(event) => { event.preventDefault(); onExplore(); scrollToChapter('configure') }}>Explore this model <Arrow /></a>
        <a className="showroom-source" href={model.sourceUrl} target="_blank" rel="noreferrer">Manufacturer specifications <Arrow /></a>
      </div>
    </div>
  )
}

export function ModelShowroom({ selectedModelId, onSelectModel }: ModelSelectionProps) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const select = useRef(onSelectModel)
  const previousIndex = useRef(-1)
  const [activeIndex, setActiveIndex] = useState(0)
  const { reduced } = useMotion()
  const wide = useSyncExternalStore(subscribeTravel, travelSnapshot, () => false)
  const horizontal = wide && !reduced
  useEffect(() => { select.current = onSelectModel }, [onSelectModel])

  useGSAP(() => {
    if (!horizontal || !stage.current || !track.current) return
    const match = gsap.matchMedia()
    match.add(travelQuery, () => {
      const stageElement = stage.current!
      const trackElement = track.current!
      const distance = () => Math.max(0, trackElement.scrollWidth - stageElement.clientWidth)
      gsap.to(trackElement, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          id: 'collection-travel',
          trigger: stageElement,
          start: 'top 72px',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: function () {
          const progress = this.progress()
          const index = Math.round(progress * (models.length - 1))
          if (index === previousIndex.current) return
          previousIndex.current = index
          setActiveIndex(index)
          if ((this.scrollTrigger as ScrollTrigger | undefined)?.isActive) select.current(models[index].id)
        },
      })
      return () => { previousIndex.current = -1 }
    })
    return () => match.revert()
  }, { scope: root, dependencies: [horizontal], revertOnUpdate: true })

  function navigateToModel(id: ModelId) {
    onSelectModel(id)
    const index = models.findIndex((model) => model.id === id)
    const trigger = ScrollTrigger.getById('collection-travel')
    if (horizontal && trigger) {
      // Explicit choices land at a panel boundary; ordinary wheel motion stays scrubbed.
      scrollToY(trigger.start + ((trigger.end - trigger.start) * index / (models.length - 1)), true)
      trigger.animation?.progress(index / (models.length - 1))
      setActiveIndex(index)
    }
  }

  return (
    <section ref={root} id="showroom" className={`chapter showroom${horizontal ? ' showroom--horizontal' : ''}`} aria-labelledby="showroom-title">
      <div className="showroom__heading" data-reveal>
        <h2 id="showroom-title">Choose your<br /><em>own instinct.</em></h2>
        <p>Three expressions of the same refusal to blend in. Find the one that moves you.</p>
      </div>
      <div ref={stage} className="showroom-stage">
        <ModelSelector selectedModelId={horizontal ? models[activeIndex].id : selectedModelId} onSelectModel={navigateToModel} />
        <div className="showroom-stage__viewport">
          <div ref={track} className="showroom-track">
            {models.map((model, index) => {
              const active = horizontal ? activeIndex === index : selectedModelId === model.id
              return <article className="showroom-panel" key={model.id} data-active={active} inert={!active} aria-hidden={!active} aria-label={model.name} onFocusCapture={() => {
                if (!horizontal) return
                navigateToModel(model.id)
                const viewport = stage.current?.querySelector<HTMLElement>('.showroom-stage__viewport')
                if (viewport) viewport.scrollLeft = 0
              }}>
                <ShowroomBay model={model} active={active} onExplore={() => onSelectModel(model.id)} />
              </article>
            })}
          </div>
        </div>
        <p className="showroom-bay__announcement" role="status">Selected model: {horizontal ? models[activeIndex].name : models.find((model) => model.id === selectedModelId)?.name}.</p>
      </div>
      <details className="model-comparison" onToggle={() => ScrollTrigger.refresh()}>
        <summary><span>Compare the range</span><span className="model-comparison__toggle" aria-hidden="true" /></summary>
        <div className="model-comparison__scroll" tabIndex={0} role="region" aria-label="Model specification comparison, scroll horizontally on smaller screens">
          <table>
            <caption>Manufacturer figures. Model specifications can vary by market.</caption>
            <thead><tr><th scope="col">Specification</th>{models.map((item) => <th key={item.id} scope="col">{item.name}</th>)}</tr></thead>
            <tbody>
              <tr><th scope="row">Powertrain</th>{models.map((item) => <td key={item.id}>{item.powertrain}</td>)}</tr>
              <tr><th scope="row">Combined power</th>{models.map((item) => <td key={item.id}>{item.power.toLocaleString('en')} CV</td>)}</tr>
              <tr><th scope="row">0–100 km/h</th>{models.map((item) => <td key={item.id}>{item.acceleration.toFixed(1)} s</td>)}</tr>
              <tr><th scope="row">Top speed</th>{models.map((item) => <td key={item.id}>{item.topSpeed} km/h</td>)}</tr>
              <tr><th scope="row">Pricing · Malaysia</th>{models.map((item) => <td key={item.id}>{item.priceLabel}</td>)}</tr>
              <tr><th scope="row">Source</th>{models.map((item) => <td key={item.id}><a href={item.sourceUrl} target="_blank" rel="noreferrer">Official {item.name} page</a><small>Checked {item.sourceCheckedAt}</small></td>)}</tr>
            </tbody>
          </table>
        </div>
      </details>
      <VehicleCollection />
    </section>
  )
}
