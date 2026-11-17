#!/usr/bin/env python3
"""
Convert PPT_Script_and_Viva_Guide.md into a publication-quality PDF document.
Uses Mistune for Markdown-to-HTML conversion, Microsoft Edge headless for PDF rendering,
and PyMuPDF (fitz) for page number and running header injection.
"""

import os
import sys
import shutil
import subprocess
import mistune
import fitz

MD_PATH = r"D:\Yogesh\Coding\CSP\docs\PPT_Script_and_Viva_Guide.md"
HTML_TEMP = r"D:\Yogesh\Coding\CSP\docs\PPT_Script_and_Viva_Guide_temp.html"
RAW_PDF = r"D:\Yogesh\Coding\CSP\docs\PPT_Script_and_Viva_Guide_raw.pdf"
FINAL_PDF = r"D:\Yogesh\Coding\CSP\docs\PPT_Script_and_Viva_Guide.pdf"
ROOT_PDF = r"D:\Yogesh\Coding\CSP\PPT_Script_and_Viva_Guide.pdf"

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(EDGE_PATH):
    EDGE_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def build_pdf():
    print(f"Reading markdown from: {MD_PATH}")
    with open(MD_PATH, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Parse markdown to semantic HTML
    m = mistune.create_markdown(plugins=["table", "task_lists"])
    html_content = m(md_text)

    # CSS for publication-quality academic document
    css = """
    @page {
        size: A4;
        margin: 15mm 13mm 15mm 13mm;
    }
    *, *::before, *::after {
        box-sizing: border-box;
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Nirmala UI', Roboto, Helvetica, Arial, sans-serif;
        color: #1E293B;
        line-height: 1.5;
        font-size: 9pt;
        margin: 0;
        padding: 0;
        background: #ffffff;
    }
    
    /* Cover / Title Header Banner */
    h1 {
        color: #1B4D3E;
        font-size: 18pt;
        font-weight: 800;
        letter-spacing: -0.02em;
        line-height: 1.25;
        margin-top: 0;
        margin-bottom: 6pt;
        padding-bottom: 6pt;
        border-bottom: 2.5px solid #1B4D3E;
    }
    
    /* Subtitle / Metadata styling */
    p:first-of-type {
        font-size: 8.5pt;
        color: #475569;
        line-height: 1.45;
        margin-bottom: 8pt;
        background: #F8FAFC;
        padding: 6pt 10pt;
        border-radius: 6px;
        border: 1px solid #E2E8F0;
    }

    /* Headings */
    h2 {
        color: #1B4D3E;
        font-size: 12.5pt;
        font-weight: 800;
        letter-spacing: -0.01em;
        margin-top: 18pt;
        margin-bottom: 6pt;
        padding-bottom: 3.5pt;
        border-bottom: 1.5px solid #047857;
        page-break-after: avoid;
        break-after: avoid;
    }

    /* Page break before selected major parts for logical reading */
    h2:nth-of-type(2), /* Part 2: Presentation script */
    h2:nth-of-type(4), /* Part 4: Technical explanation */
    h2:nth-of-type(6)  /* Part 6: Viva guide */
    {
        page-break-before: always;
        break-before: always;
    }

    h3 {
        color: #0F172A;
        font-size: 10pt;
        font-weight: 700;
        margin-top: 12pt;
        margin-bottom: 3.5pt;
        padding: 3.5pt 7pt;
        background: #F1F5F9;
        border-left: 3.5px solid #047857;
        border-radius: 0 4px 4px 0;
        page-break-after: avoid;
        break-after: avoid;
    }
    
    h4 {
        color: #047857;
        font-size: 9pt;
        font-weight: 700;
        margin-top: 9pt;
        margin-bottom: 2pt;
        page-break-after: avoid;
        break-after: avoid;
    }

    p {
        margin: 0 0 5pt 0;
        text-align: justify;
    }

    /* Blockquote Callouts */
    blockquote {
        margin: 6pt 0 10pt 0;
        padding: 6pt 10pt;
        background: #F0FDF4;
        border-left: 3.5px solid #047857;
        border-radius: 0 5px 5px 0;
        color: #065F46;
        font-size: 8.5pt;
        line-height: 1.45;
        page-break-inside: avoid;
        break-inside: avoid;
    }
    blockquote p {
        margin: 0;
        text-align: left;
    }

    /* Tables */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 6pt 0 10pt 0;
        font-size: 8pt;
        line-height: 1.4;
        page-break-inside: avoid;
        break-inside: avoid;
    }
    th, td {
        padding: 3.5pt 6pt;
        border: 1px solid #CBD5E1;
        text-align: left;
        vertical-align: top;
    }
    th {
        background: #1B4D3E;
        color: #ffffff;
        font-weight: 700;
        letter-spacing: 0.02em;
        border-color: #1B4D3E;
    }
    tr:nth-child(even) td {
        background: #F8FAFC;
    }
    table td:first-child {
        font-weight: 600;
        color: #0F172A;
        width: 26%;
    }

    /* Code blocks */
    pre {
        background: #0F172A;
        color: #E2E8F0;
        padding: 7pt 9pt;
        border-radius: 5px;
        font-family: Consolas, 'Cascadia Code', 'Courier New', monospace;
        font-size: 8pt;
        line-height: 1.4;
        overflow-x: auto;
        page-break-inside: avoid;
        break-inside: avoid;
        margin: 5pt 0 8pt 0;
        border-left: 3px solid #38BDF8;
    }
    code {
        font-family: Consolas, 'Cascadia Code', 'Courier New', monospace;
        font-size: 8pt;
        background: #F1F5F9;
        color: #0F172A;
        padding: 1pt 3pt;
        border-radius: 3px;
        border: 1px solid #E2E8F0;
    }
    pre code {
        background: transparent;
        color: inherit;
        border: none;
        padding: 0;
    }

    /* Lists */
    ul, ol {
        margin: 0 0 6pt 0;
        padding-left: 16pt;
    }
    li {
        margin-bottom: 2.5pt;
    }

    /* Task Lists (Checkboxes) */
    .task-list-item {
        list-style-type: none;
        margin-left: -13pt;
        display: flex;
        align-items: center;
        gap: 5pt;
    }
    .task-list-item input[type='checkbox'] {
        width: 12px;
        height: 12px;
        margin: 0;
        accent-color: #047857;
    }

    /* Horizontal rules */
    hr {
        border: none;
        border-top: 1px solid #E2E8F0;
        margin: 10pt 0;
    }

    /* Emphasized terms */
    strong, b {
        color: #0F172A;
        font-weight: 700;
    }
    """

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Gramin Career Setu — Presentation Script, Technical Walkthrough and Viva Guide</title>
<style>{css}</style>
</head>
<body>
{html_content}
</body>
</html>"""

    print(f"Writing temporary HTML to: {HTML_TEMP}")
    with open(HTML_TEMP, "w", encoding="utf-8") as f:
        f.write(full_html)

    # Convert to PDF via Edge headless
    print(f"Rendering PDF with Edge: {EDGE_PATH}")
    file_url = f"file:///{HTML_TEMP.replace(os.sep, '/')}"
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={RAW_PDF}",
        file_url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if not os.path.exists(RAW_PDF):
        print(f"Error rendering PDF: {res.stderr}")
        return False

    print(f"Raw PDF generated: {RAW_PDF} ({os.path.getsize(RAW_PDF):,} bytes)")

    # Post-process with PyMuPDF to add professional running headers and footers
    print("Adding running headers and footers with PyMuPDF...")
    doc = fitz.open(RAW_PDF)
    total_pages = len(doc)

    for i, page in enumerate(doc):
        r = page.rect
        margin_x = 36.8  # ~13mm

        # Header (from page 2 onwards)
        if i > 0:
            page.insert_text(
                fitz.Point(margin_x, 26),
                "Gramin Career Setu — Presentation Script, Technical Walkthrough and Viva Guide",
                fontsize=7.5,
                color=(0.11, 0.30, 0.24)  # #1B4D3E
            )
            header_right = "B.Tech CSE · CSP Batch 14"
            hw = len(header_right) * 4.5
            page.insert_text(
                fitz.Point(r.width - margin_x - hw, 26),
                header_right,
                fontsize=7.5,
                color=(0.35, 0.40, 0.45)
            )
            page.draw_line(
                fitz.Point(margin_x, 31),
                fitz.Point(r.width - margin_x, 31),
                color=(0.82, 0.86, 0.90),
                width=0.5
            )

        # Footer (all pages)
        page.draw_line(
            fitz.Point(margin_x, r.height - 30),
            fitz.Point(r.width - margin_x, r.height - 30),
            color=(0.82, 0.86, 0.90),
            width=0.5
        )
        page.insert_text(
            fitz.Point(margin_x, r.height - 18),
            "Dept. of CSE · Lakireddy Bali Reddy College of Engineering (Autonomous) · A.P.",
            fontsize=7.5,
            color=(0.40, 0.45, 0.50)
        )
        page_str = f"Page {i + 1} of {total_pages}"
        text_w = len(page_str) * 4.5
        page.insert_text(
            fitz.Point(r.width - margin_x - text_w - 4, r.height - 18),
            page_str,
            fontsize=7.5,
            color=(0.11, 0.30, 0.24)
        )

    doc.save(FINAL_PDF)
    doc.close()

    # Also copy to root for easy user access
    shutil.copy2(FINAL_PDF, ROOT_PDF)

    print(f"Finalized PDF saved successfully to:")
    print(f"  1. {FINAL_PDF} ({os.path.getsize(FINAL_PDF):,} bytes, {total_pages} pages)")
    print(f"  2. {ROOT_PDF} ({os.path.getsize(ROOT_PDF):,} bytes)")

    # Clean up temp files
    try:
        os.remove(HTML_TEMP)
        os.remove(RAW_PDF)
        print("Cleaned up temporary files.")
    except Exception:
        pass

    return True

if __name__ == "__main__":
    success = build_pdf()
    sys.exit(0 if success else 1)
