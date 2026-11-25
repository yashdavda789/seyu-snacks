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

from PIL import Image, ImageChops

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
PHOTOS = ROOT / "src" / "photos"
EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}


def squared(src, side):
    """Return the image cropped to a centred square around its subject."""
    im = Image.open(src).convert("RGB")
    W, H = im.size

    # the four corners are background; use their average as the pad colour
    corners = [im.getpixel(p) for p in ((2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3))]
    bg = tuple(sum(c[i] for c in corners) // len(corners) for i in range(3))

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


def batch(folder, order_file, side, dry):
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
            img, orig, subj, _ = squared(src, side)
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

    order_file = None
    if "--order" in args:
        i = args.index("--order")
        order_file = args[i + 1]
        del args[i : i + 2]

    if "--batch" in args:
        i = args.index("--batch")
        print()
        batch(args[i + 1], order_file, side, dry)
        return

    if len(args) < 2:
        sys.exit(__doc__)

    src, dst = args[0], Path(args[1])
    img, orig, _, bg = squared(src, side)
    if dry:
        print(f"{orig[0]}x{orig[1]} -> {side}x{side}, pad {bg}  (dry run, nothing written)")
        return
    kb = save(img, dst)
    print(f"{orig[0]}x{orig[1]} -> {dst}  {side}x{side}, {kb} KB")


if __name__ == "__main__":
    main()
