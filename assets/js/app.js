
/* DISCLAIMER — shows once per browser session only */
// Hide immediately if already acknowledged this session
if (sessionStorage.getItem('disc_ack')) {
  const discEl = document.getElementById('disclaimer-overlay');
  if (discEl) { discEl.style.display = 'none'; document.body.style.overflow = 'auto'; }
}

/* ── DAY/NIGHT MODE ── (kept for admin compatibility, toggle button removed from nav) */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
window.addEventListener('componentsLoaded', () => {
  const t = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
});

/* ── COLOR THEME SELECTOR ── */
function changeColorTheme(themeName) {
  document.body.classList.remove('theme-slate', 'theme-green', 'theme-burgundy', 'theme-navy');
  document.body.classList.add('theme-' + themeName);
  localStorage.setItem('color_theme', themeName);
}
window.addEventListener('componentsLoaded', () => {
  const savedTheme = localStorage.getItem('color_theme') || 'slate';
  document.body.classList.add('theme-' + savedTheme);
  const themeSelector = document.getElementById('theme-selector');
  if (themeSelector) themeSelector.value = savedTheme;
});

/* ── SCROLL EVENTS ── */
let _lastScrollY = 0;
let _ticking = false;

window.addEventListener('scroll', () => {
  if (!_ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const nb = document.getElementById('navbar');
      const tcb = document.getElementById('top-contact-bar');
      const btt = document.getElementById('back-to-top');

      if (!nb) { _ticking = false; return; }

      // ── Glassmorphic "scrolled" state ──
      const scrollThreshold = document.body.classList.contains('home-page') ? 350 : 20;
      nb.classList.toggle('scrolled', scrollY > scrollThreshold);

      // ── Hide on scroll DOWN, show on scroll UP ──
      const delta = scrollY - _lastScrollY;
      if (scrollY > 80) {
        if (delta > 4) {
          // Scrolling down — hide navbar (preserving the pill's translateX(-50%))
          nb.style.transform = 'translateX(-50%) translateY(calc(-100% - 2rem))';
          nb.style.transition = 'transform 0.35s ease';
          if (tcb) { tcb.style.opacity = '0'; tcb.style.pointerEvents = 'none'; tcb.style.transition = 'opacity 0.3s'; }
        } else if (delta < -4) {
          // Scrolling up — reveal
          nb.style.transform = 'translateX(-50%) translateY(0)';
          if (tcb) { tcb.style.opacity = '1'; tcb.style.pointerEvents = ''; }
        }
      } else {
        // Near top — always show
        nb.style.transform = 'translateX(-50%) translateY(0)';
        if (tcb) { tcb.style.opacity = '1'; tcb.style.pointerEvents = ''; }
      }

      // ── Back to Top ──
      if (btt) btt.classList.toggle('visible', scrollY > 500);

      // ── Reading progress bar ──
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = height ? (scrollY / height) * 100 : 0;
      const pb = document.getElementById('scroll-progress');
      if (pb) pb.style.width = pct + '%';

      _lastScrollY = scrollY;
      _ticking = false;
    });
    _ticking = true;
  }
}, { passive: true });

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ── MOBILE MENU ── */
function toggleMenu() {
  const m = document.getElementById('mobile-menu');
  const h = document.getElementById('hamburger');
  m.classList.toggle('open');
  h.textContent = m.classList.contains('open') ? '✕' : '☰';
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if (!menu || !hamburger) return; // guard: not yet injected
  if (!menu.contains(e.target) && !hamburger.contains(e.target) && menu.classList.contains('open')) {
    menu.classList.remove('open');
    hamburger.textContent = '☰';
  }
});

/* SCROLL REVEAL (INTERSECTION OBSERVER) */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {threshold: 0.08, rootMargin: '0px 0px -30px 0px'});

function observeRevealElements() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (!el.dataset.observed) {
      observer.observe(el);
      el.dataset.observed = '1';
    }
  });
}
// Run on initial load
observeRevealElements();
// Run again after components inject header/footer
window.addEventListener('componentsLoaded', observeRevealElements);
// Also run after a short delay as a safety net
setTimeout(observeRevealElements, 800);

/* ── STAT COUNTER ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  if (!target) return;
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + '+';
    if (current >= target) clearInterval(timer);
  }, 40);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target.dataset.count) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── COURT FILTERS ── */
