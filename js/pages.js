// ─── Populate header/footer shell ───
RecoolApp.populateShell = function() {
  this.renderNav('headerNav');
  this.renderNav('mobileNavLinks');
  this.renderSocial('footerSocial');
  this.renderFooterLinks();
};

// ═══════════════════════════════════════
//  PAGE: HOME
// ═══════════════════════════════════════
RecoolApp.populateHome = function() {
  var d = this.data.home;

  // Hero slider
  this.heroInit(d.slides);

  // Featured (with overlays, links to product pages)
  var fg = document.getElementById('featuredGrid');
  if (fg) {
    var products = this.data.products;
    var waBase = this.getWhatsAppBase();
    var h3 = '';
    d.featured.forEach(function(f2, fi) {
      var pi = f2.pid;
      var p = products[pi];
      var waUrl = waBase + (p.shareOnWhatsApp || '?text=' + encodeURIComponent(f2.brand + ' ' + f2.name));
      h3 += '<div class="item" data-slug="' + (p.slug || '') + '">';
      h3 += '<div class="img-wrap" style="position:relative;overflow:hidden;">';
      h3 += '<img src="' + f2.image + '" alt="" loading="lazy" />';
      h3 += '<div class="overlay">';
      h3 += '<a class="icon-btn" href="' + waUrl + '" target="_blank" title="Share on WhatsApp"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>';
      h3 += '<button class="icon-btn" onclick="event.stopPropagation();RecoolApp.addCompare(' + pi + ')" title="Compare"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 6h-2v14H5V6H3v14a2 2 0 002 2h14a2 2 0 002-2V6z"/><path d="M13 6h-2V2h2v4zm3-4h2v4h-2V2zM8 2H6v4h2V2z"/></svg></a>';
      h3 += '<button class="icon-btn" onclick="event.stopPropagation();RecoolApp.copyProductLink(' + pi + ')" title="Copy Link"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-2.24 5-5s-2.24-5-5-5z"/></svg></a>';
      h3 += '</div></div><div class="info"><div class="brand">' + f2.brand + '</div><div class="name">' + f2.name + '</div></div></div>';
    });
    fg.innerHTML = h3;
    // Click to navigate to product page
    fg.querySelectorAll('.item').forEach(function(el) {
      el.addEventListener('click', function() {
        var slug = this.dataset.slug;
        if (slug) RecoolApp.navigate('collections/' + slug);
      });
    });
  }

  // Services
  var sg = document.getElementById('servicesGrid');
  if (sg) {
    var h4 = '';
    d.services.forEach(function(svc) {
      h4 += '<div class="service-card"><div class="sicon">' + (this.SVGS[svc.icon] || '') + '</div><h4>' + svc.title + '</h4><p>' + svc.desc + '</p></div>';
    }, this);
    sg.innerHTML = h4;
  }

  // Testimonials (auto-slide carousel)
  var tt = document.getElementById('testimonialTrack');
  var td = document.getElementById('testimonialDots');
  if (tt) {
    var h5 = '';
    d.testimonials.forEach(function(t2) {
      var stars = '';
      for (var si = 0; si < 5; si++) { stars += '<svg viewBox="0 0 24 24" class="' + (si < t2.rating ? '' : 'empty') + '"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'; }
      h5 += '<div class="testimonial-slide"><div class="testimonial-card"><div class="stars">' + stars + '</div><p>"' + t2.text + '"</p><div class="author"><strong>' + t2.name + '</strong><span>' + t2.role + '</span></div></div></div>';
    });
    tt.innerHTML = h5;
    if (td) {
      var dh = '';
      d.testimonials.forEach(function(t2, i) { dh += '<span' + (i === 0 ? ' class="active"' : '') + ' data-ti="' + i + '"></span>'; });
      td.innerHTML = dh;
    }
    // Init testimonial carousel
    setTimeout(function() {
      var slides = document.querySelectorAll('.testimonial-slide');
      var dots = document.querySelectorAll('#testimonialDots span');
      var current = 0;
      if (!slides.length) return;
      function goT(i) {
        if (i < 0) i = slides.length - 1;
        if (i >= slides.length) i = 0;
        current = i;
        tt.style.transform = 'translateX(-' + (i * 100) + '%)';
        dots.forEach(function(d) { d.classList.toggle('active', parseInt(d.dataset.ti) === i); });
      }
      dots.forEach(function(d) { d.addEventListener('click', function() { goT(parseInt(this.dataset.ti)); }); });
      setInterval(function() { goT(current + 1); }, 4500);
    }, 100);
  }

  // Features
  var ftg = document.getElementById('featuresGrid');
  if (ftg) {
    ftg.innerHTML =
      '<div class="feat-card"><div class="f-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#111"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg></div><h4>Premium Materials</h4><p>Top-grain leather, breathable mesh, and sustainable fabrics sourced globally.</p></div>' +
      '<div class="feat-card"><div class="f-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#111"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><h4>Certified Quality</h4><p>Each pair undergoes 25+ quality checks before it reaches your doorstep.</p></div>' +
      '<div class="feat-card"><div class="f-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#111"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg></div><h4>Perfect Fit</h4><p>Engineered for all-day comfort with ergonomic insoles and arch support.</p></div>' +
      '<div class="feat-card"><div class="f-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="#111"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div><h4>30-Day Guarantee</h4><p>Love them or return them. Free shipping, no questions asked.</p></div>';
  }

};

