"""
Pulls the committee portraits out of the printed invitation PDF.

    python scripts/extract-committee-photos.py

The names are not hard-coded against image ids. The script reads the caption
words and the portrait rectangles off the page and pairs them by position —
within each row, portraits and captions are both sorted left to right and
matched up, and the horizontal offset of every pair is printed so a bad match
is visible rather than silent. The mapping is therefore *derived* from the
document rather than asserted by me, and if the invitation is ever re-exported
with the images in a different internal order this still gets it right.

It also means the printed order is the page's own reading order — left to
right, top to bottom — which is the order the website lists them in.

TWO THINGS THIS PAGE DOES THAT A NAIVE EXTRACTOR GETS WRONG
-----------------------------------------------------------
1. The page background is laid down as six full-width horizontal bands, and
   the exporter clipped the portraits to those bands. Every portrait in the
   first row is therefore stored as *two* images — 594x550 above the seam at
   y=536.4 and 594x145 below it. Taken alone the top piece is a chinless
   crop. They are stitched back together here.

2. Content-stream order is not reading order. Pulling the captions out in the
   order the text happens to appear puts Thyagaraju Naidu and Phani Kumar
   last, when on the page they sit in the middle of rows two and three.
"""

import io
import pathlib
import re
import sys
import unicodedata

import pymupdf

PDF = pathlib.Path("References/Ganesha 2026 Final.pdf")
OUT = pathlib.Path(".cache/committee-raw")

# The page carrying the "Committee Members" grid, and the band of it the
# portraits occupy. Everything above is contributions, donors and volunteers.
PAGE = 2
GRID_TOP = 460

# Portraits are placed at about 63pt wide. The only other artwork below
# GRID_TOP is the full-width background, at 595pt.
MIN_W, MAX_W = 55, 75

# Rows are ~90pt apart and each caption is printed within a point or two of
# the portrait above it. A little slack below zero as well: the baselines
# wobble by up to 1.5pt, so a caption can sit fractionally above the bottom
# edge of its own portrait.
CAPTION_ABOVE = 3
CAPTION_BELOW = 12

# Two rects belong to the same portrait when they share a left edge and meet.
SAME_COLUMN = 2
SEAM = 2

# Rows are found by clustering y, not by assuming a pitch.
ROW_TOLERANCE = 12


def slug(name: str) -> str:
    text = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def tidy(name: str) -> str:
    """`Phani kumar` -> `Phani Kumar`, while leaving `E.P`, `T` and `V` alone."""
    return " ".join(
        word.capitalize() if word.islower() and len(word) > 1 else word
        for word in name.split()
    )


def cluster(values, tolerance):
    """Groups sorted numbers into runs, returning a value -> group index map."""
    groups = {}
    current = []
    for v in sorted(values):
        if current and v - current[-1] > tolerance:
            current = []
        current.append(v)
        groups[v] = len(groups) if len(current) == 1 else groups[current[0]]
    return groups