function filterCourts(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.courts-grid .court-card');
  
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(category));
  });

  cards.forEach(card => {
    if (category === 'all') {
      card.style.display = '';
      setTimeout(() => card.style.opacity = '1', 50);
    } else {
      const filterVal = card.getAttribute('data-filter');
      if (filterVal === category) {
        card.style.display = '';
        setTimeout(() => card.style.opacity = '1', 50);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════
   WHATSAPP BOOKING SYSTEM
═══════════════════════════════════════════════════════ */
function openWhatsApp() {
  const modal = document.getElementById('wa-booking-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent background scroll
  } else {
    // Fallback if component is not loaded
    window.open(`https://wa.me/918920141417`, '_blank');
  }
}

function closeWaModal() {
  const modal = document.getElementById('wa-booking-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function submitWaBooking(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ Redirecting...';
  btn.style.opacity = '0.8';
  btn.disabled = true;

  const name = document.getElementById('wa-name').value.trim();
  const time = document.getElementById('wa-time').value;
  const matter = document.getElementById('wa-matter').value;
  const context = document.getElementById('wa-context').value.trim();

  // Format the WhatsApp message beautifully
  const text = `*New Consultation Request*\n\n*Name:* ${name}\n*Practice Area:* ${matter}\n*Preferred Time:* ${time}\n\n*Brief Context:*\n${context}`;
  
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/918920141417?text=${encodedText}`;

  setTimeout(() => {
    window.open(waUrl, '_blank');
    closeWaModal();
    // Reset form
    e.target.reset();
    btn.innerHTML = originalText;
    btn.style.opacity = '1';
    btn.disabled = false;
  }, 600);
}

/* FORM SUBMIT — sends query to WhatsApp */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const name = (document.getElementById('fname') || {value:''}).value;
  const phone = (document.getElementById('phone') || {value:''}).value;
  const email = (document.getElementById('email') || {value:''}).value;
  const area = (document.getElementById('area') || {value:''}).value;
  const message = (document.getElementById('message') || {value:''}).value;

  btn.textContent = 'Preparing...';
  btn.style.opacity = '.7';
  btn.disabled = true;

  const waMsg = encodeURIComponent(
    `New Query from Website\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nArea of Law: ${area}\n\nMessage:\n${message}`
  );

  setTimeout(() => {
    // Open WhatsApp
    window.open(`https://wa.me/918920141417?text=${waMsg}`, '_blank');
    btn.textContent = 'Query Sent! Opening WhatsApp...';
    btn.style.opacity = '1';
    document.getElementById('contact-form').reset();
    setTimeout(() => {
      btn.textContent = 'Send Query — We\'ll Respond in 24 Hours';
      btn.disabled = false;
    }, 3000);
  }, 600);
}


/* ── BENTO CARD PARALLAX (subtle 3D Tilt) ── */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `translateY(-6px) scale(1.01) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transformOrigin = 'center center';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transformOrigin = '';
  });
});

/* ═══════════════════════════════════════════════════════
   TEAM CMS ENGINE
   Stores members in localStorage; renders premium flip-cards
═══════════════════════════════════════════════════════ */

const DEFAULT_MEMBERS = [
  /* 1 — Founder / 18+ yrs */
  {
    id: 'vd-001',
    name: 'Adv. Vinay Kumar Dubey',
    role: 'Founder',
    tagline: '18+ years · Property & Civil Law · Supreme Court',
    desc: 'Enrolled with the Bar Council of Delhi in 2009 after graduating from ILS Law College, Pune, Adv. Vinay Kumar Dubey has built an 18-year career spanning civil, criminal, and commercial litigation. He founded this practice after senior stints at United Chambers of Law (UCOL) and as in-house counsel for M/s Aerens Goldsouk International. His clients include Mahindra & Mahindra Financial Services, IndiGo (InterGlobe Enterprises), Indus Tower Ltd, Gabriel India, and Shriram Housing Finance.',
    benches: 'Supreme Court of India · Delhi HC · Punjab & Haryana HC · Allahabad HC · DRT Delhi',
    enrollment: 'Bar Council of Delhi — D-2229/2009',
    tags: 'Property Law,Civil Litigation,Arbitration,Real Estate,SARFAESI,Corporate',
    photo: 'assets/images/team/vinay kumar.png',
    education: 'BSL LLB — ILS Law College, Pune',
    notableclients: 'Mahindra & Mahindra Financial Services, IndiGo, Indus Tower, Gabriel India, Shriram Housing Finance',
    fullBio: 'Adv. Vinay Kumar Dubey founded Juris Global Legal Solutions with a vision to provide uncompromising legal excellence. Enrolled with the Bar Council of Delhi in 2009, he built a formidable foundation working with independent counsels and leading law firAdv. He extensively practises in Banking Laws, Debt Collection, Securitization, Arbitration, Negotiable Instruments (NI) Act, and commercial litigation.\n\nEarly in his career, he handled complex banking matters and provided critical legal opinions to nationalized banks. His subsequent tenure at United Chambers of Law (UCOL) under Senior Advocates Adv. Sacchin Puri and Adv. Kaadambari Puri deeply enriched his expertise in real estate, specific performance, matrimonial disputes, and corporate executions. He actively represents clients before the Hon\'ble Supreme Court of India, National Consumer Disputes Redressal Commission (NCDRC), various High Courts, and Debt Recovery Tribunals (DRT).',
    educationList: ['BSL LLB from the prestigious ILS Law College, Pune'],
    expertiseList: ['Banking & Finance Litigation', 'Real Estate & Property Law', 'SARFAESI & DRT Proceedings', 'Arbitration & Conciliation', 'Matrimonial & Civil Disputes'],
    caseHistory: ['Successfully defended complex commercial claims for Mahindra & Mahindra Financial Services.', 'Secured critical injunctions in high-stakes property disputes before the Delhi High Court.', 'Resolved massive corporate debt recovery portfolios through strategic arbitration and DRT proceedings.']
  },
  /* 2 — Founding Member */
  {
    id: 'pd-011',
    name: 'Adv. Priya Dubey',
    role: 'Regional Head – Delhi NCR',
    tagline: 'Empathetic Counsel · Matrimonial Disputes · Family Courts',
    desc: 'A dedicated advocate specialising in matrimonial and family disputes, Adv. Priya Dubey brings empathy and strategic rigour to sensitive cases — including divorce proceedings, child custody, maintenance, and domestic violence matters. She is committed to securing fair and protective resolutions for her clients in Family Courts and Appellate forums.',
    benches: 'Family Courts · Delhi District Courts · Delhi HC',
    enrollment: 'Bar Council of Delhi',
    tags: 'Family Law,Matrimonial Disputes,Divorce,Child Custody,Maintenance',
    photo: 'assets/images/team/priya.png',
    education: 'Law Graduate',
    notableclients: '',
    desc: 'Advocate Priya Dubey is a Founding Member of the firm and the spearhead of our Matrimonial and Family Law practice. She understands that family disputes are emotionally taxing and require an advocate who is both fiercely protective of her clients\u2019 rights and deeply empathetic to their personal struggles.\n\nShe regularly navigates highly contentious divorces, complex child custody battles, alimony negotiations, and domestic violence protections. Her approach is rooted in attempting amicable mediations where possible, but aggressively litigating in Family Courts and the High Court when her clients\u2019 welfare and financial security are at stake.',
    educationList: ['Bachelor of Laws (LLB)'],
    expertiseList: ['Contested & Mutual Divorce', 'Child Custody & Guardianship', 'Alimony & Maintenance Claims', 'Domestic Violence (Protection of Women)', 'Pre-Nuptial Counselling'],
    caseHistory: ['Successfully mediated high-conflict child custody disputes, prioritising the minor\u2019s welfare.', 'Secured significant permanent alimony in contested divorce proceedings.', 'Obtained immediate protection orders for victims of domestic abuse.']
  },
  /* 3 — Senior Counsel / 15+ yrs */
  {
    id: 'ck-006',
    name: 'Adv. Chaitral K. Kotwal',
    role: 'Senior Counsel — Bombay HC & Arbitration',
    tagline: '15+ years · Bombay HC · NCLT · Arbitration',
    desc: 'With over 15 years spanning Contract Law, Arbitration, Company Law, Competition Law, Insolvency, and Consumer matters, Adv. Chaitral Kotwal practises primarily before the Bombay High Court. She has briefed Senior Advocates Adv. Kiran Bapat, Adv. Darius Khambata, and Adv. Simil Purohit. She holds an LLM from Savitribai Phule Pune University and a Diploma in Cyber Law.',
    benches: 'Bombay HC · NCLT · State Consumer Forum · CAT · Arbitral Tribunals',
    enrollment: 'Bar Council of Maharashtra — (2010)',
    tags: 'Arbitration,Company Law,Competition Law,Insolvency,Contract Law,Cyber Law',
    photo: '',
    education: 'LLM — Savitribai Phule Pune University; BSL LLB — Pune University',
    notableclients: 'Corporate and government clients before Bombay HC',
    fullBio: 'Adv. Chaitral K. Kotwal is a deeply respected Senior Counsel with over 15 years of elite practice primarily before the Bombay High Court and the NCLT. Her multifaceted expertise encompasses Arbitration, Corporate Law, Competition Law, and complex Insolvency proceedings.\n\nThroughout her illustrious career, she has collaborated closely with legal luminaries, briefing legendary Senior Advocates such as Adv. Kiran Bapat, Adv. Darius Khambata, and Adv. Simil Purohit. Her academic rigour, culminating in a Master of Laws (LLM) and a specialised Diploma in Cyber Law, makes her an indispensable asset in modern corporate and digital litigation.',
    educationList: ['LLM — Savitribai Phule Pune University', 'BSL LLB — Pune University', 'Diploma in Cyber Law'],
    expertiseList: ['Corporate & Insolvency Law (IBC)', 'Commercial Arbitration', 'Competition & Antitrust', 'Cyber Law & Data Privacy', 'High Court Writs & Appeals'],
    caseHistory: ['Successfully argued complex insolvency resolutions before the NCLT.', 'Handled multi-crore commercial arbitrations involving infrastructure conglomerates.', 'Advised top-tier corporations on Competition Commission (CCI) compliance.']
  },
  /* 4 — Senior Partner / 10+ yrs */
  {
    id: 'vkd-004',
    name: 'Adv. Vivek Kumar Dubey',
    role: 'National Head, Operations',
    tagline: '10+ years · Banking Law · District & High Courts',
    desc: 'Independent practitioner since July 2015, Adv. Vivek Kumar Dubey is a panel advocate for Bank of India, Punjab National Bank, Manappuram Finance, and UCO Bank. His practice covers civil, criminal, Motor Vehicle Act, labour law, banking recovery, due diligence, and securitization matters. He graduated from S.B. Keer Law College, Ratnagiri.',
    benches: 'High Courts · District Courts · Appellate Tribunals',
    enrollment: 'Bar Council — (2015)',
    tags: 'Banking Law,Civil Litigation,Criminal Law,NI Act,SARFAESI,Labour Law',
    photo: 'assets/images/team/vivek kumar dubey.png',
    education: 'BCom LLB — S.B. Keer Law College, Ratnagiri',
    notableclients: 'Bank of India, Punjab National Bank, Manappuram Finance, UCO Bank, Gabriel India',
    fullBio: 'Adv. Vivek Kumar Dubey serves as a Senior Partner, driving the firm\'s robust Banking and Commercial Litigation practice. An independent practitioner since 2015, he is trusted by India\'s largest financial institutions, serving as a distinguished panel advocate for the Bank of India, Punjab National Bank, Manappuram Finance, and UCO Bank.\n\nHis courtroom command spans Civil, Criminal, and Commercial Litigation, with specialised dominance in the Negotiable Instruments (NI) Act, SARFAESI proceedings, Motor Accident Claims (MACT), and Labour Law. He brings meticulous due diligence to high-value securitization matters and fiercely defends corporate interests in complex recovery disputes.',
    educationList: ['BCom LLB — S.B. Keer Law College, Ratnagiri'],
    expertiseList: ['Banking & Financial Recovery', 'SARFAESI Act Proceedings', 'Criminal Litigation & NI Act', 'Labour & Industrial Law', 'Property Due Diligence'],
    caseHistory: ['Executed massive debt recovery drives for major nationalised banks.', 'Successfully defended corporate clients in protracted industrial disputes.', 'Handled comprehensive property due diligence for high-value banking securitizations.']
  },
  /* 5 — Advocate / 10+ yrs */
  {
    id: 'sb-007',
    name: 'Adv. Sandeep Bidhuri',
    role: 'Head – Civil Litigation',
    tagline: '10+ years · Commercial Law · Panel Counsel',
    desc: 'Operating from Chamber No. 632 at Saket District Court, Adv. Sandeep Bidhuri (Enrolment No. D-2103/2010) has over 10 years of experience in civil, criminal, commercial, and banking matters across Delhi & NCR. He serves as panel counsel for SDMC and DTC, and is former panel counsel for Punjab National Bank. His practice spans MACT claims, NI Act Section 138, arbitration, and comprehensive legal drafting.',
    benches: 'Delhi & NCR District Courts · Delhi HC · Supreme Court of India',
    enrollment: 'Bar Council of Delhi — D-2103/2010',
    tags: 'Criminal Law,MACT,NI Act,Civil Litigation,Arbitration,Banking',
    photo: 'assets/images/team/sandeep bidhuri.png',
    education: 'BA LLB — Maharishi Dayanand University (First Division)',
    notableclients: 'South Delhi Municipal Corporation, Delhi Transport Corporation, Punjab National Bank (Former)',
    fullBio: 'With over 10 years of robust practice in the courts of Delhi and the NCR, including regular appearances before the Delhi High Court and the Supreme Court of India, Adv. Sandeep Bidhuri is a highly effective litigator. Operating out of the Saket Court complex, he specialises in Civil, Criminal, Commercial, and Banking matters, bringing diligence and a strong client focus to every case.\n\nHis expertise has been recognised through his appointments as Panel Counsel for the South Delhi Municipal Corporation (SDMC) and the Delhi Transport Corporation (DTC), as well as serving as Former Panel Counsel for the Punjab National Bank. He is highly regarded for his skills in arbitration, property due diligence, MACT claims, and Section 138 Negotiable Instruments Act matters.',
    educationList: ['BA LLB — Maharishi Dayanand University (First Division)'],
    expertiseList: ['Civil & Criminal Litigation', 'Arbitration & ADR', 'Banking & Recovery Matters', 'Motor Accident Claims (MACT)', 'Section 138 NI Act', 'Property Due Diligence', 'Commercial Dispute Resolution'],
    caseHistory: ['Handled comprehensive property due diligence and recovery matters for major banks.', 'Represented the SDMC and DTC in complex civil and statutory proceedings.', 'Drafted and vetted high-value commercial agreements, sale deeds, and MOUs.', 'Successfully resolved numerous disputes via arbitration and alternative dispute resolution.']
  },
  /* 6 — Associate / 7+ yrs */
  {
    id: 'pm-005',
    name: 'Adv. Prajakta Suresh Mulye',
    role: 'Regional Head – Maharashtra & Goa',
    tagline: '7+ years · Consumer Law · DLSA Legal Aid Panel',
    desc: 'Enrolled in Maharashtra (MAH/355/2018), Adv. Prajakta Mulye brings strong consumer, arbitration, and banking law expertise. She is a panel advocate for Bank of India and Punjab National Bank (Ratnagiri) and serves on the DLSA legal aid panel, providing access to justice for those who cannot afford representation.',
    benches: 'Bombay HC · Ratnagiri District Courts · Consumer Forums · DRT',
    enrollment: 'Bar Council of Maharashtra — MAH/355/2018',
    tags: 'Consumer Law,Arbitration,Banking Law,SARFAESI,Real Estate,Legal Aid',
    photo: 'assets/images/team/prajakta.png',
    education: 'BA LLB — S.B. Keer Law College, Ratnagiri',
    notableclients: 'Bank of India, Punjab National Bank, DLSA Ratnagiri',
    fullBio: 'Adv. Prajakta Suresh Mulye is a dedicated Associate Advocate with over 7 years of specialised practice in Consumer Law, Arbitration, and Banking Recovery. Operating primarily across Maharashtra, she is a fierce advocate for both institutional clients and individual consumers.\n\nHer exceptional litigation skills have earned her prestigious empanelment with the Bank of India and Punjab National Bank. Beyond her corporate practice, she is deeply committed to public service, actively representing marginalised citizens through the District Legal Services Authority (DLSA) legal aid panel.',
    educationList: ['BA LLB — S.B. Keer Law College, Ratnagiri'],
    expertiseList: ['Consumer Protection Litigation', 'Banking & SARFAESI Recovery', 'Domestic Arbitration', 'Public Interest & Legal Aid', 'Real Estate Disputes'],
    caseHistory: ['Secured major consumer compensation awards against defaulting real estate developers.', 'Successfully executed complex property attachments under the SARFAESI Act.', 'Represented indigent clients pro-bono, securing critical fundamental rights protections.']
  },
  /* 7 — Associate / 4+ yrs */
  {
    id: 'pt-008',
    name: 'Adv. Prateek Kr. Tiwari',
    role: 'Head – Real Estate',
    tagline: '4+ years · RERA & Consumer Law · Corporate Counsel',
    desc: 'A results-oriented legal strategist with 4+ years of specialised experience in RERA compliance, consumer litigation, and arbitration. Having served as Senior Legal Executive for major real estate developers, Adv. Prateek Tiwari brings invaluable in-house corporate perspective to complex property and contractual disputes. He aggressively represents clients across RERA authorities, consumer redressal commissions, and civil courts.',
    benches: 'Delhi NCR District Courts · RERA Authorities · Consumer Forums',
    enrollment: 'Bar Council of Uttar Pradesh — (2020)',
    tags: 'Real Estate,RERA,Consumer Law,Civil Litigation,Arbitration',
    photo: 'assets/images/team/Prateek Kr.png',
    education: 'Bachelor of Laws (LLB)',
    notableclients: 'M/s Rise Project Private Limited, Real Estate Developers',
    fullBio: 'Adv. Prateek Kumar Tiwari is an incisive Associate Advocate specialising in Real Estate Regulatory Authority (RERA) compliance, Consumer Protection, and Commercial Arbitration. With over 4 years of intense legal practice, he brings a unique hybrid perspective, having previously served as a Senior Legal Executive for prominent real estate developers like M/s Rise Project Pvt. Ltd.\n\nHis inside knowledge of corporate real estate operations allows him to dismantle complex developer-buyer disputes with devastating efficiency. He aggressively champions his clients\u2019 rights before RERA authorities, Consumer Forums, and Civil Courts, consistently securing refunds, possession orders, and heavy compensations.',
    educationList: ['Bachelor of Laws (LLB)'],
    expertiseList: ['RERA Compliance & Litigation', 'Consumer Redressal', 'Property & Contractual Disputes', 'Corporate Legal Advisory', 'Domestic Arbitration'],
    caseHistory: ['Secured massive refunds for homebuyers from defaulting Tier-1 developers via RERA.', 'Defended real estate corporations in complex multi-party arbitrations.', 'Drafted and executed airtight commercial leases for expansive commercial properties.']
  },
  /* 8 — Associate / 3+ yrs */
  {
    id: 'vkm-002',
    name: 'Adv. Vishal Kumar Malhotra',
    role: 'Managing Head – Dispute Resolution, Arbitration, Probate & NRI Matters',
    tagline: '3+ years · Arbitration · High Courts',
    desc: 'A commercially astute advocate, Adv. Vishal Malhotra holds the unique distinction of being appointed as sole Arbitrator in over 450 retail housing finance disputes for a marquee NBFC. He independently argues before the Delhi HC, Allahabad HC, Uttarakhand HC, Rajasthan HC, and Bombay HC. He has briefed senior advocates Adv. Mukul Rohatgi, Adv. Amit Sibal, and Adv. Sachin Puri.',
    benches: 'Delhi HC · Allahabad HC · Bombay HC · NCDRC',
    enrollment: 'Bar Council of Delhi — D/4321/2023',
    tags: 'Arbitration,Commercial Litigation,Consumer Law,Real Estate,Immigration',
    photo: 'assets/images/team/vishal.png',
    education: 'BA LLB — GGSIPU, New Delhi (CGPA 8.05/10)',
    notableclients: 'Marquee NBFC (450+ arbitration disputes), Educational Institutions',
    fullBio: 'Adv. Vishal Kumar Malhotra is an exceptionally bright and commercially astute Associate Advocate who has rapidly distinguished himself in the fields of Arbitration and Commercial Dispute Resolution. Remarkably early in his career, he holds the unique distinction of being appointed as the sole Arbitrator in over 450 retail housing finance disputes for a marquee Non-Banking Financial Company (NBFC).\n\nHe independently and successfully argues matters before an impressive array of appellate forums, including the High Courts of Delhi, Allahabad, Uttarakhand, Rajasthan, and Bombay. He has also had the privilege of briefing and assisting legal titans such as Senior Advocates Adv. Mukul Rohatgi, Adv. Amit Sibal, and Adv. Sachin Puri.',
    educationList: ['BA LLB — Guru Gobind Singh Indraprastha University (GGSIPU), New Delhi (CGPA 8.05/10)'],
    expertiseList: ['Commercial Arbitration', 'Appellate Court Litigation', 'NBFC & Financial Disputes', 'Real Estate Litigation', 'Immigration Law Advisory'],
    caseHistory: ['Adjudicated over 450 retail housing finance disputes as a sole Arbitrator.', 'Drafted critical SLPs and writ petitions filed before the Hon\'ble Supreme Court.', 'Represented prominent educational institutions in complex regulatory disputes.']
  },
  /* 9 — Associate / 2+ yrs */
  {
    id: 'gy-003',
    name: 'Adv. Gautam Yadav',
    role: 'Head – Constitutional & Insolvency Law',
    tagline: '2+ years · High Court · DDA Standing Counsel',
    desc: 'Adv. Gautam Yadav served as Associate under Adv. Manika Tripathy (Advocate-on-Record, DDA Standing Counsel), appearing before the Delhi HC, DRT, and NCLT. He has prepared 150+ legal drafts spanning constitutional, civil, commercial, and recovery matters. Earlier trained under Adv. Vinay Dubey on NI Act matters.',
    benches: 'Delhi HC · DRT · NCLT',
    enrollment: 'Bar Council of Delhi — (2024)',
    tags: 'Constitutional Law,Civil Litigation,SARFAESI,DRT,Writ Petitions',
    photo: 'assets/images/team/gautm.png',
    education: 'BA LLB (Hons.) — GGSIPU, New Delhi (2019–2024)',
    notableclients: 'Delhi Development Authority (DDA), Delhi HC Legal Services Committee',
    fullBio: 'Adv. Gautam Yadav is a dynamic and meticulous Associate Advocate specialising in Constitutional Law, Civil Litigation, and Statutory Recovery. Before joining the core team, he served as a key associate under Adv. Manika Tripathy, Advocate-on-Record and Standing Counsel for the Delhi Development Authority (DDA), gaining unparalleled exposure to high-stakes government litigation.\n\nHe has independently prepared over 150 complex legal drafts, including writ petitions, Special Leave Petitions (SLPs), and statutory appeals. His regular appearances before the Delhi High Court, DRT, and NCLT reflect his deep understanding of procedural intricacies and his relentless commitment to securing favourable judicial outcomes.',
    educationList: ['BA LLB (Hons.) — Guru Gobind Singh Indraprastha University (GGSIPU), New Delhi (2019–2024)'],
    expertiseList: ['Constitutional Writ Petitions', 'Government & DDA Litigation', 'Civil & Commercial Drafting', 'NCLT Insolvency Proceedings', 'DRT Statutory Recovery'],
    caseHistory: ['Assisted in critical land acquisition and regulatory defences for the DDA.', 'Drafted intricate writ petitions challenging unconstitutional administrative actions.', 'Handled comprehensive recovery documentation for major financial institutions.']
  },
  /* 10 — Associate (Commercial) */
  {
    id: 'ps-010',
    name: 'Adv. Pawan Shina',
    role: 'Head – Banking & Commercial Law',
    tagline: 'Strategic Commercial Litigator · Debt Recovery',
    desc: 'A sharply analytical litigator, Adv. Pawan Shina drives the firm\'s commercial recovery and corporate dispute practice. He specialises in untangling convoluted financial disputes, enforcing contracts, and executing rapid recovery strategies through the DRT and civil courts. His aggressive pre-litigation negotiation tactics often secure settlements before trial.',
    benches: 'Delhi District Courts · DRT · Delhi HC',
    enrollment: 'Bar Council of Delhi',
    tags: 'Commercial Law,Debt Recovery,Contract Enforcement,Negotiation',
    photo: 'assets/images/team/pawan shina.png',
    education: 'Bachelor of Laws (LLB)',
    notableclients: '',
    fullBio: 'Adv. Pawan Shina is a sharply analytical Associate Advocate who forms the backbone of the firm\'s commercial recovery and corporate dispute practice. He possesses a distinctive talent for untangling convoluted financial disputes and executing rapid, aggressive recovery strategies through the Debt Recovery Tribunals (DRT) and Civil Courts.\n\nKnown for his strategic foresight, Pawan often employs aggressive pre-litigation negotiation tactics that force favourable settlements without the need for protracted trials. When litigation is unavoidable, he brings relentless preparation and procedural mastery to the courtroom.',
    educationList: ['Bachelor of Laws (LLB)'],
    expertiseList: ['Corporate Debt Recovery', 'DRT & DRAT Litigation', 'Breach of Contract Suits', 'Commercial Negotiation', 'Cheque Bounce (Section 138)'],
    caseHistory: ['Negotiated high-value pre-litigation settlements in entrenched commercial disputes.', 'Executed rapid asset attachments in debt recovery tribunals.', 'Defended corporate entities against hostile civil injunctions.']
  },
  /* 11 — Associate (Criminal) */
  {
    id: 'sc-009',
    name: 'Adv. Surender Chandila',
    role: 'Head – Criminal Law',
    tagline: 'Tactical Trial Lawyer · White-Collar Defence',
    desc: 'A fierce and tactical trial lawyer, Adv. Surender Chandila specialises in criminal defence, white-collar crimes, and high-stakes evidentiary hearings. Known for his meticulous cross-examinations and deep understanding of procedural loopholes, he crafts bulletproof defence strategies for complex criminal matters across the trial courts of Delhi.',
    benches: 'Delhi District Courts · Sessions Courts · Delhi HC',
    enrollment: 'Bar Council of Delhi',
    tags: 'Criminal Defence,White-Collar Crime,Trial Advocacy,Bail Matters',
    photo: 'assets/images/team/Surender chandila.png',
    education: 'Bachelor of Laws (LLB)',
    notableclients: '',
    fullBio: 'Adv. Surender Chandila is a fierce and tactical trial lawyer with an exclusive focus on Criminal Defence and White-Collar Crimes. He is a commanding presence in the trial and sessions courts of Delhi, known for his ability to dismantle prosecution narratives through meticulous, surgically precise cross-examinations.\n\nHe possesses an encyclopaedic understanding of procedural law, often identifying microscopic loopholes that prove critical to his clients\u2019 exoneration. From securing emergency anticipatory bails to running exhaustive multi-year criminal trials, Surender provides unwavering, bulletproof defence representation.',
    educationList: ['Bachelor of Laws (LLB)'],
    expertiseList: ['Criminal Trial Advocacy', 'White-Collar & Economic Offences', 'Anticipatory & Regular Bails', 'Evidentiary Hearings', 'Quashing of FIRs'],
    caseHistory: ['Secured acquittals in highly publicised, complex criminal trials.', 'Obtained emergency bails in stringent economic offence cases.', 'Successfully quashed malicious FIRs through High Court writ petitions.']
  }
,
  {
    id: 'diwakar-dev',
    name: 'Adv. Diwakar Dev',
    role: 'Regional Head – Rajasthan, Cyber & IT Law',
    location: 'Gurugram',
    photo: 'assets/images/team/Diwaker.png',
    tags: 'Civil Litigation, Criminal Law, Cyber Law, White-Collar Crime, PMLA',
    benches: 'District & Sessions Courts, Gurugram',
    tagline: 'Meticulous, strategy-led, and commercially astute advocacy.',
    desc: 'Advocate Diwakar Dev is a litigation and dispute resolution practitioner based at the District & Sessions Courts, Gurugram, with an extensive practice spanning 22 States and Union Territories across India through a trusted network of associate counsel and correspondent advocates.\n\nHis practice encompasses Civil and Criminal Litigation, Cyber Law, White-Collar Crime, PMLA, GST & Taxation, Banking & RBI Regulatory Matters, Intellectual Property Rights (IPR), Commercial & Corporate Disputes, Constitutional & Writ Jurisdiction, Service and Labour Law, Revenue Matters, Arbitration, Consumer Litigation, Real Estate & Property Disputes, Police & Corruption Matters, Family Law, and Regulatory Compliance.\n\nRecognised for a meticulous, strategy-led, and commercially astute approach, he advises and represents individuals, corporations, financial institutions, startups, and public bodies before Courts, Tribunals, and Regulatory Authorities. Combining rigorous legal analysis with persuasive advocacy, he is committed to delivering pragmatic, effective, and result-oriented legal solutions while upholding the highest standards of professional integrity, discretion, and excellence.',
    educationList: [
      'Extensive litigation practice across 22 States & UTs'
    ],
    expertiseList: [
      'Civil and Criminal Litigation',
      'Cyber Law & White-Collar Crime',
      'PMLA & GST Taxation',
      'Banking & RBI Regulatory Matters',
      'Intellectual Property Rights (IPR)',
      'Commercial & Corporate Disputes',
      'Constitutional & Writ Jurisdiction',
      'Arbitration & Consumer Litigation'
    ],
    caseHistory: []
  }

  ,{
    id: 'sahil-001',
    name: 'Adv. Sahil Gupta',
    role: 'Regional Head – Family Law',
    tagline: '',
    desc: 'Regional Head – Family Law',
    benches: '',
    enrollment: '',
    tags: '',
    photo: 'assets/images/team/sahil gupta.png',
    education: '',
    notableclients: '',
    fullBio: '',
    educationList: [],
    expertiseList: [],
    caseHistory: []
  }

  ,{
    id: 'naresh-001',
    name: 'Adv. Naresh Chaudhary',
    role: 'Regional Head – Ghaziabad & Noida',
    tagline: '',
    desc: 'Regional Head – Ghaziabad & Noida',
    benches: '',
    enrollment: '',
    tags: '',
    photo: 'assets/images/team/naresh chaudhary.png',
    education: '',
    notableclients: '',
    fullBio: '',
    educationList: [],
    expertiseList: [],
    caseHistory: []
  },
  {
    id: 'rm-001',
    name: 'Adv. Ravi Mutreja',
    role: 'Regional Head – Gurugram',
    tagline: '',
    desc: 'Regional Head – Gurugram',
    benches: '',
    enrollment: '',
    tags: '',
    photo: 'assets/images/team/ravi mutreja.png',
    education: '',
    notableclients: '',
    fullBio: '',
    educationList: [],
    expertiseList: [],
    caseHistory: []
  }
];

const TEAM_DATA_VERSION = 'v10';





function getTeamMembers() {
  try {
    const storedVersion = localStorage.getItem('juris_team_version');
    // If version mismatch, reset to latest defaults
    if (storedVersion !== TEAM_DATA_VERSION) {
      localStorage.setItem('juris_team_members', JSON.stringify(DEFAULT_MEMBERS));
      localStorage.setItem('juris_team_version', TEAM_DATA_VERSION);
      return DEFAULT_MEMBERS;
    }
    const stored = localStorage.getItem('juris_team_members');
    if (stored) {
      let members = JSON.parse(stored);
      members = members.map(m => {
        if(m.name) m.name = m.name.replace(/Mr\. /g, 'Adv. ').replace(/Ms\. /g, 'Adv. ');
        if(m.desc) m.desc = m.desc.replace(/Mr\. /g, 'Adv. ').replace(/Ms\. /g, 'Adv. ');
        if(m.fullBio) m.fullBio = m.fullBio.replace(/Mr\. /g, 'Adv. ').replace(/Ms\. /g, 'Adv. ');
        return m;
      });
      return members;
    }
    return DEFAULT_MEMBERS;
  } catch { return DEFAULT_MEMBERS; }
}


function saveTeamToStorage(members) {
  localStorage.setItem('juris_team_members', JSON.stringify(members));
}

function getInitials(name) {
  return name.split(' ').filter(w => /[A-Z]/.test(w[0])).map(w => w[0]).join('').slice(0,2) || name.slice(0,2).toUpperCase();
}

function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  const allMembers = getTeamMembers();
  
  // Enforce same order as home page
  const ORDER = [
    'vd-001',
    'vkd-004',
    'pd-011',
    'pm-005',
    'sc-009',
    'ps-010',
    'sb-007',
    'sahil-001',
    'vkm-002',
    'pt-008',
    'gy-003',
    'naresh-001',
    'diwakar-dev',
    'rm-001'
  ];
  const memberMap = {};
  allMembers.forEach(m => { memberMap[m.id] = m; });
  let members = ORDER.map(id => memberMap[id]).filter(Boolean);
  if (!members.length) members = allMembers;

  grid.innerHTML = '';

  members.forEach((m, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'team-card-wrap';
    wrap.dataset.memberId = m.id;

    const avatarHtml = m.photo
      ? `<img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;object-position:top center;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="tc-initials" style="display:none;width:100%;height:100%;background:linear-gradient(135deg,var(--nav-bg2),var(--acc2));align-items:center;justify-content:center;">${getInitials(m.name)}</div>`
      : `<div class="tc-initials" style="width:100%;height:100%;background:linear-gradient(135deg,var(--nav-bg2),var(--acc2));display:flex;align-items:center;justify-content:center;">${getInitials(m.name)}</div>`;

    // Top 3 expertise tags on front
    const frontTags = (m.tags || '').split(',').slice(0,3)
      .map(t => `<span class="tc-tag">${t.trim()}</span>`).join('');

    let shortName = m.name.replace(/^(Adv\.|Mr\.|Ms\.)\s*/,'');
    const isFemale = /Priya|Prajakta|Chaitral/i.test(shortName);
    shortName = (isFemale ? 'Ms. ' : 'Mr. ') + shortName;

    wrap.innerHTML = `
      <div style="border-radius:8px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.18);background:var(--card-bg);display:flex;flex-direction:column;height:100%;">
        <div style="flex:1; width:100%; margin:0; padding:0; position:relative; overflow:hidden;">
          ${avatarHtml}
        </div>
        <div style="background:#0a0e1c;width:100%;margin:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 10px;border-top:3px solid #8B0000;">
          <h4 style="margin:0;font-family:'Times New Roman',Times,serif;font-size:1rem;color:#fff;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;text-align:center;line-height:1.2;width:100%;">${shortName}</h4>
          <div style="color:#fff;font-size:0.8rem;margin-top:4px;font-family:'Times New Roman',Times,serif;text-align:center;">${m.role || 'Advocate'}</div>
        </div>
      </div>
    `;
    grid.appendChild(wrap);
  });

  // Add 20+ Associates card
  const assocWrap = document.createElement('div');
  assocWrap.className = 'team-card-wrap';
  assocWrap.innerHTML = `
    <div class="team-card" tabindex="0" style="cursor:default;">
      <div class="team-card-inner">
        <div class="tc-front glass-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;">
          <div class="tc-front-accent"></div>
          <div style="font-size:3.5rem;font-weight:700;color:var(--acc);margin-bottom:0.5rem;font-family:'Times New Roman',Times,serif;text-shadow:0 2px 10px rgba(0,0,0,0.5);">20+</div>
          <div class="tc-name" style="margin-top:0;">Associates</div>
          <div class="tc-role">Legal Team</div>
          <div class="tc-expertise-chips" style="margin-top:1rem;justify-content:center;">
            <span class="tc-tag">Dedicated</span>
            <span class="tc-tag">Experienced</span>
          </div>
        </div>
      </div>
    </div>
  `;
  grid.appendChild(assocWrap);


  // Stagger slide-in
  setTimeout(() => {
    grid.querySelectorAll('.team-card-wrap').forEach((el, i) => {
      setTimeout(() => el.classList.add('in-view'), i * 100);
    });
  }, 50);

}

/* ═══ HOME PAGE TEAM GRID (photo + name only, sorted by user order) ═══ */
function renderHomeTeamGrid() {
  const container = document.getElementById('team-home-grid');
  if (!container) return;

  const allMembers = getTeamMembers();

  // Vinay at index 0 — appears first on mobile, roughly centered on desktop
  const ORDER = [
    'vd-001',
    'vkd-004',
    'pd-011',
    'pm-005',
    'sc-009',
    'ps-010',
    'sb-007',
    'sahil-001',
    'vkm-002',
    'pt-008',
    'gy-003',
    'naresh-001',
    'diwakar-dev',
    'rm-001'
  ];

  const memberMap = {};
  allMembers.forEach(m => { memberMap[m.id] = m; });
  let orderedMembers = ORDER.map(id => memberMap[id]).filter(Boolean);
  if (!orderedMembers.length) orderedMembers = allMembers;

  function buildCard(m) {
    const initials = m.name.split(' ').filter(w => /[A-Z]/.test(w[0])).map(w => w[0]).join('').slice(0,2) || m.name.slice(0,2).toUpperCase();
    let shortName = m.name.replace(/^(Adv\.|Mr\.|Ms\.)\s*/,'');
    const isFemale = /Priya|Prajakta|Chaitral/i.test(shortName);
    shortName = (isFemale ? 'Ms. ' : 'Mr. ') + shortName;
    const imgHtml = m.photo
      ? `<img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;object-position:top center;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div style="display:none;width:100%;height:100%;background:linear-gradient(135deg,#8B0000,#050e1e);align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;font-family:'Times New Roman',Times,serif;">${initials}</div>`
      : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#8B0000,#050e1e);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#fff;font-family:'Times New Roman',Times,serif;">${initials}</div>`;
    return `<div class="team-slider-card" style="flex:0 0 240px;border-radius:8px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.18);cursor:default;">
      <div style="width:100%;aspect-ratio:3/4;position:relative;background:var(--card-bg);overflow:hidden;">
        ${imgHtml}
      </div>
      <div style="background:#0a0e1c;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 10px;border-top:3px solid #8B0000;">
        <h4 style="margin:0;font-family:'Times New Roman',Times,serif;font-size:0.95rem;color:#fff;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;text-align:center;line-height:1.3;">${shortName}</h4>
        <div style="color:#fff;font-size:0.75rem;margin-top:4px;font-family:'Times New Roman',Times,serif;text-align:center;">${m.role || 'Advocate'}</div>
      </div>
    </div>`;
  }

  // 5 copies: [copy1][copy2][real/middle][copy4][copy5] — 2 full sets on each side
  const singleHTML = orderedMembers.map(buildCard).join('');
  container.innerHTML = singleHTML + singleHTML + singleHTML + singleHTML + singleHTML;
  container.style.display = 'flex';
  container.style.gap = '1.5rem';
  container.style.overflowX = 'hidden';
  container.style.position = 'relative';

  // Wrap in a moving inner track
  const cards = Array.from(container.children);
  const track = document.createElement('div');
  track.id = 'team-inner-track';
  track.style.cssText = 'display:flex;gap:1.5rem;will-change:transform;';
  cards.forEach(c => track.appendChild(c));
  container.innerHTML = '';
  container.appendChild(track);
  container.style.display = 'block';
  container.style.overflow = 'hidden';

  const TOTAL = orderedMembers.length;
  // Read actual rendered card width from DOM (handles mobile vs desktop)
  // Cards are built into the DOM first, then we read CARD_W dynamically
  let CARD_W = 240 + 24; // default fallback (card width + gap)
  // We have 3 copies; the "real" set starts at index TOTAL
  // Normalise within the middle copy (offset range: TOTAL*CARD_W to 2*TOTAL*CARD_W)

  // Start in the MIDDLE copy so we can scroll left or right without hitting empty
  let currentOffset = TOTAL * CARD_W; // beginning of middle copy

  let animFrame;
  let autoInterval;
  let isPaused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragOffsetStart = 0;

  function setOffset(px, animated) {
    track.style.transition = animated ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = `translateX(${-px}px)`;
  }

  function normalizeOffset() {
    const fullWidth = TOTAL * CARD_W;
    // Keep in middle copy region: [2*fullWidth, 3*fullWidth)
    while (currentOffset >= 3 * fullWidth) currentOffset -= fullWidth;
    while (currentOffset < 2 * fullWidth) currentOffset += fullWidth;
  }

  // Initial position: set after layout so we read correct card widths
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const firstCard = track.querySelector('.team-slider-card');
      if (firstCard) {
        CARD_W = firstCard.offsetWidth + 24;
      }
      const containerW = container.offsetWidth;
      const visibleCards = Math.max(1, Math.floor(containerW / CARD_W));
      // Start at the 3rd copy (index 2*TOTAL) so Vinay (index 0) shows first
      const vinayIndex = 0;
      const startCard = Math.max(0, vinayIndex - Math.floor(visibleCards / 2));
      currentOffset = 2 * TOTAL * CARD_W + startCard * CARD_W;
      setOffset(currentOffset, false);
    });
  });

  // Auto scroll (pauses on hover/drag)
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(() => {
      if (!isPaused && !isDragging) {
        currentOffset += CARD_W;
        normalizeOffset();
        setOffset(currentOffset, true);
      }
    }, 3200);
  }

  function stopAuto() {
    if (autoInterval) clearInterval(autoInterval);
  }

  // Store so global scrollTeamSlider can call it
  window._teamSliderNext = function() {
    stopAuto();
    currentOffset += CARD_W;
    normalizeOffset();
    setOffset(currentOffset, true);
    startAuto();
  };
  window._teamSliderPrev = function() {
    stopAuto();
    currentOffset -= CARD_W;
    normalizeOffset();
    setOffset(currentOffset, true);
    startAuto();
  };

  // Pause on hover
  container.addEventListener('mouseenter', () => { isPaused = true; });
  container.addEventListener('mouseleave', () => { isPaused = false; isDragging = false; });

  // Mouse drag
  container.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragOffsetStart = currentOffset;
    track.style.transition = 'none';
  });
  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const delta = dragStartX - e.clientX;
    currentOffset = dragOffsetStart + delta;
    // Snap to nearest card
    currentOffset = Math.round(currentOffset / CARD_W) * CARD_W;
    normalizeOffset();
    setOffset(currentOffset, true);
    startAuto();
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const delta = dragStartX - e.clientX;
    setOffset(dragOffsetStart + delta, false);
  });

  // Touch swipe
  let touchStartX = 0;
  let touchOffsetStart = 0;
  container.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchOffsetStart = currentOffset;
    track.style.transition = 'none';
  }, { passive: true });
  container.addEventListener('touchmove', e => {
    const delta = touchStartX - e.touches[0].clientX;
    setOffset(touchOffsetStart + delta, false);
  }, { passive: true });
  container.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    currentOffset = touchOffsetStart + delta;
    currentOffset = Math.round(currentOffset / CARD_W) * CARD_W;
    normalizeOffset();
    setOffset(currentOffset, true);
  });

  // Start auto when section enters view
  const section = document.getElementById('team-slider-section');
  if (section) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) startAuto();
      else stopAuto();
    }, { threshold: 0.1 });
    obs.observe(section);
  } else {
    startAuto();
  }

  teamSliderInterval = { stop: stopAuto };
}

