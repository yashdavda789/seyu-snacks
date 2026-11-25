#!/usr/bin/env node
/**
 * Photo status report.
 *
 *     npm run photos
 *
 * Walks src/photos/ and says, for every one of the 48 products, whether it
 * has a 360 frame set, a single photograph, or is still showing its 3D
 * render. Then flags anything that will not look right: a misspelled slug,
 * a picture that is not square, a file heavy enough to slow the page.
 *
 * With --init it instead creates one empty folder per product, ready for
 * you to drop frames into:
 *
 *     npm run photos -- --init
 *
 * With --shotlist it writes docs/shot-list.md: all 48 products grouped by
 * what they look like, so one bowl setup covers a whole group.
 *
 *     npm run photos -- --shotlist
 *
 * No dependencies - image sizes are read straight out of the file headers.
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(ROOT, 'src', 'photos')
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp'])

// ---------------------------------------------------------------- targets

const TARGET = {
  single: { px: 1200, kb: 250 },
  frame: { px: 800, kb: 90 },
  frames: { min: 12, good: 24 },
}

// -------------------------------------------------- image size from header

function dimensions(file) {
  let buf
  try {
    buf = readFileSync(file)
  } catch {
    return null
  }

  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }
  }

  // JPEG - walk the segment markers looking for a start-of-frame
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i += 1; continue }
      const marker = buf[i + 1]
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2
        continue
      }
      const len = buf.readUInt16BE(i + 2)
      const sof = marker >= 0xc0 && marker <= 0xcf &&
        marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (sof) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
      i += 2 + len
    }
    return null
  }

  // WebP - three sub-formats, each stores the size differently
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buf.toString('ascii', 12, 16)
    if (kind === 'VP8X') {
      return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) }
    }
    if (kind === 'VP8L' && buf[20] === 0x2f) {
      const b = [buf[21], buf[22], buf[23], buf[24]]
      return {
        w: 1 + (((b[1] & 0x3f) << 8) | b[0]),
        h: 1 + (((b[3] & 0x0f) << 10) | (b[2] << 2) | ((b[1] & 0xc0) >> 6)),
      }
    }
    if (kind === 'VP8 ' && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff }
    }
  }

  return null
}

// ----------------------------------------------------------- scan the dir

const numberIn = (name) => {
  const m = name.match(/(\d{1,4})/)
  return m ? parseInt(m[1], 10) : null
}

/** slug -> [{ order, key, path }] */
function scan() {
  const found = {}
  if (!existsSync(DIR)) return found

  const add = (slug, order, key, path) => {
    ;(found[slug] ??= []).push({ order, key, path })
  }

  for (const entry of readdirSync(DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const f of readdirSync(join(DIR, entry.name))) {
        if (!EXT.has(extname(f).toLowerCase())) continue
        const name = basename(f, extname(f))
        add(entry.name, numberIn(name) ?? 0, name, join(DIR, entry.name, f))
      }
      continue
    }
    if (!EXT.has(extname(entry.name).toLowerCase())) continue
    const name = basename(entry.name, extname(entry.name))
    const seq = name.match(/^(.+)-(\d{1,3})$/)
    if (seq) add(seq[1], parseInt(seq[2], 10), name, join(DIR, entry.name))
    else add(name, 0, name, join(DIR, entry.name))
  }

  for (const list of Object.values(found)) {
    list.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key))
  }
  return found
}

// -------------------------------------------------------------- the report

const { PRODUCTS } = await import(pathToFileURL(join(ROOT, 'src', 'data', 'products.js')))

