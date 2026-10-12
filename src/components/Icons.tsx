export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.5" />
  </svg>
}
export function Plus({ minus = false }: { minus?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d={minus ? 'M3 10h14' : 'M3 10h14M10 3v14'} stroke="currentColor" strokeWidth="1.5" />
  </svg>
}
