const TICKER =
  'FRESH BATCHES DAILY ✦ DELIVERED ANYWHERE IN INDIA IN 2–4 DAYS ✦ ' +
  'AND TO 5 COUNTRIES WORLDWIDE ✦ ORDER ON WHATSAPP ✦ '

const NAV = [
  { href: '#main', label: 'Products' },
  { href: '#story', label: 'About' },
  { href: '#contact', label: 'Contact' },
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

/**
 * Wordmark left, three text links right. No logo mark - the name is the
 * logo, which is what the design does.
 *
 * `active` highlights one link; the product page passes 'Products'.
 */
export default function Header({ active = '', onHome }) {
  return (
    <header className="shop">
      <div className="wrap">
        <a
          className="brand"
          href="#top"
          onClick={(e) => {
            if (!onHome) return
            e.preventDefault()
            onHome()
          }}
        >
          Seyu Snacks &amp; Namkeen
        </a>

        <nav className="nav" aria-label="Sections">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={active === n.label ? 'on' : undefined}
              aria-current={active === n.label ? 'page' : undefined}
              onClick={(e) => {
                // on the product page the anchors point at a page that is
                // not mounted, so go home first and let the hash land there
                if (!onHome) return
                e.preventDefault()
                onHome(n.href)
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
