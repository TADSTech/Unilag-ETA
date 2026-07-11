import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable, KeepTogether
)

WIDTH, HEIGHT = A4
MARGIN = 2 * cm

BRAND = HexColor("#1a56db")
BRAND_LIGHT = HexColor("#e8effd")
GRAY = HexColor("#4b5563")
LIGHT_GRAY = HexColor("#f3f4f6")
DARK = HexColor("#111827")

styles = getSampleStyleSheet()

s_title = ParagraphStyle("Title2", parent=styles["Title"], fontSize=24, textColor=BRAND, spaceAfter=4*mm, leading=30, alignment=TA_CENTER)
s_subtitle = ParagraphStyle("Subtitle", parent=styles["Normal"], fontSize=10, textColor=GRAY, spaceAfter=10*mm, alignment=TA_CENTER)
s_h1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=16, textColor=BRAND, spaceBefore=8*mm, spaceAfter=4*mm, leading=20, borderPadding=(0, 0, 2, 0))
s_h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=13, textColor=DARK, spaceBefore=6*mm, spaceAfter=3*mm, leading=17)
s_h3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=11, textColor=DARK, spaceBefore=5*mm, spaceAfter=2*mm, leading=14)
s_body = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=15, textColor=DARK, spaceAfter=2*mm)
s_bullet = ParagraphStyle("Bullet", parent=s_body, leftIndent=15, bulletIndent=0, spaceBefore=1*mm, spaceAfter=1*mm)
s_code = ParagraphStyle("Code", parent=styles["Code"], fontSize=8.5, leading=12, backColor=LIGHT_GRAY, borderPadding=6, spaceBefore=3*mm, spaceAfter=3*mm, textColor=HexColor("#1f2937"))
s_blockquote = ParagraphStyle("Quote", parent=s_body, leftIndent=12, textColor=GRAY, fontStyle="italic", borderPadding=(4, 0, 4, 8), borderColor=BRAND, borderWidth=0, borderLeftWidth=3)
s_timestamp = ParagraphStyle("Timestamp", parent=s_body, fontSize=9, textColor=BRAND, fontName="Helvetica-Bold", spaceAfter=1*mm)
s_action = ParagraphStyle("Action", parent=s_body, fontSize=9, textColor=GRAY, leftIndent=12, spaceAfter=1*mm, fontName="Helvetica-Oblique")

def parse_md_line(line):
    line = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', line)
    line = re.sub(r'`(.+?)`', r'<font face="Courier" size="9"><b>\1</b></font>', line)
    line = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    line = re.sub(r'<b>(.+?)</b>', lambda m: '<b>' + m.group(1).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>') + '</b>', line)
    line = re.sub(r'<font face="Courier" size="9"><b>(.+?)</b></font>', lambda m: '<font face="Courier" size="9"><b>' + m.group(1).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>') + '</b></font>', line)
    return line

def build_elements(md_text):
    elements = []
    lines = md_text.split("\n")
    in_code = False
    code_lines = []
    i = 0

    while i < len(lines):
        raw = lines[i]

        if raw.startswith("```"):
            if in_code:
                text = "\n".join(code_lines)
                elements.append(Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>"), s_code))
                code_lines = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_lines.append(raw)
            i += 1
            continue

        stripped = raw.strip()

        if not stripped:
            i += 1
            continue

        if stripped.startswith("---"):
            elements.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#d1d5db"), spaceBefore=4*mm, spaceAfter=4*mm))
            i += 1
            continue

        if stripped.startswith("# ") or stripped.startswith("#　"):
            text = stripped.lstrip("#　 ").strip()
            elements.append(Paragraph(parse_md_line(text), s_h1))
            i += 1
            continue

        if stripped.startswith("## ") or stripped.startswith("##　"):
            text = stripped.lstrip("#　 ").strip()
            elements.append(Paragraph(parse_md_line(text), s_h2))
            i += 1
            continue

        if stripped.startswith("### ") or stripped.startswith("###　"):
            text = stripped.lstrip("#　 ").strip()
            elements.append(Paragraph(parse_md_line(text), s_h3))
            i += 1
            continue

        if stripped.startswith("> "):
            text = stripped[2:].strip()
            elements.append(Paragraph(parse_md_line(text), s_blockquote))
            i += 1
            continue

        if re.match(r'^[\d]+\.\s', stripped):
            text = re.sub(r'^[\d]+\.\s', '', stripped)
            elements.append(Paragraph(parse_md_line(text), s_bullet, bulletText="•"))
            i += 1
            continue

        if re.match(r'^[*-]\s', stripped):
            text = re.sub(r'^[*-]\s', '', stripped)
            elements.append(Paragraph(parse_md_line(text), s_bullet, bulletText="•"))
            i += 1
            continue

        if stripped.startswith("* **Action:**"):
            text = stripped
            text = re.sub(r'^\*\*Action:\*\*', '', text).strip()
            elements.append(Paragraph("<i>" + parse_md_line(text) + "</i>", s_body))
            i += 1
            continue

        if "**Script:**" in stripped:
            text = stripped.replace("**Script:**", "").strip()
            elements.append(Paragraph("<i>" + parse_md_line(text) + "</i>", s_body))
            i += 1
            continue

        if "**Action:**" in stripped:
            text = stripped.replace("**Action:**", "").strip()
            elements.append(Paragraph(parse_md_line(text), s_body))
            i += 1
            continue

        elements.append(Paragraph(parse_md_line(stripped), s_body))
        i += 1

    return elements

with open("demo_flow.md", encoding="utf-8") as f:
    md = f.read()

doc = SimpleDocTemplate(
    "demo_flow.pdf",
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
    title="Shuttle ETA — Live Demo Script",
    author="PESSA Innovation Challenge 2026",
)

story = []

story.append(Paragraph("Shuttle ETA", s_title))
story.append(Paragraph("2-3 Min Live Demo Script &amp; Flow", s_subtitle))
story.append(HRFlowable(width="100%", thickness=1.5, color=BRAND, spaceBefore=2*mm, spaceAfter=6*mm))

story += build_elements(md)

doc.build(story)
print("PDF generated: demo_flow.pdf")
