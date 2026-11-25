import { useEffect, useMemo, useRef, useState } from 'react'
import Header, { Ticker } from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ShipBand from './components/ShipBand.jsx'
import Controls from './components/Controls.jsx'
import ProductCard from './components/ProductCard.jsx'
import SpinModal from './components/SpinModal.jsx'
import OrderForm from './components/OrderForm.jsx'
import FloatingOrder from './components/FloatingOrder.jsx'
import Footer from './components/Footer.jsx'
import { PRODUCTS } from './data/products.js'
import { framesFor, photoFor } from './photos/index.js'
import { useThumbnails } from './hooks/useThumbnails.js'

/** How many cards show at once, and how many each "View more" adds. */
const PAGE = 8

export default function App() {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [spinning, setSpinning] = useState(null)
  const gridRef = useRef(null)

  // products that already have a photograph don't need a render
  const photographed = useMemo(
    () => new Set(PRODUCTS.filter((p) => photoFor(p.slug)).map((p) => p.id)),
    [],
  )

  // search matches the name and the description, so "spicy" or "peanut"
  // finds something even when it is not in the title
  const matches = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return PRODUCTS
    return PRODUCTS.filter(
      (p) => p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term),
    )
  }, [query])

  // a new search starts again from the first page
  useEffect(() => setLimit(PAGE), [query])

  const visible = useMemo(() => matches.slice(0, limit), [matches, limit])
  const left = matches.length - visible.length

  // Only what is on screen gets rendered in 3D. Opening the page used to
  // build all 48; now it builds 8, and each "View more" builds 8 more.
  const shots = useThumbnails(visible, photographed)

  function viewMore() {
    const first = visible.length
    setLimit((n) => n + PAGE)
    // put the keyboard on the first newly revealed card rather than leaving
    // focus on a button that may have just disappeared
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll('.card-art')
      cards?.[first]?.focus({ preventScroll: true })
    })
  }

  return (
    <>
      <Ticker />
      <Header />
      <Hero count={PRODUCTS.length} />
      <ShipBand />
      <Controls query={query} onQuery={setQuery} shown={matches.length} />

      <main id="main">
        <div className="wrap">
          {matches.length > 0 ? (
            <>
              <div className="grid" ref={gridRef}>
                {visible.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    photo={photoFor(p.slug)}
                    shot={shots[p.id]}
                    onSpin={setSpinning}
                  />
                ))}
              </div>

              <div className="more" aria-live="polite">
                <p className="more-count">
                  Showing <strong>{visible.length}</strong> of {matches.length}
                  <span className="more-bar" aria-hidden="true">
                    <span style={{ width: `${(visible.length / matches.length) * 100}%` }} />
                  </span>
                </p>

                {left > 0 ? (
                  <button className="more-btn" type="button" onClick={viewMore}>
                    View {Math.min(left, PAGE)} more
                    <span className="more-arrow" aria-hidden="true">
                      ↓
                    </span>
                  </button>
                ) : (
                  <p className="more-done">
                    That&rsquo;s everything <span aria-hidden="true">🎉</span>
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="empty">
              <h2>Nothing matches that</h2>
              <p>
                Try &ldquo;sev&rdquo;, &ldquo;chivda&rdquo; or &ldquo;peanut&rdquo; &mdash; or just
                message us and we&rsquo;ll make it.
              </p>
            </div>
          )}
        </div>
      </main>

      <OrderForm />
      <Footer />
      <FloatingOrder />

      {/* the same photos the card draws from, so the two never disagree */}
      <SpinModal
        product={spinning}
        frames={spinning ? framesFor(spinning.slug) : []}
        onClose={() => setSpinning(null)}
      />
    </>
  )
}
