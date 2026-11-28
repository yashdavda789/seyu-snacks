import { useEffect, useRef, useState } from 'react'
import ArcName from './ArcName.jsx'
import { PRODUCTS } from '../data/products.js'
import { photoFor } from '../photos/index.js'
import { studio } from '../three/studio.js'

/** the products the hero cycles through, by slug */
const FACES = ['bikaneri-bhujia', 'sp-bhakarwadi', 'navratna-chivda', 'bhajani-chakli']
const EVERY = 4200
/** how long the unit takes to rotate away, in ms - matched in styles.css */
const TURN = 360

export default function Hero({ onOpen }) {
  const faces = FACES.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean)
  const [at, setAt] = useState(0)
  // `shown` lags `at` by the length of the turn, so the outgoing product
  // stays on screen while it rotates away
  const [shown, setShown] = useState(0)
  const [phase, setPhase] = useState('in')
  const [shots, setShots] = useState({})
  const asked = useRef(new Set())

  const product = faces[shown] ?? PRODUCTS[0]
  const photo = photoFor(product.slug)
  const picture = photo ?? shots[product.slug]

  // Render the one on screen, then the rest in the background. Each is a
  // big render, so doing all four up front would hold the page.
  useEffect(() => {
    let live = true
    const want = [product, ...faces.filter((f) => f !== product)]

    const run = (i) => {
      if (!live || i >= want.length) return
      // the product page may be holding the one shared canvas
      if (studio.live) return setTimeout(() => run(i), 400)
      const p = want[i]
      if (photoFor(p.slug) || asked.current.has(p.slug)) return run(i + 1)
      asked.current.add(p.slug)
      try {
        const url = studio.thumbnail(p, { size: 900, scatter: true, pull: 1.5, on: 'none' })
        if (url && live) setShots((prev) => ({ ...prev, [p.slug]: url }))
      } catch {
        // no WebGL: the hero runs without a picture
      }
      setTimeout(() => run(i + 1), 120)
    }

    const id = setTimeout(() => run(0), 30)
    return () => {
      live = false
      clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug])

  /* Cycle, unless the visitor would rather things held still. `at` is in
     the dependencies so a tap on a dot restarts the countdown - otherwise
     the timer can fire a moment later and fight the tap. */
  useEffect(() => {
    if (faces.length < 2) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setTimeout(() => setAt((n) => (n + 1) % faces.length), EVERY)
    return () => clearTimeout(id)
  }, [faces.length, at])

  /* The turn. The name and the bowl are one unit: it rotates away and fades
     out, the product is swapped at the bottom of the turn, then the new one
     rotates in from the other side. Rotating back the way it came would read
     as a wobble rather than a wheel.

     The `at === shown` branch is what makes this safe: whatever interrupts
     the turn - a tap mid-rotation, the timer landing on the same frame -
     the unit always ends up back at 'in' and visible. Leaving that case to
     fall through is what made the hero go blank. */
  useEffect(() => {
    if (at === shown) {
      setPhase('in')
      return undefined
    }
    setPhase('out')
    const id = setTimeout(() => setShown(at), TURN)
    return () => clearTimeout(id)
  }, [at, shown])

  return (
    <section className="hero" id="top">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>
            Namkeen that
            <br />
            hits different
          </h1>
          <p className="hero-sub">Tell us what you&rsquo;re craving</p>
          <div className="hero-cta">
            <a className="btn-fill" href="#main">
              Online Shop
            </a>
            <a className="btn-text" href="#story">
              Get Info <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="hero-art">
          {/* keyed on the product only. Keying on the phase too would
              remount the element the moment it should start rotating away,
              so it vanished instead of turning. */}
          <div className={`hero-unit ${phase}`} key={product.slug}>
            <ArcName name={product.title} />

            <button
              className="hero-shot"
              type="button"
              onClick={() => onOpen?.(product)}
              aria-label={`Open ${product.title}`}
            >
              {picture ? (
                <img className="hero-img" src={picture} alt={product.title} />
              ) : (
                <span className="hero-img hero-img-wait" aria-hidden="true" />
              )}
              <span className="hero-floor" aria-hidden="true" />
            </button>
          </div>

          <div className="hero-dots" role="tablist" aria-label="Featured snacks">
            {faces.map((f, i) => (
              <button
                key={f.slug}
                type="button"
                role="tab"
                aria-selected={i === at}
                aria-label={f.title}
                className={i === at ? 'on' : undefined}
                onClick={() => setAt(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
