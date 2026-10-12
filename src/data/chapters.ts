export const chapters = [
  { id: 'awakening', number: '01', title: 'Awakening', act: 'Mystery' },
  { id: 'presence', number: '02', title: 'Presence', act: 'Form' },
  { id: 'benchmarks', number: '03', title: 'Benchmarks', act: 'Precision' },
  { id: 'showroom', number: '04', title: 'Showroom', act: 'Choice' },
  { id: 'configure', number: '05', title: 'Configure', act: 'Expression' },
  { id: 'finale', number: '06', title: 'Finale', act: 'Reflection' },
] as const

export type Chapter = (typeof chapters)[number]
export type ChapterId = Chapter['id']
