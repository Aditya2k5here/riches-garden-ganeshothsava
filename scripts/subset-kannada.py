"""
Subsets the two Kannada faces down to the characters this site actually shows.

    python scripts/subset-kannada.py

Why: the site is bilingual, but the Kannada it carries is a few hundred
characters of headings and labels. The full faces are ~90 kB each and each one
drags a ~28 kB Latin slice along behind it. Subsetting to the text in use
brings the pair to a few kB and drops the Latin requests entirely.

The character set is read out of content/ and components/ rather than being
maintained by hand, so it cannot drift away from the copy. Re-run this after
adding or editing any Kannada string.

Two things that are easy to get wrong and are handled here:

  * HarfBuzz decomposes Kannada vowel signs before substitutions run, so the
    component marks have to survive even though they never appear literally
    in the text — ೇ is ೆ+ೕ, ೋ is ೆ+ೂ+ೕ. Subsetting on the visible characters
    alone silently breaks the conjunct clusters, and it looks fine until you
    compare it with the original.
  * Only one weight is used, so the variable axis is pinned first. That alone
    is most of the saving.
"""

import pathlib
import re
import sys
import urllib.request

from fontTools.subset import main as pyftsubset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

FACES = [
    {
        "name": "noto-sans-kannada-subset",
        "url": (
            "https://fonts.gstatic.com/s/notosanskannada/v32/"
            "8vIh7xs32H97qzQKnzfeXycxXZyUmySvZWItmf1fe6TVmgoD4F-Yo3w.woff2"
        ),
    },
    {
        "name": "noto-serif-kannada-subset",
        "url": (
            "https://fonts.gstatic.com/s/notoserifkannada/v30/"
            "v6-JGZHLJFKIhClqUYqXDiWqpxQxWSPCTY4CEsI.woff2"
        ),
    },
]

# Every Kannada combining mark, matra and virama, plus the joiners and the
# dotted circle. A few hundred bytes, and without them the shaper has nothing
# to attach.
MARKS = "U+0CBC-0CD6,U+0CE2-0CE3,U+200C-200D,U+25CC"

SOURCE_DIRS = ["content", "components", "app"]
KANNADA = re.compile(r"[ಀ-೿‌‍]")

OUT_DIR = pathlib.Path("public/fonts")
CACHE = pathlib.Path(".cache")


def collect_text() -> str:
    """Every Kannada character that appears anywhere in the source."""
    found: set[str] = set()
    for directory in SOURCE_DIRS:
        root = pathlib.Path(directory)
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if path.suffix not in {".ts", ".tsx", ".css"}:
                continue
            found.update(KANNADA.findall(path.read_text(encoding="utf-8")))

    # Digits and punctuation appear inside Kannada runs too.
    found.update("0123456789 .,·:—–")
    return "".join(sorted(found))


def build(face: dict, text: str) -> None:
    cached = CACHE / f"{face['name']}-full.woff2"
    if not cached.exists():
        print(f"downloading {face['name']}")
        request = urllib.request.Request(
            face["url"], headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(request, timeout=60) as response:
            cached.write_bytes(response.read())

    before = cached.stat().st_size

    pinned = CACHE / f"{face['name']}-400.ttf"
    font = TTFont(cached)
    if "fvar" in font:
        instantiateVariableFont(
            font, {"wght": 400}, inplace=True, updateFontNames=True
        )
    font.flavor = None
    font.save(pinned)

    out = OUT_DIR / f"{face['name']}.woff2"
    pyftsubset(
        [
            str(pinned),
            f"--text={text}",
            f"--unicodes={MARKS}",
            f"--output-file={out}",
            "--flavor=woff2",
            "--layout-features+=akhn,blwf,half,pstf,vatu,cjct,rphf,pres,abvs,blws,psts,haln",
            "--no-hinting",
            "--drop-tables+=DSIG",
        ]
    )

    after = out.stat().st_size
    print(
        f"{out}  {after / 1024:.1f} kB "
        f"(from {before / 1024:.1f} kB — {100 - after / before * 100:.0f}% smaller)"
    )


def main() -> int:
    CACHE.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    text = collect_text()
    kannada_only = [c for c in text if "ಀ" <= c <= "೿"]
    print(f"{len(kannada_only)} distinct Kannada characters in use")

    for face in FACES:
        build(face, text)

    return 0


if __name__ == "__main__":
    sys.exit(main())
