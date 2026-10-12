import { media, type MediaAsset } from './media'

export type ModelId = 'revuelto' | 'temerario' | 'urus-se'

export interface VehicleModel {
  readonly id: ModelId
  readonly name: string
  readonly eyebrow: string
  readonly description: string
  /** Combined power in metric horsepower (CV), as published by Lamborghini. */
  readonly power: number
  /** Manufacturer 0–100 km/h acceleration, in seconds. */
  readonly acceleration: number
  /** Manufacturer top speed in km/h; preserves the Revuelto greater-than qualifier. */
  readonly topSpeed: string
  readonly powertrain: string
  readonly priceLabel: string
  readonly image: MediaAsset
  readonly gallery: readonly MediaAsset[]
  readonly sourceUrl: string
  readonly sourceCheckedAt: string
}

export const models: readonly VehicleModel[] = [
  {
    id: 'revuelto', name: 'Revuelto', eyebrow: 'V12 / ELECTRIFIED',
    description: 'A naturally aspirated V12 and three electric motors. A new chapter in the twelve-cylinder story.',
    power: 1015, acceleration: 2.5, topSpeed: '>350',
    powertrain: '6.5 L naturally aspirated V12 + three electric motors',
    priceLabel: 'Price on request', image: media.revueltoHero,
    gallery: [media.revueltoHero, media.revueltoDark, media.revueltoDarkRear, media.revueltoInterior, media.revueltoWhite],
    sourceUrl: 'https://www.lamborghini.com/en-en/models/revuelto', sourceCheckedAt: '2026-10-11',
  },
  {
    id: 'temerario', name: 'Temerario', eyebrow: 'V8 / HIGH REVS',
    description: 'Twin-turbo V8 response meets three electric motors. Sharp geometry, with performance to match.',
    power: 920, acceleration: 2.7, topSpeed: '343',
    powertrain: '4.0 L twin-turbo V8 + three electric motors',
    priceLabel: 'Price on request', image: media.temerarioNeutral,
    gallery: [media.temerarioNeutral, media.temerarioHero, media.temerarioTrack, media.temerarioRear],
    sourceUrl: 'https://www.lamborghini.com/models/temerario', sourceCheckedAt: '2026-10-11',
  },
  {
    id: 'urus-se', name: 'Urus SE', eyebrow: 'V8 / BEYOND THE CITY',
    description: 'A plug-in hybrid powertrain in a Super SUV. More room to make every journey your own.',
    power: 800, acceleration: 3.4, topSpeed: '312',
    powertrain: '4.0 L twin-turbo V8 + electric motor',
    priceLabel: 'Price on request', image: media.urusHero,
    gallery: [media.urusHero],
    sourceUrl: 'https://www.lamborghini.com/en-en/models/urus/urus-se', sourceCheckedAt: '2026-10-11',
  },
]

export function getModel(id: ModelId): VehicleModel {
  const model = models.find((entry) => entry.id === id)
  if (!model) throw new Error(`Unknown model: ${id}`)
  return model
}