// ═══════════════════════════════════════
//  HERO SLIDER
// ═══════════════════════════════════════
RecoolApp.heroOff = function() {
  var wrap = document.querySelector('.hero-image-wrap');
  if (!wrap) return 480;
  var w = wrap.offsetWidth;
  return Math.max(20, w / 2 - 80);
};

RecoolApp.heroInit = function(slides) {
  this.heroSlides = slides;
  this.heroIdx = 0;
  this.heroBusy = false;
  var n = slides.length;
  var img1 = document.getElementById('heroImage');
  var img2 = document.getElementById('heroNext');
  if (img1) img1.src = slides[0].image;
  if (img2) { img2.src = slides[1 % n].image; img2.style.transition = 'none'; img2.style.transform = 'translate(-50%,-50%) translateX(' + this.heroOff() + 'px) scale(0.15)'; img2.style.opacity = '0'; }
  var cl = document.getElementById('carouselLeft');
  if (cl) cl.src = slides[(0 - 1 + n) % n].image;
  var cr = document.getElementById('carouselRight');
  if (cr) cr.src = slides[1 % n].image;
  this.heroUpdateText(slides[0]);
  this.heroBindClicks();
  var self = this;
  clearInterval(this.heroTimer);
  this.heroTimer = setInterval(function() { self.heroNext(); }, 4000);
};

RecoolApp.heroUpdateText = function(c) {
  var b = document.getElementById('heroBrand'); if (b) b.textContent = c.brand;
  var bg = document.getElementById('heroBadge'); if (bg) bg.textContent = c.badge;
  var t = document.getElementById('heroTitle'); if (t) t.innerHTML = c.title + '<br /><span class="light">' + c.subtitle + '</span>';
  var d2 = document.getElementById('heroDesc'); if (d2) d2.textContent = c.desc;
  var f = document.getElementById('heroFeature'); if (f) f.textContent = c.feature;
  var p = document.getElementById('heroPrice'); if (p) p.textContent = c.price;
};

