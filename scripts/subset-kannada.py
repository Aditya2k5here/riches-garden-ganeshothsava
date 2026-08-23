"""
Subsets Noto Sans Kannada down to the handful of glyphs this site actually
shows, and writes it to public/fonts/ for next/font/local.

Why: the committee's Kannada name appears twice on the site — about thirty
characters in total. The full Kannada face is ~89 kB, plus a ~28 kB Latin
slice the browser fetches alongside it. Subsetting to the text in use brings
that to a few kB and removes the Latin request entirely.

Run only when the Kannada strings in content/site.ts change:
    python scripts/subset-kannada.py
"""

import pathlib
import sys
import urllib.request

from fontTools.subset import main as pyftsubset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# The Kannada actually rendered anywhere on the site. Keep in sync with
# `festival.organisationKannada` in content/site.ts.
TEXT = "ರಿಚ್ಚಸ್ ಗಾರ್ಡನ್ ಗಣೇಶೋತ್ಸವ ಸಮಿತಿ"

# Noto Sans Kannada, variable weight axis, kannada subset.
SOURCE = (
    "https://fonts.gstatic.com/s/notosanskannada/v32/"
    "8vIh7xs32H97qzQKnzfeXycxXZyUmySvZWItmf1fe6TVmgoD4F-Yo3w.woff2"
)

# Every Kannada combining mark, matra and virama. A few hundred bytes, and
# without them the shaper has nothing to attach.
MARKS = "U+0CBC-0CD6,U+0CE2-0CE3,U+200C-200D,U+25CC"

OUT = pathlib.Path("public/fonts/noto-sans-kannada-subset.woff2")
CACHE = pathlib.Path(".cache/noto-sans-kannada-full.woff2")


def main() -> int:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)

    if not CACHE.exists():
        print(f"downloading {SOURCE.rsplit('/', 1)[-1]}")
        request = urllib.request.Request(
            SOURCE, headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            CACHE.write_bytes(response.read())

    before = CACHE.stat().st_size

    # Only one weight is ever used, so pin the variable axis before subsetting
    # — a static instance drops the whole variation machinery.
    pinned = pathlib.Path(".cache/noto-sans-kannada-400.ttf")
    font = TTFont(CACHE)
    if "fvar" in font:
        instantiateVariableFont(font, {"wght": 400}, inplace=True, updateFontNames=True)
    font.flavor = None
    font.save(pinned)

    pyftsubset(
        [
            str(pinned),
            f"--text={TEXT}",
            # HarfBuzz decomposes Kannada vowel signs before GSUB runs, so the
            # component marks have to survive even though they never appear
            # literally in the text: ೇ is ೆ+ೕ, ೋ is ೆ+ೂ+ೕ. Subsetting on the
            # text alone drops them and the conjunct clusters collide.
            f"--unicodes={MARKS}",
            f"--output-file={OUT}",
            "--flavor=woff2",
            # Kannada needs its shaping tables kept, or conjuncts and vowel
            # signs break. This is the whole reason not to subset by codepoint
            # alone.
            "--layout-features+=akhn,blwf,half,pstf,vatu,cjct,rphf,pres,abvs,blws,psts,haln",
            "--no-hinting",
            "--drop-tables+=DSIG",
        ]
    )

    after = OUT.stat().st_size
    print(
        f"{OUT}  {after / 1024:.1f} kB  "
        f"(from {before / 1024:.1f} kB — {100 - after / before * 100:.0f}% smaller)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
