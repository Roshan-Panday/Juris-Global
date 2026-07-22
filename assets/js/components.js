const HEADER_HTML = `

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobile-menu">
  <a href="index.html" onclick="toggleMenu()">Home</a>
  <a href="index.html#about" onclick="toggleMenu()">About</a>
  <a href="team.html" onclick="toggleMenu()">Our Team</a>
  <a href="index.html#practice" onclick="toggleMenu()">Our Expertise</a>
  <a href="index.html#courts" onclick="toggleMenu()">Courts</a>
  <a href="blog.html" onclick="toggleMenu()">Blog</a>
  <a href="careers.html" onclick="toggleMenu()">Careers</a>
  <a href="contact.html" onclick="toggleMenu()">Contact</a>
  <div style="padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,0.1);margin-top:.5rem;">
    <a href="tel:+918920141417" style="display:flex;align-items:center;gap:0.5rem;color:var(--accent);font-size:1.1rem;font-weight:bold;margin-bottom:.5rem;font-family:'Times New Roman',Times,serif;"><span style="transform:rotate(90deg);">&#9990;</span> +91- 89201 41417</a>
    <a href="mailto:info@jurisgloballegalsolution.com" style="display:flex;align-items:center;gap:0.5rem;color:var(--accent);font-size:1.1rem;font-weight:bold;font-family:'Times New Roman',Times,serif;"><span>&#9993;</span> info@jurisgloballegalsolution.com</a>
  </div>
</div>

<!-- STATIC TOP HEADER FOR ALL PAGES -->
<header class="home-static-header">
  <div class="hsh-w">
    <a class="nav-logo" href="index.html" style="text-decoration:none;display:flex;flex-direction:column;justify-content:center;line-height:1.2;">
      Juris Global <span style="font-size:0.75rem;letter-spacing:0.1em;color:var(--acc);text-transform:uppercase;">Legal Solutions</span>
    </a>
    <div class="nav-links" style="display:flex;align-items:center;">
      <a href="index.html" style="font-family:'Times New Roman',Times,serif;">Home</a>
      <a href="index.html#about" style="font-family:'Times New Roman',Times,serif;">About</a>
      <a href="team.html" style="font-family:'Times New Roman',Times,serif;">Our Team</a>
      <a href="index.html#practice" style="font-family:'Times New Roman',Times,serif;">Our Expertise</a>
      <a href="index.html#courts" style="font-family:'Times New Roman',Times,serif;">Courts</a>
      <a href="blog.html" style="font-family:'Times New Roman',Times,serif;">Blog</a>
      <a href="careers.html" style="font-family:'Times New Roman',Times,serif;">Careers</a>
    </div>
    <div class="nav-contact-block" style="display:flex;flex-direction:column;justify-content:center;gap:0.25rem;border-left:1px solid rgba(255,255,255,0.18);padding-left:1.5rem;margin-left:1rem;">
      <a href="tel:+918920141417" style="color:#fff;text-decoration:none;font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:0.4rem;font-family:'Times New Roman',Times,serif;"><span style="color:#c9a84c;font-size:1rem;transform:rotate(90deg);display:inline-block;">&#9990;</span> +91&#8209; 89201 41417</a>
      <a href="mailto:info@jurisgloballegalsolution.com" style="color:#fff;text-decoration:none;font-weight:600;font-size:0.85rem;display:flex;align-items:center;gap:0.4rem;font-family:'Times New Roman',Times,serif;"><span style="color:#c9a84c;font-size:1rem;">&#9993;</span> info@jurisgloballegalsolution.com</a>
    </div>
  </div>
</header>
<!-- NAVBAR -->
<nav class="navbar" id="navbar">
  <a class="nav-logo" href="index.html" id="nav-logo-trigger" style="text-decoration:none;font-family:'Times New Roman',Times,serif;line-height:1.2;display:flex;flex-direction:column;justify-content:center;">
    Juris Global <span style="font-size:0.75rem;letter-spacing:0.1em;color:var(--acc);text-transform:uppercase;">Legal Solutions</span>
  </a>
  <div class="nav-links">
    <a href="index.html" style="font-family:'Times New Roman',Times,serif;">Home</a>
    <a href="index.html#about" style="font-family:'Times New Roman',Times,serif;">About</a>
    <a href="team.html" style="font-family:'Times New Roman',Times,serif;">Our Team</a>
    <a href="index.html#practice" style="font-family:'Times New Roman',Times,serif;">Our Expertise</a>
    <a href="index.html#courts" style="font-family:'Times New Roman',Times,serif;">Courts</a>
    <a href="blog.html" style="font-family:'Times New Roman',Times,serif;">Blog</a>
    <a href="careers.html" style="font-family:'Times New Roman',Times,serif;">Careers</a>
    <div class="theme-select-container">
      <select id="theme-selector" onchange="changeColorTheme(this.value)" class="theme-select" title="Choose color theme" style="font-family:'Times New Roman',Times,serif;">
        <option value="slate">Slate Blue</option>
        <option value="green">Emerald</option>
        <option value="burgundy">Burgundy</option>
        <option value="navy">Royal Navy</option>
      </select>
    </div>
    <div class="nav-contact-block" style="display:flex;flex-direction:column;justify-content:center;gap:0.25rem;margin-left:1.2rem;padding-left:1.2rem;border-left:1px solid rgba(255,255,255,0.18);">
      <a href="tel:+918920141417" style="color:#fff;text-decoration:none;font-weight:600;font-size:0.82rem;display:flex;align-items:center;gap:0.4rem;white-space:nowrap;line-height:1.3;letter-spacing:0.02em;font-family:'Times New Roman',Times,serif;text-transform:none;"><span style="color:#c9a84c;font-size:1rem;transform:rotate(90deg);display:inline-block;">&#9990;</span> +91&#8209; 89201 41417</a>
      <a href="mailto:info@jurisgloballegalsolution.com" style="color:#fff;text-decoration:none;font-weight:600;font-size:0.82rem;display:flex;align-items:center;gap:0.4rem;white-space:nowrap;line-height:1.3;letter-spacing:0.02em;font-family:'Times New Roman',Times,serif;text-transform:none;"><span style="color:#c9a84c;font-size:1rem;">&#9993;</span> info@jurisgloballegalsolution.com</a>
    </div>

  </div>
  <button class="hamburger" onclick="toggleMenu()" id="hamburger" style="font-size:1.8rem;">&#9776;</button>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer" id="footer" style="background: #0a0e1c; padding: 1.75rem 0 0; border-top: 1px solid rgba(255,255,255,0.07); margin: 0; font-family:'Times New Roman',Times,serif;">
  <div class="section-w">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2.5rem; margin-bottom: 1.25rem; align-items: start;">
      
      <!-- Brand Column -->
      <div style="flex: 1 1 250px; max-width: 380px;">
        <div style="font-family:'Times New Roman',Times,serif; font-size: 1.5rem; font-weight: 700; color: var(--txt); margin-bottom: 1rem;">
          Juris Global<br><span style="color: var(--accent); font-size: 1.1rem;">Legal Solutions</span>
        </div>
        <p style="color: var(--txt-s); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; font-family:'Times New Roman',Times,serif;">
          Advocates &amp; Legal Consultants.<br>
          Established 2009. Appearing before the Supreme Court of India, High Courts, and Tribunals across the country.
        </p>
        <p style="color:var(--txt-s);font-size:.78rem;font-style:italic;line-height:1.5;font-family:'Times New Roman',Times,serif;">
          Under the Bar Council of India rules, advocates are prohibited from soliciting work or advertising. This website is for informational purposes only and does not constitute legal advice or create a lawyer–client relationship.
        </p>
      </div>

      <!-- Quick Links -->
      <div style="flex: 1 1 150px; max-width: 220px;">
        <h4 style="color: var(--txt); font-family:'Times New Roman',Times,serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Quick Links</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <a href="index.html#about" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">About the Firm</a>
          <a href="team.html" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">Our Advocates</a>
          <a href="index.html#practice" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">Our Expertise</a>
          <a href="index.html#courts" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">Courts We Appear Before</a>
          <a href="careers.html" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">Careers</a>
          <a href="admin/login.html" style="color: var(--txt-s); text-decoration: none; font-size: 0.9rem; font-family:'Times New Roman',Times,serif;">Staff Login</a>
        </div>
      </div>

      <!-- Contact -->
      <div style="flex: 1 1 250px; max-width: 320px;">
        <h4 style="color: var(--txt); font-family:'Times New Roman',Times,serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Our Offices</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; color: var(--txt-s); font-size: 0.9rem; line-height: 1.6; font-family:'Times New Roman',Times,serif;">
          <div><strong style="color:var(--txt);">📍 Head Office</strong><br><a href="https://maps.app.goo.gl/H31iWbGapqB1D9HW6" target="_blank" rel="noopener" style="color: var(--txt-s); text-decoration: none;">K69, First Floor, Near HDFC Bank,<br>Next to Jangpura Post Office,<br>Jangpura Extension, New Delhi - 110014</a></div>
	
          <div style="margin-top: 0.25rem;"><br><a href="https://www.google.com/maps/place/16%C2%B059'33.7%22N+73%C2%B019'38.1%22E/@16.9931232,73.3262257,18.07z/data=!4m4!3m3!8m2!3d16.9926834!4d73.32724?hl=en&entry=ttu&g_ep=EgoyMDI2MDcxOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener" style="color: var(--txt-s); text-decoration: none;">F-6, Devta Apartment, Salvi Stop,<br>Near Chiryu Hospital, Ratnagiri - 415612</a></div>
          <div style="margin-top: 0.25rem;"><br><a href="https://maps.app.goo.gl/Y7w6nigjVgbLarzH9" target="_blank" rel="noopener" style="color: var(--txt-s); text-decoration: none;">Chamber No. 632, Lawyers Chamber Block,<br>Saket Courts, New Delhi - 110017</a></div>
	  <div>📞 <a href="tel:+918920141417" style="color: var(--accent); text-decoration: none;">+91 89201 41417</a></div>
          <div>☎️ <a href="tel:+911135933508" style="color: var(--accent); text-decoration: none;">+91 11 35933508</a></div>
          <div>✉️ <a href="mailto:info@jurisgloballegalsolution.com" style="color: var(--accent); text-decoration: none;">info@jurisgloballegalsolution.com</a></div>
        </div>
      </div>

      <!-- Branch Offices -->
      <div style="flex: 1 1 150px; max-width: 200px;">
        <h4 style="color: var(--txt); font-family:'Times New Roman',Times,serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem;">Branch Offices</h4>
        <ul style="list-style-type: none; padding: 0; margin: 0; color: var(--txt-s); font-size: 0.9rem; line-height: 1.6; font-family:'Times New Roman',Times,serif; display: flex; flex-direction: column; gap: 0.25rem;">
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Uttar Pradesh</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Madhya Pradesh</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Himachal Pradesh</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Punjab</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Haryana</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Chandigarh</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Rajasthan</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Bihar</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Maharashtra</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Telangana</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Karnataka</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Tamil Nadu</li>
          <li style="position: relative; padding-left: 12px;"><span style="position: absolute; left: 0; color: var(--accent);">•</span> Kerala</li>
        </ul>
      </div>

    </div>

    <div style="border-top: 1px solid var(--border); padding: 0.85rem 0; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; color: var(--txt-s); font-size: 0.8rem; align-items: center; font-family:'Times New Roman',Times,serif;">
      <div>© ${new Date().getFullYear()} Juris Global Legal Solutions. All Rights Reserved.</div>
      <div style="display: flex; gap: 1.5rem;">
        <a href="assets/privacy-policy.html" style="color: var(--txt-s); text-decoration: none; font-family:'Times New Roman',Times,serif; transition: color 0.2s;" onmouseover="this.style.color='#c9983a'" onmouseout="this.style.color=''">Privacy Policy</a>
        <a href="assets/terms-and-conditions.html" style="color: var(--txt-s); text-decoration: none; font-family:'Times New Roman',Times,serif; transition: color 0.2s;" onmouseover="this.style.color='#c9983a'" onmouseout="this.style.color=''">Terms of Use</a>
        <a href="#" onclick="let d = document.getElementById('disclaimer-overlay'); if(d){ d.style.display='flex'; d.style.opacity='1'; } return false;" style="color: var(--txt-s); text-decoration: none; font-family:'Times New Roman',Times,serif; transition: color 0.2s;" onmouseover="this.style.color='#c9983a'" onmouseout="this.style.color=''">Bar Council Disclaimer</a>
      </div>
    </div>
  </div>
</footer>


<!-- ═══ TRANSLATOR ═══ -->
<div id="lang-selector-wrap">
  <div id="google_translate_element" style="display:none;"></div>
  <button id="lang-btn" onclick="toggleLangMenu()">
    <span id="current-lang-flag">🌐</span> <span id="current-lang-name">Language</span>
  </button>
  <div id="lang-menu">
    <div id="lang-menu-header">Select Language</div>
    <div id="lang-search-wrap">
      <input type="text" id="lang-search" placeholder="Search language..." oninput="filterLangs(this.value)" autocomplete="off">
    </div>
    <div id="lang-list"></div>
  </div>
</div>

<!-- Email Float Removed to prevent overlap with chatbot -->

<!-- Success Toast -->
<div class="toast" id="toast">
  <span class="toast-icon">✅</span>
  <span class="toast-text">Query sent! We'll respond within 24 hours.</span>
</div>

<!-- ═══ CHATBOT (Informational — Juris Global) ═══ -->
<div id="lex-launcher" title="Ask us anything" aria-label="Open information window">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
</div>
<div id="lex-window">
  <div id="lex-header">
    <h3 style="font-family:'Times New Roman',Times,serif;">⚖️ Juris Global — Info</h3>
    <button id="lex-close">&times;</button>
  </div>
  <div id="lex-messages"></div>
  <div id="lex-input-area">
    <input type="text" id="lex-input" placeholder="Type your question..." style="font-family:'Times New Roman',Times,serif;">
    <button id="lex-send">↑</button>
  </div>
</div>
`;