RecoolApp.heroAnim = function(dir) {
  if (this.heroBusy) return;
  this.heroBusy = true;
  var n = this.heroSlides.length;
  var slides = this.heroSlides;
  var img1 = document.getElementById('heroImage');
  var img2 = document.getElementById('heroNext');
  if (!img1 || !img2) { this.heroBusy = false; return; }
  var off = this.heroOff();
  var self = this;

  if (dir === 1) {
    var nextIdx = (this.heroIdx + 1) % n;
    // New image starts at the right carousel thumbnail position (small, low opacity)
    img2.src = slides[nextIdx].image;
    img2.style.transition = 'none';
    img2.style.transform = 'translate(-50%,-50%) translateX(' + off + 'px) scale(0.15)';
    img2.style.opacity = '0';
    // Current image at center
    img1.style.transition = 'none';
    img1.style.transform = 'translate(-50%,-50%)';
    img1.style.opacity = '1';
    img1.style.zIndex = '2';
    void img2.offsetHeight;
    // Animate: incoming slides from right to center, current slides from center to left
    img2.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    img1.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    img2.style.transform = 'translate(-50%,-50%)';
    img2.style.opacity = '1';
    img2.style.zIndex = '2';
    img1.style.transform = 'translate(-50%,-50%) translateX(-' + off + 'px) scale(0.15)';
    img1.style.opacity = '0';
    img1.style.zIndex = '1';
    setTimeout(function() {
      self.heroIdx = nextIdx;
      var idx = self.heroIdx;
      // Reset: img1 becomes current, img2 goes back to right carousel position
      img1.src = slides[idx].image;
      img1.style.transition = 'none';
      img1.style.transform = 'translate(-50%,-50%)';
      img1.style.opacity = '1';
      img1.style.zIndex = '2';
      img2.style.transition = 'none';
      img2.style.transform = 'translate(-50%,-50%) translateX(' + off + 'px) scale(0.15)';
      img2.style.opacity = '0';
      img2.style.zIndex = '1';
      var cl = document.getElementById('carouselLeft');
      if (cl) cl.src = slides[(idx - 1 + n) % n].image;
      var cr = document.getElementById('carouselRight');
      if (cr) cr.src = slides[(idx + 1) % n].image;
      self.heroBusy = false;
      self.heroUpdateText(slides[idx]);
    }, 620);
  } else {
    var prevIdx = (this.heroIdx - 1 + n) % n;
    // New image starts at the left carousel thumbnail position
    img2.src = slides[prevIdx].image;
    img2.style.transition = 'none';
    img2.style.transform = 'translate(-50%,-50%) translateX(-' + off + 'px) scale(0.15)';
    img2.style.opacity = '0';
    img1.style.transition = 'none';
    img1.style.transform = 'translate(-50%,-50%)';
    img1.style.opacity = '1';
    img1.style.zIndex = '2';
    void img2.offsetHeight;
    // Animate: incoming from left to center, current from center to right
    img2.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    img1.style.transition = 'all 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    img2.style.transform = 'translate(-50%,-50%)';
    img2.style.opacity = '1';
    img2.style.zIndex = '2';
    img1.style.transform = 'translate(-50%,-50%) translateX(' + off + 'px) scale(0.15)';
    img1.style.opacity = '0';
    img1.style.zIndex = '1';
    setTimeout(function() {
      self.heroIdx = prevIdx;
      var idx = self.heroIdx;
      img1.src = slides[idx].image;
      img1.style.transition = 'none';
      img1.style.transform = 'translate(-50%,-50%)';
      img1.style.opacity = '1';
      img1.style.zIndex = '2';
      img2.style.transition = 'none';
      img2.style.transform = 'translate(-50%,-50%) translateX(' + off + 'px) scale(0.15)';
      img2.style.opacity = '0';
      img2.style.zIndex = '1';
      var cl = document.getElementById('carouselLeft');
      if (cl) cl.src = slides[(idx - 1 + n) % n].image;
      var cr = document.getElementById('carouselRight');
      if (cr) cr.src = slides[(idx + 1) % n].image;
      self.heroBusy = false;
      self.heroUpdateText(slides[idx]);
    }, 620);
  }
};

RecoolApp.heroNext = function() { this.heroAnim(1); };
RecoolApp.heroPrev = function() { this.heroAnim(-1); };

RecoolApp.heroBindClicks = function() {
  var self = this;
  var cl = document.getElementById('carouselLeft');
  var cr = document.getElementById('carouselRight');
  if (cl) cl.addEventListener('click', function() { clearInterval(self.heroTimer); self.heroPrev(); self.heroTimer = setInterval(function() { self.heroNext(); }, 4000); });
  if (cr) cr.addEventListener('click', function() { clearInterval(self.heroTimer); self.heroNext(); self.heroTimer = setInterval(function() { self.heroNext(); }, 4000); });
};

