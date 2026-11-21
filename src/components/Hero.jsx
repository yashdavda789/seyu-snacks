export default function Hero({ count }) {
  return (
    <section className="hero">
      <div className="wrap">
        <p className="crumbs">
          <a href="#main">Home</a> / <span>Namkeen</span>
        </p>
        <p className="kicker">Spin it before you buy it</p>
        <h1>
          Namkeen that <span className="pop">hits different</span>
        </h1>
        <p className="hero-sub">
          Gathiya, chivda, sev and farsan from our own kadhai &mdash; small batches, fresh oil,
          spices ground in-house. Every item is modelled in 3D, so tap <strong>360&deg;</strong> and
          look at it from any angle before you order.
        </p>
        <ul className="tags">
          <li>{count} varieties</li>
          <li>1 Kg packs</li>
          <li>No preservatives</li>
          <li>360&deg; on every item</li>
          <li>Same-day dispatch</li>
        </ul>
      </div>
    </section>
  )
}
