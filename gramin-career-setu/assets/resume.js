/**
 * Gramin Career Setu — Resume Builder (assets/resume.js)
 * ──────────────────────────────────────────────────────
 * Form validation + jsPDF-powered professional A4 PDF resume generation.
 *
 * NOTE: jsPDF's built-in fonts only support Latin characters.
 * The PDF is generated in English (standard for Indian resumes).
 * The form UI remains bilingual via the i18n system.
 */

const ResumeBuilder = (() => {
  'use strict';

  // ── PDF Style Constants ──
  const PDF = {
    // A4 dimensions in mm
    WIDTH:  210,
    HEIGHT: 297,

    // Margins
    MARGIN_LEFT:   20,
    MARGIN_RIGHT:  20,
    MARGIN_TOP:    15,
    MARGIN_BOTTOM: 20,

    // Colors  [R, G, B]
    COLOR_PRIMARY:    [27, 94, 32],     // #1b5e20
    COLOR_SECONDARY:  [46, 125, 50],    // #2e7d32
    COLOR_TEXT:       [51, 51, 51],      // #333333
    COLOR_LIGHT_TEXT: [119, 119, 119],   // #777777
    COLOR_LINE:       [200, 200, 200],   // #c8c8c8
    COLOR_WHITE:      [255, 255, 255],
    COLOR_HEADER_BG:  [27, 94, 32],

    // Font sizes
    FONT_NAME:    22,
    FONT_CONTACT: 10,
    FONT_SECTION: 12,
    FONT_BODY:    10.5,
    FONT_SMALL:   9,
    FONT_FOOTER:  7.5,

    // Line spacing
    LINE_HEIGHT: 5.5,
  };

  // ── DOM cache ──
  const dom = {};

  function cacheDom() {
    dom.form         = document.getElementById('resumeForm');
    dom.fullName     = document.getElementById('fieldName');
    dom.phone        = document.getElementById('fieldPhone');
    dom.email        = document.getElementById('fieldEmail');
    dom.village      = document.getElementById('fieldVillage');
    dom.qualification = document.getElementById('fieldQualification');
    dom.skills       = document.getElementById('fieldSkills');
    dom.experience   = document.getElementById('fieldExperience');
    dom.languages    = document.getElementById('fieldLanguages');
    dom.objective    = document.getElementById('fieldObjective');
    dom.submitBtn    = document.getElementById('btnGenerate');
    dom.successCard  = document.getElementById('successCard');
    dom.formCard     = document.getElementById('formCard');
  }

  // ── Helpers ──
  function t(key) { return I18n.getString(key); }

  function showError(fieldId, msg) {
    const errorEl = document.getElementById(fieldId + 'Error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = '';
    }
    const input = document.getElementById(fieldId);
    if (input) input.classList.add('form-input--error');
  }

  function clearError(fieldId) {
    const errorEl = document.getElementById(fieldId + 'Error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    const input = document.getElementById(fieldId);
    if (input) input.classList.remove('form-input--error');
  }

  function clearAllErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    document.querySelectorAll('.form-input--error').forEach(el => {
      el.classList.remove('form-input--error');
    });
  }

  // ── Validation ──
  function validate() {
    clearAllErrors();
    let isValid = true;

    const name  = dom.fullName.value.trim();
    const phone = dom.phone.value.trim();

    if (!name) {
      showError('fieldName', t('resume-err-name'));
      isValid = false;
    }

    if (!phone) {
      showError('fieldPhone', t('resume-err-phone'));
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-]/g, ''))) {
      showError('fieldPhone', t('resume-err-phone-invalid'));
      isValid = false;
    }

    return isValid;
  }

  // ══════════════════════════════════════════════════════════════
  //  PDF Generation
  // ══════════════════════════════════════════════════════════════

  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const contentWidth = PDF.WIDTH - PDF.MARGIN_LEFT - PDF.MARGIN_RIGHT;
    let y = PDF.MARGIN_TOP;

    // Gather form values
    const data = {
      name:          dom.fullName.value.trim(),
      phone:         dom.phone.value.trim(),
      email:         dom.email.value.trim(),
      village:       dom.village.value.trim(),
      qualification: dom.qualification.value.trim(),
      skills:        dom.skills.value.trim(),
      experience:    dom.experience.value.trim(),
      languages:     dom.languages.value.trim(),
      objective:     dom.objective.value.trim(),
    };

    // ────────────────────────────────────────────
    //  HEADER BAND
    // ────────────────────────────────────────────
    const headerHeight = 38;
    doc.setFillColor(...PDF.COLOR_HEADER_BG);
    doc.rect(0, 0, PDF.WIDTH, headerHeight, 'F');

    // Accent line at bottom of header
    doc.setFillColor(251, 192, 45);  // gold accent
    doc.rect(0, headerHeight, PDF.WIDTH, 1.5, 'F');

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(PDF.FONT_NAME);
    doc.setTextColor(...PDF.COLOR_WHITE);
    doc.text(data.name.toUpperCase(), PDF.MARGIN_LEFT, 18);

    // Contact line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(PDF.FONT_CONTACT);
    doc.setTextColor(220, 237, 222);  // light green-white

    const contactParts = [];
    if (data.phone)   contactParts.push(data.phone);
    if (data.email)   contactParts.push(data.email);
    if (data.village)  contactParts.push(data.village);
    doc.text(contactParts.join('  |  '), PDF.MARGIN_LEFT, 27);

    y = headerHeight + 6;

    // ────────────────────────────────────────────
    //  HELPER: Draw section heading
    // ────────────────────────────────────────────
    function drawSection(title) {
      y += 4;

      // Check if we need a new page
      if (y > PDF.HEIGHT - PDF.MARGIN_BOTTOM - 20) {
        doc.addPage();
        y = PDF.MARGIN_TOP;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(PDF.FONT_SECTION);
      doc.setTextColor(...PDF.COLOR_SECONDARY);
      doc.text(title.toUpperCase(), PDF.MARGIN_LEFT, y);
      y += 1.5;

      // Underline
      doc.setDrawColor(...PDF.COLOR_SECONDARY);
      doc.setLineWidth(0.6);
      doc.line(PDF.MARGIN_LEFT, y, PDF.MARGIN_LEFT + contentWidth, y);
      y += 5;
    }

    // ────────────────────────────────────────────
    //  HELPER: Draw body text (with word wrap)
    // ────────────────────────────────────────────
    function drawText(text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(PDF.FONT_BODY);
      doc.setTextColor(...PDF.COLOR_TEXT);

      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        if (y > PDF.HEIGHT - PDF.MARGIN_BOTTOM - 10) {
          doc.addPage();
          y = PDF.MARGIN_TOP;
        }
        doc.text(line, PDF.MARGIN_LEFT, y);
        y += PDF.LINE_HEIGHT;
      });
    }

    // ────────────────────────────────────────────
    //  HELPER: Draw bullet list
    // ────────────────────────────────────────────
    function drawBulletList(items) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(PDF.FONT_BODY);
      doc.setTextColor(...PDF.COLOR_TEXT);

      items.forEach(item => {
        if (!item.trim()) return;
        if (y > PDF.HEIGHT - PDF.MARGIN_BOTTOM - 10) {
          doc.addPage();
          y = PDF.MARGIN_TOP;
        }
        doc.text('\u2022', PDF.MARGIN_LEFT + 2, y);
        const lines = doc.splitTextToSize(item.trim(), contentWidth - 10);
        lines.forEach((line, i) => {
          doc.text(line, PDF.MARGIN_LEFT + 8, y);
          if (i < lines.length - 1) y += PDF.LINE_HEIGHT;
        });
        y += PDF.LINE_HEIGHT;
      });
    }

    // ────────────────────────────────────────────
    //  SECTIONS
    // ────────────────────────────────────────────

    // 1. Career Objective
    if (data.objective) {
      drawSection('Career Objective');
      drawText(data.objective);
    }

    // 2. Education
    if (data.qualification) {
      drawSection('Education');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(PDF.FONT_BODY);
      doc.setTextColor(...PDF.COLOR_TEXT);
      doc.text(data.qualification, PDF.MARGIN_LEFT, y);
      y += PDF.LINE_HEIGHT;
    }

    // 3. Key Skills
    if (data.skills) {
      drawSection('Key Skills');
      const skillItems = data.skills.split(',').map(s => s.trim()).filter(Boolean);

      if (skillItems.length > 0) {
        // Draw skills as a 2-column bullet grid
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(PDF.FONT_BODY);
        doc.setTextColor(...PDF.COLOR_TEXT);

        const colWidth = contentWidth / 2;
        for (let i = 0; i < skillItems.length; i += 2) {
          if (y > PDF.HEIGHT - PDF.MARGIN_BOTTOM - 10) {
            doc.addPage();
            y = PDF.MARGIN_TOP;
          }

          // Left column
          doc.text('\u2022  ' + skillItems[i], PDF.MARGIN_LEFT + 2, y);

          // Right column
          if (skillItems[i + 1]) {
            doc.text('\u2022  ' + skillItems[i + 1], PDF.MARGIN_LEFT + colWidth + 2, y);
          }
          y += PDF.LINE_HEIGHT;
        }
      }
    }

    // 4. Work Experience
    if (data.experience) {
      drawSection('Work Experience');
      drawText(data.experience);
    }

    // 5. Languages
    if (data.languages) {
      drawSection('Languages Known');
      const langItems = data.languages.split(',').map(s => s.trim()).filter(Boolean);
      drawText(langItems.join('  •  '));
    }

    // ────────────────────────────────────────────
    //  DECLARATION
    // ────────────────────────────────────────────
    y += 8;
    if (y > PDF.HEIGHT - PDF.MARGIN_BOTTOM - 30) {
      doc.addPage();
      y = PDF.MARGIN_TOP;
    }

    // Light separator
    doc.setDrawColor(...PDF.COLOR_LINE);
    doc.setLineWidth(0.3);
    doc.line(PDF.MARGIN_LEFT, y, PDF.MARGIN_LEFT + contentWidth, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(PDF.FONT_SMALL);
    doc.setTextColor(...PDF.COLOR_TEXT);
    doc.text('DECLARATION', PDF.MARGIN_LEFT, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(PDF.FONT_SMALL);
    doc.setTextColor(...PDF.COLOR_LIGHT_TEXT);
    const declText = 'I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.';
    const declLines = doc.splitTextToSize(declText, contentWidth);
    declLines.forEach(line => {
      doc.text(line, PDF.MARGIN_LEFT, y);
      y += 4.5;
    });

    y += 6;

    // Date and signature
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(PDF.FONT_SMALL);
    doc.setTextColor(...PDF.COLOR_TEXT);
    doc.text('Date: ' + dateStr, PDF.MARGIN_LEFT, y);
    doc.text('Signature: ___________________', PDF.MARGIN_LEFT + contentWidth - 70, y);

    // ────────────────────────────────────────────
    //  FOOTER
    // ────────────────────────────────────────────
    const footerY = PDF.HEIGHT - 10;
    doc.setDrawColor(...PDF.COLOR_LINE);
    doc.setLineWidth(0.2);
    doc.line(PDF.MARGIN_LEFT, footerY - 3, PDF.MARGIN_LEFT + contentWidth, footerY - 3);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(PDF.FONT_FOOTER);
    doc.setTextColor(...PDF.COLOR_LIGHT_TEXT);
    doc.text(
      'Generated by Gramin Career Setu \u2014 Career guidance for rural youth',
      PDF.WIDTH / 2,
      footerY,
      { align: 'center' }
    );

    // ────────────────────────────────────────────
    //  SAVE
    // ────────────────────────────────────────────
    const safeName = data.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    doc.save(safeName + '_Resume.pdf');
  }

  // ══════════════════════════════════════════════════════════════
  //  Form Handling
  // ══════════════════════════════════════════════════════════════

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-input--error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Check if jsPDF is loaded
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert(t('resume-jspdf-error'));
      return;
    }

    // Disable button briefly to prevent double-click
    dom.submitBtn.disabled = true;
    dom.submitBtn.classList.add('btn-generate--loading');

    setTimeout(() => {
      try {
        generatePDF();
        showSuccess();
      } catch (err) {
        console.error('[ResumeBuilder] PDF generation failed:', err);
        alert(t('resume-pdf-error'));
      } finally {
        dom.submitBtn.disabled = false;
        dom.submitBtn.classList.remove('btn-generate--loading');
      }
    }, 150);
  }

  function showSuccess() {
    dom.formCard.style.display = 'none';
    dom.successCard.style.display = '';
    dom.successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showForm() {
    dom.successCard.style.display = 'none';
    dom.formCard.style.display = '';
    dom.formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Clear error on input ──
  function bindClearOnInput() {
    ['fieldName', 'fieldPhone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => clearError(id));
      }
    });
  }

  // ── Watch for language changes ──
  function onLanguageChange() {
    // Update placeholder texts
    const placeholders = document.querySelectorAll('[data-lang-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-lang-placeholder');
      const str = t(key);
      if (str !== key) el.placeholder = str;
    });
  }

  // ── Init ──
  function init() {
    cacheDom();
    bindClearOnInput();

    dom.form.addEventListener('submit', handleSubmit);

    // "Generate Another" button
    const btnAnother = document.getElementById('btnAnother');
    if (btnAnother) btnAnother.addEventListener('click', showForm);

    // Language change observer
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.attributeName === 'lang') onLanguageChange();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  return { init };
})();

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => ResumeBuilder.init(), 100);
});
