import { DOMESTIC_DAYS } from '../data/products.js'

/**
 * The brown band: how ordering works, in three steps. It sits between the
 * hero and the grid because that is where the question "so how do I actually
 * buy this?" turns up.
 */
const STEPS = [
  {
    title: 'Select Your Fave',
    body: 'Browse our menu and pick the snacks you love.',
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="2" />
        <rect x="13" y="4" width="7" height="7" rx="2" />
        <rect x="4" y="13" width="7" height="7" rx="2" />
        <path d="M13 16.5h7M16.5 13v7" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Book Your Snacks',
    body: 'Secure your order easily in just a few taps.',
    icon: (
      <>
        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6a2.5 2.5 0 0 1-2.5 2.5H10l-4 3v-3H7.5A2.5 2.5 0 0 1 5 13.5Z" />
        <path d="M9.5 10.5h5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: `Delivered in ${DOMESTIC_DAYS}`,
    body: 'Freshly packed and brought straight to your door!',
    icon: (
      <>
        <path d="M3 7.5h9v8H3z" />
        <path d="M12 10h3.6l2.4 2.6v2.9H12z" />
        <circle cx="7" cy="17" r="1.7" />
        <circle cx="16" cy="17" r="1.7" />
      </>
    ),
  },
]

export default function Steps() {
  return (
    <section className="steps" id="how">
      <div className="wrap">
        <ol className="steps-row">
          {STEPS.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step-ring" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  {s.icon}
                </svg>
                <b>{i + 1}</b>
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
