import { useEffect, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon.jsx'

/**
 * A button that follows you down the page. It appears once the hero is out
 * of sight - before that the header's own button is still on screen, and two
 * of them at once is just clutter.
 *
 * It scrolls to the order form rather than opening WhatsApp cold, because a
 * message someone has already half-written gets finished far more often than
 * an empty chat does.
 */
export default function FloatingOrder() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function jump() {
    const el = document.getElementById('order')
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    el.querySelector('#of-name')?.focus({ preventScroll: true })
  }

  return (
    <button
      className={`floater${show ? ' in' : ''}`}
      type="button"
      onClick={jump}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <WhatsAppIcon />
      <span>Build your box</span>
    </button>
  )
}
