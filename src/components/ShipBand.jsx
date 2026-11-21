import { COUNTRIES, DELIVERY_DAYS } from '../data/products.js'

export default function ShipBand() {
  return (
    <section className="ship">
      <div className="wrap">
        <div className="ship-head">
          <h2>We ship to {COUNTRIES.length} countries</h2>
          <span className="fast">Delivered in {DELIVERY_DAYS}</span>
          <p>Vacuum-sealed and air-freighted, so it lands as crisp as it left the shop.</p>
        </div>
        <ul className="ship-row">
          {COUNTRIES.map((c) => (
            <li className="ship-c" key={c.name}>
              <span className="flag" aria-hidden="true">
                {c.flag}
              </span>
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
