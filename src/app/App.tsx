import { ChapterIndex } from '../components/ChapterIndex'

export function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header" aria-label="Project identity">
        <span className="site-header__name">L / AM</span>
        <span className="site-header__classification">Independent automotive concept</span>
        <span className="site-header__year">2026 / Study 01</span>
      </header>

      <main id="main-content">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro__meta">
            <span>Concept frame / Phase 03</span>
            <span>Revuelto · Temerario · Urus SE</span>
          </div>

          <div className="intro__core">
            <p className="intro__pretitle">Lamborghini / independent study</p>
            <h1 id="intro-title" className="intro__title">
              <span>The art{' '}</span>
              <span>of motion<span className="intro__period">.</span></span>
            </h1>
            <div className="intro__rule" aria-hidden="true" />
            <p className="intro__statement">
              A machine revealed through light, velocity, engineering and craft.
              The cinematic homepage is being built from this direction.
            </p>
          </div>

          <div className="intro__footer">
            <span>01 / Awakening</span>
            <span className="intro__footer-line" aria-hidden="true" />
            <span>Scroll to inspect the structure</span>
          </div>
        </section>

        <ChapterIndex />
      </main>

      <footer className="site-footer">
        <p>Independent concept experience. Not affiliated with Automobili Lamborghini.</p>
        <p>Planning and development frame — no vehicle imagery or configurator is represented here.</p>
      </footer>
    </>
  )
}
