#!/usr/bin/env python3
"""
Finishing touches for the built rulebook PDFs (run by book/build.mjs when Python
and PyMuPDF are available; the build still works without them).

  pdf-finish.py meta <pdf> [<pdf> ...]
      Set Author, Subject and Keywords (Chromium leaves them empty).
  pdf-finish.py spread <interior.pdf> <front.pdf> <back.pdf> <out.pdf> [inches-per-page]
      One print cover: back + spine + front, with 0.125in bleed on the outside
      edges. The spine width is the interior's page count times the paper's
      thickness (default 0.0025in a page; check your printer's spine calculator).
      A spine narrower than 0.25in gets no lettering, as most printers ask.
"""
import sys
import pymupdf

AUTHOR = "Richard Moore"
SUBJECT = "A tabletop roleplaying game of street cats, sticky paws and getting away with it"
KEYWORDS = "tabletop roleplaying game, cats, gang, robbery, getaway, family game"
BLEED = 0.125
SPINE_FILL = (0x1d / 255, 0x23 / 255, 0x42 / 255)   # --dark-deep
SPINE_INK = (1.0, 0.902, 0.651)                     # --accent-bright


def meta(paths):
    for p in paths:
        doc = pymupdf.open(p)
        m = doc.metadata or {}
        m.update(author=AUTHOR, subject=SUBJECT, keywords=KEYWORDS)
        doc.set_metadata(m)
        doc.saveIncr()
        doc.close()


def spread(interior, front, back, out, per_page=0.0025):
    pages = pymupdf.open(interior).page_count
    spine = round(pages * per_page, 4)
    f, b = pymupdf.open(front), pymupdf.open(back)
    fw, fh = f[0].rect.width, f[0].rect.height          # 8.75 x 11.25 in (bleed all round)
    bl = BLEED * 72
    half = fw - bl                                         # each cover without its spine-side bleed
    W, H = 2 * half + spine * 72, fh
    doc = pymupdf.open()
    pg = doc.new_page(width=W, height=H)
    # back cover on the left, front cover on the right; the spine sits between their trim lines
    pg.show_pdf_page(pymupdf.Rect(0, 0, half, H), b, 0, clip=pymupdf.Rect(0, 0, half, fh))
    pg.show_pdf_page(pymupdf.Rect(half + spine * 72, 0, W, H), f, 0, clip=pymupdf.Rect(bl, 0, fw, fh))
    sp = pymupdf.Rect(half, 0, half + spine * 72, H)
    pg.draw_rect(sp, color=None, fill=SPINE_FILL)
    if spine >= 0.25:
        title = "NINE LIVES GANG"
        pg.insert_textbox(sp, title, fontsize=min(14, spine * 72 * 0.55), color=SPINE_INK, rotate=270, align=1)
    doc.set_metadata({"title": f"Nine Lives Gang — print cover ({pages} pages, spine {spine}in)", "author": AUTHOR,
                      "subject": SUBJECT, "keywords": KEYWORDS})
    doc.save(out)
    print(f"spread: {out} — {W / 72:.3f}in x {H / 72:.3f}in, spine {spine}in for {pages} pages")


if __name__ == "__main__":
    cmd, *args = sys.argv[1:]
    if cmd == "meta":
        meta(args)
    elif cmd == "spread":
        spread(*args[:4], *(float(x) for x in args[4:5]))
    else:
        sys.exit(__doc__)
