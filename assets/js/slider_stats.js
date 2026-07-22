/* ════════════════════════════════════════════════════
   TEAM INFINITE SLIDER — HOME PAGE
════════════════════════════════════════════════════ */
(function initTeamSlider() {
  const track = document.getElementById('team-slider-track');
  if (!track) return;

  const members = typeof getTeamMembers === 'function' ? getTeamMembers() : [];
  if (!members || members.length === 0) return;

  function getInits(name) {
    return name.split(' ').filter(w => /[A-Z]/.test(w[0])).map(w => w[0]).join('').slice(0,2) || name.slice(0,2).toUpperCase();
  }

  function buildCard(m) {
    const topTags = (m.tags || '').split(',').slice(0,2).map(t => '<span class="ts-tag">' + t.trim() + '</span>').join('');
    const inits = getInits(m.name);
    const imgHtml = m.photo
      ? '<img src="' + m.photo + '" alt="' + m.name + '" onerror="this.style.display=\'none\'">' 
      : inits;
    const shortRole = (m.role || '').split(/[-—]/)[0].trim();
    const enrolOrg = (m.enrollment || '').split(/[-—]/)[0].trim();

    return '<a href="profile.html?id=' + m.id + '" class="ts-card">'
      + '<div class="ts-card-img">' + imgHtml + '</div>'
      + '<div class="ts-card-name">' + m.name + '</div>'
      + '<div class="ts-card-role">' + shortRole + '</div>'
      + '<div class="ts-card-location">' + enrolOrg + '</div>'
      + '<div class="ts-card-tags">' + topTags + '</div>'
      + '</a>';
  }

  // Build and duplicate for seamless infinite loop
  const cardsHtml = members.map(buildCard).join('');
  track.innerHTML = cardsHtml + cardsHtml;

  // Manual nav buttons
  let manualOffset = 0;
  const CARD_W = 244; // 220px card + 24px gap

  window.sliderNext = function() {
    track.style.animation = 'none';
    manualOffset -= CARD_W;
    const half = track.scrollWidth / 2;
    if (Math.abs(manualOffset) >= half) manualOffset = 0;
    track.style.transform = 'translateX(' + manualOffset + 'px)';
  };
  window.sliderPrev = function() {
    track.style.animation = 'none';
    manualOffset += CARD_W;
    const half = track.scrollWidth / 2;
    if (manualOffset > 0) manualOffset = -(half - CARD_W);
    track.style.transform = 'translateX(' + manualOffset + 'px)';
  };

  // Resume auto-scroll after manual nav (3 seconds later)
  ['sliderNext','sliderPrev'].forEach(fn => {
    const orig = window[fn];
    window[fn] = function() {
      orig();
      clearTimeout(window._sliderResumeTimer);
      window._sliderResumeTimer = setTimeout(() => {
        track.style.animation = '';
      }, 3000);
    };
  });
})();

/* ════════════════════════════════════════════════════
   STATS COUNTER ANIMATION
════════════════════════════════════════════════════ */
(function initStatsCounter() {
  var fired = false;

  function animateCounters() {
    if (fired) return;
    var section = document.getElementById('stats-bar');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.9) return;

    fired = true;

    document.querySelectorAll('.stat-num[data-target], .ps-num[data-target]').forEach(function(el) {
      var target = parseInt(el.dataset.target, 10);
      var suffix = el.dataset.suffix || '';
      if (el.dataset.mode === 'year') { el.textContent = target; return; }

      var duration = 1800;
      var start = null;

      function step(now) {
        if (!start) start = now;
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(step);
    });
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  window.addEventListener('load', function() { setTimeout(animateCounters, 300); });
})();
