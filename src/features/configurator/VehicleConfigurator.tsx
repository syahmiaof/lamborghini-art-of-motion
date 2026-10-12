import { useState } from 'react'
import { models } from '../../data/models'
import { Arrow, ModelSelector, VehicleImage, type ModelSelectionProps } from '../showroom/ModelShowroom'
import './configurator.css'

const photographLabels: Record<string, string> = {
  '/media/revuelto-dark.webp': 'Black · front',
  '/media/revuelto-dark-rear.webp': 'Black · rear',
  '/media/temerario-neutral.webp': 'Graphite exterior',
  '/media/revuelto-hero.webp': 'Orange · front',
  '/media/revuelto-rear.webp': 'Orange · rear',
  '/media/revuelto-interior.webp': 'Cockpit',
  '/media/revuelto-white.webp': 'White exterior',
  '/media/revuelto-lime.webp': 'Lime exterior',
  '/media/temerario-hero.webp': 'Front view',
  '/media/temerario-rear.webp': 'Rear view',
  '/media/urus-hero.webp': 'Exterior view',
}

function CuratedViews({ model, onReset }: { model: (typeof models)[number]; onReset: () => void }) {
  const [viewIndex, setViewIndex] = useState(0)
  const views = [model.image, ...model.gallery.filter((asset) => asset.src !== model.image.src)]
  const active = views[viewIndex] ?? model.image
  return (
    <div className="curated-views">
      <div className="curated-views__preview">
        <VehicleImage key={active.src} asset={active} />
        <div className="curated-views__image-caption"><span>{model.name} / View {String(viewIndex + 1).padStart(2, '0')}</span><a href={active.sourceUrl} target="_blank" rel="noreferrer">Photo credit</a></div>
      </div>
      <div className="curated-views__controls">
        <div className="curated-views__title"><h3>{model.name}</h3><button type="button" onClick={() => { setViewIndex(0); onReset() }}>Reset</button></div>
        <fieldset className="curated-views__choices">
          <legend>Curated looks &amp; views</legend>
          <div className="curated-views__thumbnails">
            {views.map((asset, index) => (
              <button key={asset.src} type="button" aria-pressed={viewIndex === index} aria-label={asset.caption} onClick={() => setViewIndex(index)}>
                <img src={asset.srcSmall ?? asset.src} alt="" width="120" height="80" loading="lazy" decoding="async" />
                <span>{photographLabels[asset.src] ?? `View ${String(index + 1).padStart(2, '0')}`}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <p className="curated-views__selection" role="status">{active.caption}</p>
        <fieldset className="curated-views__unavailable" disabled aria-describedby={`availability-${model.id}`}>
          <legend>Personalisation</legend>
          <div><span>Exterior paint</span><button type="button">As photographed</button></div>
          <div><span>Wheel design</span><button type="button">As photographed</button></div>
          <div><span>Interior trim</span><button type="button">As photographed</button></div>
        </fieldset>
        <p id={`availability-${model.id}`} className="curated-views__note">These are photographed vehicles, each with its own finish and setting. Paint, wheels and trim cannot be combined here. Build your own combination in Lamborghini’s official configurator.</p>
        <a className="collection-link curated-views__cta" href="https://configurator.lamborghini.com/configurator/" target="_blank" rel="noreferrer">Open official configurator <Arrow /></a>
        <p className="curated-views__disclaimer">Opens Lamborghini’s website. No configuration or enquiry is submitted by this concept.</p>
      </div>
    </div>
  )
}

export function VehicleConfigurator({ selectedModelId, onSelectModel }: ModelSelectionProps) {
  const model = models.find((item) => item.id === selectedModelId) ?? models[0]
  return (
    <section id="configure" className="chapter configurator" aria-labelledby="configure-title">
      <div className="configurator__heading" data-reveal>
        <h2 id="configure-title">A closer look.<br /><em>A personal choice.</em></h2>
        <p>Take your time with the details. Explore the available views, then make it yours in the official configurator.</p>
      </div>
      <ModelSelector selectedModelId={selectedModelId} onSelectModel={onSelectModel} />
      <CuratedViews key={model.id} model={model} onReset={() => onSelectModel('revuelto')} />
    </section>
  )
}