// --init: one empty folder per product, each with a note inside so the
// folder survives a git commit (git does not track empty directories).
if (process.argv.includes('--init')) {
  let made = 0
  for (const p of PRODUCTS) {
    const dir = join(DIR, p.slug)
    if (existsSync(dir)) continue
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'README.txt'),
      `${p.title}\n\n` +
        `Drop the 360 frames in here, numbered in shooting order:\n` +
        `  01.jpg  02.jpg  03.jpg ... 24.jpg\n\n` +
        `800x800 square, under 90 KB each, JPEG quality 80.\n` +
        `Frame 01 becomes the picture on the card.\n\n` +
        `Delete this file once you add the photos.\n`,
    )
    made += 1
  }
  console.log(`\n  Created ${made} folder(s) under src/photos/.`)
  console.log(`  Drop 01.jpg ... 24.jpg into each one, then run: npm run photos\n`)
  process.exit(0)
}

// --shotlist: the running order for a photo session. Products are grouped by
// shape, because one bowl, one surface and one camera position cover a whole
// group - re-setting between every product is what makes a shoot take a day.
if (process.argv.includes('--shotlist')) {
  const GROUPS = [
    ['mix', 'Chivda and mixtures', 'Heap it high and let a few pieces spill over the rim.'],
    ['disc', 'Puris, mathris and papdi', 'Stack a few leaning against each other, not flat.'],
    ['strand', 'Sev and bhujia', 'Pile loose so the strands catch light; press it down and it goes flat.'],
    ['bean', 'Dals and whole pulses', 'Fill to the rim - these settle lower than they look.'],
    ['stick', 'Gathiya, fafda and rolls', 'Lay a few across the top so the shape reads.'],
    ['wheel', 'Bhakarwadi', 'Turn two or three spiral-side up.'],
    ['bead', 'Boondi', 'Mounded; these roll, so shoot soon after filling.'],
    ['crescent', 'Karanji and samosa', 'Three or four is plenty - do not crowd them.'],
    ['diamond', 'Shankarpali and anarse', 'Fan them out slightly.'],
    ['spiral', 'Chakli', 'One upright against the rim, the rest stacked.'],
    ['cashew', 'Kaju bhajiya', 'Shallow pile, shot a touch lower than the rest.'],
  ]

  const lines = [
    '# Shot list',
    '',
    'Generated by `npm run photos -- --shotlist`. Tick as you go.',
    '',
    'Grouped by what each product looks like, so one bowl setup covers a whole',
    'group. Work down the list in order and you reset the table 11 times, not 48.',
    '',
    'Spec: **square, 1200 × 1200, JPEG, under 250 KB**. Full method in',
    '[product-photography.md](product-photography.md).',
    '',
    '**Shoot in this order** and the import can name the files for you — see',
    '`--order` in that document.',
    '',
  ]

  let n = 0
  for (const [kind, heading, tip] of GROUPS) {
    const items = PRODUCTS.filter((p) => p.kind === kind)
    if (!items.length) continue
    lines.push(`## ${heading}  <small>(${items.length})</small>`, '', `*${tip}*`, '')
    for (const p of items) {
      n += 1
      lines.push(`- [ ] **${String(n).padStart(2, '0')}. ${p.title}** — \`${p.slug}.jpg\``)
    }
    lines.push('')
  }

  // any product whose kind is not in GROUPS still has to be shot
  const covered = new Set(GROUPS.map(([k]) => k))
  const rest = PRODUCTS.filter((p) => !covered.has(p.kind))
  if (rest.length) {
    lines.push('## Everything else', '')
    for (const p of rest) {
      n += 1
      lines.push(`- [ ] **${String(n).padStart(2, '0')}. ${p.title}** — \`${p.slug}.jpg\``)
    }
    lines.push('')
  }

  lines.push(`${n} products in all.`, '')

  // the same order as a plain list, for `square.py --batch --order`
  const order = [
    '# Shooting order, one slug per line.',
    '# Feed this to: python3 -I scripts/square.py --batch <folder> --order docs/shot-order.txt',
    '# Edit it to match what you actually shot, then re-run.',
    '',
    ...GROUPS.flatMap(([k]) => PRODUCTS.filter((p) => p.kind === k).map((p) => p.slug)),
    ...rest.map((p) => p.slug),
    '',
  ]

  mkdirSync(join(ROOT, 'docs'), { recursive: true })
  writeFileSync(join(ROOT, 'docs', 'shot-list.md'), lines.join('\n'))
  writeFileSync(join(ROOT, 'docs', 'shot-order.txt'), order.join('\n'))

  console.log(`\n  Wrote docs/shot-list.md and docs/shot-order.txt (${n} products).\n`)
  process.exit(0)
}

