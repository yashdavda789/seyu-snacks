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
          Namkeen, chivda, sev and mixtures from our own kadhai &mdash; small batches, fresh oil,
          spices ground in-house. Delivered <strong>anywhere in India</strong>, and to five
          countries. Tap any item to look at it from every angle before you order.
        </p>
        <ul className="tags">
          <li>{count} varieties</li>
          <li>All-India delivery</li>
          <li>1 Kg packs</li>
          <li>No preservatives</li>
          <li>Same-day dispatch</li>
        </ul>
      </div>
    </section>
  )
}
