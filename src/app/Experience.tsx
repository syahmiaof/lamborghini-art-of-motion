import { useEffect, useRef, useState, type MouseEvent, type FormEvent } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../motion/gsap'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { bindScrollController, scrollToChapter } from '../motion/scroll'
import { AwakeningExperience } from '../features/awakening/AwakeningExperience'
import { PresenceExperience } from '../features/presence/PresenceExperience'
import { CockpitExperience } from '../features/cockpit/CockpitExperience'
import { VideoModal } from '../features/video/VideoModal'

interface InventoryItem {
  readonly id: string
  readonly model: string
  readonly year: number
  readonly price: number
  readonly spec: string
  readonly color: string
  readonly tags: readonly string[]
  readonly image: string
  readonly power: string
  readonly acceleration: string
  readonly topSpeed: string
  readonly engine: string
  readonly chassis: string
}

const inventoryData: readonly InventoryItem[] = [
  {
    id: 'rev-01',
    model: 'Revuelto',
    year: 2026,
    price: 673294,
    spec: '6.5L V12 Hybrid',
    color: 'Brilliant Black',
    tags: ['REVUELTO', 'HYBRID', 'V12'],
    image: '/media/revuelto-dark.webp',
    power: '1,015 CV',
    acceleration: '2.5s (0-100 km/h)',
    topSpeed: '>350 km/h',
    engine: '6.5L Naturally Aspirated V12 + 3 Electric Motors',
    chassis: 'Carbon Monofuselage with Forged Composites',
  },
  {
    id: 'tem-01',
    model: 'Temerario',
    year: 2026,
    price: 386649,
    spec: '4.0L V8 Hybrid',
    color: 'Verde Shock',
    tags: ['TEMERARIO', 'HYBRID'],
    image: '/media/temerario-hero.webp',
    power: '920 CV',
    acceleration: '2.7s (0-100 km/h)',
    topSpeed: '343 km/h',
    engine: '4.0L Twin-Turbo Flat-Plane V8 @ 10,000 RPM + 3 Axial Flux Motors',
    chassis: 'High-Strength Aluminium Spaceframe',
  },
  {
    id: 'urus-01',
    model: 'Urus SE',
    year: 2026,
    price: 280736,
    spec: '4.0L V8 PHEV',
    color: 'Grigio Keres',
    tags: ['URUS', 'HYBRID'],
    image: '/media/urus-hero.webp',
    power: '800 CV',
    acceleration: '3.4s (0-100 km/h)',
    topSpeed: '312 km/h',
    engine: '4.0L Twin-Turbo V8 + Electric Motor (800 Nm Combined)',
    chassis: 'Adaptive Air Suspension & Active Torque Vectoring',
  },
  {
    id: 'rev-02',
    model: 'Revuelto',
    year: 2025,
    price: 612858,
    spec: '6.5L V12 Hybrid',
    color: 'Arancio Apodis',
    tags: ['REVUELTO', 'HYBRID', 'V12'],
    image: '/media/revuelto-hero.webp',
    power: '1,015 CV',
    acceleration: '2.5s (0-100 km/h)',
    topSpeed: '>350 km/h',
    engine: '6.5L Naturally Aspirated V12 + 3 Electric Motors',
    chassis: 'Carbon Monofuselage with Forged Composites',
  },
  {
    id: 'tem-02',
    model: 'Temerario',
    year: 2026,
    price: 425000,
    spec: '4.0L V8 Hybrid',
    color: 'Verde Mercurius',
    tags: ['TEMERARIO', 'HYBRID'],
    image: '/media/temerario-track.webp',
    power: '920 CV',
    acceleration: '2.7s (0-100 km/h)',
    topSpeed: '343 km/h',
    engine: '4.0L Twin-Turbo Flat-Plane V8 @ 10,000 RPM + 3 Axial Flux Motors',
    chassis: 'High-Strength Aluminium Spaceframe',
  },
  {
    id: 'urus-02',
    model: 'Urus SE',
    year: 2025,
    price: 295000,
    spec: '4.0L V8 PHEV',
    color: 'Arancio Egon',
    tags: ['URUS', 'HYBRID'],
    image: '/media/urus-arancio-front.webp',
    power: '800 CV',
    acceleration: '3.4s (0-100 km/h)',
    topSpeed: '312 km/h',
    engine: '4.0L Twin-Turbo V8 + Electric Motor (800 Nm Combined)',
    chassis: 'Adaptive Air Suspension & Active Torque Vectoring',
  },
  {
    id: 'rev-03',
    model: 'Revuelto',
    year: 2024,
    price: 645000,
    spec: '6.5L V12 Hybrid',
    color: 'Bianco Monocerus',
    tags: ['REVUELTO', 'HYBRID', 'V12'],
    image: '/media/revuelto-white.webp',
    power: '1,015 CV',
    acceleration: '2.5s (0-100 km/h)',
    topSpeed: '>350 km/h',
    engine: '6.5L Naturally Aspirated V12 + 3 Electric Motors',
    chassis: 'Carbon Monofuselage with Forged Composites',
  },
  {
    id: 'tem-03',
    model: 'Temerario',
    year: 2025,
    price: 395000,
    spec: '4.0L V8 Hybrid',
    color: 'Matte Graphite',
    tags: ['TEMERARIO', 'HYBRID'],
    image: '/media/temerario-neutral.webp',
    power: '920 CV',
    acceleration: '2.7s (0-100 km/h)',
    topSpeed: '343 km/h',
    engine: '4.0L Twin-Turbo Flat-Plane V8 @ 10,000 RPM + 3 Axial Flux Motors',
    chassis: 'High-Strength Aluminium Spaceframe',
  },
]