// ═══════════════════════════════════════
//  PAGE: COLLECTIONS
// ═══════════════════════════════════════
RecoolApp.populateCollections = function() {
  var self = this;
  var products = self.data.products;
  var waBase = self.getWhatsAppBase();

  self.compareList = JSON.parse(localStorage.getItem('recool_compare') || '[]');
  self.currentDetail = null;

  var grid = document.getElementById('galleryGrid');
  if (!grid) return;
  products.forEach(function(p, i) {
    var waUrl = waBase + (p.shareOnWhatsApp || '?text=' + encodeURIComponent(p.name));
    var card = document.createElement('div');
    card.className = 'product-card';
    var brand = p.brand || p.name.split(' ')[0];
    card.innerHTML = '<div class="img-wrap"><img src="' + (p.image || p.imageUrl) + '" alt="' + p.name + '" loading="lazy" /><div class="overlay"><a class="icon-btn" href="' + waUrl + '" target="_blank" title="Share on WhatsApp"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a><button class="icon-btn" onclick="event.stopPropagation();RecoolApp.addCompare(' + i + ')" title="Compare"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 6h-2v14H5V6H3v14a2 2 0 002 2h14a2 2 0 002-2V6z"/><path d="M13 6h-2V2h2v4zm3-4h2v4h-2V2zM8 2H6v4h2V2z"/></svg></a><button class="icon-btn" onclick="event.stopPropagation();RecoolApp.copyProductLink(' + i + ')" title="Copy Link"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-2.24 5-5s-2.24-5-5-5z"/></svg></a></div></div><div class="info"><div class="brand">' + brand + '</div><div class="name">' + p.name + '</div></div>';
    card.addEventListener('click', function() { RecoolApp.navigate('collections/' + p.slug); });
    grid.appendChild(card);
  });

  self.updateCompareBar();
};

// ═══════════════════════════════════════
//  PAGE: ABOUT
// ═══════════════════════════════════════
RecoolApp.populateAbout = function() {
  var d = this.data.about;
  var tg = document.getElementById('aboutTag'); if (tg) tg.textContent = d.hero.tag;
  var tt = document.getElementById('aboutTitle'); if (tt) tt.textContent = d.hero.title;
  var pa = document.getElementById('aboutParas'); if (pa) { pa.innerHTML = d.hero.paragraphs.map(function(p) { return '<p>' + p + '</p>'; }).join(''); }
  var im = document.getElementById('aboutImg'); if (im) im.src = d.hero.image;
  var va = document.getElementById('aboutValues'); if (va) { va.innerHTML = d.values.map(function(v) { return '<div class="val"><h3>' + v.title + '</h3><p>' + v.desc + '</p></div>'; }).join(''); }
  var tg2 = document.getElementById('teamGrid'); if (tg2) { tg2.innerHTML = d.team.map(function(t) { return '<div class="team-card"><div class="avatar" style="background:' + t.bg + ';"></div><h4>' + t.name + '</h4><span>' + t.role + '</span></div>'; }).join(''); }
  var mg = document.getElementById('milestoneGrid'); if (mg) { mg.innerHTML = d.milestones.map(function(m) { return '<div class="milestone"><div class="year">' + m.year + '</div><h4>' + m.title + '</h4><p>' + m.desc + '</p></div>'; }).join(''); }
  var ct = document.getElementById('ctaTitle'); if (ct) ct.textContent = d.cta.title;
  var cd = document.getElementById('ctaDesc'); if (cd) cd.textContent = d.cta.desc;
  var cb = document.getElementById('ctaBtn'); if (cb) { cb.textContent = d.cta.button; cb.href = d.cta.link; }
};