// Global slider interval and state
let teamSliderInterval;

window.scrollTeamSlider = function(dir) {
  if (dir > 0 && window._teamSliderNext) window._teamSliderNext();
  else if (dir < 0 && window._teamSliderPrev) window._teamSliderPrev();
};


/* ── Admin Panel controls ── */
function openAdminPanel() {
  document.getElementById('admin-panel').classList.add('open');
  document.getElementById('admin-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  renderAdminList();
}
function closeAdminPanel() {
  document.getElementById('admin-panel').classList.remove('open');
  document.getElementById('admin-overlay').classList.remove('show');
  document.body.style.overflow = '';
  cancelEdit();
}

function renderAdminList() {
  const members = getTeamMembers();
  const list = document.getElementById('admin-member-list');
  list.innerHTML = members.map(m => {
    const avatarHtml = m.photo
      ? `<img src="${m.photo}" alt="${m.name}">`
      : getInitials(m.name);
    return `
      <div class="admin-member-item">
        <div class="ami-avatar">${m.photo ? `<img src="${m.photo}" alt="${m.name}">` : getInitials(m.name)}</div>
        <div class="ami-info">
          <div class="ami-name">${m.name}</div>
          <div class="ami-role">${m.role}</div>
        </div>
        <div class="ami-actions">
          <button class="ami-btn edit" onclick="editMember('${m.id}')" title="Edit">✏️</button>
          <button class="ami-btn del" onclick="deleteMember('${m.id}')" title="Remove">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
  if (!members.length) list.innerHTML = '<p style="font-size:.78rem;color:var(--txt-s);text-align:center;padding:1rem">No team members yet. Add your first below!</p>';
}

function deleteMember(id) {
  if (!confirm('Remove this team member?')) return;
  const members = getTeamMembers().filter(m => m.id !== id);
  saveTeamToStorage(members);
  renderAdminList();
  if(document.getElementById('team-grid')) { renderTeam(); }
}

function editMember(id) {
  const m = getTeamMembers().find(m => m.id === id);
  if (!m) return;
  document.getElementById('af-edit-id').value = m.id;
  document.getElementById('af-name').value = m.name;
  document.getElementById('af-role').value = m.role;
  document.getElementById('af-tagline').value = m.tagline || '';
  document.getElementById('af-desc').value = m.desc || '';
  document.getElementById('af-benches').value = m.benches || '';
  document.getElementById('af-enrollment').value = m.enrollment || '';
  document.getElementById('af-tags').value = m.tags || '';
  if (m.photo) {
    const prev = document.getElementById('af-preview');
    prev.src = m.photo;
    prev.style.display = 'block';
    document.getElementById('af-upload-icon').style.display = 'none';
    document.getElementById('af-upload-label').style.display = 'none';
  }
  document.getElementById('admin-form-title').textContent = 'Edit Member';
  document.getElementById('af-submit-btn').textContent = '💾 Save Changes';
  document.getElementById('af-cancel-btn').style.display = 'block';
  document.getElementById('admin-form').scrollIntoView({behavior:'smooth',block:'start'});
}

function cancelEdit() {
  document.getElementById('af-edit-id').value = '';
  document.getElementById('admin-form').reset();
  document.getElementById('af-preview').style.display = 'none';
  document.getElementById('af-upload-icon').style.display = 'block';
  document.getElementById('af-upload-label').style.display = 'block';
  document.getElementById('admin-form-title').textContent = 'Add New Member';
  document.getElementById('af-submit-btn').textContent = '＋ Add Member to Team';
  document.getElementById('af-cancel-btn').style.display = 'none';
  window._editPhoto = null;
}

function previewPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('File too large. Max 2 MB.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('af-preview');
    prev.src = e.target.result;
    prev.style.display = 'block';
    document.getElementById('af-upload-icon').style.display = 'none';
    document.getElementById('af-upload-label').style.display = 'none';
    window._editPhoto = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveTeamMember(event) {
  event.preventDefault();
  const editId = document.getElementById('af-edit-id').value;
  const name = document.getElementById('af-name').value.trim();
  const role = document.getElementById('af-role').value.trim();
  if (!name || !role) return;

  let photo = window._editPhoto || '';
  if (!photo && editId) {
    const existing = getTeamMembers().find(m => m.id === editId);
    if (existing) photo = existing.photo || '';
  }

  const member = {
    id: editId || 'tm-' + Date.now(),
    name,
    role,
    tagline: document.getElementById('af-tagline').value.trim(),
    desc: document.getElementById('af-desc').value.trim(),
    benches: document.getElementById('af-benches').value.trim(),
    enrollment: document.getElementById('af-enrollment').value.trim(),
    tags: document.getElementById('af-tags').value.trim(),
    photo
  };

  let members = getTeamMembers();
  if (editId) {
    members = members.map(m => m.id === editId ? member : m);
  } else {
    members.push(member);
  }
  saveTeamToStorage(members);
  renderAdminList();
  if(document.getElementById('team-grid')) { renderTeam(); }
  cancelEdit();

  // Show toast
  const toast = document.getElementById('toast');
  document.querySelector('.toast-text').textContent = editId ? 'Team member updated!' : 'New team member added!';
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); document.querySelector('.toast-text').textContent = "Query sent! We'll respond within 24 hours."; }, 3000);
}

// Init team on load
if(document.getElementById('team-grid')) { renderTeam(); }


/* ── GSAP ANIMATIONS (MILESTONE 1 & 2) ── */
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.fromTo(heroContent, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }

  // Section Headers Reveal
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach((header) => {
    gsap.fromTo(header,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power2.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Staggered Bento Grid Reveal (Practice Areas)
  const bentoGrid = document.querySelector('.bento-grid');
  if (bentoGrid) {
    const cards = bentoGrid.querySelectorAll('.bento-card');
    gsap.fromTo(cards,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
        scrollTrigger: {
          trigger: bentoGrid,
          start: "top 80%"
        }
      }
    );
  }
  
  // Staggered Stats Reveal
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    const stats = statsGrid.querySelectorAll('.stat-item');
    gsap.fromTo(stats,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsGrid,
          start: "top 85%"
        }
      }
    );
  }
});


/* ── EASTER EGG LOGIN TRIGGER ── */
let logoClicks = 0;
let logoClickTimer;
const logoEl = document.querySelector('.nav-logo');
if (logoEl) {
  logoEl.addEventListener('click', (e) => {
    logoClicks++;
    clearTimeout(logoClickTimer);
    if (logoClicks >= 5) {
      window.location.href = 'admin/login.html';
      logoClicks = 0;
    }
    logoClickTimer = setTimeout(() => { logoClicks = 0; }, 3000);
  });
}


/* ── MAGNETIC HOVER EFFECT ── */
const magneticEls = document.querySelectorAll('.nav-cta, .btn-primary, .bento-card');
magneticEls.forEach(el => {
  el.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(this, { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: "power2.out" });
  });
  el.addEventListener('mouseleave', function() {
    gsap.to(this, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  });
});


/* ── HERO IMAGE SLIDER ── */
let heroSlideIndex = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

function goToSlide(n) {
  if (!heroSlides.length) return;
  heroSlides[heroSlideIndex].classList.remove('active');
  if (heroDots[heroSlideIndex]) heroDots[heroSlideIndex].classList.remove('active');
  heroSlideIndex = (n + heroSlides.length) % heroSlides.length;
  heroSlides[heroSlideIndex].classList.add('active');
  if (heroDots[heroSlideIndex]) heroDots[heroSlideIndex].classList.add('active');
}
if (heroSlides.length) {
  setInterval(() => goToSlide(heroSlideIndex + 1), 5000);
}

/* ── BLOG PREVIEW RENDERER (from SITE_CONTENT) ── */
function renderBlogPreview() {
  const grid = document.getElementById('blog-preview-grid');
  if (!grid || typeof SITE_CONTENT === 'undefined') return;
  const posts = SITE_CONTENT.blog.filter(p => p.published).slice(0, 3);
  grid.innerHTML = posts.map(p => `
    <a class="blog-card reveal" href="post.html?id=${p.id}" style="text-decoration:none;">
      <div class="blog-card-img-wrap">
        <img class="blog-card-img" src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="blog-card-cat">${p.category}</span>
      </div>
      <div class="blog-card-body">
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-card-excerpt">${p.excerpt}</div>
        <div class="blog-card-meta">
          <span class="bcm-author">${p.author.split(',')[0]}</span>
          <span class="bcm-read">${p.readTime} read →</span>
        </div>
      </div>
    </a>
  `).join('');
  // Re-observe newly injected elements
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
renderBlogPreview();

/* ── TEAM CARD CLICK-TO-FLIP (Fixed - no layout shift) ── */
document.addEventListener('click', (e) => {
  const card = e.target.closest('.team-card');
  if (!card) return;
  // Don't flip if clicking on a button inside the card
  if (e.target.closest('button, a')) return;
  card.classList.toggle('flipped');
});

/* ── PAGE LOADER ── */
(function () {
  function hideLoader() {
    const loader = document.getElementById('jg-loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 700);
    }, 1900); // matches progress bar duration
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }
})();

// ── Initialize Components (Wait for Firebase) ──
function initComponents() {
  if(document.getElementById('team-grid')) renderTeam();
  if(document.getElementById('team-home-grid')) renderHomeTeamGrid();
  if(document.getElementById('blog-preview-grid')) renderBlogPreview();
  if(document.getElementById('full-blog-grid')) renderFullBlog(); // for blog.html
}

// Render with default local data first (for speed)
document.addEventListener('DOMContentLoaded', initComponents);

// Re-render when Firebase data is fetched
window.addEventListener('firebaseDataReady', () => {
  initComponents();
  // Also update global firm info if needed (like phone in footer)
  updateGlobalFirmInfo();
});

function updateGlobalFirmInfo() {
  if (!window.SITE_CONTENT || !window.SITE_CONTENT.firm) return;
  const f = window.SITE_CONTENT.firm;
  
  // Update any elements that have specific data attributes
  document.querySelectorAll('[data-firm="phone"]').forEach(el => {
    if(el.tagName === 'A') el.href = `tel:${f.phone.replace(/[^0-9+]/g, '')}`;
    el.textContent = f.phone;
  });
  document.querySelectorAll('[data-firm="email"]').forEach(el => {
    if(el.tagName === 'A') el.href = `mailto:${f.email}`;
    el.textContent = f.email;
  });
  document.querySelectorAll('[data-firm="address"]').forEach(el => {
    el.textContent = f.address;
  });
}

// --- TRANSLATOR LOGIC ---
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰' },
  { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
];

let langMenuOpen = false;
let currentLang = localStorage.getItem('juris_lang') || 'en';

function renderLangList(filter) {
  const list = document.getElementById('lang-list');
  if (!list) return;
  const filtered = filter
    ? LANGUAGES.filter(l => l.name.toLowerCase().includes(filter.toLowerCase()))
    : LANGUAGES;
  list.innerHTML = filtered.map(l => `
    <div class="lang-item ${l.code === currentLang ? 'active' : ''}" onclick="changeLang('${l.code}', '${l.name}')">
      <span class="lang-flag">${l.flag}</span>
      <span>${l.name}</span>
      ${l.code === currentLang ? '<span style="margin-left:auto;font-size:0.7rem">✓</span>' : ''}
    </div>
  `).join('');
}

window.filterLangs = function(val) {
  renderLangList(val);
}

window.toggleLangMenu = function() {
  langMenuOpen = !langMenuOpen;
  const menu = document.getElementById('lang-menu');
  if (!menu) return;
  menu.classList.toggle('open', langMenuOpen);
  if (langMenuOpen) {
    renderLangList('');
    document.getElementById('lang-search').focus();
  }
}

window.changeLang = function(code, name) {
  currentLang = code;
  localStorage.setItem('juris_lang', code);
  
  if (code === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
  } else {
    document.cookie = `googtrans=/en/${code}; path=/;`;
    if (window.location.hostname) {
        document.cookie = `googtrans=/en/${code}; path=/; domain=` + window.location.hostname + ";";
    }
  }
  window.location.reload();
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#lang-selector-wrap')) {
    langMenuOpen = false;
    const menu = document.getElementById('lang-menu');
    if (menu) menu.classList.remove('open');
  }
});

window.addEventListener('componentsLoaded', () => {
    renderLangList('');
    const cur = LANGUAGES.find(l => l.code === currentLang);
    if (cur) {
        const flagEl = document.getElementById('current-lang-flag');
        const nameEl = document.getElementById('current-lang-name');
        if (flagEl) flagEl.textContent = cur.flag;
        if (nameEl) nameEl.textContent = cur.name;
    }
});
