import { PRODUCTS } from '../data/products.js'

/**
 * Where "Get Info" and the Story link land.
 *
 * EDIT THIS. The copy below is deliberately plain and true of almost any
 * small kitchen - it is a frame, not your story. Put the real thing in:
 * who started it, which year, which lane, what your grandmother made first.
 * That is the part a customer in Toronto cannot get anywhere else.
 */
const FACTS = [
  { big: String(PRODUCTS.length), small: 'kinds on the shelf' },
  { big: 'Daily', small: 'fresh batches, never stocked' },
  { big: '0', small: 'preservatives, ever' },
]

export default function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap story-in">
        <div className="story-copy">
          <p className="story-kicker">Our story</p>
          <h2>Made the same way for three generations</h2>
          <p>
            Everything here comes out of one kitchen. The gram flour is ground for us, the spices
            are roasted and milled in-house, and the oil is changed every batch rather than every
            day. Nothing is bought in, relabelled or left sitting.
          </p>
          <p>
            It means we cannot make very much of it. It also means what you open smells the way it
            did coming out of the kadhai.
          </p>
        </div>

        <ul className="story-facts">
          {FACTS.map((f) => (
            <li key={f.small}>
              <strong>{f.big}</strong>
              <span>{f.small}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
