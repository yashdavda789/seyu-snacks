import { useMemo, useState } from 'react'
import Header, { Ticker } from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ShipBand from './components/ShipBand.jsx'
import Controls from './components/Controls.jsx'
import ProductCard from './components/ProductCard.jsx'
import SpinModal from './components/SpinModal.jsx'
import Footer from './components/Footer.jsx'
import { PRODUCTS } from './data/products.js'
import { photoFor } from './photos/index.js'
import { useThumbnails } from './hooks/useThumbnails.js'

const SORTERS = {
  az: (a, b) => a.title.localeCompare(b.title),
  za: (a, b) => b.title.localeCompare(a.title),
  plh: (a, b) => a.price - b.price,
  phl: (a, b) => b.price - a.price,
  featured: (a, b) => a.id - b.id,
}

export default function App() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [spinning, setSpinning] = useState(null)

  // products that already have a photograph don't need a render
  const photographed = useMemo(
    () => new Set(PRODUCTS.filter((p) => photoFor(p.slug)).map((p) => p.id)),
    [],
  )
  const shots = useThumbnails(PRODUCTS, photographed)

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = term ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(term)) : PRODUCTS
    return [...list].sort(SORTERS[sort] ?? SORTERS.featured)
  }, [query, sort])

  return (
    <>
      <Ticker />
      <Header />
      <Hero count={PRODUCTS.length} />
      <ShipBand />
      <Controls
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={setSort}
        shown={visible.length}
      />

      <main id="main">
        <div className="wrap">
          {visible.length > 0 ? (
            <div className="grid">
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
          ) : (
            <div className="empty">
              <h2>Nothing matches that</h2>
              <p>
                Try &ldquo;sev&rdquo;, &ldquo;chivda&rdquo; or &ldquo;gathiya&rdquo; &mdash; or just
                message us and we&rsquo;ll make it.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <SpinModal product={spinning} onClose={() => setSpinning(null)} />
    </>
  )
}
