import { media, type MediaAsset } from './media'

export interface CollectionVehicle {
  readonly id: string
  readonly model: string
  readonly name: string
  readonly year: number
  readonly powertrain: string
  readonly power: number
  readonly acceleration: number
  readonly topSpeed: string
  readonly color: string
  readonly tags: readonly ('ALL' | 'REVUELTO' | 'TEMERARIO' | 'URUS' | 'HYBRID' | 'V12')[]
  readonly image: MediaAsset
  readonly priceLabel: string
  readonly description: string
  readonly sourceUrl: string
}

export const collectionData: readonly CollectionVehicle[] = [
  {
    id: 'revuelto-black',
    model: 'Revuelto',
    name: 'Revuelto HPEV V12',
    year: 2025,
    powertrain: '6.5L naturally aspirated V12 + 3 electric motors',
    power: 1015,
    acceleration: 2.5,
    topSpeed: '>350 km/h',
    color: 'Brilliant Black',
    tags: ['ALL', 'REVUELTO', 'HYBRID', 'V12'],
    image: media.revueltoDark,
    priceLabel: 'Price on request · Malaysia',
    description: 'The first High Performance Electrified Vehicle (HPEV) hybrid super sports car from Sant’Agata Bolognese, featuring a monolithic carbon-fiber monofuselage and 1,015 CV.',
    sourceUrl: 'https://www.lamborghini.com/en-en/models/revuelto',
  },
  {
    id: 'revuelto-orange',
    model: 'Revuelto',
    name: 'Revuelto Launch Spec',
    year: 2024,
    powertrain: '6.5L naturally aspirated V12 + 3 electric motors',
    power: 1015,
    acceleration: 2.5,
    topSpeed: '>350 km/h',
    color: 'Arancio Apodis',
    tags: ['ALL', 'REVUELTO', 'HYBRID', 'V12'],
    image: media.revueltoHero,
    priceLabel: 'Price on request · Malaysia',
    description: 'Iconic orange finish emphasizing the sharp hexagonal aeronautic lines and signature Y-shaped daytime running light architecture.',
    sourceUrl: 'https://www.lamborghini.com/en-en/models/revuelto',
  },
  {
    id: 'temerario-graphite',
    model: 'Temerario',
    name: 'Temerario Twin-Turbo',
    year: 2025,
    powertrain: '4.0L twin-turbo V8 + 3 electric motors',
    power: 920,
    acceleration: 2.7,
    topSpeed: '343 km/h',
    color: 'Matte Graphite',
    tags: ['ALL', 'TEMERARIO', 'HYBRID'],
    image: media.temerarioNeutral,
    priceLabel: 'Price on request · Malaysia',
    description: 'Flat-plane crank twin-turbo V8 capable of revving to an astonishing 10,000 RPM, paired with three axial-flux electric motors for instantaneous response.',
    sourceUrl: 'https://www.lamborghini.com/models/temerario',
  },
  {
    id: 'temerario-lime',
    model: 'Temerario',
    name: 'Temerario Showroom Spec',
    year: 2025,
    powertrain: '4.0L twin-turbo V8 + 3 electric motors',
    power: 920,
    acceleration: 2.7,
    topSpeed: '343 km/h',
    color: 'Verde Shock / Lime',
    tags: ['ALL', 'TEMERARIO', 'HYBRID'],
    image: media.temerarioHero,
    priceLabel: 'Price on request · Malaysia',
    description: 'Finished in electrifying green, showcasing aerodynamic air curtains, rear diffuser tunnels, and a motorsport-honed cockpit.',
    sourceUrl: 'https://www.lamborghini.com/models/temerario',
  },
  {
    id: 'urus-se-grey',
    model: 'Urus',
    name: 'Urus SE Super SUV',
    year: 2025,
    powertrain: '4.0L twin-turbo V8 PHEV + permanent-magnet motor',
    power: 800,
    acceleration: 3.4,
    topSpeed: '312 km/h',
    color: 'Grigio Keres',
    tags: ['ALL', 'URUS', 'HYBRID'],
    image: media.urusHero,
    priceLabel: 'Price on request · Malaysia',
    description: 'The PHEV evolution of the Super SUV: 800 CV combined output, electric torque vectoring, and over 60 km of pure-electric urban range.',
    sourceUrl: 'https://www.lamborghini.com/en-en/models/urus/urus-se',
  },
  {
    id: 'revuelto-white',
    model: 'Revuelto',
    name: 'Revuelto Concours Spec',
    year: 2024,
    powertrain: '6.5L naturally aspirated V12 + 3 electric motors',
    power: 1015,
    acceleration: 2.5,
    topSpeed: '>350 km/h',
    color: 'Bianco Monocerus',
    tags: ['ALL', 'REVUELTO', 'HYBRID', 'V12'],
    image: media.revueltoWhite,
    priceLabel: 'Price on request · Malaysia',
    description: 'Pristine white livery photographed at Hampton Court Concours of Elegance, highlighting the sculpted side NACA ducts.',
    sourceUrl: 'https://www.lamborghini.com/en-en/models/revuelto',
  },
  {
    id: 'temerario-track',
    model: 'Temerario',
    name: 'Temerario Motorsport Spec',
    year: 2026,
    powertrain: '4.0L twin-turbo V8 + 3 electric motors',
    power: 920,
    acceleration: 2.7,
    topSpeed: '343 km/h',
    color: 'Verde Mercurius',
    tags: ['ALL', 'TEMERARIO', 'HYBRID'],
    image: media.temerarioTrack,
    priceLabel: 'Price on request · Malaysia',
    description: 'Motorsport-calibrated dynamic package displayed at the 2026 Adelaide Motorsport Festival circuit, featuring high-downforce aero tunnels and 10,000 RPM redline.',
    sourceUrl: 'https://www.lamborghini.com/models/temerario',
  },
  {
    id: 'urus-se-orange',
    model: 'Urus',
    name: 'Urus SE Arancio Egon',
    year: 2025,
    powertrain: '4.0L twin-turbo V8 PHEV + permanent-magnet motor',
    power: 800,
    acceleration: 3.4,
    topSpeed: '312 km/h',
    color: 'Arancio Egon',
    tags: ['ALL', 'URUS', 'HYBRID'],
    image: media.urusArancioFront,
    priceLabel: 'Price on request · Malaysia',
    description: 'Striking Arancio Egon launch livery with twin-turbo PHEV architecture delivering 800 CV, electric torque vectoring, and active matrix aerodynamics.',
    sourceUrl: 'https://www.lamborghini.com/en-en/models/urus/urus-se',
  },
]
