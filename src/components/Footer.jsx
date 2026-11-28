import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from '../data/products.js'

const LINKS = [
  { href: '#main', label: 'Products' },
  { href: '#story', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const SOCIAL = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    path: 'M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5A20 20 0 0 0 14.2 5c-2.2 0-3.7 1.3-3.7 3.8v2.4H8v2.8h2.5v7Z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    path: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm5.9-7.8a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM8.6 3.5h6.8A5.1 5.1 0 0 1 20.5 8.6v6.8a5.1 5.1 0 0 1-5.1 5.1H8.6a5.1 5.1 0 0 1-5.1-5.1V8.6a5.1 5.1 0 0 1 5.1-5.1Zm0 1.8A3.3 3.3 0 0 0 5.3 8.6v6.8a3.3 3.3 0 0 0 3.3 3.3h6.8a3.3 3.3 0 0 0 3.3-3.3V8.6a3.3 3.3 0 0 0-3.3-3.3Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/',
    path: 'M7.3 19H4.6V9.8h2.7Zm-1.35-10.4A1.6 1.6 0 1 1 7.5 7a1.6 1.6 0 0 1-1.55 1.6ZM19.4 19h-2.7v-4.5c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19H10.7V9.8h2.6v1.25h.04a2.9 2.9 0 0 1 2.6-1.43c2.8 0 3.3 1.8 3.3 4.2Z',
  },
]

export default function Footer({ onJump }) {
  const year = new Date().getFullYear()
//
  return (
    <footer id="contact">
      <div className="wrap foot-top">
        <nav className="foot-links" aria-label="Footer">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                if (!onJump) return
                e.preventDefault()
                onJump(l.href)
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <ul className="foot-social">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap">
        <p className="foot-big">Build your box</p>
      </div>

      <div className="wrap foot-bottom">
        <p>&copy; {year}, Seyu Snacks &amp; Namkeen</p>
        <a
          className="foot-mail"
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Zm2.2.5 6.8 5 6.8-5Z" />
          </svg>
          {WHATSAPP_DISPLAY}
        </a>
        <p className="foot-legal">
          <a href="#story">Terms &amp; Regulations</a>
          <a href="#story">Privacy</a>
        </p>
      </div>
    </footer>
  )
}
