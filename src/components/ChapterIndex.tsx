import { chapters } from '../data/chapters'

export function ChapterIndex() {
  return (
    <section className="chapter-index" aria-labelledby="chapter-index-title">
      <div className="chapter-index__heading">
        <p className="eyebrow">Narrative architecture / 08 chapters</p>
        <h2 id="chapter-index-title">From first light to final form.</h2>
      </div>
      <ol className="chapter-index__list">
        {chapters.map((chapter) => (
          <li className="chapter-index__item" key={chapter.id}>
            <span className="chapter-index__number">{chapter.number}</span>
            <span className="chapter-index__title">{chapter.title}</span>
            <span className="chapter-index__act">{chapter.act}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
