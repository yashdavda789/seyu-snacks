import { useState } from 'react'
import { COUNTRIES, WHATSAPP_DISPLAY, DELIVERY_DAYS } from '../data/products.js'

export default function Footer() {
  const [label, setLabel] = useState('Copy number')

  async function copy() {
    try {
      await navigator.clipboard.writeText(WHATSAPP_DISPLAY)
      setLabel('Copied')
    } catch {
      setLabel('Select and copy')
    }
    setTimeout(() => setLabel('Copy number'), 1800)
  }

  return (
    <>
      <footer>
        <div className="wrap">
          <div>
            <h2>Seyu Snacks &amp; Namkeen</h2>
            <p>
              Traditional Gujarati and Maharashtrian farsan, fried fresh and packed the same day.
            </p>
          </div>

          <div>
            <h2>Order on WhatsApp</h2>
            <p className="phone">{WHATSAPP_DISPLAY}</p>
            <button className="copy" type="button" onClick={copy}>
              {label}
            </button>
          </div>

          <div>
            <h2>Shop hours</h2>
            <ul>
              <li>Monday &ndash; Saturday &middot; 9:00 am &ndash; 9:00 pm</li>
              <li>Sunday &middot; 9:00 am &ndash; 2:00 pm</li>
              <li>Festival orders: please order 2 days ahead</li>
            </ul>
          </div>

          <div>
            <h2>International</h2>
            <ul>
              <li>{COUNTRIES.map((c) => c.name).join(' · ')}</li>
              <li>Delivered in {DELIVERY_DAYS}</li>
              <li>Message us for shipping rates</li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="legal">
        <div className="wrap">
          &copy; Seyu Snacks &amp; Namkeen. Prices are per kilogram and may change with the season.
          Product visuals are our own 3D renders unless a photograph is supplied.
        </div>
      </div>
    </>
  )
}
