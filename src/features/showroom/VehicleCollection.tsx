import { useState } from 'react'
import { collectionData, type CollectionVehicle } from '../../data/collection'
import { QuickViewModal } from './QuickViewModal'
import './collection.css'

type FilterTag = 'ALL' | 'REVUELTO' | 'TEMERARIO' | 'URUS' | 'HYBRID' | 'V12'

const filterTabs: readonly FilterTag[] = ['ALL', 'REVUELTO', 'TEMERARIO', 'URUS', 'HYBRID', 'V12']

export function VehicleCollection() {
  const [activeFilter, setActiveFilter] = useState<FilterTag>('ALL')
  const [selectedVehicle, setSelectedVehicle] = useState<CollectionVehicle | null>(null)

  const filtered = activeFilter === 'ALL'
    ? collectionData
    : collectionData.filter((item) => item.tags.includes(activeFilter))

  return (
    <div className="vehicle-collection" aria-labelledby="collection-heading">
      <div className="vehicle-collection__header">
        <span className="small-label tech-font gold-text">06B / ARCHIVAL EXPLORATION</span>
        <h4 id="collection-heading" className="display-font">CURATED VEHICLE ARCHIVE</h4>
        <p className="vehicle-collection__subtitle">
          Authentic photographed exemplars from the Sant’Agata Bolognese lineage. Verified engineering configurations.
        </p>
      </div>

      <div className="filter-bar" role="toolbar" aria-label="Filter vehicle collection by model or powertrain">
        {filterTabs.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`filter-btn ${activeFilter === tag ? 'active' : ''}`}
            aria-pressed={activeFilter === tag}
            onClick={() => setActiveFilter(tag)}
          >
            {tag === 'URUS' ? 'URUS SE' : tag}
          </button>
        ))}
      </div>

      <div className="collection-grid" role="region" aria-live="polite" aria-label="Vehicle collection cards">
        {filtered.map((car) => (
          <article
            key={car.id}
            className="collection-card"
            aria-label={`${car.name}, ${car.color}`}
          >
            <div className="collection-card__media">
              <img
                src={car.image.srcSmall ?? car.image.src}
                alt={car.image.alt}
                width={car.image.width}
                height={car.image.height}
                loading="lazy"
                decoding="async"
              />
              <span className="collection-card__tag tech-font">
                [{car.model.toUpperCase()} — {car.color.toUpperCase()}]
              </span>
              <button
                type="button"
                className="collection-card__quick-view"
                onClick={() => setSelectedVehicle(car)}
                aria-label="Quick view details"
              >
                QUICK VIEW
              </button>
            </div>

            <div className="collection-card__meta">
              <div>
                <h4 className="collection-card__title display-font">{car.name}</h4>
                <div className="collection-card__variant tech-font">
                  {car.year} // {car.power} CV // {car.color}
                </div>
              </div>
              <div className="collection-card__price tech-font">
                {car.priceLabel}
              </div>
            </div>
          </article>
        ))}
      </div>

      <QuickViewModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  )
}