// ═══════════════════════════════════════
//  PAGE: CONTACT
// ═══════════════════════════════════════
RecoolApp.populateContact = function() {
  var d = this.data.contact;
  var s = this.data.site;
  var pt = document.getElementById('contactPageTitle'); if (pt) pt.textContent = d.pageTitle;
  var ch = document.getElementById('contactHeading'); if (ch) ch.textContent = d.heading;
  var cs = document.getElementById('contactSub'); if (cs) cs.textContent = d.subtitle;
  var ci = document.getElementById('contactInfoItems'); if (ci) { ci.innerHTML = d.infoItems.map(function(item) { return '<div class="info-item"><div class="icon">' + (RecoolApp.SVGS[item.icon] || '') + '</div><div class="text"><strong>' + item.label + '</strong><span>' + item.value + '</span></div></div>'; }).join(''); }
  var cs2 = document.getElementById('contactSocial');
  if (cs2) {
    var h = '';
    var order = ['facebook','whatsapp','instagram','twitter','youtube'];
    order.forEach(function(key) {
      var found = null;
      for (var si = 0; si < s.social.length; si++) { if (s.social[si].icon === key) { found = s.social[si]; break; } }
      if (!found) return;
      h += '<a href="' + found.url + '" target="_blank" aria-label="' + found.name + '">' + (RecoolApp.SVGS[key] || '') + '</a>';
    });
    cs2.innerHTML = h;
  }
  var cf = document.getElementById('contactFormFields'); if (cf) { cf.innerHTML = d.formFields.map(function(f) { return '<div class="form-group"><label>' + f.label + '</label><input type="' + (f.type || 'text') + '" placeholder="' + f.placeholder + '" ' + (f.required ? 'required' : '') + ' /></div>'; }).join(''); }
  var cm = document.getElementById('contactMap'); if (cm && d.mapUrl) cm.src = d.mapUrl;
};

// ═══════════════════════════════════════
//  PAGE: COMPARE
// ═══════════════════════════════════════
RecoolApp.populateCompare = function() {
  var self = this;
  var products = self.data.products;
  var list = JSON.parse(localStorage.getItem('recool_compare') || '[]');
  var grid = document.getElementById('compareGrid');
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" width="56" height="56" fill="#ddd"><path d="M21 6h-2v14H5V6H3v14a2 2 0 002 2h14a2 2 0 002-2V6z"/><path d="M13 6h-2V2h2v4zm3-4h2v4h-2V2zM8 2H6v4h2V2z"/></svg><h3>Nothing to compare</h3><p>Add products from the gallery to compare them side by side.</p><a href="collections" class="empty-btn">Browse Products</a></div>';
  } else {
    var h = '';
    list.forEach(function(id) {
      var p = products[id];
      if (!p) return;
      var feats = '';
      p.features.forEach(function(f) { feats += '<li>' + f + '</li>'; });
      h += '<div class="compare-card"><button class="remove" onclick="RecoolApp.removeCompare(' + id + ')" title="Remove">\u2715</button><div class="img-wrap"><img src="' + (p.image || p.imageUrl) + '" alt="' + p.name + '" /></div><div class="body"><div class="brand">' + (p.brand || p.name.split(' ')[0]) + '</div><h3>' + p.name + '</h3><ul class="specs">' + feats + '</ul></div></div>';
    });
    grid.innerHTML = h;
  }
};

