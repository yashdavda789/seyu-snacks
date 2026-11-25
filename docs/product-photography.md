# Product photography — what to shoot, and why the renders can't do it

Written 25 November 2026, after looking at how sweedesi.com actually does it.

---

## 1. The hard limit on the 3D

The product images on the site right now are **3D models built from geometry
in the browser** — tubes, spheres and flattened discs piled into a bowl, lit
by three lights. They can be pushed further: better materials, more pieces,
softer shadows. They will still not look like photographs.

Nothing in that pipeline produces the things that make food look real:
crumbs, uneven frying, oil pooling in one spot, a chipped bowl edge, the
slightly wrong white balance of a kitchen window. Those come from a camera
pointed at actual food.

So: **the renders are placeholders.** They are good placeholders — every
product has one, they are consistent, they cost nothing and they ship with
the site. But they are not the finished thing, and no amount of tuning makes
them the finished thing.

---

## 2. What SweeDesi is actually doing — worth knowing

Their namkeen collection page, image by image:

| Filename on their CDN | What it is | Master size |
|---|---|---|
| `IMG20240513112938_….jpg` | a phone photo, 13 May 2024 | — |
| `IMG20240513112635_….jpg` | a phone photo, same session | — |
| `ChatGPTImageJul15_2026_11_52_04AM.png` | **AI-generated**, 15 July 2026 | 1254 × 1254 |
| `ChatGPTImageJul15_2026_11_55_49AM.png` | **AI-generated**, same session | 1254 × 1254 |
| `ChatGPTImageJul15_2026_10_51_30PM.png` | **AI-generated** | 1254 × 1254 |
| `ChatGPTImageJul15_2026_10_55_43PM.png` | **AI-generated** | 1254 × 1254 |
| `jeeravan-masala-ratan-sev-bhandar-….png` | supplied by the vendor | 1080 × 1080 |
| `10-Hing-Dal-4.jpg` | supplied by the vendor | 387 × 387 |

Four AI images on one collection page, uploaded under ChatGPT's default
filename. So the site being held up as the real-looking one is **part real
photos, part AI, part whatever the vendor sent** — including some at 387px,
which is smaller than anything on your site.

Two things follow from this:

1. You are not behind. Their bar is a phone camera and a window.
2. The images of theirs that read as real are the **phone photos** — not the
   AI ones, which have the same too-clean, too-even look you objected to.

---

## 3. What makes their real photos read as real

Looking at the two phone shots on that page:

- **The actual pouch is in frame**, label facing the camera, slightly angled
- Product is **spilled out of the pack** onto the surface next to it
- A **real cloth** underneath — a pink napkin, a woven mat
- **One window, off to the side.** Soft shadow falling one way, no ring light
- Props that belong in a kitchen: a steel thali, a ceramic jar
- Composition is **slightly off-centre and imperfect**

None of that is expensive. All of it is unavailable to a renderer.

---

## 4. The shot spec

Match the format they use, because it is what Shopify-style grids want:

| | Spec |
|---|---|
| Shape | **square**, 1:1 |
| Size | **1200 × 1200** (theirs run 1080–1254) |
| Format | JPEG, quality 80 |
| Weight | under 250 KB |
| Where it goes | `src/photos/<slug>.jpg` |

### Setup — about ten minutes to build, then it stays put

1. **A table next to a window.** Daytime, no direct sun. Turn every
   electric light off — mixing window light with a tube light is what makes
   home photos go green.
2. **Surface:** a wooden board, a brown paper sheet, or a plain cloth. Pick
   one and use it for all 48, or the grid looks patchy.
3. **Bowl:** one wooden or steel bowl, used for every product. Same bowl
   every time is what makes a catalogue look like a catalogue.
4. **Camera:** your phone. Propped on a stack of books so it does not move.
   Shoot from about 30–40° above the bowl, not straight down.
5. **Fill the bowl properly** — heaped, spilling slightly over the rim. A
   half-empty bowl looks mean.
6. **Spill a little next to it** and put the pouch in frame if you have
   printed packaging.
7. Tap on the food to focus, drop the exposure a touch if the highlights
   blow out, shoot 3–4 frames, pick the best.

### The running order

`docs/shot-list.md` has all 48 grouped by what they look like — all the
chivdas together, all the sev together, and so on — so one bowl setup covers
a whole group and you reset the table 11 times instead of 48. Keep it open on
your phone and tick as you go.

```bash
npm run photos -- --shotlist     # regenerate it if the catalogue changes
```

### Afterwards — importing the whole shoot

Copy the photos off your phone into any folder, then one command crops every
one square, resizes it, and files it under the right product name:

```bash
python3 -I scripts/square.py --batch ~/photos --order docs/shot-order.txt
```

Photos sort by filename, which on a phone is the order you took them, and
match up with the slugs in `docs/shot-order.txt` — the same order as the
shot list. **Shoot in that order and you never rename a file.**

Add `--dry-run` first to see the pairing before anything is written:

```bash
python3 -I scripts/square.py --batch ~/photos --order docs/shot-order.txt --dry-run
```

If you skipped a product or shot one twice, edit `docs/shot-order.txt` to
match what you actually shot and run it again.

If you would rather name the files yourself, drop the `--order` and it
matches on the name instead — `bikaneri-bhujia.jpg`, `bikaneri-bhujia.HEIC`
and `bikaneri-bhujia-2.jpg` all land on the right product, and anything it
does not recognise is listed and left alone.

One photo at a time still works:

```bash
python3 -I scripts/square.py shot.jpg src/photos/bikaneri-bhujia.jpg
```

Then check the whole set:

```bash
npm run photos
```

It reads each file's real dimensions and flags anything not square, under
1200px, or too heavy.

The script needs Pillow: `pip3 install --user Pillow`.

---

## 5. Three ways to get there

| Route | Cost | Time | Result |
|---|---|---|---|
| **Shoot them yourself** | ~0 | a Sunday for all 48 | Best. Real product, real brand, no licence worries |
| **Licensed stock** | ₹50–500/image | an afternoon | Fine, but generic — and the same shots appear on competitors' sites |
| **Hire a food photographer** | ₹15–40k for 48 | a week | Best quality; worth it once you know which 20 products actually sell |

My recommendation: **shoot them yourself, in one session, starting with your
ten best sellers.** Leave the rest on renders until those ten are live. If
the business works, pay a photographer to reshoot properly later.

A note on the third route in your shortlist: lifting product photographs
from sweedesi.com (or from Prashant Corner, or from Amazon listings) is not
an option I will set up. They are someone else's copyrighted images, mostly
of someone else's products, and putting them on a storefront is both
infringement and a false claim about what you are selling. Licensed stock
is the legitimate version of the same shortcut.

---

## 6. What happens on the site as photos arrive

Nothing needs changing. Drop `bikaneri-bhujia.jpg` into `src/photos/` and
that product switches from its render to the photo, on the card and in the
opened view, at the next reload. Products without a photo keep their render,
so the grid never has a hole in it while you work through the list.

See `src/photos/README.md` for the mechanics, including the 24-frame folder
if you ever want a real spinning 360.
