import WhatsAppIcon from './WhatsAppIcon.jsx'
import { formatPrice, whatsappLink } from '../data/products.js'

/**
 * The picture layer falls back in three steps: a real photograph if one
 * exists, otherwise the 3D render once it finishes, otherwise a tinted
 * placeholder.
 *
 * The picture itself is the button that opens the larger view - a real
 * <button> rather than a clickable div, so it is reachable by keyboard and
 * announced properly without needing a visible badge.
 *
 * Name and price sit bottom left, the order button bottom right, the way a
 * shop lists a shelf.
 */
export default function ProductCard({ product, photo, shot, onSpin }) {
  const picture = photo ?? shot

  return (
    <article className="card">
      <button
        type="button"
        className="card-art"
        aria-label={`View ${product.title} close up`}
        onClick={() => onSpin(product)}
      >
        <span className="art-placeholder" aria-hidden="true" />
        {picture && (
          <img
            className={`picture${photo ? ' is-photo' : ' in'}`}
            src={picture}
            alt=""
            decoding="async"
          />
        )}
        <span className="unit-chip">{product.unit}</span>
      </button>

      <div className="card-body">
        <div className="card-lines">
          <h3 className="card-title">{product.title}</h3>
          <p className="price">
            <span className="rs">Rs.</span>
            {formatPrice(product.price)}
            <span className="per">/ {product.unit}</span>
          </p>
        </div>

        <a
          className="card-buy"
          href={whatsappLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Order ${product.title} on WhatsApp`}
        >
          <WhatsAppIcon />
        </a>
      </div>
    </article>
  )
}
