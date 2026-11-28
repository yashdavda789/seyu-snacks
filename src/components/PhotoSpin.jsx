import { useEffect, useRef, useState } from 'react'

/**
 * A photographic 360: drag to turn the product, the way a turntable shot
 * works on a shopping site. Each frame is one photograph; dragging scrubs
 * through them and wraps around at both ends.
 *
 * Frames are preloaded before the first drag, otherwise the first turn
 * stutters while the browser fetches each one.
 *
 * Used when `src/photos/<slug>/` holds a numbered set. One photograph on
 * its own cannot spin - it holds one angle - so that case shows a still.
 */
export default function PhotoSpin({ frames, alt, className = '' }) {
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const boxRef = useRef(null)

  // preload every frame
  useEffect(() => {
    let cancelled = false
    let left = frames.length

    frames.forEach((src) => {
      const img = new Image()
      const done = () => {
        if (cancelled) return
        left -= 1
        if (left <= 0) setReady(true)
      }
      img.onload = done
      img.onerror = done
      img.src = src
    })

    return () => {
      cancelled = true
    }
  }, [frames])

  // drag, touch and arrow keys all move through the frames
  useEffect(() => {
    const box = boxRef.current
    if (!box) return undefined

    let lastX = null
    let carried = 0

    // how far the pointer travels for one frame; a full drag across the
    // box turns the product roughly once
    const step = () => Math.max(6, box.clientWidth / Math.max(frames.length, 1))
    const point = (e) => (e.touches ? e.touches[0] : e)

    const down = (e) => {
      lastX = point(e).clientX
      carried = 0
      box.classList.add('grabbing')
    }

    const move = (e) => {
      if (lastX === null) return
      const x = point(e).clientX
      carried += x - lastX
      lastX = x

      const unit = step()
      while (Math.abs(carried) >= unit) {
        const dir = carried > 0 ? 1 : -1
        carried -= dir * unit
        setIndex((i) => (i + dir + frames.length) % frames.length)
      }
      if (e.cancelable) e.preventDefault()
    }

    const up = () => {
      lastX = null
      box.classList.remove('grabbing')
    }

    const key = (e) => {
      if (e.key === 'ArrowLeft') {
        setIndex((i) => (i - 1 + frames.length) % frames.length)
        e.preventDefault()
      } else if (e.key === 'ArrowRight') {
        setIndex((i) => (i + 1) % frames.length)
        e.preventDefault()
      }
    }

    box.addEventListener('mousedown', down)
    box.addEventListener('touchstart', down, { passive: true })
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    box.addEventListener('keydown', key)

    return () => {
      box.removeEventListener('mousedown', down)
      box.removeEventListener('touchstart', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
      box.removeEventListener('keydown', key)
    }
  }, [frames])

  return (
    <div
      className={`spin-box ${className}`.trim()}
      ref={boxRef}
      tabIndex={0}
      role="img"
      aria-label={`${alt}, ${frames.length} frame 360 view. Drag, or use the arrow keys, to turn it.`}
    >
      {/* every frame stays mounted so switching never refetches */}
      {frames.map((src, i) => (
        <img
          key={src}
          className="spin-frame"
          src={src}
          alt={i === 0 ? alt : ''}
          aria-hidden={i !== 0}
          draggable="false"
          hidden={i !== index}
        />
      ))}
      {!ready && <span className="spin-loading">Loading frames&hellip;</span>}
    </div>
  )
}
