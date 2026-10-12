export interface MediaAsset {
  readonly src: string
  readonly srcSmall: string
  readonly width: number
  readonly height: number
  readonly alt: string
  readonly caption: string
  readonly credit: string
  readonly sourceUrl: string
  readonly license: string
  readonly licenseUrl: string
  readonly year: number
  readonly modifications: string
}

const commons = 'https://commons.wikimedia.org/wiki/File:'
const bySa4 = 'https://creativecommons.org/licenses/by-sa/4.0/'

export const media = {
  revueltoDark: {
    src: '/media/revuelto-dark.webp', srcSmall: '/media/revuelto-dark-800.webp',
    width: 1920, height: 1235,
    alt: 'Glossy black Lamborghini Revuelto in front three-quarter view with illuminated Y-shaped headlights',
    caption: 'Revuelto — black exterior, front three-quarter view',
    credit: 'Ethan Llamas', sourceUrl: `${commons}Lamborghini_Revuelto_Brilliant_Black_01.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph. Vehicle paint is unaltered.',
  },
  revueltoDarkRear: {
    src: '/media/revuelto-dark-rear.webp', srcSmall: '/media/revuelto-dark-rear-800.webp',
    width: 1920, height: 1080,
    alt: 'Glossy black Lamborghini Revuelto from the rear showing illuminated taillights and raised rear wing',
    caption: 'Revuelto — black exterior, rear three-quarter view',
    credit: 'Ethan Llamas', sourceUrl: `${commons}Lamborghini_Revuelto_Brilliant_Black_02.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph. Vehicle paint is unaltered.',
  },
  temerarioNeutral: {
    src: '/media/temerario-neutral.webp', srcSmall: '/media/temerario-neutral-800.webp',
    width: 1920, height: 1043,
    alt: 'Matte graphite Lamborghini Temerario in front three-quarter view on an illuminated showroom platform',
    caption: 'Temerario — graphite exterior, front three-quarter view',
    credit: 'MrWalkr', sourceUrl: `${commons}2025_Lamborghini_Temerario.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph. Vehicle paint is unaltered.',
  },
  revueltoHero: {
    src: '/media/revuelto-hero.webp', srcSmall: '/media/revuelto-hero-800.webp',
    width: 1920, height: 1280,
    alt: 'Orange Lamborghini Revuelto in front three-quarter view outside a glass-fronted building',
    caption: 'Revuelto — orange exterior, front three-quarter view',
    credit: '江草慧至', sourceUrl: `${commons}Lamborghini_Revuelto.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2023,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoWhite: {
    src: '/media/revuelto-white.webp', srcSmall: '/media/revuelto-white-800.webp',
    width: 1920, height: 937,
    alt: 'White Lamborghini Revuelto in front three-quarter view at Hampton Court Concours',
    caption: 'Revuelto — white exterior at Hampton Court Concours',
    credit: 'MrWalkr', sourceUrl: `${commons}2023_Lamborghini_Revuelto_Low_HCC23.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2023,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoLime: {
    src: '/media/revuelto-lime.webp', srcSmall: '/media/revuelto-lime-800.webp',
    width: 1920, height: 1280,
    alt: 'Lime green Lamborghini Revuelto approaching a gathering of sports cars',
    caption: 'Revuelto — lime exterior, photographed at a car gathering',
    credit: 'Alexandre Prevot', sourceUrl: `${commons}Lamborghini_Revuelto_(54896208648).jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoInterior: {
    src: '/media/revuelto-interior.webp', srcSmall: '/media/revuelto-interior-800.webp',
    width: 1920, height: 1080,
    alt: 'Revuelto cockpit with steering wheel, digital instruments and orange interior trim',
    caption: 'Revuelto — driver cockpit and orange trim',
    credit: 'Y.Leclercq', sourceUrl: `${commons}Lamborghini_Revuelto_int%C3%A9rieur_02.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2024,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoRear: {
    src: '/media/revuelto-rear.webp', srcSmall: '/media/revuelto-rear-800.webp',
    width: 1280, height: 697,
    alt: 'Orange Lamborghini Revuelto from the rear showing its engine cover and rear light signature',
    caption: 'Revuelto — rear three-quarter view at Goodwood Festival of Speed',
    credit: 'MrWalkr', sourceUrl: `${commons}2023_Lamborghini_Revuelto_Rear.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2023,
    modifications: 'Converted from Wikimedia 1280-pixel thumbnail to WebP; 800-pixel derivative resized. Display may crop and darken.',
  },
  temerarioHero: {
    src: '/media/temerario-hero.webp', srcSmall: '/media/temerario-hero-800.webp',
    width: 1920, height: 1280,
    alt: 'Lime green Lamborghini Temerario in front three-quarter view inside a showroom',
    caption: 'Temerario — lime exterior, front three-quarter view',
    credit: 'Alexandre Prevot', sourceUrl: `${commons}Lamborghini_Temerario.jpg`,
    license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/', year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  temerarioRear: {
    src: '/media/temerario-rear.webp', srcSmall: '/media/temerario-rear-800.webp',
    width: 1280, height: 812,
    alt: 'Green Lamborghini Temerario from the rear at Rétromobile 2026',
    caption: 'Temerario — green exterior, rear three-quarter view',
    credit: 'Charles from Port Chester, New York', sourceUrl: `${commons}Lamborghini_Temerario_(2026)_(55081181722).jpg`,
    license: 'CC0 1.0', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', year: 2026,
    modifications: 'Converted from Wikimedia 1280-pixel thumbnail to WebP; 800-pixel derivative resized. Display may crop and darken.',
  },
  urusHero: {
    src: '/media/urus-hero.webp', srcSmall: '/media/urus-hero-800.webp',
    width: 1280, height: 853,
    alt: 'Grey Lamborghini Urus SE approaching a gathering of sports cars',
    caption: 'Urus SE — grey exterior, front view',
    credit: 'Alexandre Prevot', sourceUrl: `${commons}Lamborghini_Urus_SE_(54896231244).jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Converted from Wikimedia 1280-pixel thumbnail to WebP; 800-pixel derivative resized. Display may crop and darken.',
  },
  revueltoPresence: {
    src: '/media/revuelto-presence.webp', srcSmall: '/media/revuelto-presence-800.webp',
    width: 1920, height: 1154,
    alt: 'Lamborghini Revuelto on an illuminated exhibition stage under dramatic spotlights at Auto Zürich',
    caption: 'Revuelto — dramatic stage reveal at Auto Zürich',
    credit: 'M97 Uzair', sourceUrl: `${commons}Lamborghini_Revuelto_Auto_Zuerich_2023_1X7A1101.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2023,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoVelocity: {
    src: '/media/revuelto-velocity.webp', srcSmall: '/media/revuelto-velocity-800.webp',
    width: 1920, height: 1148,
    alt: 'Lamborghini Revuelto in Arancio Apodis running at speed on the Goodwood Festival of Speed hillclimb tarmac',
    caption: 'Revuelto — dynamic hillclimb run at Goodwood Festival of Speed',
    credit: 'MrWalkr', sourceUrl: `${commons}2023_Lamborghini_Revuelto_LB744_Orange_FOS23.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2023,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoInteriorDetail: {
    src: '/media/revuelto-interior-detail.webp', srcSmall: '/media/revuelto-interior-detail-800.webp',
    width: 1920, height: 1080,
    alt: 'Lamborghini Revuelto cockpit console, digital interfaces, and steering wheel detail',
    caption: 'Revuelto — driver cockpit controls and forged carbon monofuselage architecture',
    credit: 'Y.Leclercq', sourceUrl: `${commons}Lamborghini_Revuelto_int%C3%A9rieur_01.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2024,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  revueltoFinale: {
    src: '/media/revuelto-finale.webp', srcSmall: '/media/revuelto-finale-800.webp',
    width: 1920, height: 928,
    alt: 'Glossy black Lamborghini Revuelto in low three-quarter stance at London Concours',
    caption: 'Revuelto — low aerodynamic stance at London Concours',
    credit: 'MrWalkr', sourceUrl: `${commons}Black_Lamborghini_Revuelto_LC25.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  temerarioTrack: {
    src: '/media/temerario-track.webp', srcSmall: '/media/temerario-track-800.webp',
    width: 1920, height: 1280,
    alt: 'Lamborghini Temerario at the 2026 Adelaide Motorsport Festival circuit',
    caption: 'Temerario — motorsport dynamic display at Adelaide Festival',
    credit: 'Aussie_automotive', sourceUrl: `${commons}Lamborghini_Temerario_at_the_2026_Adelaide_Motorsport_Festival_%28DSCF2495%29.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2026,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  urusArancioFront: {
    src: '/media/urus-arancio-front.webp', srcSmall: '/media/urus-arancio-front-800.webp',
    width: 1920, height: 1234,
    alt: 'Arancio Egon orange Lamborghini Urus SE Super SUV in front three-quarter view',
    caption: 'Urus SE — Arancio Egon orange finish, front three-quarter view',
    credit: 'MrWalkr', sourceUrl: `${commons}Lamborghini_Urus_SE_Arancio_Egon_01.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
  urusArancioRear: {
    src: '/media/urus-arancio-rear.webp', srcSmall: '/media/urus-arancio-rear-800.webp',
    width: 1920, height: 1235,
    alt: 'Arancio Egon orange Lamborghini Urus SE Super SUV from the rear three-quarter angle',
    caption: 'Urus SE — Arancio Egon orange finish, rear diffuser and aerodynamic light signature',
    credit: 'MrWalkr', sourceUrl: `${commons}Lamborghini_Urus_SE_Arancio_Egon_02.jpg`,
    license: 'CC BY-SA 4.0', licenseUrl: bySa4, year: 2025,
    modifications: 'Resized and converted to WebP. Display may crop and darken the photograph.',
  },
} as const satisfies Record<string, MediaAsset>

export type MediaId = keyof typeof media
export const mediaCredits: readonly MediaAsset[] = Object.values(media)
