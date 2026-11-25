/**
 * Real photographs, keyed by product slug.
 *
 * THREE WAYS TO USE THIS FOLDER. Pick one per product; mixing across
 * products is fine.
 *
 * 1. ONE PHOTO - a still picture, shown on the card and in the opened view.
 *
 *        src/photos/bikaneri-bhujia.jpg
 *
 * 2. A FOLDER OF FRAMES - a real photographic 360 that turns when dragged.
 *    Name the folder after the product and number the frames inside it.
 *    This is the tidy way once you are doing many products.
 *
 *        src/photos/bikaneri-bhujia/01.jpg
 *        src/photos/bikaneri-bhujia/02.jpg
 *        ...
 *        src/photos/bikaneri-bhujia/24.jpg
 *
 * 3. NUMBERED FILES - the same thing without a folder, for one-offs.
 *
 *        src/photos/bikaneri-bhujia-01.jpg ... bikaneri-bhujia-24.jpg
 *
 * Frame 01 becomes the card picture, so the card and the opened view can
 * never disagree. Any frame count works; 24 to 36 turns smoothly, 12 is
 * visibly steppy but readable.
 *
 * Nothing to wire up either way: Vite picks the files up at build time, so
 * the page never requests a photo that isn't there. A product with no photo
 * keeps its 3D model, which spins on its own.
 *
 * .jpg, .jpeg, .png and .webp all work.
 */

// Both patterns must be written out in full: Vite reads them at build time,
// so they cannot be built from variables or template strings.

// loose files:            src/photos/bikaneri-bhujia.jpg
const loose = import.meta.glob('./*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// one folder per product: src/photos/bikaneri-bhujia/01.jpg
const foldered = import.meta.glob('./*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** slug -> [{ order, key, url }], later sorted into shooting order */
const bySlug = {}

const add = (slug, order, key, url) => {
  ;(bySlug[slug] ??= []).push({ order, key, url })
}

// first digits anywhere in the name: "frame_07" -> 7, "02" -> 2, "a" -> null
const numberIn = (name) => {
  const m = name.match(/(\d{1,4})/)
  return m ? parseInt(m[1], 10) : null
}

for (const [path, url] of Object.entries(loose)) {
  const name = path.replace(/^\.\//, '').replace(/\.[^.]+$/, '')

  // "bikaneri-bhujia-07" -> slug "bikaneri-bhujia", frame 7
  const seq = name.match(/^(.+)-(\d{1,3})$/)
  if (seq) add(seq[1], parseInt(seq[2], 10), name, url)
  else add(name, 0, name, url)
}

for (const [path, url] of Object.entries(foldered)) {
  const [, slug, file] = path.match(/^\.\/([^/]+)\/(.+)$/) ?? []
  if (!slug) continue
  const name = file.replace(/\.[^.]+$/, '')
  // numbered frames sort by their number; anything else sorts by filename
  add(slug, numberIn(name) ?? 0, name, url)
}

for (const list of Object.values(bySlug)) {
  list.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key))
}

export const PHOTOS = Object.fromEntries(
  Object.entries(bySlug).map(([slug, list]) => [slug, list.map((f) => f.url)]),
)

/** Every frame for a product, in order. Empty when it has no photos. */
export function framesFor(slug) {
  return PHOTOS[slug] ?? []
}

/** The picture to show on the card: the only photo, or the first frame. */
export function photoFor(slug) {
  return PHOTOS[slug]?.[0] ?? null
}

/** True when there are enough frames to turn through. */
export function isSpinnable(slug) {
  return (PHOTOS[slug]?.length ?? 0) > 1
}
