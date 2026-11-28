/**
 * A product name set on a curve, the way the design has it behind the hero
 * bowl: the first word arched over the top, the rest sitting straight below.
 *
 * SVG `textPath` does the curve. The path is an invisible arc; the viewBox
 * is wide and short so the whole thing scales with the column rather than
 * needing a fixed size.
 */
export default function ArcName({ name }) {
  const words = name.trim().split(/\s+/)
  const top = words[0]
  const rest = words.slice(1).join(' ')
  // a stable id, so two of these on one page never share a path
  const id = `arc-${name.replace(/\W+/g, '-').toLowerCase()}`

  return (
    // The viewBox has to clear the arc's apex plus the cap height of the
    // text riding on it, or the top of the word is clipped away. The apex
    // of this arc sits 118 above its ends, so the path starts low enough
    // that 178 - 118 = 60 still leaves room for a 58px cap above it.
    <svg className="arc" viewBox="0 0 400 190" aria-hidden="true">
      <defs>
        <path id={id} d="M 20 178 A 196 196 0 0 1 380 178" fill="none" />
      </defs>

      <text className="arc-top">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {top}
        </textPath>
      </text>

      {/* the second word sits under the apex, not at the foot of the box -
          down there the bowl covers it */}
      {rest && (
        <text className="arc-rest" x="200" y="140" textAnchor="middle">
          {rest}
        </text>
      )}
    </svg>
  )
}
