"""
Generates the "Stardew Valley Gift Cheat Sheet" PDF lead magnet.

This is an OPTIONAL helper — you only need it if you want to regenerate or edit
the downloadable cheat sheet. The website itself does not run this script.

Usage:
    python -m pip install reportlab
    python scripts/generate-cheatsheet.py

Output: public/downloads/stardew-valley-gift-cheat-sheet.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)

# --- Cozy Game Guide palette ----------------------------------------------
SAGE = colors.HexColor("#5f8470")
CLAY = colors.HexColor("#cd7d57")
CREAM = colors.HexColor("#fbf7f0")
ACCENT_SOFT = colors.HexColor("#f3e2d6")
INK = colors.HexColor("#3c372f")
INK_MUTED = colors.HexColor("#756d62")
LINE = colors.HexColor("#e8e0d2")
WHITE = colors.white

SITE = "cozygameguide.com"

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "downloads")
os.makedirs(OUT_DIR, exist_ok=True)
OUT = os.path.join(OUT_DIR, "stardew-valley-gift-cheat-sheet.pdf")

doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    topMargin=0.45 * inch, bottomMargin=0.45 * inch,
    leftMargin=0.6 * inch, rightMargin=0.6 * inch,
    title="Stardew Valley Gift Cheat Sheet", author="Cozy Game Guide",
)
W = doc.width

# --- styles ----------------------------------------------------------------
title = ParagraphStyle("title", fontName="Times-Bold", fontSize=25, leading=28,
                       textColor=WHITE, alignment=TA_CENTER)
subtitle = ParagraphStyle("subtitle", fontName="Helvetica", fontSize=10.5, leading=14,
                          textColor=CREAM, alignment=TA_CENTER, spaceBefore=3)
section = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=13, leading=16,
                         textColor=SAGE, spaceBefore=10, spaceAfter=5)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, textColor=INK)
body_b = ParagraphStyle("body_b", fontName="Helvetica-Bold", fontSize=10, leading=14, textColor=INK)
cell_h = ParagraphStyle("cell_h", fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=WHITE)
small = ParagraphStyle("small", fontName="Helvetica", fontSize=8.5, leading=12,
                       textColor=INK_MUTED, alignment=TA_CENTER)
box_h = ParagraphStyle("box_h", fontName="Helvetica-Bold", fontSize=10.5, leading=13)

story = []

# --- banner ----------------------------------------------------------------
banner = Table(
    [[[Paragraph("Stardew Valley Gift Cheat Sheet", title),
       Paragraph("Win over the whole valley faster &mdash; the gifts that matter", subtitle)]]],
    colWidths=[W],
)
banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), SAGE),
    ("TOPPADDING", (0, 0), (-1, -1), 14),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("ROUNDEDCORNERS", [8, 8, 8, 8]),
]))
story.append(banner)
story.append(Spacer(1, 12))

# --- universal loved gifts -------------------------------------------------
story.append(Paragraph("Universal Loved Gifts (almost everyone loves these)", section))
loves = Table(
    [[Paragraph("Prismatic Shard &nbsp;&bull;&nbsp; Pearl &nbsp;&bull;&nbsp; Magic Rock Candy "
                "&nbsp;&bull;&nbsp; Rabbit&rsquo;s Foot &nbsp;&bull;&nbsp; Golden Pumpkin", body_b)]],
    colWidths=[W],
)
loves.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), ACCENT_SOFT),
    ("TOPPADDING", (0, 0), (-1, -1), 9),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("ROUNDEDCORNERS", [6, 6, 6, 6]),
]))
story.append(loves)
story.append(Spacer(1, 4))
story.append(Paragraph("They&rsquo;re rare &mdash; save them for villagers you want to befriend "
                       "fast, or for birthdays (8&times; friendship!).", small))

# --- likes / hates two-column ---------------------------------------------
story.append(Spacer(1, 8))
likes = [Paragraph("Safe Likes (good fallback)", box_h),
         Spacer(1, 4),
         Paragraph("&bull; Most flowers (Tulip, Sunflower)<br/>"
                   "&bull; Most fruit &amp; many cooked dishes<br/>"
                   "&bull; Gold Bars, Maple Syrup<br/>"
                   "&bull; Most gems", body)]
hates = [Paragraph("Never Gift (hates)", box_h),
         Spacer(1, 4),
         Paragraph("&bull; Trash, Driftwood, Broken items<br/>"
                   "&bull; Bait &amp; Tackle<br/>"
                   "&bull; Most crafting materials (Wood, Stone, Fiber)<br/>"
                   "&bull; Gives <b>negative</b> friendship!", body)]
two_col = Table([[likes, hates]], colWidths=[W / 2.0, W / 2.0])
two_col.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#eef3ef")),
    ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#f7e8e0")),
    ("TEXTCOLOR", (0, 0), (0, 0), SAGE),
    ("TEXTCOLOR", (1, 0), (1, 0), CLAY),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("LINEAFTER", (0, 0), (0, 0), 4, CREAM),
]))
story.append(two_col)

# --- marriage candidates table --------------------------------------------
story.append(Paragraph("Best Loved Gift by Marriage Candidate", section))
rows = [
    ["Villager", "A reliable loved gift"],
    ["Abigail", "Amethyst, Pumpkin, Chocolate Cake"],
    ["Alex", "Complete Breakfast, Salmon Dinner"],
    ["Elliott", "Crab Cakes, Lobster, Pomegranate"],
    ["Emily", "Amethyst, Aquamarine, Cloth"],
    ["Haley", "Coconut, Fruit Salad, Sunflower"],
    ["Harvey", "Coffee, Pickles, Wine"],
    ["Leah", "Salad, Truffle, Goat Cheese, Wine"],
    ["Maru", "Cauliflower, Diamond, Gold Bar"],
    ["Penny", "Diamond, Emerald, Melon, Poppy"],
    ["Sam", "Pizza, Maple Bar, Cactus Fruit"],
    ["Sebastian", "Frozen Tear, Sashimi, Pumpkin, Void Egg"],
    ["Shane", "Beer, Hot Pepper, Pepper Poppers"],
]
data = []
for i, (name, gift) in enumerate(rows):
    if i == 0:
        data.append([Paragraph(name, cell_h), Paragraph(gift, cell_h)])
    else:
        data.append([Paragraph(name, body_b), Paragraph(gift, body)])

tbl = Table(data, colWidths=[1.5 * inch, W - 1.5 * inch], repeatRows=1)
style = [
    ("BACKGROUND", (0, 0), (-1, 0), SAGE),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
]
for r in range(1, len(data)):
    if r % 2 == 0:
        style.append(("BACKGROUND", (0, r), (-1, r), CREAM))
tbl.setStyle(TableStyle(style))
story.append(tbl)

# --- footer ----------------------------------------------------------------
story.append(Spacer(1, 12))
story.append(HRFlowable(width="100%", thickness=1, color=LINE))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "Free cheat sheet from <b>Cozy Game Guide</b> &nbsp;&bull;&nbsp; "
    + SITE + " &nbsp;&bull;&nbsp; Tip: you can gift twice per week per villager, plus their birthday.",
    small,
))

doc.build(story)
print("Wrote", os.path.abspath(OUT), "(", os.path.getsize(OUT), "bytes )")
