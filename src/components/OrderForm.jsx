import { useMemo, useState } from 'react'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { PRODUCTS, WHATSAPP_NUMBER, formatPrice } from '../data/products.js'

/**
 * "Build your box" - the one place on the page that asks the visitor for
 * something instead of just showing them things.
 *
 * There is no server here and nothing is stored: the form writes a WhatsApp
 * message and opens it in the visitor's own WhatsApp, where they press send.
 * The shop gets a real, readable order in the same inbox as every other
 * order, and the site stays a static build.
 *
 * The message is shown as it is written, in a chat bubble, so nobody has to
 * trust a form they cannot see the output of.
 */

// eight to pick from, so the form stays a form rather than a second catalogue
const PICKS = [
  'bikaneri-bhujia',
  'navratna-chivda',
  'aloo-bhujia-sev',
  'sp-bhakarwadi',
  'bhajani-chakli',
  'farali-chivda',
  'moongdal',
  'sweet-boondi',
]

const BOXES = [
  { id: 'half', label: 'Half kilo of each', hint: 'a taste of a few' },
  { id: 'one', label: '1 Kg of each', hint: 'the usual' },
  { id: 'gift', label: 'Make it a gift box', hint: 'wrapped, with a note' },
]

const HEAT = [
  { id: 'mild', label: 'Mild', chillies: 1 },
  { id: 'medium', label: 'Medium', chillies: 2 },
  { id: 'hot', label: 'Fire', chillies: 3 },
]

export default function OrderForm() {
  const picks = useMemo(
    () => PICKS.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(Boolean),
    [],
  )

  const [name, setName] = useState('')
  const [where, setWhere] = useState('')
  const [box, setBox] = useState('one')
  const [heat, setHeat] = useState('medium')
  const [chosen, setChosen] = useState([])
  const [note, setNote] = useState('')

  const toggle = (slug) =>
    setChosen((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]))

  /** Three at random - for people who cannot decide, which is most people. */
  function surprise() {
    const pool = [...picks]
    const out = []
    while (out.length < 3 && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0].slug)
    }
    setChosen(out)
  }

  const picked = picks.filter((p) => chosen.includes(p.slug))
  const ready = name.trim() !== '' && (picked.length > 0 || note.trim() !== '')

  // a rough total, so nobody is surprised later. Half-kilo is half the price.
  const total = Math.round(picked.reduce((sum, p) => sum + p.price, 0) * (box === 'half' ? 0.5 : 1))

  // One message, written once, used by both the preview and the button.
  const message = useMemo(() => {
    const boxLabel = BOXES.find((b) => b.id === box)?.label ?? ''
    const heatLabel = HEAT.find((h) => h.id === heat)?.label ?? ''

    const lines = ["Hi! I'd like to order.", '']
    if (name.trim()) lines.push(`Name: ${name.trim()}`)
    if (where.trim()) lines.push(`Delivering to: ${where.trim()}`)

    if (picked.length) {
      lines.push('', `${boxLabel}:`)
      picked.forEach((p) => lines.push(`• ${p.title}`))
      lines.push(`Spice: ${heatLabel}`)
      lines.push(`Rough total: Rs. ${formatPrice(total)}`)
    }

    if (note.trim()) lines.push('', `Note: ${note.trim()}`)
    return lines.join('\n')
  }, [name, where, box, heat, picked, note, total])

  function send(e) {
    e.preventDefault()
    if (!ready) return
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <section className="order" id="order">
      <div className="wrap">
        <form className="order-card" onSubmit={send}>
          <span className="order-sticker" aria-hidden="true">
            no app needed
          </span>

          <div className="order-head">
            <p className="order-kicker">Build your box</p>
            <h2>
              Tell us what you&rsquo;re <span className="pop">craving</span>
            </h2>
            <p className="order-sub">
              Tick what you want and watch the message write itself. Press the button and it opens
              in your WhatsApp, ready to send.
            </p>
          </div>

          <div className="order-grid">
            <div className="field">
              <label htmlFor="of-name">Your name</label>
              <input
                id="of-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Who&rsquo;s ordering?"
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="of-where">City or country</label>
              <input
                id="of-where"
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Bengaluru, Dubai, Toronto&hellip;"
              />
            </div>
          </div>

          <fieldset className="field picks-field">
            <legend>
              Pick your favourites
              <button className="shuffle" type="button" onClick={surprise}>
                <span aria-hidden="true">🎲</span> Surprise me
              </button>
            </legend>
            <div className="picks">
              {picks.map((p) => {
                const on = chosen.includes(p.slug)
                return (
                  <button
                    key={p.slug}
                    type="button"
                    className={`pick${on ? ' on' : ''}`}
                    aria-pressed={on}
                    onClick={() => toggle(p.slug)}
                  >
                    <span className="pick-tick" aria-hidden="true">
                      {on ? '✓' : '+'}
                    </span>
                    {p.title}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>How much?</legend>
            <div className="boxes">
              {BOXES.map((b) => (
                <label key={b.id} className={`box${box === b.id ? ' on' : ''}`}>
                  <input
                    type="radio"
                    name="box"
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

          <fieldset className="field">
            <legend>How spicy?</legend>
            <div className="heat">
              {HEAT.map((h) => (
                <label key={h.id} className={`chilli${heat === h.id ? ' on' : ''}`}>
                  <input
                    type="radio"
                    name="heat"
                    value={h.id}
                    checked={heat === h.id}
                    onChange={() => setHeat(h.id)}
                  />
                  <span className="chilli-art" aria-hidden="true">
                    {'🌶️'.repeat(h.chillies)}
                  </span>
                  <strong>{h.label}</strong>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="of-note">Anything else? (optional)</label>
            <textarea
              id="of-note"
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Deliver after Diwali, need 5 boxes for gifting&hellip;"
            />
          </div>

          {/* the message, exactly as it will arrive */}
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

          <div className="order-foot">
            <p className="order-total">
              {picked.length ? (
                <>
                  <span>
                    {picked.length} {picked.length === 1 ? 'item' : 'items'} &middot; roughly
                  </span>
                  <strong>Rs. {formatPrice(total)}</strong>
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

          <p className="order-fine">
            Nothing on this page is collected or stored &mdash; the message goes straight from your
            phone to ours.
          </p>
        </form>
      </div>
    </section>
  )
}
