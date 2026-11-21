/**
 * Real photographs, keyed by product slug.
 *
 * Drop a file in this folder named after the product's slug - for example
 * `bikaneri-bhujia.jpg` - and it replaces that product's 3D render. Nothing
 * else to wire up: Vite picks it up at build time, so the page never requests
 * a photo that isn't there.
 *
 * .jpg, .jpeg, .png and .webp all work. Square images (around 800x800) fit
 * the card best. Any product without a photo keeps its render.
 */
const files = import.meta.glob('./*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const PHOTOS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.replace(/^\.\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

export function photoFor(slug) {
  return PHOTOS[slug] ?? null
}
