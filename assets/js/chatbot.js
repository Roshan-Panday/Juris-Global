// ── JURIS GLOBAL — INFORMATIONAL CHATBOT ──
// Gathers visitor details and directs to contact form / email
// No legal advice or consulting provided

class LexChatbot {
  constructor() {
    this.isOpen = false;
    this.hasGreeted = false;
    this.step = null; // tracks multi-step detail gathering
    this.userDetails = {};
    this.messagesArea = document.getElementById('lex-messages');
    this.input = document.getElementById('lex-input');
    this.firmPhone = '+91 89201 41417';
    this.firmEmail = 'info@jurisgloballegalsolution.com';
    this.setupListeners();
    // No auto-popup — user must click the button
  }
  
  setupListeners() {
    const launcher = document.getElementById('lex-launcher');
    const closeBtn = document.getElementById('lex-close');
    const sendBtn  = document.getElementById('lex-send');
    if (launcher) launcher.addEventListener('click', () => this.toggleWindow());
    if (closeBtn) closeBtn.addEventListener('click', () => this.toggleWindow());
    if (sendBtn)  sendBtn.addEventListener('click', () => this.handleUserInput());
    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserInput();
      });
    }
  }
  
  toggleWindow() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('lex-window');
    if (win) win.classList.toggle('active', this.isOpen);
    if (this.isOpen && !this.hasGreeted) {
      this.hasGreeted = true;
      this.showGreeting();
    } else if (this.isOpen && this.input) {
      setTimeout(() => this.input.focus(), 300);
    }
  }
  
  showGreeting() {
    this.botTyping(() => {
      this.addMessage('bot', 'Welcome to Juris Global Legal Solutions — Advocates & Legal Consultants, New Delhi. How may I assist you today?');
      this.addOptions([
        { label: 'About the Firm', action: 'about' },
        { label: 'Our Areas of Practice', action: 'practice' },
        { label: 'Courts We Appear Before', action: 'courts' },
        { label: 'Send a Query / Contact Us', action: 'contact_flow' },
        { label: 'Office Hours & Location', action: 'hours' },
      ]);
    }, 800);
  }

  botTyping(callback, delay = 1000) {
    const id = 'typing-' + Date.now();
    if (!this.messagesArea) return;
    this.messagesArea.insertAdjacentHTML('beforeend', `
      <div class="typing-indicator" id="${id}"><span></span><span></span><span></span></div>
    `);
    this.scrollToBottom();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.remove();
      callback();
    }, delay);
  }
  
  addMessage(sender, text) {
    if (!this.messagesArea) return;
    const div = document.createElement('div');
    div.className = `lex-msg ${sender}`;
    div.style.fontFamily = "'Times New Roman', Times, serif";
    div.textContent = text;
    this.messagesArea.appendChild(div);
    this.scrollToBottom();
  }
  
  addOptions(options) {
    if (!this.messagesArea) return;
    const html = options.map(opt =>
      `<button class="lex-btn" style="font-family:'Times New Roman',Times,serif;" onclick="window.lex.handleOption('${opt.action}', '${opt.label.replace(/'/g,"\\'")}'">${opt.label}</button>`
    ).join('');
    this.messagesArea.insertAdjacentHTML('beforeend', `<div class="lex-options">${html}</div>`);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesArea) this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
  }
  
  handleOption(action, label) {
    this.addMessage('user', label);
    document.querySelectorAll('.lex-options').forEach(el => el.style.display = 'none');
    this.botTyping(() => this.executeAction(action));
  }

  executeAction(action) {
    switch(action) {
      case 'about':
        this.addMessage('bot', 'Juris Global Legal Solutions is a full-service law firm established in 2009, headquartered in Jangpura Extension, New Delhi. We appear before the Supreme Court of India, all major High Courts, District Courts, and 50+ Tribunals. Our advocates handle civil, criminal, property, matrimonial, NRI, corporate, constitutional and all other legal matters.');
        this.addOptions([
          { label: 'Our Areas of Practice', action: 'practice' },
          { label: 'Send a Query', action: 'contact_flow' },
          { label: 'Back to Start', action: 'restart' },
        ]);
        break;
      case 'practice':
        this.addMessage('bot', 'We handle all areas of law including: Property & Real Estate · Criminal Law (Bail, Trial, FIR Quashing) · Civil Suits & Litigation · Matrimonial & Family Law · NRI Legal Services · Constitutional & Writ Petitions · Succession & Wills · Corporate & Company Law · Banking & Debt Recovery · Consumer Protection · Cyber Law · Labour & Service Law · Arbitration · RERA · Cheque Bounce (NI Act) · PMLA · NDPS · and more.');
        this.addOptions([
          { label: 'Send a Query', action: 'contact_flow' },
          { label: 'Back to Start', action: 'restart' },
        ]);
        break;
      case 'courts':
        this.addMessage('bot', "We appear before: Supreme Court of India · Delhi High Court · Punjab & Haryana High Court · Allahabad High Court · Bombay High Court · NCLT & NCLAT · DRT & DRAT · Consumer Forums (NCDRC) · RERA Authorities · CAT · AFT · ITAT · NGT · Family Courts · District Courts across Delhi, NCR, UP, Haryana, Punjab, Maharashtra & other states.");
        this.addOptions([
          { label: 'Send a Query', action: 'contact_flow' },
          { label: 'Back to Start', action: 'restart' },
        ]);
        break;
      case 'hours':
        this.addMessage('bot', 'Office Hours: Monday–Friday: 10:00 AM – 7:00 PM IST | Saturday: 10:00 AM – 3:00 PM IST. Head Office: K69, First Floor, Jangpura Extension, New Delhi – 110014. For queries, please email us at info@jurisgloballegalsolution.com or call +91 89201 41417.');
        this.addOptions([
          { label: 'Send a Query', action: 'contact_flow' },
          { label: 'Back to Start', action: 'restart' },
        ]);
        break;
      case 'contact_flow':
        this.addMessage('bot', 'To send us a query, please provide a few details. This is not legal advice — our team will review your query and respond within 24 hours. What is your name?');
        this.step = 'get_name';
        if (this.input) this.input.focus();
        break;
      case 'restart':
        this.addMessage('bot', 'How else may I assist you?');
        this.step = null;
        this.addOptions([
          { label: 'About the Firm', action: 'about' },
          { label: 'Our Areas of Practice', action: 'practice' },
          { label: 'Courts We Appear Before', action: 'courts' },
          { label: 'Send a Query / Contact Us', action: 'contact_flow' },
          { label: 'Office Hours & Location', action: 'hours' },
        ]);
        break;
      default:
        this.addMessage('bot', 'For any queries, please email us at info@jurisgloballegalsolution.com or visit the Contact section on our website.');
        break;
    }
  }
  
  handleUserInput() {
    if (!this.input) return;
    const val = this.input.value.trim();
    if (!val) return;
    this.addMessage('user', val);
    this.input.value = '';
    document.querySelectorAll('.lex-options').forEach(el => el.style.display = 'none');

    if (this.step) {
      this.handleDetailStep(val);
      return;
    }

    // Basic keyword matching for informational responses
    const lower = val.toLowerCase();
    const delay = Math.min(800 + (val.length * 10), 2000);
    this.botTyping(() => {
      if (lower.includes('criminal') || lower.includes('bail') || lower.includes('fir') || lower.includes('fraud') || lower.includes('cheating')) {
        this.addMessage('bot', 'We handle all criminal matters including bail applications (regular & anticipatory), FIR quashing, trial defence, cheque bounce (NI Act), economic offences, PMLA, NDPS, cyber crimes, and more. Please send a query for further assistance.');
      } else if (lower.includes('property') || lower.includes('real estate') || lower.includes('rera') || lower.includes('land')) {
        this.addMessage('bot', 'We handle all property matters including title disputes, sale/purchase agreement disputes, illegal possession, builder-buyer disputes (RERA), NRI property management, ancestral property, and more.');
      } else if (lower.includes('divorce') || lower.includes('matrimon') || lower.includes('custody') || lower.includes('family')) {
        this.addMessage('bot', 'We handle all matrimonial and family law matters including contested and mutual divorce, child custody, maintenance, domestic violence, and cross-border NRI matrimonial cases.');
      } else if (lower.includes('nri') || lower.includes('abroad') || lower.includes('overseas') || lower.includes('foreign')) {
        this.addMessage('bot', 'We represent NRI clients in all legal matters remotely. Our services include property disputes, matrimonial cases, succession, criminal matters, and all other areas of law. Consultations are conducted via video call on a paid basis.');
      } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge') || lower.includes('price') || lower.includes('consultation')) {
        this.addMessage('bot', 'Consultations are conducted on a paid basis. Fees vary depending on the nature and complexity of the matter. Please send a query via the contact form or email info@jurisgloballegalsolution.com to discuss your matter.');
      } else if (lower.includes('contact') || lower.includes('call') || lower.includes('email') || lower.includes('reach')) {
        this.addMessage('bot', `You may contact us at:\n📞 ${this.firmPhone}\n✉️ ${this.firmEmail}\nOffice Hours: Mon–Fri 10AM–7PM, Sat 10AM–3PM IST.`);
      } else {
        this.addMessage('bot', 'Thank you for your message. For specific legal queries, please use the contact form on our website or email us at info@jurisgloballegalsolution.com. Our team will respond within 24 hours.');
      }
      this.addOptions([
        { label: 'Send a Query', action: 'contact_flow' },
        { label: 'Back to Start', action: 'restart' },
      ]);
    }, delay);
  }

  handleDetailStep(val) {
    this.botTyping(() => {
      if (this.step === 'get_name') {
        this.userDetails.name = val;
        this.addMessage('bot', `Thank you, ${val}. What type of legal matter do you need assistance with? (e.g. Criminal, Property, Matrimonial, NRI, Civil, Corporate, etc.)`);
        this.step = 'get_matter';
      } else if (this.step === 'get_matter') {
        this.userDetails.matter = val;
        this.addMessage('bot', 'Please provide a brief description of your situation. (Note: Do not include sensitive or confidential information at this stage.)');
        this.step = 'get_desc';
      } else if (this.step === 'get_desc') {
        this.userDetails.desc = val;
        this.addMessage('bot', 'What is the best way to reach you? Please provide your email address or phone number.');
        this.step = 'get_contact';
      } else if (this.step === 'get_contact') {
        this.userDetails.contact = val;
        this.step = null;
        // Build email body
        const subject = encodeURIComponent(`Query from ${this.userDetails.name} — ${this.userDetails.matter}`);
        const body = encodeURIComponent(
          `Name: ${this.userDetails.name}\nMatter: ${this.userDetails.matter}\nDescription: ${this.userDetails.desc}\nContact: ${this.userDetails.contact}`
        );
        this.addMessage('bot', `Thank you, ${this.userDetails.name}. Your details have been noted. Click the button below to send your query to our team on WhatsApp. We will respond within 24 hours.`);
        // Build WhatsApp message
        const waText = encodeURIComponent(
          `Hello Juris Global Legal Solutions,\n\nName: ${this.userDetails.name}\nMatter: ${this.userDetails.matter}\nDescription: ${this.userDetails.desc}\nContact: ${this.userDetails.contact}`
        );
        this.messagesArea.insertAdjacentHTML('beforeend', `
          <div class="lex-options">
            <a href="https://wa.me/918920141417?text=${waText}" target="_blank" class="lex-btn" style="font-family:'Times New Roman',Times,serif;display:inline-block;text-decoration:none;background:#25D366;color:#fff;border-radius:8px;padding:10px 18px;">&#128172; Send Query on WhatsApp &rarr;</a>
          </div>
        `);
        this.scrollToBottom();
      }
    }, 700);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  window.lex = new LexChatbot();
});
