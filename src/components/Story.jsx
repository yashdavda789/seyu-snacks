/**
 * The "our story" section: the case for the shop, in two paragraphs, with
 * three cards floating over a scatter of ingredients.
 *
 * The scatter is drawn here rather than loaded as an image, so it costs
 * nothing and never 404s.
 */
const CARDS = ['Local Shops & Makers', 'Sourced on order', 'Delivered in Days']

/** deterministic, so the scatter does not reshuffle on every render */
function bits(n) {
  let seed = 7
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  return Array.from({ length: n }, () => ({
    left: `${rnd() * 100}%`,
    top: `${rnd() * 100}%`,
    size: 4 + rnd() * 11,
    spin: `${rnd() * 360}deg`,
    round: rnd() > 0.55,
    dim: 0.35 + rnd() * 0.55,
  }))
}

const SCATTER = bits(90)

export default function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap story-in">
        <div className="story-copy">
          <p className="story-kicker">Our story</p>
          <h2>
            What you want from your hometown,
            <br />
            delivered to your loved ones
          </h2>
          <p>
            Supermarket shelves abroad never carry the true taste of the local shops you grew up
            with. We bridge that distance by sourcing directly from iconic neighbourhood bakeries,
            family-run kitchens and trusted sweet makers right in your hometown.
          </p>
          <p>
            Nothing sits in a warehouse waiting to be sold. Once you book, we collect your
            favourites fresh from the source, seal them at peak crispness, and fly them straight to
            your doorstep &mdash; or to the people you miss most.
          </p>
        </div>

        <div className="story-art">
          <div className="scatter" aria-hidden="true">
            {SCATTER.map((b, i) => (
              <span
                key={i}
                style={{
                  left: b.left,
                  top: b.top,
                  width: b.round ? b.size * 0.5 : b.size,
                  height: b.round ? b.size * 0.5 : b.size * 0.42,
                  borderRadius: b.round ? '50%' : '2px',
                  transform: `rotate(${b.spin})`,
                  opacity: b.dim,
                }}
              />
            ))}
          </div>

          <ul className="story-cards">
            {CARDS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
