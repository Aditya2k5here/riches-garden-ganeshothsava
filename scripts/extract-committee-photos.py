"""
Pulls the committee portraits out of the printed brochure PDF.

    python scripts/extract-committee-photos.py

The names are not hard-coded against image ids. The script reads the caption
words and the portrait rectangles off the page and pairs them by position —
each portrait takes the caption whose start is nearest its horizontal centre,
within the same row. That way the mapping is *derived* from the document
rather than asserted by me, and if the brochure is ever re-exported with the
images in a different internal order, this still gets it right instead of
silently putting the wrong face against a name.

It prints every pairing so it can be checked by eye before anything ships.
"""

import pathlib
import re
import sys
import unicodedata

import pymupdf

PDF = pathlib.Path("References/2026 brochure.pdf")
OUT = pathlib.Path(".cache/committee-raw")

# The page holding the "Committee Members" grid, and the band of the page the
# portraits occupy. Everything above is the contributions and volunteers text.
PAGE = 2
GRID_TOP = 240

# Portraits sit in rows about 47pt apart, with each caption printed roughly
# 2pt under its portrait. The window has to be well inside that row pitch:
# allow 60pt and a portrait in row one can reach the caption belonging to
# row two, which is exactly how the first run mismatched four faces.
CAPTION_GAP = 14


def slug(name: str) -> str:
    text = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def main() -> int:
    if not PDF.exists():
        print(f"missing {PDF}")
        return 1

    doc = pymupdf.open(PDF)
    page = doc[PAGE]

    # --- portraits -----------------------------------------------------------
    # The page background and the decorative art are also images, so keep only
    # the small ones inside the grid band.
    portraits = []
    for image in page.get_images(full=True):
        xref = image[0]
        for rect in page.get_image_rects(xref):
            if rect.y0 > GRID_TOP and rect.width < 60 and rect.height < 60:
                portraits.append((xref, rect))

    # --- captions ------------------------------------------------------------
    # Words come back in reading order, which is not reliable across columns,
    # so names are rebuilt from x positions: a new name starts at each "Mr."
    words = sorted(page.get_text("words"), key=lambda w: (round(w[1]), w[0]))
    captions = []
    current = None
    for x0, y0, _x1, _y1, word, *_ in words:
        if y0 < GRID_TOP:
            continue
        if word.startswith("Mr."):
            if current:
                captions.append(current)
            # "Mr.Shivappa" arrives with no space after the honorific.
            rest = word[3:].strip()
            current = {"x": x0, "y": y0, "parts": [rest] if rest else []}
        elif current:
            current["parts"].append(word)
    if current:
        captions.append(current)

    for caption in captions:
        caption["name"] = " ".join(caption["parts"]).strip()

    # --- pair them -----------------------------------------------------------
    pairs = []
    taken = set()
    for xref, rect in sorted(portraits, key=lambda p: (round(p[1].y0), p[1].x0)):
        centre = (rect.x0 + rect.x1) / 2
        candidates = [
            (i, c)
            for i, c in enumerate(captions)
            if i not in taken and 0 < c["y"] - rect.y1 < CAPTION_GAP
        ]
        if not candidates:
            print(f"  !! no caption under portrait at x={rect.x0:.0f} y={rect.y0:.0f}")
            continue
        index, best = min(candidates, key=lambda pair: abs(pair[1]["x"] - centre))
        taken.add(index)
        pairs.append((best["name"], xref, rect))

    missed = [c["name"] for i, c in enumerate(captions) if i not in taken]
    if missed:
        print(f"  !! captions with no portrait: {missed}")

    # --- write ---------------------------------------------------------------
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.iterdir():
        old.unlink()

    print(f"{len(pairs)} portraits\n")
    for name, xref, rect in pairs:
        data = doc.extract_image(xref)
        # Keep the real container; the brochure mixes PNG and JPEG.
        path = OUT / f"{slug(name)}.{data['ext']}"
        path.write_bytes(data["image"])
        print(
            f"  {name:<20} xref={xref:<4} {data['width']}x{data['height']} "
            f"{data['ext']:<4} -> {path.name}"
        )

    print(
        "\nRaw extracts written. Run `node scripts/prepare-committee-photos.mjs` "
        "to square and size them."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
