import { useEffect, useState } from 'react'
import { studio } from '../three/studio.js'

/**
 * Renders every product to a still image, one per idle slot so the page stays
 * responsive while it works. Returns a { [id]: dataURL } map that fills in as
 * the renders land.
 *
 * Products that already have a photograph are skipped - no point rendering
 * something the card will never show.
 */
export function useThumbnails(products, skipIds = new Set()) {
  const [shots, setShots] = useState({})

  useEffect(() => {
    let cancelled = false
    const queue = products.filter((p) => !skipIds.has(p.id))
    let i = 0

    const idle =
      window.requestIdleCallback ??
      ((fn) => setTimeout(() => fn({ timeRemaining: () => 8 }), 16))

    function step() {
      if (cancelled || i >= queue.length) return
      const product = queue[i++]
      try {
        const url = studio.thumbnail(product)
        if (url && !cancelled) setShots((prev) => ({ ...prev, [product.id]: url }))
      } catch {
        // a failed render just leaves the card's placeholder in place
      }
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
