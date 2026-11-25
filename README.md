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

Tapping any product opens straight into its larger view — same behaviour for
every item, no intermediate step.

What shows, on the card and in that larger view, is decided once by what is
in `src/photos/`:

| In `src/photos/` | Card | Opened view |
|---|---|---|
| `slug/01.jpg … slug/24.jpg` | frame 01 | photographic 360, drag to turn |
| `slug.jpg` | that photo | that photo, still |
| nothing | the 3D model | the 3D model, drag to spin |

Both places read the same source, so the card and the opened view always
match. Replacing a photo changes both at once.

A single photograph cannot spin — one image holds one angle. To get a
photographic 360, shoot the product on a turntable and number the frames;
`src/photos/README.md` has the full method.

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

`src/photos/` already holds one folder per product, named after it. Drop 24
photos shot all the way round into a folder and that product turns in 360:

```
src/photos/bikaneri-bhujia/01.jpg
src/photos/bikaneri-bhujia/02.jpg
...
src/photos/bikaneri-bhujia/24.jpg
```

That's the whole step — nothing to register, nothing to import. Frame `01`
becomes the picture on the main page.

| | Size | Weight | How many |
|---|---|---|---|
| **360 view** | **800 × 800** square | under **90 KB** each | **24** |
| Single photo, no turn | 1200 × 1200 square | under 250 KB | 1 |

For a still picture instead, leave one file loose, outside the folders:
`src/photos/bikaneri-bhujia.jpg`. It shows on the card and in the opened
view but will not turn — one photograph holds one angle.

```bash
npm run photos                # what all 48 are showing, and what to fix
npm run photos -- --shotlist  # the running order for a photo session
npm run photos -- --init      # recreate the 48 folders

# import a whole shoot: crops square, resizes, files under the right name
python3 -I scripts/square.py --batch ~/photos --order docs/shot-order.txt
```

The 3D renders are **placeholders**. They cannot look photographic — see
[docs/product-photography.md](docs/product-photography.md) for what to shoot
instead and how.

`npm run photos` reads every file's real dimensions and flags wrong
filenames, non-square pictures and anything heavy enough to slow the page.

**To change a photo later**, overwrite the file with a new one of the same
name. If you change the extension — say `.jpg` to `.png` — delete the old
file, or the old one keeps winning. While `npm run dev` is running, a new or
replaced file shows up immediately; no restart needed.

**The same files drive both views.** What is in that folder shows on the card
*and* in the view that opens when the product is tapped, so the two can never
disagree. Replace a frame and both change at once.

A product with no photograph shows its 3D model in both places instead, and
that model can be spun and tilted.

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
  photos/                one folder per product - drop photos in (see above)
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
