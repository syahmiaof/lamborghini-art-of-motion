import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '../motion/gsap'
import { useMotion } from '../motion/MotionContext'

export function AnimatedHeading({ children, className = '', id, as: Tag = 'h2' }: {
  children: string; className?: string; id?: string; as?: 'h1' | 'h2' | 'h3'
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const { reduced } = useMotion()
  useGSAP(() => {
    if (reduced) return
    gsap.from('.word-inner', {
      yPercent: 105, duration: 0.95, ease: 'expo.out', stagger: 0.065,
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
    })
  }, { scope: ref, dependencies: [reduced], revertOnUpdate: true })
  const words: ReactNode[] = children.split(' ').map((word, i) =>
    <span className="word-mask" key={i} aria-hidden="true"><span className="word-inner">{word}</span>{' '}</span>)
  return <Tag ref={ref} id={id} className={'display-heading ' + className} aria-label={children}>{words}</Tag>
}
