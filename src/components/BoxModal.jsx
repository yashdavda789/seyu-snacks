import { useEffect, useMemo, useRef, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { PRODUCTS, WHATSAPP_NUMBER, formatPrice } from '../data/products.js'
import { photoFor } from '../photos/index.js'

const BOXES = [
  { id: 'half', label: 'Half kilo of each', hint: 'a taste of a few' },
  { id: 'one', label: '1 Kg of each', hint: 'the usual' },
  { id: 'gift', label: 'Make it a gift box', hint: 'wrapped, with a note' },
]

/** what the list shows before anyone types */
const SUGGESTED = [
  'bikaneri-bhujia',
  'navratna-chivda',
  'aloo-bhujia-sev',
  'sp-bhakarwadi',
  'bhajani-chakli',
  'farali-chivda',
  'moongdal',
  'sweet-boondi',
]

/**
 * "Build your box", as a dialog.
 *
 * All 48 products are reachable through the search rather than the eight
 * that used to be hard-coded, and picking one adds it to the order. There
 * is no server: the form writes a WhatsApp message and opens it in the
 * visitor's own WhatsApp, where they press send. The message is shown as
 * it is written, so nobody has to trust a form they cannot see the output
 * of.
 */
export default function BoxModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [where, setWhere] = useState('')
  const [box, setBox] = useState('one')
  const [chosen, setChosen] = useState([])
  const [note, setNote] = useState('')
  const [hunt, setHunt] = useState('')
  const panel = useRef(null)
  const first = useRef(null)

  // escape, scroll lock and focus
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.classList.add('lb-open')
    first.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('lb-open')
    }
  }, [open, onClose])

  const toggle = (slug) =>
    setChosen((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))

  function surprise() {
    const pool = PRODUCTS.map((p) => p.slug)
    const out = []
    while (out.length < 3 && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
    }
    setChosen(out)
  }

  // search the whole catalogue; with nothing typed, show a short shortlist
  const listed = useMemo(() => {
    const term = hunt.trim().toLowerCase()
    if (!term) {
      const picked = PRODUCTS.filter((p) => chosen.includes(p.slug))
      const rest = PRODUCTS.filter(
        (p) => !chosen.includes(p.slug) && SUGGESTED.includes(p.slug),
      )
      return [...picked, ...rest].slice(0, 10)
    }
    return PRODUCTS.filter(
      (p) => p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term),
    ).slice(0, 12)
  }, [hunt, chosen])

  const picked = PRODUCTS.filter((p) => chosen.includes(p.slug))
  const ready = name.trim() !== '' && (picked.length > 0 || note.trim() !== '')
  const total = Math.round(picked.reduce((s, p) => s + p.price, 0) * (box === 'half' ? 0.5 : 1))

  const message = useMemo(() => {
    const boxLabel = BOXES.find((b) => b.id === box)?.label ?? ''
    const lines = ["Hi! I'd like to order.", '']
    if (name.trim()) lines.push(`Name: ${name.trim()}`)
    if (where.trim()) lines.push(`Delivering to: ${where.trim()}`)
    if (picked.length) {
      lines.push('', `${boxLabel}:`)
      picked.forEach((p) => lines.push(`• ${p.title}`))
      lines.push(`Rough total: Rs. ${formatPrice(total)}`)
    }
    if (note.trim()) lines.push('', `Note: ${note.trim()}`)
    return lines.join('\n')
  }, [name, where, box, picked, note, total])

  function send(e) {
    e.preventDefault()
    if (!ready) return
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  if (!open) return null
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="box-wrap"
      role="dialog"
      aria-modal="true"
      aria-label="Build your box"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form className="box-panel" ref={panel} onSubmit={send}>
        <span className="box-sticker" aria-hidden="true">
          no app needed
        </span>
        <button className="box-x" type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="box-head">
          <p className="order-kicker">Build your box</p>
          <h2>
            Tell us what you&rsquo;re <span className="pop">craving</span>
          </h2>
          <p className="order-sub">
            Search the whole shelf, tick what you want, and watch the message write itself. Press
            the button and it opens in your WhatsApp, ready to send.
          </p>
        </div>

        <div className="box-scroll">
          <div className="order-grid">
            <div className="field">
              <label htmlFor="bx-name">Your name</label>
              <input
                id="bx-name"
                ref={first}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Who&rsquo;s ordering?"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="bx-where">City or country</label>
              <input
                id="bx-where"
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Bengaluru, Dubai, Toronto&hellip;"
              />
            </div>
          </div>

          <fieldset className="field">
            <legend>
              Pick your favourites
              <button className="shuffle" type="button" onClick={surprise}>
                <span aria-hidden="true">🎲</span> Surprise me
              </button>
            </legend>

            <div className="hunt">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4"
                />
              </svg>
              <label htmlFor="bx-hunt" hidden>
                Search all {PRODUCTS.length} snacks
              </label>
              <input
                id="bx-hunt"
                type="text"
                value={hunt}
                onChange={(e) => setHunt(e.target.value)}
                placeholder={`Search all ${PRODUCTS.length} snacks…`}
                autoComplete="off"
              />
              {hunt && (
                <button type="button" className="search-clear" onClick={() => setHunt('')}>
                  Clear
                </button>
              )}
            </div>

            {listed.length ? (
              <ul className="hunt-list">
                {listed.map((p) => {
                  const on = chosen.includes(p.slug)
                  const pic = photoFor(p.slug)
                  return (
                    <li key={p.slug}>
                      <button
                        type="button"
                        className={`hunt-row${on ? ' on' : ''}`}
                        aria-pressed={on}
                        onClick={() => toggle(p.slug)}
                      >
                        {pic ? (
                          <img src={pic} alt="" aria-hidden="true" />
                        ) : (
                          <span className="hunt-blank" aria-hidden="true" />
                        )}
                        <span className="hunt-name">{p.title}</span>
                        <span className="hunt-price">₹{formatPrice(p.price)}</span>
                        <span className="hunt-tick" aria-hidden="true">
                          {on ? '✓' : '+'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="hunt-none">Nothing matches that &mdash; try &ldquo;sev&rdquo;.</p>
            )}
          </fieldset>

          <fieldset className="field">
            <legend>How much?</legend>
            <div className="boxes">
              {BOXES.map((b) => (
                <label key={b.id} className={`box${box === b.id ? ' on' : ''}`}>
                  <input
                    type="radio"
                    name="howmuch"
                    value={b.id}
                    checked={box === b.id}
                    onChange={() => setBox(b.id)}
                  />
                  <strong>{b.label}</strong>
                  <em>{b.hint}</em>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="bx-note">Anything else? (optional)</label>
            <textarea
              id="bx-note"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Deliver after Diwali, need 5 boxes for gifting&hellip;"
            />
          </div>

        </div>

        {/* Pinned, not inside the scrolling middle: watching the message
            write itself as you fill the form is the whole point of it, and
            down there you had to go hunting for it. */}
        <div className="chat" aria-live="polite">
          <div className="chat-top">
            <span className="chat-dp" aria-hidden="true">
              S
            </span>
            <div>
              <strong>Seyu Snacks &amp; Namkeen</strong>
              <em>online</em>
            </div>
            <span className="chat-tag">preview</span>
          </div>
          <div className="chat-body">
            <p className="bubble">
              {message}
              <span className="bubble-meta">
                {now}
                <span className="ticks" aria-hidden="true">
                  ✓✓
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="box-foot">
          <p className="order-total">
            {picked.length ? (
              <>
                <span>
                  {picked.length} {picked.length === 1 ? 'item' : 'items'} &middot; roughly
                </span>
                <strong>₹{formatPrice(total)}</strong>
              </>
            ) : (
              <span>Pick a few, or just write us a note</span>
            )}
          </p>
          <button className="order-send" type="submit" disabled={!ready}>
            <WhatsAppIcon />
            Send on WhatsApp
          </button>
        </div>
      </form>
    </div>
  )
}
