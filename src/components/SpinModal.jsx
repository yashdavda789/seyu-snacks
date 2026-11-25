import { useEffect, useRef } from 'react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import PhotoSpin from './PhotoSpin.jsx'
import { studio } from '../three/studio.js'
import { brandOf, formatPrice, whatsappLink } from '../data/products.js'

/**
 * The product view. Three cases, decided only by what is in src/photos/:
 *
 *   several numbered frames -> a photographic 360, drag to turn
 *   one photo               -> that photo, still
 *   no photo                -> the 3D model, drag to spin
 *
 * Whatever shows here is what the card shows, so the two never disagree.
 */
export default function SpinModal({ product, frames = [], onClose }) {
  const photo = frames[0] ?? null
  const spinnablePhoto = frames.length > 1
  const stageRef = useRef(null)
  const closeRef = useRef(null)

  // Escape, body scroll lock and focus apply to both kinds of view
  useEffect(() => {
    if (!product) return
    closeRef.current?.focus()
    document.body.classList.add('lb-open')

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('lb-open')
    }
  }, [product, onClose])

  // the WebGL canvas is only built when there is no photograph to show
  useEffect(() => {
    if (!product || photo) return
    const stage = stageRef.current
    if (!stage) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    studio.attach(stage, product, { reducedMotion: reduced })

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

    stage.addEventListener('mousedown', down)
    stage.addEventListener('touchstart', down, { passive: true })
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)

    const resize = () => studio.resize()
    window.addEventListener('resize', resize)

    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { studio.nudge(-1); e.preventDefault() }
      else if (e.key === 'ArrowRight') { studio.nudge(1); e.preventDefault() }
      else if (e.key === 'ArrowUp') { studio.tiltBy(-0.06); e.preventDefault() }
      else if (e.key === 'ArrowDown') { studio.tiltBy(0.06); e.preventDefault() }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      stage.removeEventListener('mousedown', down)
      stage.removeEventListener('touchstart', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
      window.removeEventListener('resize', resize)
      document.removeEventListener('keydown', onKey)
      studio.detach()
    }
  }, [product, photo])

  if (!product) return null

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={
        photo
          ? `${product.title}, photograph`
          : `${product.title}, 3D view. Drag, or use the arrow keys, to rotate.`
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="lb-inner">
        <div className="lb-head">
          <div className="lb-headings">
            <p className="lb-brand">{brandOf(product)}</p>
            <p className="lb-title">{product.title}</p>
          </div>
          <button className="lb-close" type="button" ref={closeRef} onClick={onClose}>
            Close
          </button>
        </div>

        {spinnablePhoto ? (
          <PhotoSpin frames={frames} alt={product.title} />
        ) : photo ? (
          <div className="lb-stage is-photo">
            <img className="lb-photo" src={photo} alt={product.title} />
          </div>
        ) : (
          <div className="lb-stage" ref={stageRef} />
        )}

        <div className="lb-foot">
          <p className="lb-price">
            Rs. {formatPrice(product.price)} / {product.unit}
          </p>
          <a className="wa" href={whatsappLink(product)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
