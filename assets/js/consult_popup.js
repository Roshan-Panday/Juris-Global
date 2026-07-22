/* ═══════════════════════════════════════════════════
   JURIS GLOBAL — MULTI-STEP LEGAL ENQUIRY POPUP
   Step 1  → Client Type (India / NRI)
   Step 2  → Area of Concern (different per type)
   Step 3a → State (India path) / Country (NRI path)
   Step 4  → Contact Form → Email to firm
   Bar Council compliant · Paid only · No WhatsApp
═══════════════════════════════════════════════════ */
(function initConsultPopup() {
  // No session guard — shows on every page load and every 3 minutes

  /* ─────────────────────────────────────────────
     DATA
  ───────────────────────────────────────────── */
  const AREAS = {
    india: [
      { icon: '🏠', label: 'Property / Real Estate' },
      { icon: '⚖️', label: 'Criminal Defence / Bail' },
      { icon: '👨‍👩‍👧', label: 'Matrimonial / Family Law' },
      { icon: '📋', label: 'Civil Suit / Litigation' },
      { icon: '🏢', label: 'Corporate / Business Law' },
      { icon: '📜', label: 'Succession / Will / Probate' },
      { icon: '🏦', label: 'Banking / Debt Recovery' },
      { icon: '🛡️', label: 'Consumer / RERA Dispute' },
      { icon: '💻', label: 'Cyber Law / IT Act' },
      { icon: '📌', label: 'Other Legal Matter' },
    ],
    nri: [
      { icon: '🏡', label: 'NRI Property / Inheritance' },
      { icon: '💍', label: 'Matrimonial / Divorce (Cross-border)' },
      { icon: '✈️', label: 'Immigration / Visa / OCI' },
      { icon: '📜', label: 'NRI Succession / Will / Probate' },
      { icon: '💼', label: 'NRI Corporate / Investment' },
      { icon: '👨‍👩‍👧', label: 'Child Custody (International)' },
      { icon: '⚖️', label: 'Criminal Matter (India-based)' },
      { icon: '📌', label: 'Other NRI Legal Enquiry' },
    ]
  };

  const INDIA_STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Delhi (NCT)','Goa','Gujarat','Haryana','Himachal Pradesh',
    'Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
    'Manipur','Meghalaya','Mizoram','Nagaland','Odisha',
    'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
    'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Chandigarh (UT)','Jammu & Kashmir','Ladakh','Puducherry','Other'
  ];

  const NRI_REGIONS = [
    'United States (USA)','United Kingdom (UK)','United Arab Emirates (UAE)',
    'Canada','Australia','Singapore','New Zealand','Europe (Other)',
    'Middle East (Other)','Africa','South-East Asia','Other Country'
  ];

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  let clientType = '';
  let selectedArea = '';
  let selectedLocation = '';

  /* ─────────────────────────────────────────────
     POPUP SHELL
  ───────────────────────────────────────────── */
  const overlay = document.createElement('div');
  overlay.id = 'jg-popup-overlay';
  overlay.style.cssText = [
    'position:fixed;top:0;left:0;width:100%;height:100%;',
    'background:rgba(0,0,0,0.65);z-index:99990;',
    'display:flex;align-items:center;justify-content:center;',
    'padding:1rem;backdrop-filter:blur(4px);',
    'opacity:0;transition:opacity 0.3s;pointer-events:none;'
  ].join('');

  const card = document.createElement('div');
  card.id = 'jg-popup-card';
  card.style.cssText = [
    'background:#fff;border-radius:20px;',
    'max-width:480px;width:100%;',
    'padding:2.2rem 1.8rem 1.8rem;',
    'position:relative;',
    'box-shadow:0 24px 64px rgba(0,0,0,0.28);',
    'font-family:\'Times New Roman\',Times,serif;',
    'max-height:88vh;overflow-y:auto;',
    'transition:transform 0.3s;'
  ].join('');

  /* Close button */
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.title = 'Close';
  closeBtn.style.cssText = [
    'position:absolute;top:1rem;right:1rem;',
    'width:30px;height:30px;border-radius:50%;',
    'border:1px solid #ddd;background:#f5f5f5;',
    'cursor:pointer;font-size:1.15rem;color:#666;',
    'display:flex;align-items:center;justify-content:center;',
    'line-height:1;padding:0;'
  ].join('');
  closeBtn.onclick = closePopup;
  card.appendChild(closeBtn);

  /* Progress dots */
  const dots = document.createElement('div');
  dots.id = 'jg-popup-dots';
  dots.style.cssText = 'display:flex;justify-content:center;gap:6px;margin-bottom:1.5rem;';
  card.appendChild(dots);

  /* Content */
  const content = document.createElement('div');
  content.id = 'jg-popup-content';
  card.appendChild(content);

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  /* ─────────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────────── */
  function setDots(active, total) {
    dots.innerHTML = Array.from({length: total}, (_,i) =>
      `<span style="width:8px;height:8px;border-radius:50%;background:${i===active?'#8B0000':'#ddd'};transition:background 0.3s;display:inline-block;"></span>`
    ).join('');
  }

  function heading(icon, title, sub) {
    return `
      <div style="text-align:center;margin-bottom:1.75rem;">
        <div style="font-size:2.6rem;margin-bottom:0.6rem;">${icon}</div>
        <h2 style="color:#8B0000;font-size:1.45rem;margin:0 0 0.35rem;font-family:'Times New Roman',Times,serif;">${title}</h2>
        <p style="color:#888;font-size:0.88rem;margin:0;font-family:'Times New Roman',Times,serif;">${sub}</p>
      </div>`;
  }

  function btnStyle(extra) {
    return [
      'padding:0.85rem 1rem;border:1.5px solid #e8e8e8;border-radius:12px;',
      'background:#fff;font-size:0.95rem;font-weight:700;color:#222;',
      'cursor:pointer;text-align:center;width:100%;',
      'font-family:\'Times New Roman\',Times,serif;transition:all 0.18s;',
      extra || ''
    ].join('');
  }

  function hoverBtn(btn) {
    btn.addEventListener('mouseenter', () => { btn.style.borderColor='#8B0000'; btn.style.background='#fdf6f6'; });
    btn.addEventListener('mouseleave', () => { btn.style.borderColor='#e8e8e8'; btn.style.background='#fff'; });
  }

  function backLink(fn) {
    return `<button onclick="window._jgBack()" style="margin-top:1rem;background:none;border:none;color:#aaa;font-size:0.8rem;cursor:pointer;font-family:'Times New Roman',Times,serif;">← Back</button>`;
  }

  /* ─────────────────────────────────────────────
     STEP 1 — Client Type
  ───────────────────────────────────────────── */
  function renderStep1() {
    clientType = ''; selectedArea = ''; selectedLocation = '';
    setDots(0, 4);
    content.innerHTML = heading('⚖️', 'Need Legal Assistance?', 'Help us understand your legal concern.') + `
      <div style="display:flex;flex-direction:column;gap:0.65rem;">
        <button class="jg-sb" onclick="window._jgStep2('india')" style="${btnStyle()}">
          Indian
        </button>
        <button class="jg-sb" onclick="window._jgStep2('nri')" style="${btnStyle()}">
          NRI / Foreigner
        </button>
      </div>
      <p style="text-align:center;color:#ccc;font-size:0.7rem;margin-top:1.25rem;font-family:'Times New Roman',Times,serif;">
        Under Bar Council rules, this enquiry does not constitute legal advice.
      </p>`;
    content.querySelectorAll('.jg-sb').forEach(hoverBtn);
  }

  /* ─────────────────────────────────────────────
     STEP 2 — Area of Concern
  ───────────────────────────────────────────── */
  window._jgStep2 = function(type) {
    clientType = type;
    selectedArea = '';
    setDots(1, 4);
    const areas = AREAS[type];
    const isNri = type === 'nri';
    content.innerHTML = heading(
      isNri ? '🌐' : '🔍',
      isNri ? 'NRI Legal Concern?' : 'Primary Area of Concern?',
      'Select your legal priority.'
    ) + `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;" id="jg-area-grid">
        ${areas.map(a => `
          <button class="jg-sb" onclick="window._jgStep3('${a.label.replace(/'/g,"&#39;")}')"
            style="${btnStyle('font-size:0.82rem;padding:0.75rem 0.5rem;')}">
            ${a.icon}<br><span style="font-size:0.78rem;">${a.label}</span>
          </button>`).join('')}
      </div>
      ${backLink()}`;
    content.querySelectorAll('.jg-sb').forEach(hoverBtn);
  };

  /* ─────────────────────────────────────────────
     STEP 3 — State (India) / Country (NRI)
  ───────────────────────────────────────────── */
  window._jgStep3 = function(area) {
    selectedArea = area;
    selectedLocation = '';
    setDots(2, 4);
    const isNri = clientType === 'nri';
    const list = isNri ? NRI_REGIONS : INDIA_STATES;
    const title = isNri ? 'Your Country / Region?' : 'Your State in India?';
    const sub   = isNri ? 'Where are you currently located?' : 'Which state does your matter relate to?';
    const icon  = isNri ? '📍' : '🗺️';

    content.innerHTML = heading(icon, title, sub) + `
      <p style="font-size:0.8rem;color:#888;margin-bottom:0.75rem;font-family:'Times New Roman',Times,serif;">
        Selected matter: <strong style="color:#8B0000;">${area}</strong>
      </p>
      <select id="jg-loc-select" style="
        width:100%;padding:0.9rem 1rem;border:1.5px solid #e0e0e0;border-radius:12px;
        font-size:0.95rem;font-family:'Times New Roman',Times,serif;
        color:#333;background:#fff;outline:none;margin-bottom:1rem;
        appearance:none;-webkit-appearance:none;cursor:pointer;">
        <option value="">— Select ${isNri ? 'Country / Region' : 'State'} —</option>
        ${list.map(l => `<option value="${l}">${l}</option>`).join('')}
      </select>
      <button id="jg-loc-next" onclick="window._jgStep4()"
        style="${btnStyle('background:#8B0000;color:#fff;border-color:#8B0000;opacity:0.4;cursor:not-allowed;')}">
        Continue →
      </button>
      ${backLink()}`;

    const sel = document.getElementById('jg-loc-select');
    const nextBtn = document.getElementById('jg-loc-next');
    sel.addEventListener('change', () => {
      selectedLocation = sel.value;
      if (selectedLocation) {
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.background = '#8B0000';
      } else {
        nextBtn.style.opacity = '0.4';
        nextBtn.style.cursor = 'not-allowed';
      }
    });
    sel.addEventListener('focus', () => { sel.style.borderColor = '#8B0000'; });
    sel.addEventListener('blur',  () => { sel.style.borderColor = '#e0e0e0'; });
  };

  /* ─────────────────────────────────────────────
     STEP 4 — Contact Form
  ───────────────────────────────────────────── */
  window._jgStep4 = function() {
    if (!selectedLocation) return;
    setDots(3, 4);
    content.innerHTML = heading('📩', 'Send Your Query', `Matter: ${selectedArea} · ${selectedLocation}`) + `
      <form id="jg-popup-form" onsubmit="window._jgSubmit(event)">
        <div style="margin-bottom:0.7rem;">
          <label style="display:block;font-size:0.7rem;font-weight:700;color:#777;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;font-family:'Times New Roman',Times,serif;">FULL NAME *</label>
          <input type="text" id="jg-pf-name" placeholder="Your Name" required autocomplete="name"
            style="width:100%;padding:0.8rem 1rem;border:1.5px solid #e0e0e0;border-radius:10px;font-size:0.95rem;font-family:'Times New Roman',Times,serif;box-sizing:border-box;outline:none;">
        </div>
        <div style="margin-bottom:0.7rem;">
          <label style="display:block;font-size:0.7rem;font-weight:700;color:#777;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;font-family:'Times New Roman',Times,serif;">EMAIL ADDRESS *</label>
          <input type="email" id="jg-pf-email" placeholder="your@email.com" required autocomplete="email"
            style="width:100%;padding:0.8rem 1rem;border:1.5px solid #e0e0e0;border-radius:10px;font-size:0.95rem;font-family:'Times New Roman',Times,serif;box-sizing:border-box;outline:none;">
        </div>
        <div style="margin-bottom:1.2rem;">
          <label style="display:block;font-size:0.7rem;font-weight:700;color:#777;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;font-family:'Times New Roman',Times,serif;">PHONE / MOBILE</label>
          <input type="tel" id="jg-pf-phone" placeholder="+91 or country code" autocomplete="tel"
            style="width:100%;padding:0.8rem 1rem;border:1.5px solid #e0e0e0;border-radius:10px;font-size:0.95rem;font-family:'Times New Roman',Times,serif;box-sizing:border-box;outline:none;">
        </div>
        <button type="submit"
          style="width:100%;padding:1rem;background:#8B0000;color:#fff;border:none;border-radius:30px;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Times New Roman',Times,serif;letter-spacing:0.03em;transition:background 0.2s;">
          Send Query →
        </button>
        <p style="text-align:center;color:#bbb;font-size:0.7rem;margin:0.65rem 0 0;font-family:'Times New Roman',Times,serif;">
          🔒 Confidential. Submission does not create a lawyer–client relationship.
        </p>
      </form>
      ${backLink()}`;

    content.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('focus', () => { inp.style.borderColor = '#8B0000'; });
      inp.addEventListener('blur',  () => { inp.style.borderColor = '#e0e0e0'; });
    });
    const sb = content.querySelector('button[type="submit"]');
    if (sb) {
      sb.addEventListener('mouseenter', () => { sb.style.background = '#6b0000'; });
      sb.addEventListener('mouseleave', () => { sb.style.background = '#8B0000'; });
    }
  };

  /* ─────────────────────────────────────────────
     BACK NAVIGATION
  ───────────────────────────────────────────── */
  window._jgBack = function() {
    if (selectedLocation) {
      window._jgStep3(selectedArea);          // back to location step
    } else if (selectedArea) {
      window._jgStep2(clientType);            // back to area step
    } else {
      renderStep1();                          // back to type step
    }
  };

  /* ─────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────── */
  window._jgSubmit = function(e) {
    e.preventDefault();
    const name  = document.getElementById('jg-pf-name').value.trim();
    const email = document.getElementById('jg-pf-email').value.trim();
    const phone = document.getElementById('jg-pf-phone').value.trim();
    const type  = clientType === 'nri' ? 'NRI / International' : 'India-based';

    /* Save locally */
    try {
      const bookings = JSON.parse(localStorage.getItem('juris_consult_bookings') || '[]');
      bookings.push({ name, email, phone, type, matter: selectedArea, location: selectedLocation, timestamp: new Date().toISOString() });
      localStorage.setItem('juris_consult_bookings', JSON.stringify(bookings));
    } catch(_) {}

    /* Open email client */
    const subject = encodeURIComponent(`Legal Query — ${selectedArea} | ${selectedLocation} | ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'N/A'}`,
      `Client Type: ${type}`,
      `Area of Concern: ${selectedArea}`,
      `Location: ${selectedLocation}`,
      '',
      'This query was submitted via the website enquiry popup.',
      'Please respond within 24 hours.'
    ].join('\n'));
    window.location.href = `mailto:info@jurisgloballegalsolution.com?subject=${subject}&body=${body}`;

    /* Success screen */
    setDots(3, 4);
    content.innerHTML = `
      <div style="text-align:center;padding:1.25rem 0;">
        <div style="font-size:3.2rem;margin-bottom:0.75rem;">✅</div>
        <h3 style="color:#8B0000;margin:0 0 0.75rem;font-size:1.3rem;font-family:'Times New Roman',Times,serif;">Query Sent</h3>
        <p style="color:#555;line-height:1.7;font-family:'Times New Roman',Times,serif;font-size:0.9rem;">
          Thank you, <strong>${name}</strong>.<br>
          Our team will review your matter and respond to<br>
          <strong>${email}</strong> within 24 hours.
        </p>
        <p style="color:#aaa;font-size:0.72rem;margin-top:1rem;font-family:'Times New Roman',Times,serif;font-style:italic;">
          Under Bar Council of India rules, this submission does not constitute legal advice or create a lawyer–client relationship.
        </p>
        <button onclick="window.closeConsultPopup()"
          style="margin-top:1.25rem;padding:0.7rem 2rem;background:#8B0000;color:#fff;border:none;border-radius:30px;font-weight:700;cursor:pointer;font-family:'Times New Roman',Times,serif;">
          Close
        </button>
      </div>`;
  };

  /* ─────────────────────────────────────────────
     OPEN / CLOSE
  ───────────────────────────────────────────── */
  function openPopupFn() {
    renderStep1();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  window.closeConsultPopup = closePopup;
  window.openPopup = openPopupFn;

  /* Close on overlay click */
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closePopup();
  });

  /* ─────────────────────────────────────────────
     AUTO-SHOW: first time after 10s, then every 3 minutes.
     No session storage — shows on every page load/reload/switch.
  ───────────────────────────────────────────── */
  const POPUP_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

  // First show after 10 seconds
  setTimeout(() => {
    openPopupFn();
    // Then repeat every 3 minutes
    setInterval(() => {
      // Only reopen if not already visible
      if (overlay.style.opacity !== '1') {
        openPopupFn();
      }
    }, POPUP_INTERVAL_MS);
  }, 10000);

})();
