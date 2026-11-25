import Logo from './Logo.jsx'

const TICKER =
  'FRESH BATCHES DAILY ✦ DELIVERED ANYWHERE IN INDIA IN 2–4 DAYS ✦ ' +
  'AND TO 5 COUNTRIES WORLDWIDE ✦ ORDER ON WHATSAPP ✦ '

// every one of these points at a section that exists on the page
const NAV = [
  { href: '#main', label: 'Products' },
  { href: '#story', label: 'Story' },
  { href: '#how', label: 'Manufacturing' },
  { href: '#ship', label: 'Packaging' },
]

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
        <a className="brand" href="#main">
          <Logo />
          <span className="brand-name">
            Seyu Snacks <em>&amp;</em> Namkeen
          </span>
        </a>

        <nav className="nav" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
