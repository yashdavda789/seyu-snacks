export const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'Alphabetically, A–Z' },
  { value: 'za', label: 'Alphabetically, Z–A' },
  { value: 'plh', label: 'Price, low to high' },
  { value: 'phl', label: 'Price, high to low' },
]

export default function Controls({ query, onQuery, sort, onSort, shown }) {
  return (
    <section className="controls">
      <div className="wrap">
        <div className="search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
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
            placeholder="Search bhujia, chivda, gathiya&hellip;"
            autoComplete="off"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>

        <div className="sort">
          <label htmlFor="sort" hidden>
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <p className="count">
          {shown} {shown === 1 ? 'product' : 'products'}
        </p>
      </div>
    </section>
  )
}