interface ResponsiveImageProps {
  readonly src: string
  readonly alt: string
  readonly className?: string
  readonly priority?: boolean
  readonly sizes?: string
}

function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 800px) 100vw, 1920px',
}: ResponsiveImageProps) {
  const smallSrc = src.replace('.webp', '-800.webp')
  const srcSet = `${smallSrc} 800w, ${src} 1920w`
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
    />
  )
}

export function Experience() {
  const root = useRef<HTMLElement>(null)
  const lineupWrapper = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const [filter, setFilter] = useState('all')
  const [activeModalCar, setActiveModalCar] = useState<InventoryItem | null>(null)

  // Video Modal States
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [videoModalSrc, setVideoModalSrc] = useState('')
  const [videoModalTitle, setVideoModalTitle] = useState('')

  const handleOpenVideoModal = (src: string, title: string) => {
    setVideoModalSrc(src)
    setVideoModalTitle(title)
    setVideoModalOpen(true)
  }

  // CTA Form States
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [formError, setFormError] = useState('')
  const [btnText, setBtnText] = useState('REQUEST TEST DRIVE')
  const [btnSubmitted, setBtnSubmitted] = useState(false)

  // 1. Initialize Lenis Smooth Scrolling with GSAP Ticker Synchronization & Reduced Motion Guard
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.documentElement.setAttribute('data-motion', 'reduced')
      return
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    bindScrollController(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Global scroll progress bar update
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0 && progressBarRef.current) {
        const progress = (window.scrollY / scrollHeight) * 100
        progressBarRef.current.style.transform = `scaleX(${progress / 100})`
        progressBarRef.current.setAttribute('aria-valuenow', String(Math.round(progress)))
      }
    }
    // Smooth scroll for internal chapter anchor links
    const handleAnchorClick = (e: globalThis.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const targetEl = document.getElementById(hash.slice(1))
      if (targetEl) {
        e.preventDefault()
        history.pushState(null, '', hash)
        scrollToChapter(hash.slice(1))
      }
    }
    document.addEventListener('click', handleAnchorClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    let live = true
    const restore = () => scrollToChapter(location.hash.slice(1) || 'hero', true)
    window.addEventListener('popstate', restore)
    document.fonts.ready.then(() => { if (live) { ScrollTrigger.sort(); ScrollTrigger.refresh(); if (location.hash) restore() } })

    return () => {
      live = false
      window.removeEventListener('popstate', restore)
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('scroll', handleScroll)
      gsap.ticker.remove(updateTicker)
      bindScrollController(null)
      lenis.destroy()
    }
  }, [])

  // 2. Escape key closes Quick View modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalCar) {
        setActiveModalCar(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalCar])

  // 3. GSAP Animations with Responsive & Reduced-Motion Adaptations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      // In reduced motion mode, reveal elements immediately without transforms
      gsap.set([
        '.hud-header',
        '.hero-title .char',
        '.hero-eyebrow',
        '.hero-eyebrow .eyebrow-line',
        '.hero-subtitle',
        '.hero-underline-accent',
        '.hero-copy',
        '.hero-cta-group a',
        '.metric-item',
        '.metric-divider',
        '.hero-annotation',
        '.hero-edition-panel',
        '.scroll-indicator',
        '.hero-bg-img',
      ], {
        y: '0%',
        x: '0%',
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
      })
      return
    }

    // Hero Load Animation (Smooth parallel cascade matching target mockup)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .fromTo('.hud-header', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)
      .to('.hero-bg-img', { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
      .fromTo('.hero-eyebrow .eyebrow-line', { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: 'left center' }, 0.1)
      .fromTo('.hero-eyebrow span:not(.eyebrow-line)', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4 }, 0.15)
      .to('.hero-title .char', {
        y: '0%',
        opacity: 1,
        duration: 0.65,
        stagger: 0.02,
      }, 0.2)
      .fromTo('.hero-subtitle', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, 0.35)
      .fromTo('.hero-underline-accent', { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: 'left center' }, 0.4)
      .fromTo('.hero-copy', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 }, 0.45)
      .fromTo('.hero-cta-group a', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0.5)
      .fromTo('.hero-annotation', { opacity: 0, x: 15 }, { opacity: 1, x: 0, duration: 0.5 }, 0.45)
      .fromTo('.scroll-indicator', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, 0.5)
      .fromTo('.metric-item', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, 0.55)
      .fromTo('.metric-divider', { scaleY: 0 }, { scaleY: 1, duration: 0.35, transformOrigin: 'bottom center', stagger: 0.04 }, 0.6)
      .fromTo('.hero-edition-panel', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.65)

    // Horizontal Scroll Lineup (Desktop viewports only)
    const lineupMedia = gsap.matchMedia()
    lineupMedia.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      if (!lineupWrapper.current) return
      const panels = gsap.utils.toArray<HTMLElement>('.model-panel')
      const scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '.section-lineup',
          pin: true,
          scrub: 1,
          id: 'lineup-travel',
          end: () => `+=${(panels.length - 1) * window.innerWidth}`,
          invalidateOnRefresh: true,
          refreshPriority: 10,
        },
      })

      // Counters inside horizontal scroll
      document.querySelectorAll('.counter').forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10)
        gsap.to(counter, {
          textContent: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter.closest('.model-panel'),
            containerAnimation: scrollTween,
            start: 'left center',
            toggleActions: 'play none none none',
          },
          onUpdate: function () {
            const raw = Math.ceil(Number(this.targets()[0].textContent))
            counter.innerHTML = new Intl.NumberFormat('en-US').format(raw)
          },
        })
      })
    })

    // Spec Bars Fill (Dynamic Performance Benchmarks)
    gsap.utils.toArray<HTMLElement>('.bar-fill').forEach((bar) => {
      const fillWidth = bar.getAttribute('data-fill') || '0%'
      gsap.to(bar, {
        scaleX: parseFloat(fillWidth) / 100,
        duration: 1.3,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        scrollTrigger: {
          trigger: '.section-bars',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Gallery Clip-Path Reveals
    gsap.utils.toArray<HTMLElement>('.gallery-img').forEach((img) => {
      gsap.to(img, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.1,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: img,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Global Section Titles (Preserve visibility while reading)
    gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
      if (title.classList.contains('hero-title')) return
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
      })
    })

    // CTA Form Stagger
    gsap.from('.cta-field', {
      scrollTrigger: {
        trigger: '.cta-form',
        start: 'top 80%',
      },
      x: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    })

    // Parallax Image Placeholders
    gsap.utils.toArray<HTMLElement>('.image-placeholder').forEach((img) => {
      const bg = img.querySelector('.glow-bg')
      if (bg) {
        gsap.to(bg, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    })

    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    return () => lineupMedia.revert()
  }, { scope: root, revertOnUpdate: true })

  // Magnetic Button Handlers
  function handleMagneticMove(e: MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(btn, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  function handleMagneticLeave(e: MouseEvent<HTMLButtonElement>) {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    })
  }

  // CTA Form Submission Handler with Validation
  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('PLEASE ENTER YOUR FULL LEGAL NAME')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setFormError('PLEASE ENTER A VALID EMAIL ADDRESS')
      return
    }

    if (!selectedModel) {
      setFormError('PLEASE SELECT A PREFERRED VEHICLE MODEL')
      return
    }

    setFormError('')
    setBtnText('RESERVATION REQUESTED âœ“')
    setBtnSubmitted(true)

    setTimeout(() => {
      setBtnText('REQUEST TEST DRIVE')
      setBtnSubmitted(false)
      setFullName('')
      setEmail('')
      setSelectedModel('')
    }, 4000)
  }

  function handleQuickViewClick(car: InventoryItem) {
    setActiveModalCar(car)
  }

  function handleModalReserve(modelName: string) {
    setActiveModalCar(null)
    const normalized = modelName.toLowerCase()
    if (normalized.includes('revuelto')) setSelectedModel('revuelto')
    else if (normalized.includes('temerario')) setSelectedModel('temerario')
    else if (normalized.includes('urus')) setSelectedModel('urus')

    const ctaSection = document.getElementById('experience')
    ctaSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredInventory = filter === 'all'
    ? inventoryData
    : inventoryData.filter((item) => item.tags.includes(filter))

  return (
    <main ref={root} id="main-content" className="lamborghini-experience" tabIndex={-1}>
      {/* GLOBAL HUD HEADER */}
      <header className="hud-header" role="banner">
        <div className="hud-brand-cluster">
          <a href="#hero" className="hud-logo" aria-label="Lamborghini Homepage">
            <span>LAMBORGHINI</span>
          </a>
          <span className="hud-brand-sep" aria-hidden="true" />
          <span className="hud-badge">THE ART OF MOTION</span>
        </div>

        <nav className="hud-nav" aria-label="Primary Navigation">
          <a href="#hero" className="hud-link active">
            <span>01 REVEAL</span>
            <span className="hud-link-bar" />
          </a>
          <a href="#awakening" className="hud-link">01 AWAKENING</a>
          <a href="#presence" className="hud-link">02 FORM</a>
          <a href="#showroom" className="hud-link">SHOWROOM</a>
          <a href="#benchmarks" className="hud-link">BENCHMARKS</a>
          <a href="#gallery" className="hud-link">03 COCKPIT</a>
          <a href="#inventory" className="hud-link">INVENTORY</a>
          <a href="#experience" className="hud-link">TEST DRIVE</a>
          <button type="button" className="hud-search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </nav>

        <div ref={progressBarRef} className="hud-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} />
      </header>

      {/* SECTION 1: HERO (PIXEL-PERFECT RECONSTRUCTION) */}
      <section className="hero chapter" id="hero" aria-label="Lamborghini Hero — The Art of Motion">
        <div className="hero-bg">
          <img
            src="/media/hero-car-clean.webp"
            alt="Lamborghini Revuelto Custom Black and Gold Edition"
            className="hero-bg-img"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-ui">
        {/* Top-Right Vehicle Annotation */}
        <div className="hero-annotation tech-font" aria-hidden="true">
          <div className="annotation-crosshair">
            <span className="crosshair-line" />
            <span className="crosshair-tick" />
          </div>
          <div className="annotation-content">
            <div className="annotation-model">REVUELTO</div>
            <div className="annotation-spec">NERO NEMESIS X</div>
            <div className="annotation-spec">ORO ELEGANZA</div>
          </div>
        </div>

        {/* Left Editorial Content */}
        <div className="hero-content">
          <div className="hero-eyebrow tech-font">
            <span className="eyebrow-line" aria-hidden="true" />
            <span>SANT&apos;AGATA BOLOGNESE &middot; SINCE 1963</span>
          </div>

          <h1 className="hero-title display-font" aria-label="LAMBORGHINI" id="heroTitle">
            {'LAMBORGHINI'.split('').map((char, index) => (
              <span key={index} className="char">{char}</span>
            ))}
          </h1>

          <div className="hero-subtitle display-font">THE ART OF MOTION</div>
          <div className="hero-underline-accent" aria-hidden="true" />

          <p className="hero-copy">
            Where Italian sculpted violence<br />
            meets hybrid telemetry.
          </p>

          <div className="hero-cta-group">
            <a href="#awakening" className="hero-btn-primary">
              <span>EXPLORE THE MACHINE</span>
              <span className="btn-arrow" aria-hidden="true">&rarr;</span>
            </a>
            <a href="#showroom" className="hero-btn-secondary">
              <span>VIEW SHOWROOM</span>
              <span className="telemetry-bars" aria-hidden="true">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
                <span className="bar bar-4" />
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Technical Infographic Strip */}
        <div className="hero-infographic-strip">
          <div className="hero-strip-left">
            <div className="scroll-indicator" aria-hidden="true">
              <span className="tech-font">SCROLL</span>
              <div className="scroll-line" />
            </div>

            <div className="metrics-group">
              {/* Metric 01 */}
              <div className="metric-item">
                <div className="metric-icon" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 14v-4" />
                    <path d="M3.34 17a10 10 0 1 1 17.32 0" />
                    <path d="m14.83 9.17 1.41-1.41" />
                    <path d="M12 4v2" />
                    <path d="m9.17 9.17-1.41-1.41" />
                  </svg>
                </div>
                <div className="metric-data">
                  <div className="metric-val display-font">1015 CV</div>
                  <div className="metric-lbl tech-font">TOTAL SYSTEM OUTPUT</div>
                </div>
              </div>

              <div className="metric-divider" aria-hidden="true" />

              {/* Metric 02 */}
              <div className="metric-item">
                <div className="metric-icon" aria-hidden="true">
                  <svg width="22" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m13 2-8 12h7l-2 8 10-14h-7l2-6Z" />
                  </svg>
                </div>
                <div className="metric-data">
                  <div className="metric-top tech-font">0 &ndash; 100 KM/H</div>
                  <div className="metric-val display-font">2.5 s</div>
                  <div className="metric-lbl tech-font">ACCELERATION</div>
                </div>
              </div>

              <div className="metric-divider" aria-hidden="true" />

              {/* Metric 03 */}
              <div className="metric-item">
                <div className="metric-icon" aria-hidden="true">
                  <svg width="28" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10V7h2V5h4V3h6v2h4v2h2v3" />
                    <path d="M2 10h20v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8Z" />
                    <circle cx="8" cy="14" r="2" />
                    <circle cx="16" cy="14" r="2" />
                    <path d="M10 14h4" />
                  </svg>
                </div>
                <div className="metric-data">
                  <div className="metric-val display-font">V12 HYBRID</div>
                  <div className="metric-lbl tech-font">ELETTRIFICATO</div>
                </div>
              </div>

              <div className="metric-divider" aria-hidden="true" />

              {/* Metric 04 */}
              <div className="metric-item">
                <div className="metric-icon" aria-hidden="true">
                  <svg width="28" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 14c4-4 12-6 20-3" />
                    <path d="M5 14l-2 4h4l1-4" />
                    <path d="M17 12l-1 6h4l1-6" />
                    <path d="M2 10c6-3 14-3 20 0" />
                  </svg>
                </div>
                <div className="metric-data">
                  <div className="metric-val display-font">ACTIVE AERO</div>
                  <div className="metric-lbl tech-font">ADAPTIVE DYNAMICS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-Right Edition Panel */}
          <div className="hero-edition-panel tech-font" aria-hidden="true">
            <div className="edition-row">
              <div className="edition-flag">
                <span className="flag-green" />
                <span className="flag-white" />
                <span className="flag-red" />
              </div>
              <span className="edition-lbl">CHASSIS</span>
              <span className="edition-val">CARBON MONOFUSELAGE</span>
            </div>
            <div className="edition-row">
              <span className="edition-lbl edition-lbl-indent">EDITION</span>
              <span className="edition-val gold-text">NERO NEMESIS X ORO ELEGANZA</span>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* SECTION 2: VIDEO TO IMAGE SEQUENCE (THE AWAKENING) â€” DIRECTLY BELOW HERO */}
      <AwakeningExperience onOpenVideoModal={handleOpenVideoModal} />

      {/* SECTION 2: FORM REVEAL (#presence) â€” PINNED FRONT 3/4 TO SIDE PROFILE SEQUENCE */}
      <PresenceExperience onOpenVideoModal={handleOpenVideoModal} />

      {/* SECTION 2: MODEL LINEUP */}
      <section className="section-lineup chapter desktop-only-scroll" id="showroom" aria-label="Model Showroom">
        <div className="horizontal-scroll-wrapper" id="lineupWrapper" ref={lineupWrapper}>
          {/* Panel 1: Revuelto */}
          <div className="model-panel">
            <div className="panel-name display-font">REVUELTO</div>
            <div className="panel-image image-placeholder" data-annotation="AERODYNAMICS // 1,015 CV APEX">
              <ResponsiveImage
                src="/media/revuelto-hero.webp"
                alt="Lamborghini Revuelto Arancio Apodis in front three-quarter view"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
            <div className="panel-specs">
              <div className="spec-item tech-font">
                <span className="spec-label">ENGINE</span>
                <span className="spec-val">6.5L V12 Hybrid</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">POWER</span>
                <span className="spec-val">1015 CV</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">0-100 KM/H</span>
                <span className="spec-val">2.5s</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">TOP SPEED</span>
                <span className="spec-val">&gt;350 km/h</span>
              </div>
              <div className="panel-price">
                <div className="price-val display-font">$<span className="counter" data-target="673294">0</span></div>
                <span className="price-label tech-font">STARTING MSRP</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Temerario */}
          <div className="model-panel">
            <div className="panel-name display-font">TEMERARIO</div>
            <div className="panel-image image-placeholder" data-annotation="10,000 RPM FLAT-PLANE // 920 CV">
              <ResponsiveImage
                src="/media/temerario-hero.webp"
                alt="Lamborghini Temerario Verde Shock in dynamic profile"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
            <div className="panel-specs">
              <div className="spec-item tech-font">
                <span className="spec-label">ENGINE</span>
                <span className="spec-val">4.0L V8 Hybrid</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">POWER</span>
                <span className="spec-val">920 CV</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">0-100 KM/H</span>
                <span className="spec-val">2.7s</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">TOP SPEED</span>
                <span className="spec-val">343 km/h</span>
              </div>
              <div className="panel-price">
                <div className="price-val display-font">$<span className="counter" data-target="386649">0</span></div>
                <span className="price-label tech-font">STARTING MSRP</span>
              </div>
            </div>
          </div>

          {/* Panel 3: Urus SE */}
          <div className="model-panel">
            <div className="panel-name display-font">URUS SE</div>
            <div className="panel-image image-placeholder" data-annotation="SUPER SUV // 800 CV PHEV">
              <ResponsiveImage
                src="/media/urus-hero.webp"
                alt="Lamborghini Urus SE Super SUV in Grigio Keres"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
            <div className="panel-specs">
              <div className="spec-item tech-font">
                <span className="spec-label">ENGINE</span>
                <span className="spec-val">4.0L V8 PHEV</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">POWER</span>
                <span className="spec-val">800 CV</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">0-100 KM/H</span>
                <span className="spec-val">3.4s</span>
              </div>
              <div className="spec-item tech-font">
                <span className="spec-label">TOP SPEED</span>
                <span className="spec-val">312 km/h</span>
              </div>
              <div className="panel-price">
                <div className="price-val display-font">$<span className="counter" data-target="280736">0</span></div>
                <span className="price-label tech-font">STARTING MSRP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* [KEKALKAN] SECTION 3: SPEC BARS (DYNAMIC PERFORMANCE BENCHMARKS) */}
      <section className="section-bars chapter" id="benchmarks" aria-label="Dynamic Performance Benchmarks">
        <div className="bars-header">
          <span className="bars-badge tech-font gold-text">DYNAMIC PERFORMANCE BENCHMARKS</span>
          <h2 className="section-title display-font" style={{ marginBottom: 0 }}>ENGINEERING APEX</h2>
        </div>
        <div className="bar-container">
          <div className="bar-group">
            <div className="bar-header">
              <span className="bar-label">SYSTEM OUTPUT INDEX (1,015 CV) <small>(Flagship HPEV class benchmark)</small></span>
              <span className="bar-value">100%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" data-fill="100%" />
            </div>
          </div>

          <div className="bar-group">
            <div className="bar-header">
              <span className="bar-label">COMBINED MECHANICAL TORQUE (1,062 NM) <small>(Combustion + 3x axial flux drive)</small></span>
              <span className="bar-value">88%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" data-fill="88%" />
            </div>
          </div>

          <div className="bar-group">
            <div className="bar-header">
              <span className="bar-label">AERODYNAMIC DOWNFORCE (+61% VS ULTIMAE) <small>(Integrated active aero wing at 250 km/h)</small></span>
              <span className="bar-value">92%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" data-fill="92%" />
            </div>
          </div>

          <div className="bar-group">
            <div className="bar-header">
              <span className="bar-label">MONOFUSELAGE TORSIONAL RIGIDITY <small>(40,000 Nm/Â° carbon composite chassis)</small></span>
              <span className="bar-value">95%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" data-fill="95%" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GALLERY (COCKPIT STUDY & CRAFTSMANSHIP) */}
      <section className="section-gallery chapter" id="gallery" aria-label="Cockpit Study and Craftsmanship">
        <CockpitExperience onOpenVideoModal={handleOpenVideoModal} />
        <div className="gallery-grid">

          <div className="gallery-row row-2 fade-in-section">
            <div className="gallery-text">
              <h3 className="display-font">HYBRID KINETICS</h3>
              <p>Electric motors integrated seamlessly with naturally aspirated combustion. Silent precision meets violent acceleration.</p>
              <div className="tech-stats tech-font">
                <div>BATTERY: 3.8 KWH LITHIUM-ION</div>
                <div className="gold-text">MOTORS: 3X AXIAL FLUX</div>
              </div>
            </div>
            <div className="gallery-img image-placeholder" data-annotation="AXIAL FLUX // HYBRID KINETICS">
              <ResponsiveImage
                src="/media/revuelto-lime.webp"
                alt="Lamborghini Revuelto Aerodynamic Lime Profile in Motion"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="gallery-row row-3 fade-in-section">
            <div className="gallery-img image-placeholder" data-annotation="GOODWOOD FOS // DYNAMIC LIGHTSIGN">
              <ResponsiveImage
                src="/media/revuelto-rear.webp"
                alt="Lamborghini Revuelto Rear Light Signature, Diffuser and High-Exit Exhausts"
                sizes="100vw"
              />
              <div className="glow-bg" style={{ background: 'radial-gradient(circle at 80% 80%, rgba(255,59,0,0.15) 0%, transparent 60%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: INVENTORY */}
      <section className="section-inventory chapter" id="inventory" aria-label="Available Inventory">
        <h2 className="section-title display-font">AVAILABLE INVENTORY</h2>

        <div className="filter-bar" id="inventoryFilters" role="toolbar" aria-label="Filter Inventory by Tag">
          {['all', 'REVUELTO', 'TEMERARIO', 'URUS', 'HYBRID', 'V12'].map((tag) => (
            <button
              key={tag}
              type="button"
              className={`filter-btn ${filter === tag ? 'active' : ''}`}
              onClick={() => setFilter(tag)}
              aria-pressed={filter === tag}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="inventory-grid" id="inventoryGrid">
          {filteredInventory.map((car, index) => {
            const formattedPrice = new Intl.NumberFormat('en-US').format(car.price)
            return (
              <article
                key={car.id}
                className="inventory-card"
                style={{ animation: `fadeUp 0.4s ease forwards ${index * 0.06}s` }}
              >
                <div className="card-img image-placeholder" data-annotation={`${car.model.toUpperCase()} // ${car.color.toUpperCase()}`}>
                  <ResponsiveImage
                    src={car.image}
                    alt={`${car.model} in ${car.color}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="card-meta">
                  <div>
                    <h3 className="card-title display-font" style={{ fontSize: '1.4rem' }}>{car.model}</h3>
                    <div className="card-variant tech-font">{car.year} // {car.spec} // {car.color}</div>
                  </div>
                  <div className="card-price">${formattedPrice}</div>
                </div>
                <button
                  type="button"
                  className="quick-view"
                  onClick={() => handleQuickViewClick(car)}
                  aria-label={`Quick view specifications for ${car.model} in ${car.color}`}
                >
                  QUICK VIEW
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* SECTION 6: CTA (EXPERIENCE IT.) */}
      <section className="section-cta chapter" id="experience" aria-label="Test Drive Booking">
        <div className="cta-container">
          <div className="cta-text">
            <span className="cta-tagline tech-font gold-text">THE ROAD IS ONLY THE BEGINNING</span>
            <h2 className="display-font section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>EXPERIENCE IT.</h2>
            <p>Book a private track or showroom test drive at your nearest Lamborghini center. Allocation availability is strictly verified.</p>
          </div>
          <form className="cta-form" onSubmit={handleFormSubmit} noValidate>
            {formError && (
              <div
                className="tech-font red-text"
                role="alert"
                style={{
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  background: 'rgba(255, 59, 0, 0.1)',
                  padding: '0.75rem 1rem',
                  borderLeft: '2px solid var(--accent-red)',
                }}
              >
                {formError}
              </div>
            )}
            <div className="form-group cta-field">
              <label htmlFor="cta-fullname" className="sr-only">Full Legal Name</label>
              <input
                id="cta-fullname"
                type="text"
                className="form-input"
                placeholder="FULL LEGAL NAME"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group cta-field">
              <label htmlFor="cta-email" className="sr-only">Email Address</label>
              <input
                id="cta-email"
                type="email"
                className="form-input"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group cta-field">
              <label htmlFor="cta-model" className="sr-only">Preferred Model</label>
              <select
                id="cta-model"
                className="form-input tech-font"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                required
              >
                <option value="" disabled>SELECT PREFERRED MODEL</option>
                <option value="revuelto">REVUELTO HPEV V12 (1,015 CV)</option>
                <option value="temerario">TEMERARIO V8 HYBRID (920 CV)</option>
                <option value="urus">URUS SE SUPER SUV (800 CV)</option>
              </select>
            </div>
            <div className="btn-magnetic-wrapper cta-field">
              <button
                type="submit"
                className="btn-submit magnetic-btn"
                id="submitBtn"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                style={btnSubmitted ? { background: '#fff', color: '#000' } : undefined}
              >
                {btnText}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* QUICK VIEW MODAL DIALOG */}
      {activeModalCar && (
        <div
          className="quick-view-backdrop"
          onClick={() => setActiveModalCar(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalCarTitle"
        >
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="quick-view-close"
              onClick={() => setActiveModalCar(null)}
              aria-label="Close modal"
            >
              âœ•
            </button>
            <div className="quick-view-body">
              <div className="quick-view-img">
                <ResponsiveImage
                  src={activeModalCar.image}
                  alt={`${activeModalCar.model} in ${activeModalCar.color}`}
                  sizes="(max-width: 768px) 100vw, 450px"
                />
              </div>
              <div className="quick-view-content">
                <div>
                  <h2 id="modalCarTitle" className="quick-view-title display-font">{activeModalCar.model}</h2>
                  <div className="quick-view-badge tech-font">
                    {activeModalCar.year} // {activeModalCar.color.toUpperCase()} // CHASSIS #{activeModalCar.id.toUpperCase()}
                  </div>
                  <div className="quick-view-price display-font">
                    ${new Intl.NumberFormat('en-US').format(activeModalCar.price)}
                  </div>
                  <div className="quick-view-specs tech-font">
                    <div className="quick-view-spec-item">
                      <span className="spec-label">POWER OUTPUT</span>
                      <span className="spec-val">{activeModalCar.power}</span>
                    </div>
                    <div className="quick-view-spec-item">
                      <span className="spec-label">ACCELERATION</span>
                      <span className="spec-val">{activeModalCar.acceleration}</span>
                    </div>
                    <div className="quick-view-spec-item">
                      <span className="spec-label">TOP SPEED</span>
                      <span className="spec-val">{activeModalCar.topSpeed}</span>
                    </div>
                    <div className="quick-view-spec-item">
                      <span className="spec-label">POWERTRAIN</span>
                      <span className="spec-val" style={{ fontSize: '0.85rem' }}>{activeModalCar.spec}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    <strong>Engine Architecture:</strong> {activeModalCar.engine}.<br />
                    <strong>Monocoque:</strong> {activeModalCar.chassis}.
                  </p>
                </div>
                <div className="quick-view-action">
                  <button
                    type="button"
                    className="quick-view-btn"
                    onClick={() => handleModalReserve(activeModalCar.model)}
                  >
                    RESERVE CHASSIS ALLOCATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="page-footer tech-font" role="contentinfo">
        <p>Independent Concept Experience Â· Not Affiliated with Automobili Lamborghini S.p.A. Â· Photography licensed under Creative Commons</p>
      </footer>

      {/* 1080P SOURCE FOOTAGE MODAL */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoSrc={videoModalSrc}
        title={videoModalTitle}
      />
    </main>
  )
}
