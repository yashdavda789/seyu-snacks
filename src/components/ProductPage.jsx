import { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import PhotoSpin from './PhotoSpin.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { PRODUCTS, formatPrice, makerOf, whatsappLink } from '../data/products.js'
import { framesFor, photoFor } from '../photos/index.js'
import { studio } from '../three/studio.js'

/** five filled, the rest hollow, half a star rounded to the nearest */
function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(rating) ? 'on' : undefined} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}

export default function ProductPage({ product, shots, onOpen }) {
  const [qty, setQty] = useState(1)
  const [spinning, setSpinning] = useState(false)
  const stageRef = useRef(null)
  const photo = photoFor(product.slug)
  const frames = framesFor(product.slug)
  const maker = makerOf(product)

  // what the picture can do, decided only by what is in src/photos/:
  //   several numbered frames -> a photographic 360, drag to turn
  //   one photo               -> that photo, still (one angle is one angle)
  //   no photo                -> the live 3D model, drag to spin
  const reel = frames.length > 1
  const live3d = !photo && !reel

  useEffect(() => setQty(1), [product])

  // Hand the shared WebGL canvas to this page and let it turn. The same
  // context draws the card thumbnails, so useThumbnails waits while this
  // is mounted rather than resizing the canvas underneath it.
  useEffect(() => {
    if (!live3d) return undefined
    const stage = stageRef.current
    if (!stage) return undefined

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    try {
      studio.attach(stage, product, { reducedMotion: reduced })
      setSpinning(true)
    } catch {
      setSpinning(false)
      return undefined
    }

    let last = null
    const point = (e) => (e.touches ? e.touches[0] : e)

    const down = (e) => {
      const p = point(e)
      last = { x: p.clientX, y: p.clientY }
      studio.dragStart()
      stage.classList.add('grabbing')
    }
    const move = (e) => {
      if (!last) return
      const p = point(e)
      studio.dragBy(p.clientX - last.x, p.clientY - last.y)
      last = { x: p.clientX, y: p.clientY }
      if (e.cancelable) e.preventDefault()
    }
    const up = () => {
      if (!last) return
      last = null
      studio.dragEnd()
      stage.classList.remove('grabbing')
    }

    const key = (e) => {
      if (e.key === 'ArrowLeft') { studio.nudge(-1); e.preventDefault() }
      else if (e.key === 'ArrowRight') { studio.nudge(1); e.preventDefault() }
      else if (e.key === 'ArrowUp') { studio.tiltBy(-0.06); e.preventDefault() }
      else if (e.key === 'ArrowDown') { studio.tiltBy(0.06); e.preventDefault() }
    }

    const resize = () => studio.resize()

    stage.addEventListener('mousedown', down)
    stage.addEventListener('touchstart', down, { passive: true })
    stage.addEventListener('keydown', key)
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    window.addEventListener('resize', resize)

    return () => {
      stage.removeEventListener('mousedown', down)
      stage.removeEventListener('touchstart', down)
      stage.removeEventListener('keydown', key)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
      window.removeEventListener('resize', resize)
      studio.detach()
      setSpinning(false)
    }
  }, [product, live3d])

  // the still that shows if WebGL is unavailable, or while a photo is used
  const still = photo ?? shots[product.id]

  // same shape, different product - near enough to be worth showing
  const similar = useMemo(() => {
    const pool = PRODUCTS.filter((p) => p.id !== product.id)
    const alike = pool.filter((p) => p.kind === product.kind)
    return [...alike, ...pool.filter((p) => p.kind !== product.kind)].slice(0, 4)
  }, [product])

  const order = `${whatsappLink(product)}%0A%0AQuantity%3A%20${qty}%20x%20${encodeURIComponent(
    product.unit,
  )}`

  return (
    <main className="pdp" id="main">
      <div className="wrap pdp-in">
        <div className="pdp-art">
          <span className="pdp-ghost" aria-hidden="true">
            {product.title}
          </span>

          {reel ? (
            <PhotoSpin frames={frames} alt={product.title} className="pdp-img" />
          ) : live3d ? (
            <>
              {/* the live canvas lands here; the still shows beneath it
                  until it does, and stays if WebGL is unavailable */}
              <div
                className="pdp-img pdp-stage"
                ref={stageRef}
                tabIndex={0}
                role="img"
                aria-label={`${product.title} in 3D. Drag, or use the arrow keys, to turn it.`}
              />
              {!spinning &&
                (still ? (
                  <img className="pdp-img pdp-under" src={still} alt={product.title} />
                ) : (
                  <span className="pdp-img pdp-under pdp-img-wait" aria-hidden="true" />
                ))}
            </>
          ) : (
            <img className="pdp-img" src={still} alt={product.title} />
          )}

          <span className="pdp-floor" aria-hidden="true" />
        </div>

        <div className="pdp-side">
          <div className="pdp-card">
            <div className="pdp-head">
              <h1>{product.title}</h1>
              <div className="qty">
                <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="One fewer">
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((n) => Math.min(20, n + 1))} aria-label="One more">
                  +
                </button>
              </div>
            </div>

            <p className="pdp-price">
              ₹{formatPrice(product.price)} <em>per {product.unit.replace(/^1\s*/i, '')}</em>
            </p>

            <p className="pdp-desc">{product.desc}</p>

            <a className="pdp-buy" href={order} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Order {qty} &times; {product.unit} &middot; ₹{formatPrice(product.price * qty)}
            </a>
          </div>

          {maker && (
            <div className="maker">
              <div className="maker-top">
                <div>
                  <h2>{maker.name}</h2>
                  <p className="maker-area">{maker.area}</p>
                </div>
                <div className="maker-rate">
                  <span>Rating from Google reviews</span>
                  <Stars rating={maker.rating} />
                </div>
              </div>
              <p className="maker-note">{maker.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="wrap">
        <div className="sec-head">
          <h2>Similar snacks</h2>
        </div>
        <div className="grid">
          {similar.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              photo={photoFor(p.slug)}
              shot={shots[p.id]}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
