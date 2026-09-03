/**
 * Gramin Career Setu — Resume Builder Logic (assets/resume.js)
 * ─────────────────────────────────────────────────────────────
 * Features:
 *  • 3-Step Interactive Wizard with Stepper Progress Bar
 *  • Live A4 Document Preview Modal
 *  • Local Offline jsPDF generation with A4 styling & fallback
 *  • Bilingual i18n integration (Telugu / English)
 *  • Zero login required
 */

const ResumeBuilder = (() => {
  'use strict';

  let currentStep = 1;

  // ── Styling constants for jsPDF ──
  const PDF = {
    MARGIN_LEFT:  18,
    MARGIN_RIGHT: 18,
    MARGIN_TOP:   20,
    PAGE_HEIGHT:  297, // A4 mm
    WIDTH:        210, // A4 mm
    LINE_HEIGHT:  6.5,

    // Colors [R, G, B]
    COLOR_PRIMARY:   [27, 94, 32],     // #1b5e20 Forest Green
    COLOR_HEADER_BG: [10, 61, 27],     // Deep brand green
    COLOR_ACCENT:    [251, 192, 45],   // #fbc02d Gold
    COLOR_TEXT:      [30, 41, 59],     // #1e293b Slate 800
    COLOR_MUTED:     [100, 116, 139],  // #64748b Slate 500
    COLOR_LINE:      [200, 230, 201],  // #c8e6c9 Light green
    COLOR_WHITE:     [255, 255, 255],

    // Font Sizes (pt)
    FONT_NAME:       18,
    FONT_CONTACT:    9.5,
    FONT_HEADING:    11,
    FONT_BODY:       10,
    FONT_SMALL:      8.5,
  };

  // ── DOM Cache ──
  const dom = {};

  function cacheDom() {
    dom.formSection      = document.getElementById('resumeFormSection');
    dom.form             = document.getElementById('resumeForm');
    dom.successCard      = document.getElementById('successCard');
    dom.stepperFill      = document.getElementById('stepperFill');
    dom.previewModal     = document.getElementById('previewModal');
    dom.previewContent   = document.getElementById('previewContent');

    // Inputs
    dom.fullName         = document.getElementById('fieldName');
    dom.phone            = document.getElementById('fieldPhone');
    dom.email            = document.getElementById('fieldEmail');
    dom.village          = document.getElementById('fieldVillage');
    dom.qualification    = document.getElementById('fieldQualification');
    dom.skills           = document.getElementById('fieldSkills');
    dom.experience       = document.getElementById('fieldExperience');
    dom.languages        = document.getElementById('fieldLanguages');
    dom.objective        = document.getElementById('fieldObjective');

    // Errors
    dom.errName          = document.getElementById('errName');
    dom.errPhone         = document.getElementById('errPhone');

    // Global Buttons
    dom.btnDownloadPDF   = document.getElementById('btnDownloadPDF');
  }

  // ── Helper: Translation lookup ──
  function t(key) {
    return (window.I18n && typeof window.I18n.t === 'function') ? window.I18n.t(key) : key;
  }

  // ══════════════════════════════════════════════════════════════
  //  Step Wizard Navigation
  // ══════════════════════════════════════════════════════════════

  function goToStep(step) {
    if (step < 1 || step > 3) return;

    // Validate step 1 if trying to jump forward
    if (step > 1 && !validateStep1()) {
      return;
    }

    currentStep = step;

    // Update Panes
    for (let i = 1; i <= 3; i++) {
      const pane = document.getElementById(`stepPane${i}`);
      const indicator = document.getElementById(`stepIndicator${i}`);

      if (pane) {
        pane.classList.toggle('wizard-step-pane--active', i === currentStep);
      }

      if (indicator) {
        indicator.classList.toggle('stepper-step--active', i === currentStep);
        indicator.classList.toggle('stepper-step--completed', i < currentStep);
      }
    }

    // Update Track Fill
    if (dom.stepperFill) {
      if (currentStep === 1) dom.stepperFill.style.width = '0%';
      else if (currentStep === 2) dom.stepperFill.style.width = '40%';
      else if (currentStep === 3) dom.stepperFill.style.width = '80%';
    }

    // Scroll to top of card on step change
    if (dom.formSection) {
      dom.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function nextStep(fromStep) {
    if (fromStep === 1) {
      if (validateStep1()) {
        goToStep(2);
      }
    } else if (fromStep === 2) {
      goToStep(3);
    }
  }

  // ══════════════════════════════════════════════════════════════
  //  Validation
  // ══════════════════════════════════════════════════════════════

  function validateStep1() {
    let isValid = true;

    // Full Name
    const name = dom.fullName.value.trim();
    if (!name) {
      showError('fieldName', 'errName', t('resume-err-name'));
      isValid = false;
    } else {
      clearError('fieldName', 'errName');
    }

    // Phone Number
    const phone = dom.phone.value.trim().replace(/[\s\-+]/g, '');
    if (!phone) {
      showError('fieldPhone', 'errPhone', t('resume-err-phone'));
      isValid = false;
    } else if (phone.length < 10) {
      showError('fieldPhone', 'errPhone', t('resume-err-phone-invalid'));
      isValid = false;
    } else {
      clearError('fieldPhone', 'errPhone');
    }

    return isValid;
  }

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('form-input-stitch--error');
    if (error) {
      error.textContent = message;
      error.style.display = 'block';
    }
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('form-input-stitch--error');
    if (error) {
      error.textContent = '';
      error.style.display = 'none';
    }
  }

  function getFormData() {
    return {
      name:          dom.fullName ? dom.fullName.value.trim() : '',
      phone:         dom.phone ? dom.phone.value.trim() : '',
      email:         dom.email ? dom.email.value.trim() : '',
      village:       dom.village ? dom.village.value.trim() : '',
      qualification: dom.qualification ? dom.qualification.value.trim() : '',
      skills:        dom.skills ? dom.skills.value.trim() : '',
      experience:    dom.experience ? dom.experience.value.trim() : '',
      languages:     dom.languages ? dom.languages.value.trim() : '',
      objective:     dom.objective ? dom.objective.value.trim() : '',
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  Live A4 Document Preview Modal
  // ══════════════════════════════════════════════════════════════

  function openPreview() {
    const data = getFormData();
    const displayName = data.name || 'YOUR NAME / మీ పేరు';
    const contactItems = [];
    if (data.phone) contactItems.push(data.phone);
    if (data.email) contactItems.push(data.email);
    if (data.village) contactItems.push(data.village);
    const displayContact = contactItems.length > 0 ? contactItems.join('  •  ') : 'Phone  •  Email  •  Location';

    dom.previewContent.innerHTML = `
      <div class="a4-preview__header">
        <h2 class="a4-preview__name">${escapeHtml(displayName)}</h2>
        <p class="a4-preview__contact">${escapeHtml(displayContact)}</p>
      </div>
      <div class="a4-preview__body">
        ${data.objective ? `
          <div>
            <h4 class="a4-preview__section-title">Career Objective / లక్ష్యం</h4>
            <p class="a4-preview__section-content">${escapeHtml(data.objective)}</p>
          </div>
        ` : ''}

        ${data.qualification ? `
          <div>
            <h4 class="a4-preview__section-title">Education / విద్యార్హత</h4>
            <p class="a4-preview__section-content">${escapeHtml(data.qualification)}</p>
          </div>
        ` : ''}

        ${data.skills ? `
          <div>
            <h4 class="a4-preview__section-title">Key Skills / నైపుణ్యాలు</h4>
            <p class="a4-preview__section-content">${escapeHtml(data.skills)}</p>
          </div>
        ` : ''}

        ${data.experience ? `
          <div>
            <h4 class="a4-preview__section-title">Work Experience / అనుభవం</h4>
            <p class="a4-preview__section-content">${escapeHtml(data.experience)}</p>
          </div>
        ` : ''}

        ${data.languages ? `
          <div>
            <h4 class="a4-preview__section-title">Languages Known / భాషలు</h4>
            <p class="a4-preview__section-content">${escapeHtml(data.languages)}</p>
          </div>
        ` : ''}

        <div>
          <h4 class="a4-preview__section-title">Declaration</h4>
          <p class="a4-preview__section-content" style="font-size: 0.8rem; color: #64748b;">
            I hereby declare that all the information provided above is true and correct to the best of my knowledge.
          </p>
        </div>
      </div>
    `;

    dom.previewModal.classList.add('open');
  }

  function closePreview() {
    dom.previewModal.classList.remove('open');
  }

  // ══════════════════════════════════════════════════════════════
  //  PDF Generation Engine
  // ══════════════════════════════════════════════════════════════

  async function ensureJsPDF() {
    if ((window.jspdf && window.jspdf.jsPDF) || window.jsPDF) return true;
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'assets/jspdf.umd.min.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        cdnScript.onload = () => resolve(true);
        cdnScript.onerror = () => resolve(false);
        document.head.appendChild(cdnScript);
      };
      document.head.appendChild(script);
    });
  }

  function generatePDF() {
    const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
    if (!jsPDFClass) throw new Error('jsPDF library not available');

    const doc = new jsPDFClass({ unit: 'mm', format: 'a4' });
    const contentWidth = PDF.WIDTH - PDF.MARGIN_LEFT - PDF.MARGIN_RIGHT;
    let y = PDF.MARGIN_TOP;
    const data = getFormData();

    // ── Header Band ──
    const headerHeight = 36;
    doc.setFillColor(...PDF.COLOR_HEADER_BG);
    doc.rect(0, 0, PDF.WIDTH, headerHeight, 'F');

    // Accent line at bottom of header
    doc.setFillColor(...PDF.COLOR_ACCENT);
    doc.rect(0, headerHeight, PDF.WIDTH, 1.5, 'F');

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(PDF.FONT_NAME);
    doc.setTextColor(...PDF.COLOR_WHITE);
    doc.text(data.name.toUpperCase(), PDF.MARGIN_LEFT, 16);

    // Contact line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(PDF.FONT_CONTACT);
    doc.setTextColor(220, 237, 222);

    const contactParts = [];
    if (data.phone)   contactParts.push('Phone: ' + data.phone);
    if (data.email)   contactParts.push('Email: ' + data.email);
    if (data.village) contactParts.push('Location: ' + data.village);
    doc.text(contactParts.join('   |   '), PDF.MARGIN_LEFT, 26);

    y = headerHeight + 8;

    // Helper: Draw Section
    function drawSection(title) {
      if (y > PDF.PAGE_HEIGHT - 35) {
        doc.addPage();
        y = PDF.MARGIN_TOP;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(PDF.FONT_HEADING);
      doc.setTextColor(...PDF.COLOR_PRIMARY);
      doc.text(title.toUpperCase(), PDF.MARGIN_LEFT, y);

      doc.setDrawColor(...PDF.COLOR_LINE);
      doc.setLineWidth(0.6);
      doc.line(PDF.MARGIN_LEFT, y + 2, PDF.WIDTH - PDF.MARGIN_RIGHT, y + 2);
      y += 8;
    }

    function drawBodyText(text) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(PDF.FONT_BODY);
      doc.setTextColor(...PDF.COLOR_TEXT);

      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach(line => {
        if (y > PDF.PAGE_HEIGHT - 20) {
          doc.addPage();
          y = PDF.MARGIN_TOP;
        }
        doc.text(line, PDF.MARGIN_LEFT, y);
        y += PDF.LINE_HEIGHT;
      });
      y += 3;
    }

    // Objective
    if (data.objective) {
      drawSection('Career Objective');
      drawBodyText(data.objective);
    }

    // Education
    if (data.qualification) {
      drawSection('Education');
      drawBodyText(data.qualification);
    }

    // Skills
    if (data.skills) {
      drawSection('Key Skills');
      const skillList = data.skills.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      if (skillList.length > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(PDF.FONT_BODY);
        doc.setTextColor(...PDF.COLOR_TEXT);
        skillList.forEach(skill => {
          doc.text('•  ' + skill, PDF.MARGIN_LEFT + 3, y);
          y += PDF.LINE_HEIGHT - 0.5;
        });
        y += 3;
      } else {
        drawBodyText(data.skills);
      }
    }

    // Experience
    if (data.experience) {
      drawSection('Work Experience');
      drawBodyText(data.experience);
    }

    // Languages
    if (data.languages) {
      drawSection('Languages Known');
      drawBodyText(data.languages);
    }

    // Declaration
    drawSection('Declaration');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(PDF.FONT_SMALL);
    doc.setTextColor(...PDF.COLOR_MUTED);
    const declText = 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.';
    const declLines = doc.splitTextToSize(declText, contentWidth);
    declLines.forEach(l => {
      doc.text(l, PDF.MARGIN_LEFT, y);
      y += 5;
    });

    // Save File
    const safeName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
    doc.save(safeName + '_Resume.pdf');
  }

  async function downloadPDF() {
    if (!validateStep1()) {
      goToStep(1);
      return;
    }

    if (dom.btnDownloadPDF) {
      dom.btnDownloadPDF.disabled = true;
    }

    const isLoaded = await ensureJsPDF();
    if (!isLoaded && (!window.jspdf || !window.jspdf.jsPDF) && !window.jsPDF) {
      alert(t('resume-jspdf-error'));
      if (dom.btnDownloadPDF) dom.btnDownloadPDF.disabled = false;
      return;
    }

    try {
      generatePDF();
      showSuccess();
    } catch (err) {
      console.error('[ResumeBuilder] PDF generation failed:', err);
      alert(t('resume-pdf-error'));
    } finally {
      if (dom.btnDownloadPDF) dom.btnDownloadPDF.disabled = false;
    }
  }

  function showSuccess() {
    if (dom.formSection) dom.formSection.style.display = 'none';
    if (dom.successCard) {
      dom.successCard.style.display = 'block';
      dom.successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showForm() {
    if (dom.successCard) dom.successCard.style.display = 'none';
    if (dom.formSection) {
      dom.formSection.style.display = 'block';
      dom.formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ──
  function init() {
    cacheDom();

    // Clear error on input
    if (dom.fullName) dom.fullName.addEventListener('input', () => clearError('fieldName', 'errName'));
    if (dom.phone) dom.phone.addEventListener('input', () => clearError('fieldPhone', 'errPhone'));

    // Modal overlay click outside to close
    if (dom.previewModal) {
      dom.previewModal.addEventListener('click', (e) => {
        if (e.target === dom.previewModal) closePreview();
      });
    }
  }

  return {
    init,
    goToStep,
    nextStep,
    openPreview,
    closePreview,
    downloadPDF,
    showForm,
    showSuccess
  };
})();

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  ResumeBuilder.init();
});
