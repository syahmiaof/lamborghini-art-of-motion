import { useEffect, useRef } from 'react'
import type { CollectionVehicle } from '../../data/collection'
import { Arrow } from '../../components/Icons'

interface QuickViewModalProps {
  readonly vehicle: CollectionVehicle | null
  readonly onClose: () => void
}

export function QuickViewModal({ vehicle, onClose }: QuickViewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (vehicle) {
      previousFocus.current = document.activeElement as HTMLElement | null
      if (!dialog.open) {
        dialog.showModal()
      }
      // Focus the close button or first focusable element
      const closeBtn = dialog.querySelector<HTMLButtonElement>('.quick-view-modal__close')
      closeBtn?.focus()
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
      previousFocus.current?.focus()
    }
  }, [vehicle])

  if (!vehicle) return null

  return (
    <dialog
      ref={dialogRef}
      className="quick-view-modal"
      data-lenis-prevent
      aria-labelledby="quick-view-title"
      aria-modal="true"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="quick-view-modal__inner">
        <button
          type="button"
          className="quick-view-modal__close"
          onClick={onClose}
          aria-label="Close vehicle details"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="quick-view-modal__media">
          <img
            src={vehicle.image.src}
            alt={vehicle.image.alt}
            width={vehicle.image.width}
            height={vehicle.image.height}
            loading="lazy"
            decoding="async"
          />
          <span className="quick-view-modal__tag tech-font">
            {vehicle.model} // {vehicle.color}
          </span>
        </div>

        <div className="quick-view-modal__details">
          <div className="quick-view-modal__header">
            <span className="tech-font gold-text">{vehicle.year} · {vehicle.powertrain}</span>
            <h3 id="quick-view-title" className="display-font">{vehicle.name}</h3>
            <p className="quick-view-modal__price tech-font">{vehicle.priceLabel}</p>
          </div>

          <p className="quick-view-modal__desc">{vehicle.description}</p>

          <dl className="quick-view-modal__specs tech-font">
            <div>
              <dt>OUTPUT</dt>
              <dd>{vehicle.power} CV</dd>
            </div>
            <div>
              <dt>0–100 KM/H</dt>
              <dd>{vehicle.acceleration.toFixed(1)} s</dd>
            </div>
            <div>
              <dt>TOP SPEED</dt>
              <dd>{vehicle.topSpeed}</dd>
            </div>
            <div>
              <dt>FINISH</dt>
              <dd>{vehicle.color}</dd>
            </div>
          </dl>

          <div className="quick-view-modal__footer">
            <a
              href={vehicle.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="collection-link"
            >
              Official Manufacturer Specifications <Arrow diagonal />
            </a>
            <p className="quick-view-modal__disclaimer">
              Independent portfolio concept. Photographic archival vehicle; not offered for sale.
            </p>
          </div>
        </div>
      </div>
    </dialog>
  )
}
