export default function Logo({ className = 'logo' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Seyu Snacks and Namkeen">
      <defs>
        <linearGradient id="seyu-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="52%" stopColor="#DD7A1C" />
          <stop offset="100%" stopColor="#E8B33F" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="19" fill="url(#seyu-logo)" />
      <rect
        x="3"
        y="3"
        width="58"
        height="58"
        rx="19"
        fill="none"
        stroke="#FBF6EE"
        strokeOpacity=".22"
        strokeWidth="2"
      />
      <circle cx="51" cy="14" r="3" fill="#FFF3DC" opacity=".8" />
      <circle cx="13" cy="50" r="2.1" fill="#FFF3DC" opacity=".55" />
      <text
        x="32"
        y="46.5"
        textAnchor="middle"
        fill="#FFF6E6"
        fontFamily="'Baloo 2','Trebuchet MS',sans-serif"
        fontSize="42"
        fontWeight="800"
      >
        S
      </text>
    </svg>
  )
}
