import { media, mediaCredits } from '../data/media'
import { models } from '../data/models'
import { Arrow, Plus } from '../components/Icons'
import { AnimatedHeading } from '../components/AnimatedHeading'
import { MediaFrame } from '../components/MediaFrame'
import { PrivateInquiryForm } from './PrivateInquiryForm'

export function ClosingExperience() {
  return <>
    <section id="finale" className="finale chapter" aria-labelledby="finale-title">
      <div className="finale-hero-banner">
        <MediaFrame asset={media.revueltoFinale} className="finale-photo" />
        <div className="finale-content">
          <span className="small-label">The road is only the beginning.</span>
          <AnimatedHeading id="finale-title">ORDINARY WAS NEVER AN OPTION.</AnimatedHeading>
          <a className="button-outline" href="#showroom">Return to the collection <Arrow diagonal /></a>
        </div>
        <span className="finale-signature">THE ART OF MOTION.</span>
      </div>
      <PrivateInquiryForm />
    </section>
    <footer className="site-footer">
      <div className="footer-main"><a className="wordmark" href="#awakening">LAMBORGHINI<span>THE ART OF MOTION</span></a><p>Independent concept experience.<br />Not affiliated with Automobili Lamborghini.</p><a className="text-link" href="#awakening">Back to the beginning <Arrow diagonal /></a></div>
      <details className="credits"><summary>Photography, sources & project credits <Plus /></summary><div className="credits-content">
        <p>Designed and developed as an independent frontend portfolio study. Vehicle photography is locally hosted, resized and converted to WebP. These image derivatives retain their linked Creative Commons licences.</p>
        <ul>{mediaCredits.map(asset => <li key={asset.src}><a href={asset.sourceUrl} target="_blank" rel="noreferrer">{asset.alt}</a> — {asset.credit} · <a href={asset.licenseUrl} target="_blank" rel="noreferrer">{asset.license}</a></li>)}</ul>
        <p>Specifications: {models.map((model, index) => <span key={model.id}>{index > 0 ? ' · ' : ''}<a href={model.sourceUrl} target="_blank" rel="noreferrer">{model.name}</a></span>)}. Current Malaysian selling prices are not verified; pricing is shown as Price on request. Barlow Condensed and Manrope are self-hosted under the SIL Open Font License.</p>
      </div></details>
      <div className="footer-bottom"><span>2026 / Independent design study</span><span>Made for the feeling.</span><span>Frontend only. No purchase or enquiry.</span></div>
    </footer>
  </>
}
