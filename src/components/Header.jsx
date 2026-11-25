import Logo from './Logo.jsx'
import WhatsAppIcon from './WhatsAppIcon.jsx'
import { GENERAL_WHATSAPP } from '../data/products.js'

const TICKER =
  'FRESH BATCHES DAILY ✦ DELIVERED ANYWHERE IN INDIA IN 2–4 DAYS ✦ ' +
  'AND TO 5 COUNTRIES WORLDWIDE ✦ SPIN ANY SNACK IN 360° ✦ ORDER ON WHATSAPP ✦ '

export function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-in">
        <span>{TICKER}</span>
        <span>{TICKER}</span>
      </div>
    </div>
  )
}

export default function Header() {
  return (
    <header className="shop">
      <div className="wrap">
        <div className="brand">
          <Logo />
          <div>
            <p className="brand-name">
              Seyu Snacks <em>&amp;</em> Namkeen
            </p>
            <p className="brand-sub">Namkeen &middot; Chivda &middot; Sweets</p>
          </div>
        </div>
        <a className="call" href={GENERAL_WHATSAPP} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          <span>Order on WhatsApp</span>
        </a>
      </div>
    </header>
  )
}
