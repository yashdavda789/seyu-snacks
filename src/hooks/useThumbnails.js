import { useEffect, useRef, useState } from 'react'
import { studio } from '../three/studio.js'

/**
 * Renders each product to a still image, one per idle slot so the page stays
 * responsive while it works. Returns a { [id]: dataURL } map that fills in as
 * the renders land.
 *
 * Pass only the products that are on screen. The list grows as the visitor
 * presses "View more", and anything already rendered is remembered, so
 * growing the list only ever costs the new items.
 *
 * Products that already have a photograph are skipped - no point rendering
 * something the card will never show.
 */
export function useThumbnails(products, skipIds = new Set()) {
  const [shots, setShots] = useState({})
  // ids already rendered, kept outside state so re-running the effect does
  // not start the whole queue again
  const done = useRef(new Set())

  useEffect(() => {
    let cancelled = false
    const queue = products.filter((p) => !skipIds.has(p.id) && !done.current.has(p.id))
    if (!queue.length) return undefined

    let i = 0
    const idle =
      window.requestIdleCallback ??
      ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 16))

    // Renders land in batches rather than one at a time: each setState
    // re-renders the whole grid, and doing that once per product costs more
    // than the rendering itself.
    let pending = {}
    const flush = () => {
      if (cancelled || !Object.keys(pending).length) return
      const batch = pending
      pending = {}
      setShots((prev) => ({ ...prev, ...batch }))
    }

    function step() {
      if (cancelled) return
      if (i >= queue.length) return flush()

      // One WebGL context serves the whole site. While a page is holding it
      // and turning a product, rendering a card here would resize the canvas
      // and recompose the scene mid-drag, so wait it out.
      if (studio.live) {
        flush()
        setTimeout(step, 400)
        return
      }

      const product = queue[i++]
      try {
        // a few pieces caught in the air, the same as the hero - it is what
        // stops a grid of 48 bowls reading as 48 identical bowls
        const url = studio.thumbnail(product, { scatter: true, pull: 0.9 })
        if (url) {
          pending[product.id] = url
          done.current.add(product.id)
        }
      } catch {
        // a failed render just leaves the card's placeholder in place
      }

      // the first few go up immediately so the top of the grid fills fast
      if (i <= 4 || i % 4 === 0) flush()
      idle(step)
    }

    const start = setTimeout(step, 60)
    return () => {
      cancelled = true
      clearTimeout(start)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  return shots
}
