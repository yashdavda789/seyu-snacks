import { formatPrice } from '../data/products.js'

/**
 * The picture falls back in three steps: a real photograph if one exists,
 * otherwise the 3D render once it finishes, otherwise a tinted placeholder.
 *
 * The whole card is the link into the product page, with a round arrow
 * bottom-right that is decoration rather than a second target - one card,
 * one place to go.
 */
export default function ProductCard({ product, photo, shot, onOpen }) {
  const picture = photo ?? shot

  return (
    <article className="card">
      <button
        type="button"
        className="card-hit"
        onClick={() => onOpen(product)}
        aria-label={`${product.title}, ${formatPrice(product.price)} rupees per ${product.unit}`}
      >
        <span className="card-art">
          <span className="art-placeholder" aria-hidden="true" />
          {picture && (
            <img
              className={`picture${photo ? ' is-photo' : ' in'}`}
              src={picture}
              alt=""
              decoding="async"
            />
          )}
        </span>

        <span className="card-body">
          <span className="card-lines">
            <span className="card-title">{product.title}</span>
            <span className="price">₹{formatPrice(product.price)}</span>
          </span>
          <span className="card-go" aria-hidden="true">
            →
          </span>
        </span>
      </button>
    </article>
  )
}
