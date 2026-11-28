import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header, { Ticker } from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Steps from './components/Steps.jsx'
import Story from './components/Story.jsx'
import Craving from './components/Craving.jsx'
import BoxModal from './components/BoxModal.jsx'
import BackToTop from './components/BackToTop.jsx'
import Controls from './components/Controls.jsx'
import ProductCard from './components/ProductCard.jsx'
import ProductPage from './components/ProductPage.jsx'
import Footer from './components/Footer.jsx'
import { PRODUCTS } from './data/products.js'
import { photoFor } from './photos/index.js'
import { useThumbnails } from './hooks/useThumbnails.js'

/** How many cards show at once, and how many each "View All" adds. */
const PAGE = 8

export default function App() {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [open, setOpen] = useState(null) // the product page, or null for home
  const [box, setBox] = useState(false)  // the build-your-box dialog
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

  // Only what is on screen gets rendered in 3D, plus whatever the product
  // page is showing, so opening the page builds 8 models rather than 48.
  const needed = useMemo(() => {
    if (!open) return visible
    return visible.some((p) => p.id === open.id) ? visible : [open, ...visible]
  }, [visible, open])
  const shots = useThumbnails(needed, photographed)

  const openProduct = useCallback((p) => {
    setOpen(p)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const goHome = useCallback((hash) => {
    setOpen(null)
    requestAnimationFrame(() => {
      const el = hash ? document.querySelector(hash) : null
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else window.scrollTo({ top: 0, behavior: 'auto' })
    })
  }, [])

  // the browser back button leaves the product page
  useEffect(() => {
    if (!open) return undefined
    window.history.pushState({ pdp: open.slug }, '')
    const back = () => setOpen(null)
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [open])

  function viewMore() {
    const first = visible.length
    setLimit((n) => n + PAGE)
    // put the keyboard on the first newly revealed card rather than leaving
    // focus on a button that may have just disappeared
    requestAnimationFrame(() => {
      const cards = gridRef.current?.querySelectorAll('.card-hit')
      cards?.[first]?.focus({ preventScroll: true })
    })
  }

  return (
    <>
      <Ticker />
      <Header active={open ? 'Products' : ''} onHome={open ? goHome : undefined} />

      {open ? (
        <ProductPage product={open} shots={shots} onOpen={openProduct} />
      ) : (
        <>
          <Hero onOpen={openProduct} />
          <Steps />

          <main id="main">
            <div className="wrap">
              <div className="sec-head">
                <h2>Our most-loved snacks</h2>
                <p>Tried, tasted and trusted by thousands of happy snackers.</p>
              </div>

              <Controls query={query} onQuery={setQuery} shown={matches.length} />

              {matches.length > 0 ? (
                <>
                  <div className="grid" ref={gridRef}>
                    {visible.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        photo={photoFor(p.slug)}
                        shot={shots[p.id]}
                        onOpen={openProduct}
                      />
                    ))}
                  </div>

                  <div className="more" aria-live="polite">
                    {left > 0 ? (
                      <button className="more-btn" type="button" onClick={viewMore}>
                        View All
                        <span className="more-arrow" aria-hidden="true">
                          →
                        </span>
                      </button>
                    ) : (
                      <p className="more-done">
                        All {matches.length} of them <span aria-hidden="true">🎉</span>
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty">
                  <h2>Nothing matches that</h2>
                  <p>
                    Try &ldquo;sev&rdquo;, &ldquo;chivda&rdquo; or &ldquo;peanut&rdquo; &mdash; or
                    just message us and we&rsquo;ll make it.
                  </p>
                </div>
              )}
            </div>
          </main>

          <Story />
          <Craving onOpen={() => setBox(true)} />
        </>
      )}

      <Footer onJump={open ? goHome : undefined} />
      <BackToTop />
      <BoxModal open={box} onClose={() => setBox(false)} />
    </>
  )
}
