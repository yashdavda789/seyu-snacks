/**
 * Search, and nothing else. A sort dropdown used to sit beside it; with 48
 * products that fit on two scrolls, typing three letters beats picking an
 * order from a menu.
 */
export default function Controls({ query, onQuery, shown }) {
  return (
    <section className="controls">
      <div className="wrap">
        <div className="search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4"
            />
          </svg>
          <label htmlFor="q" hidden>
            Search namkeen
          </label>
          <input
            type="search"
            id="q"
            placeholder="Search bhujia, chivda, sev&hellip;"
            autoComplete="off"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" type="button" onClick={() => onQuery('')}>
              Clear
            </button>
          )}
        </div>

        <p className="count">
          <strong>{shown}</strong> {shown === 1 ? 'snack' : 'snacks'}
        </p>
      </div>
    </section>
  )
}