def main() -> int:
    if not PDF.exists():
        print(f"missing {PDF}")
        return 1

    doc = pymupdf.open(PDF)
    page = doc[PAGE]

    # --- portrait rectangles, stitched back across the band seam ------------
    pieces = []
    for image in page.get_images(full=True):
        xref = image[0]
        for rect in page.get_image_rects(xref):
            if rect.y0 > GRID_TOP and MIN_W < rect.width < MAX_W:
                pieces.append({"xrefs": [xref], "rect": rect})

    pieces.sort(key=lambda p: (round(p["rect"].x0), p["rect"].y0))

    portraits = []
    for piece in pieces:
        previous = portraits[-1] if portraits else None
        joins = (
            previous
            and abs(previous["rect"].x0 - piece["rect"].x0) < SAME_COLUMN
            and abs(previous["rect"].y1 - piece["rect"].y0) < SEAM
        )
        if joins:
            previous["xrefs"] += piece["xrefs"]
            previous["rect"] = previous["rect"] | piece["rect"]
        else:
            portraits.append(piece)

    # --- caption lines ------------------------------------------------------
    # A whole row of names shares one baseline, so grouping by baseline gives
    # a row, not a caption. Each row is then cut at every honorific, and each
    # caption is measured across its own words — the centre of the name is
    # what sits under the portrait, not the start of it.
    rows_of_words = {}
    for x0, y0, x1, _y1, word, *_ in page.get_text("words"):
        if y0 < GRID_TOP:
            continue
        rows_of_words.setdefault(round(y0 / 2), []).append((x0, x1, y0, word))

    captions = []
    for words in rows_of_words.values():
        current = None
        for x0, x1, y0, word in sorted(words):
            if word in ("Mr.", "Dr."):
                if current:
                    captions.append(current)
                # "Dr." is a title someone holds; "Mr." is a courtesy the site
                # drops everywhere, so keeping it would single people out at
                # random.
                current = {
                    "parts": ["Dr."] if word == "Dr." else [],
                    "x0": x0,
                    "x1": x1,
                    "y": y0,
                }
            elif current:
                current["parts"].append(word)
                current["x1"] = max(current["x1"], x1)
                current["y"] = min(current["y"], y0)
        if current:
            captions.append(current)

    captions = [
        {
            "name": tidy(" ".join(c["parts"])),
            "x": (c["x0"] + c["x1"]) / 2,
            "y": c["y"],
        }
        for c in captions
        if c["parts"] and c["parts"] != ["Dr."]
    ]

    # --- pair, row by row ---------------------------------------------------
    rows = cluster([p["rect"].y0 for p in portraits], ROW_TOLERANCE)
    by_row = {}
    for portrait in portraits:
        by_row.setdefault(rows[portrait["rect"].y0], []).append(portrait)

    pairs = []
    for row in sorted(by_row, key=lambda r: min(p["rect"].y0 for p in by_row[r])):
        members = sorted(by_row[row], key=lambda p: p["rect"].x0)
        bottom = max(p["rect"].y1 for p in members)
        beneath = sorted(
            (
                c
                for c in captions
                if -CAPTION_ABOVE < c["y"] - bottom < CAPTION_BELOW
            ),
            key=lambda c: c["x"],
        )
        if len(beneath) != len(members):
            print(
                f"  !! row at y={bottom:.0f}: {len(members)} portraits but "
                f"{len(beneath)} captions — not pairing this row"
            )
            continue
        for portrait, caption in zip(members, beneath):
            centre = (portrait["rect"].x0 + portrait["rect"].x1) / 2
            pairs.append((caption["name"], portrait, abs(caption["x"] - centre)))

    named = {name for name, _, _ in pairs}
    missed = [c["name"] for c in captions if c["name"] not in named]
    if missed:
        print(f"  !! captions with no portrait: {missed}")

    # --- write --------------------------------------------------------------
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.iterdir():
        old.unlink()

    print(f"{len(pairs)} portraits\n")
    for name, portrait, offset in pairs:
        # Stitched portraits have to be rebuilt from their pieces; a whole one
        # is written out byte for byte in the container the PDF stored it in.
        images = [doc.extract_image(x) for x in portrait["xrefs"]]
        path = OUT / f"{slug(name)}.{images[0]['ext']}"

        if len(images) == 1:
            path.write_bytes(images[0]["image"])
            size = f"{images[0]['width']}x{images[0]['height']}"
        else:
            from PIL import Image

            parts = [Image.open(io.BytesIO(i["image"])) for i in images]
            width = max(p.width for p in parts)
            joined = Image.new("RGB", (width, sum(p.height for p in parts)))
            y = 0
            for part in parts:
                joined.paste(part, (0, y))
                y += part.height
            joined.save(path, quality=97, subsampling=0)
            size = f"{joined.width}x{joined.height} (stitched from {len(parts)})"

        flag = "  <-- CHECK" if offset > 12 else ""
        print(f"  {name:<22} {size:<28} offset {offset:5.1f}pt{flag}")

    print(
        "\nRaw extracts written. Run `node scripts/prepare-committee-photos.mjs` "
        "to size them."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
