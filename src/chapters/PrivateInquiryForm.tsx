import { useState, useRef, type FormEvent, type MouseEvent } from 'react'
import { gsap } from '../motion/gsap'
import { useMotion } from '../motion/MotionContext'
import './inquiry.css'

interface FormState {
  fullName: string
  email: string
  model: string
  consultationType: string
}

interface FormErrors {
  fullName?: string
  email?: string
  model?: string
}

export function PrivateInquiryForm() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    model: '',
    consultationType: 'virtual',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { reduced } = useMotion()

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name (at least 2 characters).'
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Please provide a valid email address.'
    }
    if (!form.model) {
      nextErrors.model = 'Please select a Lamborghini model.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 400)
  }

  // Magnetic button hover effect
  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    if (reduced || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(buttonRef.current, {
      x: x * 0.18,
      y: y * 0.18,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  function handleMouseLeave() {
    if (reduced || !buttonRef.current) return
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    })
  }

  return (
    <div className="section-cta" aria-labelledby="cta-title">
      <div className="cta-container">
        <div className="cta-text">
          <span className="small-label tech-font gold-text">08B / PRIVATE INQUIRY</span>
          <h3 id="cta-title" className="display-font">EXPERIENCE IT.</h3>
          <p>
            Request a private portfolio presentation, engineering briefing, or concept review.
          </p>
          <div className="cta-disclaimer-card tech-font">
            <span className="gold-text">[INDEPENDENT CONCEPT NOTICE]</span>
            <p>
              This is a frontend portfolio demonstration. Submissions are processed client-side only and are not forwarded to Automobili Lamborghini or official dealerships.
            </p>
          </div>
        </div>

        <div className="cta-form-wrapper">
          {submitted ? (
            <div className="cta-success" role="status" aria-live="polite">
              <div className="cta-success__badge tech-font">DEMO INQUIRY CONFIRMED ✓</div>
              <h4 className="display-font">THANK YOU, {form.fullName.toUpperCase()}</h4>
              <p>
                Your demo consultation request for the <strong>{form.model.toUpperCase()}</strong> has been recorded in this browser session.
              </p>
              <div className="cta-success__summary tech-font">
                <div><span>RECIPIENT:</span> {form.email}</div>
                <div><span>CONSULTATION:</span> {form.consultationType.toUpperCase()}</div>
                <div><span>STATUS:</span> CLIENT-SIDE DEMO SUCCESS</div>
              </div>
              <button
                type="button"
                className="collection-link"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ fullName: '', email: '', model: '', consultationType: 'virtual' })
                }}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form className="cta-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group cta-field">
                <label htmlFor="cta-name" className="visually-hidden">Full Name</label>
                <input
                  id="cta-name"
                  type="text"
                  className={`form-input ${errors.fullName ? 'is-invalid' : ''}`}
                  placeholder="FULL NAME"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'cta-name-error' : undefined}
                  required
                />
                {errors.fullName && (
                  <span id="cta-name-error" className="form-error tech-font" role="alert">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="form-group cta-field">
                <label htmlFor="cta-email" className="visually-hidden">Email Address</label>
                <input
                  id="cta-email"
                  type="email"
                  className={`form-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="EMAIL ADDRESS"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'cta-email-error' : undefined}
                  required
                />
                {errors.email && (
                  <span id="cta-email-error" className="form-error tech-font" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-group cta-field">
                <label htmlFor="cta-model" className="visually-hidden">Select Model</label>
                <select
                  id="cta-model"
                  className={`form-input tech-font ${errors.model ? 'is-invalid' : ''}`}
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  aria-invalid={!!errors.model}
                  aria-describedby={errors.model ? 'cta-model-error' : undefined}
                  required
                >
                  <option value="">SELECT MODEL</option>
                  <option value="Revuelto">LAMBORGHINI REVUELTO (V12 HPEV)</option>
                  <option value="Temerario">LAMBORGHINI TEMERARIO (V8 HYBRID)</option>
                  <option value="Urus SE">LAMBORGHINI URUS SE (PHEV)</option>
                </select>
                {errors.model && (
                  <span id="cta-model-error" className="form-error tech-font" role="alert">
                    {errors.model}
                  </span>
                )}
              </div>

              <div className="form-group cta-field">
                <label htmlFor="cta-type" className="visually-hidden">Consultation Type</label>
                <select
                  id="cta-type"
                  className="form-input tech-font"
                  value={form.consultationType}
                  onChange={(e) => setForm({ ...form, consultationType: e.target.value })}
                >
                  <option value="virtual">VIRTUAL PRIVATE TOUR (DEMO)</option>
                  <option value="briefing">TECHNICAL ENGINEERING BRIEFING (DEMO)</option>
                  <option value="portfolio">FRONTEND ARCHITECTURE PRESENTATION (DEMO)</option>
                </select>
              </div>

              <div className="btn-magnetic-wrapper cta-field">
                <button
                  ref={buttonRef}
                  type="submit"
                  className="btn-submit magnetic-btn"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'PROCESSING...' : 'REQUEST DEMO CONSULTATION'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