RecoolApp.openDetail = function(i) {
  var p = this.data.products[i];
  if (!p) return;
  this.currentDetail = i;
  document.getElementById('detailImg').src = p.image || p.imageUrl;
  document.getElementById('detailBrand').textContent = p.brand || p.name.split(' ')[0];
  document.getElementById('detailName').textContent = p.name;
  document.getElementById('detailSub').textContent = p.subtitle || p.sub || '';
  document.getElementById('detailDesc').textContent = p.description || p.desc || '';
  var fl = document.getElementById('detailFeatures');
  if (fl) { fl.innerHTML = ''; (p.features || []).forEach(function(f) { var li = document.createElement('li'); li.textContent = f; fl.appendChild(li); }); }
  var waBase = RecoolApp.getWhatsAppBase();
  document.getElementById('shareWa').href = waBase + (p.shareOnWhatsApp || '?text=' + encodeURIComponent(p.name));
  document.getElementById('detailOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};

RecoolApp.closeDetail = function() {
  var do2 = document.getElementById('detailOverlay');
  if (do2) do2.classList.remove('open');
  document.body.style.overflow = '';
};

RecoolApp.copyProductLink = function(i) {
  var p = this.data.products[i];
  if (!p) return;
  var baseUrl = location.origin + (this.basePath || '/').replace(/\/$/, '');
  var url = p.url ? baseUrl + p.url : window.location.href;
  navigator.clipboard.writeText(p.name + ' \u2014 ' + url);
};

RecoolApp.copyCurrentLink = function() {
  if (this.currentDetail === null) return;
  this.copyProductLink(this.currentDetail);
};

RecoolApp.addCompare = function(id) {
  var list = JSON.parse(localStorage.getItem('recool_compare') || '[]');
  if (list.indexOf(id) === -1) list.push(id);
  localStorage.setItem('recool_compare', JSON.stringify(list));
  this.compareList = list;
  this.updateCompareBar();
};

RecoolApp.updateCompareBar = function() {
  var bar = document.getElementById('compareBar');
  if (!bar) return;
  var list = JSON.parse(localStorage.getItem('recool_compare') || '[]');
  if (list.length > 0) { bar.style.display = 'flex'; var cc = document.getElementById('compareCount'); if (cc) cc.textContent = list.length; }
  else { bar.style.display = 'none'; }
};

RecoolApp.detailCompare = function() {
  if (this.currentDetail !== null) this.addCompare(this.currentDetail);
  this.closeDetail();
};

RecoolApp.goCompare = function() {
  RecoolApp.navigate('compare');
};

RecoolApp.removeCompare = function(id) {
  var list = JSON.parse(localStorage.getItem('recool_compare') || '[]');
  var idx = list.indexOf(id);
  if (idx > -1) list.splice(idx, 1);
  localStorage.setItem('recool_compare', JSON.stringify(list));
  this.populateCompare();
};

// ═══════════════════════════════════════
//  SUPPORT PAGES
// ═══════════════════════════════════════
RecoolApp.populateFaq = function() {
  var d = this.data.faq;
  var pt = document.getElementById('faqPageTitle'); if (pt) pt.textContent = d.pageTitle;
  var fl = document.getElementById('faqList');
  if (fl) {
    var html = '';
    d.items.forEach(function(item, i) {
      html += '<div class="faq-item' + (i === 0 ? ' open' : '') + '"><div class="q"><span>' + item.q + '</span><span class="arrow">+</span></div><div class="a">' + item.a + '</div></div>';
    });
    fl.innerHTML = html;
  }
  // Accordion
  document.querySelectorAll('.faq-item').forEach(function(el) {
    el.addEventListener('click', function() { this.classList.toggle('open'); });
  });
};

RecoolApp.populatePolicy = function(dataKey, idPrefix) {
  var d = this.data[dataKey];
  var pt = document.getElementById(idPrefix + 'PageTitle');
  if (pt) pt.textContent = d.pageTitle;
  var sec = document.getElementById(idPrefix + 'Sections');
  if (sec) {
    sec.innerHTML = d.sections.map(function(s) { return '<div class="policy-section"><h3>' + s.title + '</h3><p>' + s.body + '</p></div>'; }).join('');
  }
};

RecoolApp.populateShipping = function() { this.populatePolicy('shipping', 'shipping'); };
RecoolApp.populateReturns = function() { this.populatePolicy('returns', 'returns'); };

RecoolApp.populateSizeGuide = function() {
  var d = this.data['size-guide'];
  var pt = document.getElementById('sgPageTitle'); if (pt) pt.textContent = d.pageTitle;
  var sc = document.getElementById('sgContent');
  if (sc) {
    var html = '<h3>' + d.menTitle + '</h3><table class="size-table"><thead><tr><th>US</th><th>UK</th><th>EU</th><th>CM</th></tr></thead><tbody>';
    d.menSizes.forEach(function(s) { html += '<tr><td>' + s.us + '</td><td>' + s.uk + '</td><td>' + s.eu + '</td><td>' + s.cm + '</td></tr>'; });
    html += '</tbody></table><h3 style="margin-top:40px;">' + d.womenTitle + '</h3><table class="size-table"><thead><tr><th>US</th><th>UK</th><th>EU</th><th>CM</th></tr></thead><tbody>';
    d.womenSizes.forEach(function(s) { html += '<tr><td>' + s.us + '</td><td>' + s.uk + '</td><td>' + s.eu + '</td><td>' + s.cm + '</td></tr>'; });
    html += '</tbody></table><h3 style="margin-top:40px;">Fit Tips</h3><ul class="tips-list">';
    d.tips.forEach(function(t) { html += '<li>' + t + '</li>'; });
    html += '</ul>';
    sc.innerHTML = html;
  }
};

