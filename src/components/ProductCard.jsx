import WhatsAppIcon from './WhatsAppIcon.jsx'
import { brandOf, formatPrice, whatsappLink } from '../data/products.js'

/**
 * The picture layer falls back in three steps: a real photograph if one
 * exists, otherwise the 3D render once it finishes, otherwise a tinted
 * placeholder.
 *
 * The picture itself is the button that opens the 360 view - a real <button>
 * rather than a clickable div, so it is reachable by keyboard and announced
 * properly by screen readers without needing a visible badge.
 */
export default function ProductCard({ product, photo, shot, onSpin }) {
  const picture = photo ?? shot

  return (
    <article className="card">
      <button
        type="button"
        className="card-art"
        aria-label={`View ${product.title} in 360 degrees`}
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
        <p className="card-brand">{brandOf(product)}</p>
        <h3 className="card-title">{product.title}</h3>
        <p className="card-desc">{product.desc}</p>
        <div className="card-foot">
          <p className="price">
            <span className="rs">Rs.</span>
            {formatPrice(product.price)}
            <span className="per">/ {product.unit}</span>
          </p>
          <a className="wa" href={whatsappLink(product)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {/* the tail is dropped on very narrow phones, where the full
                label is wider than the card; the icon still says where it goes */}
            <span>
              Order<span className="wa-tail"> on WhatsApp</span>
            </span>
          </a>
        </div>
      </div>
    </article>
  )
}
