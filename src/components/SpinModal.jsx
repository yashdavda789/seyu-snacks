import { useEffect, useRef } from 'react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { studio } from '../three/studio.js'
import { brandOf, formatPrice, whatsappLink } from '../data/products.js'

/**
 * Tapping any product opens straight into its 360 view - same behaviour for
 * every item, no intermediate step.
 *
 * Hands the shared WebGL canvas to this dialog while it is open, then gives
 * it back on close. Drag with mouse or finger to spin; arrow keys work too.
 */
export default function SpinModal({ product, onClose }) {
  const stageRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !product) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    studio.attach(stage, product, { reducedMotion: reduced })
    closeRef.current?.focus()
    document.body.classList.add('lb-open')

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
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') { studio.nudge(-1); e.preventDefault() }
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
      document.body.classList.remove('lb-open')
      studio.detach()
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title}, 360 degree view. Drag, or use the arrow keys, to rotate.`}
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

        <div className="lb-stage" ref={stageRef} />

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
