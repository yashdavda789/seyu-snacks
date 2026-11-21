# Product photographs

Drop an image here named after the product's `slug` and it replaces that
product's 3D render.

```
bikaneri-bhujia.jpg
lemon-bhujia.png
bhavnagari-gathiya.webp
```

That is the whole step — Vite picks the file up at build time, so the page
never requests a photo that isn't there.

**To change a photo**, overwrite the file with a new one of the same name. If
you switch extension (`.jpg` to `.png`), delete the old file or it keeps
winning. With `npm run dev` running, the change appears immediately.

**Worth knowing:** a photo replaces the *card* picture. Tapping the product
still opens the 3D model in 360, so that product's card and its 360 stop
being the same image. Products with no photo keep both in step, which is how
the site ships.

- `.jpg`, `.jpeg`, `.png`, `.webp` all work
- square images fit the card best, around 800x800
- any product without a photo keeps its 3D render, so you can add them one at
  a time

Slugs are in `src/data/products.js`. To list them all:

```bash
node -e "import('./src/data/products.js').then(m=>m.PRODUCTS.forEach(p=>console.log(p.slug)))"
```

Shooting tip: keep them consistent — same surface, same light, same distance —
or the grid looks patchy. A sheet of white or brown paper near a window, shot
from directly above, is usually enough.

Only use photographs you own or have licensed.
