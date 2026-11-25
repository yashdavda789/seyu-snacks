import { useEffect, useState } from 'react'
import { PRODUCTS } from '../data/products.js'
import { photoFor } from '../photos/index.js'
import { studio } from '../three/studio.js'

/** which product fronts the page */
const FACE = 'bikaneri-bhujia'

export default function Hero({ count }) {
  const [shot, setShot] = useState(null)
  const product = PRODUCTS.find((p) => p.slug === FACE) ?? PRODUCTS[0]
  const photo = photoFor(product.slug)

  // One big render, with pieces caught in the air above the bowl. It goes
  // first, before the grid's thumbnails, so the top of the page settles
  // before anything below it.
  useEffect(() => {
    if (photo) return undefined
    let live = true
    const id = setTimeout(() => {
      try {
        const url = studio.thumbnail(product, { size: 920, scatter: true, pull: 1.5 })
        if (url && live) setShot(url)
      } catch {
        // no WebGL: the hero just runs without a picture
      }
    }, 30)
    return () => {
      live = false
      clearTimeout(id)
    }
  }, [product, photo])

  const picture = photo ?? shot

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>
            Namkeen that <span className="pop">hits different</span>
          </h1>
          <p className="hero-sub">
            Chivda, sev, mathri and mixtures from our own kadhai &mdash; small batches, fresh oil,
            spices ground in-house.
          </p>
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
          {picture ? (
            <img className="hero-img" src={picture} alt={product.title} />
          ) : (
            <div className="hero-img hero-img-wait" aria-hidden="true" />
          )}
          <span className="hero-floor" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