(function () {
  function loadComponents() {
    const hPlaceholder = document.getElementById('header-placeholder');
    const fPlaceholder = document.getElementById('footer-placeholder');

    const isSubfolder = window.location.pathname.includes('/admin/');
    const isAssetsPage = window.location.pathname.includes('/assets/') && !isSubfolder;
    const pathPrefix = isSubfolder ? '../' : '';
    const assetsPrefix = isAssetsPage ? '../' : 'assets/';

    // Inject Chatbot CSS to Head
    if (!document.querySelector('link[href*="chatbot.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = pathPrefix + 'assets/css/chatbot.css';
      document.head.appendChild(link);
    }

    // Inject top contact bar CSS inline
    if (!document.getElementById('tcb-style')) {
      const style = document.createElement('style');
      style.id = 'tcb-style';
      style.textContent = `
        .top-contact-bar{background:#0a0e1c;border-bottom:1px solid rgba(201,152,58,0.25);padding:.4rem 0;font-family:'Times New Roman',Times,serif;}
        .tcb-inner{max-width:1280px;margin:0 auto;padding:0 2rem;display:flex;align-items:center;gap:1rem;justify-content:flex-end;flex-wrap:wrap;}
        .tcb-item{display:flex;align-items:center;gap:.35rem;font-size:.8rem;color:rgba(255,255,255,0.75);}
        .tcb-icon{font-size:.85rem;}
        .tcb-link{color:#c9983a;text-decoration:none;font-family:'Times New Roman',Times,serif;font-size:.82rem;transition:color .2s;}
        .tcb-link:hover{color:#e8b84b;}
        .tcb-sep{color:rgba(255,255,255,0.25);}
        .email-float{position:fixed;bottom:2.5rem;right:1.8rem;z-index:8000;display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;}
        .email-float .email-tooltip{background:var(--card-bg,#131c35);border:1px solid var(--border,rgba(255,255,255,0.1));border-radius:8px;padding:.6rem .9rem;font-size:.78rem;color:var(--txt,#fff);white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:none;font-family:'Times New Roman',Times,serif;}
        .email-float:hover .email-tooltip{display:block;}
        .email-btn{width:52px;height:52px;background:linear-gradient(135deg,#c9983a,#e8b84b);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;text-decoration:none;box-shadow:0 4px 20px rgba(201,152,58,0.4);border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;}
        .email-btn:hover{transform:scale(1.1);box-shadow:0 8px 30px rgba(201,152,58,0.5);}
        * { font-family: 'Times New Roman', Times, serif !important; }
        .nav-logo, .nav-links a, .nav-cta, .section-title, .section-label, .section-sub, h1, h2, h3, h4, h5, h6, p, li, td, th, span, div, input, select, textarea, button { font-family: 'Times New Roman', Times, serif !important; }
        .hero-title, .hero-sub, .hero-badge { font-family: 'Times New Roman', Times, serif !important; }
      `;
      document.head.appendChild(style);
    }

    if (hPlaceholder) {
      let hHTML = HEADER_HTML;
      if (isSubfolder) {
        hHTML = hHTML.replace(/href="([^"]+)"/g, (match, p1) => {
          if (p1.startsWith('http') || p1.startsWith('#') || p1.startsWith('tel:') || p1.startsWith('mailto:')) return match;
          return `href="${pathPrefix}${p1}"`;
        });
      }
      hPlaceholder.innerHTML = hHTML;
    }

    if (fPlaceholder) {
      let fHTML = FOOTER_HTML;
      // Fix links for admin subfolder (prepend ../)
      if (isSubfolder) {
        fHTML = fHTML.replace(/href="([^"]+)"/g, (match, p1) => {
          if (p1.startsWith('http') || p1.startsWith('#') || p1.startsWith('tel:') || p1.startsWith('mailto:')) return match;
          return `href="${pathPrefix}${p1}"`;
        });
      }
      // Fix links for assets/ pages (privacy-policy, T&C, etc.)
      if (isAssetsPage) {
        fHTML = fHTML.replace(/href="assets\/([^"]+)"/g, (match, p1) => {
          return `href="${p1}"`;
        });
        fHTML = fHTML.replace(/href="(?!http|#|tel:|mailto:|assets\/)([^"]+)"/g, (match, p1) => {
          return `href="../${p1}"`;
        });
      }
      fPlaceholder.innerHTML = fHTML;
    }

    // Inject Google Translate script dynamically if not present
    if (!document.getElementById('google-translate-script')) {
      const gtInit = document.createElement('script');
      gtInit.innerHTML = `function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element'); }`;
      document.head.appendChild(gtInit);
      
      const gtScript = document.createElement('script');
      gtScript.id = 'google-translate-script';
      gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(gtScript);
    }

    window.dispatchEvent(new Event('componentsLoaded'));

    // Load the query popup (paid consultation, no free consult)
    (function loadConsultPopup() {
      var s = document.createElement('script');
      s.src = pathPrefix + 'assets/js/consult_popup.js';
      s.defer = true;
      document.body.appendChild(s);
    })();

    // Slider edge arrows: show only when slider section visible
    (function initSliderVisibility() {
      var sliderSection = document.getElementById('team-slider-section');
      if (!sliderSection) return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          document.body.classList.toggle('slider-visible', e.isIntersecting);
        });
      }, { threshold: 0.1 });
      obs.observe(sliderSection);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }
})();


/* Popup handled by assets/js/consult_popup.js (multi-step flow) */

