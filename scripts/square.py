"""Crop product photos square at the size the site wants.

Finds the subject against the studio background, centres it in a square with
a little breathing room, pads with the background colour if the square would
run off the edge, then resizes and saves.

ONE PHOTO

    python3 -I scripts/square.py shot.jpg src/photos/bikaneri-bhujia.jpg

A WHOLE SHOOT, files already named after the product

    python3 -I scripts/square.py --batch ~/photos

    Any file whose name starts with a slug is installed for that product, so
    bikaneri-bhujia.jpg, bikaneri-bhujia.HEIC and bikaneri-bhujia-2.jpg all
    land on the same product (the first one wins).

A WHOLE SHOOT, straight off the phone

    python3 -I scripts/square.py --batch ~/photos --order docs/shot-order.txt

    Photos are sorted by filename - which on a phone is shooting order - and
    matched to the slugs in that file, one per line. Shoot in the order of
    docs/shot-list.md and the names look after themselves. If you skipped
    something or shot one twice, edit the order file and run it again.

Add --dry-run to see what it would do without writing anything, and
--size N to use something other than 1200.

Needs Pillow:  pip3 install --user Pillow
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
PHOTOS = ROOT / "src" / "photos"
EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


#: the page colour, --bg in src/styles.css
PAGE = (0xF8, 0xF4, 0xEC)


def retint(im, bg, target, soft=14):
    """
    Shift a photo's studio background to exactly `target`.

    A shop photo comes back on near-white, and near-white is not the same
    near-white as the page. A three-step difference is enough to draw a
    faint rectangle around the picture. This moves the flat background onto
    the page colour and leaves everything else - including the soft shadow
    under the bowl - alone, fading out over `soft` levels so there is no
    visible edge where the mask ends.
    """
    if tuple(bg) == tuple(target):
        return im

    # how far each pixel is from the background it was shot on
    dist = ImageChops.difference(im, Image.new("RGB", im.size, tuple(bg))).convert("L")
    # 255 where it IS the background, fading to 0 as the subject begins
    mask = dist.point(lambda v: 255 if v <= 2 else (0 if v >= soft else int(255 * (soft - v) / (soft - 2))))
    return Image.composite(Image.new("RGB", im.size, tuple(target)), im, mask)


def decaption(im, bg, floor=0.74, limit=0.63, gap=46, pad=16):
    """
    Erase a product name burnt into the bottom-left of a photo.

    The name and the loose crumbs these photos scatter share the same rows
    AND run into each other horizontally, so neither brightness nor a plain
    box separates them. What does: read the ink column by column from the
    left and stop at the first gap wider than a word space - that gap is
    where the caption ends and the crumbs begin. `limit` caps how far right
    this can ever reach, for the two photos in a set where the longest name
    runs close enough to the crumbs to merge with them.

    Only the letters themselves are replaced, not the rectangle around
    them. The caption sits on top of the bowl's soft shadow, so painting
    out a whole box takes the shadow with it and leaves a pale panel with
    a hard edge where the real shadow carries on. The glyph mask is grown
    a few pixels to catch the anti-aliased rim, and each replaced pixel
    takes the colour of its own column from the clean row below, which
    follows the shading across the frame.
    """
    W, H = im.size

    # Find the top of the caption rather than assuming it: a name that runs
    # to two lines starts much higher than a one-liner. The probe window is
    # the far left, which holds lettering and never the crumbs, and rarely
    # the bowl. `floor` stops a stray dark pixel dragging the band up over
    # the picture.
    probe = (
        im.crop((30, int(H * 0.70), 230, H))
        .convert("L")
        .point(lambda v: 255 if v < 100 else 0)
    )
    found = probe.getbbox()
    y0 = max(int(H * floor), int(H * 0.70) + found[1] - 10) if found else int(H * 0.879)
    y1 = H

    band = im.crop((0, y0, W, y1)).convert("L").point(lambda v: 255 if v < 100 else 0)
    px = band.load()
    cols = [any(px[x, y] for y in range(band.height)) for x in range(W)]

    if not any(cols):
        return im, None

    first = cols.index(True)
    last, run = first, 0
    for x in range(first, W):
        if cols[x]:
            last, run = x, 0
        else:
            run += 1
            if run > gap:
                break

    right = min(last + pad, int(W * limit))
    area = (0, max(0, y0 - 6), right, min(H, y1 + 6))

    # the glyphs, grown to swallow their soft edges
    glyphs = im.crop(area).convert("L").point(lambda v: 255 if v < 120 else 0)
    glyphs = glyphs.filter(ImageFilter.MaxFilter(7))

    patch = im.crop(area)
    src = im.load()
    pd = patch.load()
    gm = glyphs.load()
    for x in range(area[2] - area[0]):
        fill = src[area[0] + x, H - 8]   # clean background, same column
        for y in range(area[3] - area[1]):
            if gm[x, y]:
                pd[x, y] = fill

    out = im.copy()
    out.paste(patch, area[:2])
    return out, area


def squared(src, side, bg_to=None, decap=False, pad_only=False):
    """Return the image cropped to a centred square around its subject."""
    im = Image.open(src).convert("RGB")
    W, H = im.size

    # the four corners are background; use their average as the pad colour
    corners = [im.getpixel(p) for p in ((2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3))]
    bg = tuple(sum(c[i] for c in corners) // len(corners) for i in range(3))

    # Retint FIRST, then erase the caption. The other way round, the patch
    # painted over the caption gets moved onto the target colour while the
    # soft shadow beside it - too far from the background to be retinted -
    # stays where it was, and the few levels between them draw the outline
    # of the patch.
    if bg_to:
        im = retint(im, bg, bg_to)
        bg = tuple(bg_to)

    if decap:
        im, _ = decaption(im, bg)

    if pad_only:
        # No subject hunting: centre the whole frame in a square and fill the
        # rest with the background. For a set shot to one template this beats
        # detection, which re-centres each photo slightly differently and
        # makes the grid jump about.
        n = max(W, H)
        sq = Image.new("RGB", (n, n), bg)
        sq.paste(im, ((n - W) // 2, (n - H) // 2))
        return sq.resize((side, side), Image.LANCZOS), (W, H), (W, H), bg

    # content = anything far enough from that background
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg)).convert("L")
    box = diff.point(lambda v: 255 if v > 18 else 0).getbbox() or (0, 0, W, H)

    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    # square big enough for the subject plus an 8% margin
    crop = int(max(x1 - x0, y1 - y0) * 1.08)
    left = round(cx - crop / 2)
    top = round(cy - crop / 2)

    out = Image.new("RGB", (crop, crop), bg)
    sx0, sy0 = max(left, 0), max(top, 0)
    sx1, sy1 = min(left + crop, W), min(top + crop, H)
    out.paste(im.crop((sx0, sy0, sx1, sy1)), (sx0 - left, sy0 - top))

    return out.resize((side, side), Image.LANCZOS), (W, H), (x1 - x0, y1 - y0), bg


def save(img, dst):
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, quality=85, optimize=True, progressive=True)
    return round(dst.stat().st_size / 1024)


def slugs():
    """Every product slug, read out of src/data/products.js."""
    text = (ROOT / "src" / "data" / "products.js").read_text(encoding="utf-8")
    out = []
    for chunk in text.split('"slug"')[1:]:
        out.append(chunk.split('"')[1])
    return out


def read_order(path):
    lines = Path(path).read_text(encoding="utf-8").splitlines()
    return [ln.strip() for ln in lines if ln.strip() and not ln.strip().startswith("#")]


def pictures(folder):
    files = [p for p in Path(folder).iterdir() if p.suffix.lower() in EXT and p.is_file()]
    return sorted(files, key=lambda p: p.name.lower())


def batch(folder, order_file, side, dry, bg_to=None, decap=False, pad_only=False):
    known = slugs()
    files = pictures(folder)
    if not files:
        sys.exit(f"No images in {folder}")

    pairs = []          # (slug, path)
    unmatched = []

    if order_file:
        order = read_order(order_file)
        bad = [s for s in order if s not in known]
        if bad:
            sys.exit("Not product slugs: " + ", ".join(bad[:6]))
        if len(files) != len(order):
            print(f"  ! {len(files)} photos but {len(order)} slugs in the order file.")
            print("    Pairing as far as they go - check the list below before trusting it.\n")
        pairs = list(zip(order, files))
        unmatched = files[len(order):]
    else:
        # longest slug first, so "bhakarwadi-big" wins over "bhakarwadi"
        by_len = sorted(known, key=len, reverse=True)
        taken = set()
        for f in files:
            stem = f.stem.lower()
            hit = next((s for s in by_len if stem.startswith(s)), None)
            if hit and hit not in taken:
                taken.add(hit)
                pairs.append((hit, f))
            else:
                unmatched.append(f)

    width = max((len(s) for s, _ in pairs), default=10)
    done = 0
    for slug, src in pairs:
        dst = PHOTOS / f"{slug}.jpg"
        if dry:
            print(f"  {slug.ljust(width)}  <-  {src.name}")
            continue
        try:
            img, orig, subj, _ = squared(src, side, bg_to, decap, pad_only)
        except Exception as exc:                       # noqa: BLE001
            print(f"  {slug.ljust(width)}  !! {src.name}: {exc}")
            continue
        # an existing .png/.webp for the same product would still win the glob
        for stale in PHOTOS.glob(f"{slug}.*"):
            if stale.suffix.lower() != ".jpg":
                stale.unlink()
        kb = save(img, dst)
        small = " (source is small)" if min(subj) < side * 0.7 else ""
        print(f"  {slug.ljust(width)}  <-  {src.name}  {orig[0]}x{orig[1]} -> {side}, {kb} KB{small}")
        done += 1

    for f in unmatched:
        print(f"  {'(no match)'.ljust(width)}  --  {f.name}")

    print()
    if dry:
        print(f"  Dry run: {len(pairs)} would be installed, {len(unmatched)} unmatched.")
    else:
        print(f"  Installed {done} photo(s) into src/photos/.")
    print("  Check them with: npm run photos\n")


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    args = [a for a in args if a != "--dry-run"]

    side = 1200
    if "--size" in args:
        i = args.index("--size")
        side = int(args[i + 1])
        del args[i : i + 2]

    # --page puts the background on the site's own cream; --bg RRGGBB on
    # anything else. Without either, the photo keeps the background it
    # arrived with.
    # --decap paints out a product name burnt into the bottom-left corner
    decap = "--decap" in args
    args = [a for a in args if a != "--decap"]

    # --pad keeps the whole frame and squares it with background instead of
    # cropping in on the subject
    pad_only = "--pad" in args
    args = [a for a in args if a != "--pad"]

    bg_to = None
    if "--page" in args:
        bg_to = PAGE
        args = [a for a in args if a != "--page"]
    if "--bg" in args:
        i = args.index("--bg")
        h = args[i + 1].lstrip("#")
        bg_to = tuple(int(h[k:k + 2], 16) for k in (0, 2, 4))
        del args[i:i + 2]

    order_file = None
    if "--order" in args:
        i = args.index("--order")
        order_file = args[i + 1]
        del args[i : i + 2]

    if "--batch" in args:
        i = args.index("--batch")
        print()
        batch(args[i + 1], order_file, side, dry, bg_to, decap, pad_only)
        return

    if len(args) < 2:
        sys.exit(__doc__)

    src, dst = args[0], Path(args[1])
    img, orig, _, bg = squared(src, side, bg_to, decap, pad_only)
    if dry:
        print(f"{orig[0]}x{orig[1]} -> {side}x{side}, pad {bg}  (dry run, nothing written)")
        return
    kb = save(img, dst)
    print(f"{orig[0]}x{orig[1]} -> {dst}  {side}x{side}, {kb} KB")


if __name__ == "__main__":
    main()
