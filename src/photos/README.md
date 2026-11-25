# Product photographs

One folder per product is already waiting here — 48 of them, named after the
products. Drop photos in and the site picks them up. Nothing else to edit.

```bash
npm run photos          # what every product is showing right now
```

Run that any time. It lists all 48 products, says whether each one has a 360,
a single photo or is still on its 3D render, and flags anything that will
not look right — a wrong filename, a picture that isn't square, a file heavy
enough to slow the page.

---

## Photo sizes — the short answer

| | Size | Weight | How many |
|---|---|---|---|
| **360 view** (what you want) | **800 × 800** square | **under 90 KB** each | **24 per product** |
| Single photo (no turn) | **1200 × 1200** square | under 250 KB | 1 |

JPEG, quality 80. Square matters — the card crops to a square, so anything
wider loses its sides.

Why 800 and not bigger: all 24 frames download before the first drag. At
800 × 800 / 90 KB that is about **2 MB per product**, which is fine. At
1500 × 1500 it would be 7 MB and the turn would stutter on a phone.

---

## Putting a 360 on a product

Shoot 24 photos going all the way round, number them, drop them in that
product's folder:

```
src/photos/bikaneri-bhujia/01.jpg
src/photos/bikaneri-bhujia/02.jpg
...
src/photos/bikaneri-bhujia/24.jpg
```

That is the whole step. Frame `01` becomes the picture on the main page, and
dragging across the opened view turns the product one full revolution. The
card and the 360 read the same files, so they can never disagree — replace a
frame and both change at once.

Delete the `README.txt` sitting in the folder once you have added photos.

### Shooting them

1. Put the bowl on something you can turn — a lazy susan, a plate on a round
   tray, even a stool.
2. Fix the camera on a tripod or propped against something. It must not move
   between shots or the product will appear to jump around.
3. Keep the light fixed too. Daylight from one window is fine; just don't
   move the lamp.
4. Turn the bowl a little, shoot, repeat, all the way round.
   - **24 frames = 15° per turn — smooth, and what to aim for**
   - 36 frames = 10° per turn, very smooth, 50% heavier
   - 12 frames = 30° per turn, visibly steppy but usable
5. Rename them `01.jpg` … `24.jpg` in shooting order and drop them in.

A phone on a tripod works. Keep every product on the same surface, in the
same light, at the same distance, or the grid looks patchy. A sheet of white
or brown paper near a window, shot from slightly above, is usually enough.

### Resizing them

If you have ImageMagick, this does a whole folder at once:

```bash
mogrify -resize 800x800^ -gravity center -extent 800x800 -quality 80 -format jpg src/photos/bikaneri-bhujia/*.jpg
```

That crops each frame to a centred square, scales it to 800 × 800 and saves
at quality 80. Check the result with `npm run photos`.

---

## Just one photo instead

A product can have a single picture rather than a set. Name the file after
the product and leave it loose, outside the folders:

```
src/photos/bikaneri-bhujia.jpg
```

It shows on the card and in the opened view. **It will not turn** — one
photograph holds one angle, and there is no honest way to make a second one
out of it. For the product to spin you need the 24 frames.

A product with no photo at all keeps its 3D model, which does spin.

---

## Changing a photo later

Overwrite the file with a new one of the same name. If you switch extension
— `.jpg` to `.png` — delete the old file or it keeps winning. With
`npm run dev` running the change appears immediately; no restart.

---

## Rules the code follows

- `.jpg`, `.jpeg`, `.png` and `.webp` all work. The extension doesn't matter,
  only the name before it.
- Folder names and filenames must match the product's **slug** exactly.
  `npm run photos` tells you when one doesn't.
- Inside a folder, frames sort by the number in the filename. `01.jpg`,
  `frame-01.jpg` and `bhujia_01.jpg` all work; `1.jpg … 24.jpg` sorts
  correctly too.
- Numbered loose files still work for one-offs:
  `bikaneri-bhujia-01.jpg … bikaneri-bhujia-24.jpg`.
- Mixing is fine. Give your best sellers a frame set, leave others a single
  photo, let the rest keep their 3D model. Add them one at a time.

Only use photographs you own or have licensed.

---

## All 48 folder names

These already exist under `src/photos/`. If you ever need to recreate them:

```bash
npm run photos -- --init
```

```
  navratna-chivda                 Navratna Chivda
  bikaneri-bhujia                 Bikaneri Bhujia
  lemon-bhujia                    Lemon Bhujia
  aloo-bhujia-sev                 Aloo Bhujia Sev
  potato-masala-chivda            Potato Masala Chivda
  sp-fafda                        SP. Fafda
  df-nylon-chivda                 DF Nylon Chivda
  bhavnagari-gathiya              Bhavnagari Gathiya
  bhajani-chakli                  Bhajani Chakli
  garlic-farsan                   Garlic Farsan
  kadipatta-farsan                Kadipatta Farsan
  farali-chivda                   Farali Chivda
  makai-chivda                    Makai Chivda
  schezwan-roll                   Schezwan Roll
  methi-puri                      Methi Puri
  nylon-papdi                     Nylon Papdi
  sp-bhakarwadi                   SP. Bhakarwadi
  sweet-boondi                    Sweet Boondi
  mora-sev                        Mora Sev
  ckp-karanji                     CKP Karanji
  dry-fruit-samosa                Dry Fruit Samosa
  sp-wheat-gul-poli               Sp. Wheat Gul Poli
  sweet-shankarpali               Sweet Shankarpali
  methi-thepla                    Methi Thepla
  butter-mathri                   Butter Mathri
  kadipatta-mathari               Kadipatta Mathari
  golden-farsan                   Golden Farsan
  manglori-mix-farsan             Manglori Mix Farsan
  moongdal                        Moongdal
  methi-matthi                    Methi Matthi
  palak-matthi                    Palak Matthi
  diet-bhel                       Diet Bhel
  bhakarwadi-big                  Bhakarwadi Big
  diet-corn-chivda                Diet Corn Chivda
  pravasi-chivda                  Pravasi Chivda
  dryfruit-mixture                Dryfruit Mixture
  garlic-sev                      Garlic Sev
  methi-ghatiya                   Methi Ghatiya
  homemade-poha-chivda            Homemade Poha Chivda
  kaju-bhajiya                    Kaju Bhajiya
  nylon-sev                       Nylon Sev
  special-dalmuth                 Special Dalmuth
  panchratna-mix-chivda           Panchratna Mix Chivda
  salted-boondi                   Salted Boondi
  chirote                         Chirote
  chanadal                        Chanadal
  anarse                          Anarse
  masala-moong                    Masala Moong
```