const found = scan()

const kb = (p) => Math.round(statSync(p).size / 1024)
const pad = (s, n) => String(s).padEnd(n)

const warnings = []
const spin = []
const still = []
const none = []

for (const p of PRODUCTS) {
  const list = found[p.slug] ?? []
  if (list.length > 1) spin.push([p, list])
  else if (list.length === 1) still.push([p, list])
  else none.push(p)
}

console.log('')
console.log(`  ${pad('PRODUCT', 26)} ${pad('SHOWS', 22)} SIZE`)
console.log(`  ${'-'.repeat(60)}`)

const row = (p, shows, size) => console.log(`  ${pad(p.slug, 26)} ${pad(shows, 22)} ${size}`)

for (const [p, list] of spin) {
  const total = list.reduce((n, f) => n + kb(f.path), 0)
  const d = dimensions(list[0].path)
  row(p, `360, ${list.length} frames`, `${d ? `${d.w}x${d.h}, ` : ''}${total} KB total`)

  if (list.length < TARGET.frames.min) {
    warnings.push(`${p.slug}: only ${list.length} frames - the turn will look steppy, aim for ${TARGET.frames.good}`)
  }
  if (d && d.w !== d.h) {
    warnings.push(`${p.slug}: frames are ${d.w}x${d.h}, not square - they will be cropped on the card`)
  }
  const heavy = list.filter((f) => kb(f.path) > TARGET.frame.kb)
  if (heavy.length) {
    warnings.push(`${p.slug}: ${heavy.length} frame(s) over ${TARGET.frame.kb} KB - every frame loads before the first drag`)
  }
}

for (const [p, list] of still) {
  const f = list[0]
  const d = dimensions(f.path)
  const size = kb(f.path)
  row(p, 'photo, no turn', `${d ? `${d.w}x${d.h}, ` : ''}${size} KB`)

  warnings.push(`${p.slug}: one photo cannot turn - add a numbered folder to give it a 360`)
  if (d && d.w !== d.h) {
    warnings.push(`${p.slug}: ${d.w}x${d.h} is not square - it will be cropped on the card`)
  }
  if (d && d.w < TARGET.single.px) {
    warnings.push(`${p.slug}: ${d.w}px wide - below ${TARGET.single.px}px it looks soft on a retina screen`)
  }
  if (size > TARGET.single.kb) {
    warnings.push(`${p.slug}: ${size} KB - over ${TARGET.single.kb} KB, re-save at JPEG quality 80`)
  }
}

for (const p of none) row(p, '3D render', '-')

// slugs on disk that match no product - almost always a typo
const slugs = new Set(PRODUCTS.map((p) => p.slug))
for (const slug of Object.keys(found)) {
  if (!slugs.has(slug)) {
    warnings.push(`"${slug}" matches no product - check the spelling against src/data/products.js`)
  }
}

console.log('')
console.log(`  ${spin.length} with 360   ${still.length} still photo   ${none.length} on 3D render   (${PRODUCTS.length} products)`)

if (warnings.length) {
  console.log('')
  console.log('  Worth fixing')
  console.log(`  ${'-'.repeat(60)}`)
  for (const w of warnings) console.log(`  - ${w}`)
}

console.log('')
console.log(`  Target: 360 frames ${TARGET.frame.px}x${TARGET.frame.px} square, under ${TARGET.frame.kb} KB each, ${TARGET.frames.good} of them.`)
console.log(`          Single photo ${TARGET.single.px}x${TARGET.single.px} square, under ${TARGET.single.kb} KB.`)
console.log(`  Full instructions: src/photos/README.md`)
console.log('')
