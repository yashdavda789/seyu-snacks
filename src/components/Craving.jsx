import { PRODUCTS } from '../data/products.js'

/**
 * The band that invites you to order. It used to hold the form itself;
 * now it holds one button that opens it, so the section reads at a glance
 * and the form gets the room it needs.
 *
 * The button is deliberately explicit about what happens when you press
 * it - a button that silently swaps the page under you is worse than one
 * that says it will open something.
 */
export default function Craving({ onOpen }) {
  return (
    <section className="crave" id="order">
      <div className="wrap">
        <div className="crave-card">
          <h2>Tell us what you&rsquo;re craving</h2>
          <p>
            Pick from all {PRODUCTS.length}, tell us how much, and it opens in your WhatsApp
            already written out.
          </p>

          <button className="crave-btn" type="button" onClick={onOpen}>
            <span className="crave-btn-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <rect x="3" y="7" width="18" height="13" rx="2.5" />
                <path d="M3 11h18M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
              </svg>
            </span>
            Build Your Box
            <span className="crave-btn-hint" aria-hidden="true">
              opens a form
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
