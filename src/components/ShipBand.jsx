import { CITIES, COUNTRIES, DELIVERY_DAYS, DOMESTIC_DAYS } from '../data/products.js'

/**
 * Where we deliver. Two rows, because the two cases are different promises:
 * India is fast and cheap, overseas is slower and air-freighted. Showing
 * them together was hiding the domestic half of the business.
 *
 * The cities are the named ones only - the row ends by saying every other
 * pin code is covered, so nobody has to look for their own town.
 */
export default function ShipBand() {
  return (
    <section className="ship">
      <div className="wrap">
        <div className="ship-head">
          <h2>Across India, and to {COUNTRIES.length} countries</h2>
          <span className="fast">India in {DOMESTIC_DAYS}</span>
          <p>Packed the day it is fried, so it arrives as crisp as it left the shop.</p>
        </div>

        <div className="ship-group">
          <h3 className="ship-label">
            Anywhere in India <span>{DOMESTIC_DAYS}</span>
          </h3>
          <ul className="ship-row">
            {CITIES.map((city) => (
              <li className="ship-c is-city" key={city}>
                <span>{city}</span>
              </li>
            ))}
            <li className="ship-c is-more">
              <span>&amp; every other pin code</span>
            </li>
          </ul>
        </div>

        <div className="ship-group">
          <h3 className="ship-label">
            Overseas <span>{DELIVERY_DAYS}</span>
          </h3>
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
      </div>
    </section>
  )
}
