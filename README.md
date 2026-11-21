# Seyu Snacks & Namkeen

Storefront for a namkeen shop. 48 products, each one modelled in 3D and
viewable in 360, ordered over WhatsApp.

There are no stock photos here. Every product picture is geometry rendered in
the browser, so the imagery is original and nothing is downloaded.

```bash
npm install
npm run dev      # http://127.0.0.1:5178
npm run build    # static site in dist/
npm run preview  # serve the build
```

Requires Node 18 or newer.

---

## How it works

On load, one WebGL context renders every product to a still thumbnail, one per
idle slot so the page stays responsive. Tapping a product hands that same
context to the 360 dialog, where it spins live. One context does all of it —
48 canvases would melt a phone.

Tapping any product opens straight into its 360 view — same behaviour for
every item, no intermediate step.

A product's card picture falls back in three steps:

1. a real photograph, if one is in `src/photos/`
2. the 3D render, once it finishes
3. a tinted placeholder, until then

Out of the box no photographs are in use, so every card shows its own 3D
render and the 360 shows that same model. Card and 360 always match.

---

## Changing things

### Prices, names, descriptions

`src/data/products.js`. One object per product:

```js
{
  id: 0,
  slug: 'navratna-chivda',
  title: 'Navratna Chivda',
  price: 600,
  unit: '1 Kg',
  desc: 'A delicious and crunchy blend of rice flakes...',
  kind: 'mix',        // which 3D model
  tone: 'golden',     // which colour ramp
  vessel: 0,          // 0 tin, 1 katori, 2 heaped on the thali
  accent: 7541262,    // enamel colour, tin only
}
```

### The WhatsApp number

`WHATSAPP_NUMBER` and `WHATSAPP_DISPLAY`, top of `src/data/products.js`.
`WHATSAPP_NUMBER` is the wa.me form: country code, no `+`, no spaces.

### Countries and delivery time

`COUNTRIES` and `DELIVERY_DAYS` in the same file.

### Adding real photographs

Drop an image into `src/photos/` named after the product's slug:

```
src/photos/bikaneri-bhujia.jpg
```

That's the whole step. Vite picks it up at build time, so the page never
requests a photo that isn't there. `.jpg`, `.jpeg`, `.png` and `.webp` all
work. Square, around 800x800, fits the card best. Products without a photo
keep their render — you can add them one at a time.

**To change a photo later**, overwrite that file with a new one of the same
name. If you change the extension — say `.jpg` to `.png` — delete the old
file, or the old one keeps winning. While `npm run dev` is running, a new or
replaced file shows up immediately; no restart needed.

**One thing to know:** a photograph replaces the card picture only. The 360
still shows the 3D model, so that product's card and its 360 stop being the
same image. Every product without a photo keeps both in step. A sample photo
is parked in `samples/` if you want to try it — see `samples/README.md`.

### Colours and type

`src/styles.css`. Every colour is a token on `:root`, redefined once for dark
mode. Change the brand in one place and the whole site follows.

### The 3D itself

`src/three/studio.js`:

| What | Where |
|---|---|
| Shape of each snack | `FOOD` — 11 builders, 8 variants each |
| Colour ramps | `TONES` |
| How a pile settles | `SETTLE` — tilt, count, height |
| Serving dishes | `VESSELS` — tin, katori, heap |
| Lighting | `init()` |
| Reflections | `envEquirect()` |

Two things there are less obvious than they look:

- **Thumbnails are JPEG**, which has no alpha, so the backdrop is baked into
  the scene (`backdrop()`). A transparent canvas would flatten to black.
- **Metal needs something to reflect.** Brass with no environment map renders
  black, hence `envEquirect()` and the `PMREMGenerator` call in `init()`.

---

## Project layout

```
src/
  data/products.js       catalogue, WhatsApp link builder, countries
  three/studio.js        the 3D studio: models, lighting, spin
  hooks/useThumbnails.js renders each product to a still, progressively
  photos/                drop real photographs here (see above)
  components/            Header, Hero, ShipBand, Controls, ProductCard,
                         SpinModal, Footer, Logo, WhatsAppIcon
  styles.css             design tokens and all layout
  App.jsx                search, sort, grid, which product is spinning
```

---

## Deploying

`npm run build` produces a static `dist/` — no server, no database. It works
on Netlify, Cloudflare Pages, GitHub Pages, or any shared hosting. `base` is
`'./'` in `vite.config.js`, so the build also runs from a subfolder.

For a quick public test link: build, then drag the `dist` folder onto
<https://app.netlify.com/drop>.

---

## Known issue: npm audit

`npm audit` reports an esbuild advisory (GHSA-67mh-4wv8-2f99) via Vite 5.

- It affects the **dev server only**. A built site is unaffected.
- It lets a website you visit while `npm run dev` is running make requests to
  that dev server and read the responses.
- The real fix is Vite 7+, which needs Node 20+. On Node 18, Vite 5 is as far
  as this goes.

Mitigation in place: the dev server is bound to `127.0.0.1`, so it is not
reachable from the network. If you move to Node 20+, bump Vite and the
advisory clears.

---

## Credit

Product names, prices and descriptions were taken from a public catalogue as
reference data. Product photography is not included — supply your own, or let
the 3D renders stand in.
