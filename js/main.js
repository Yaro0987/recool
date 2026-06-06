// ─── Main Entry Point ───
var RecoolApp = RecoolApp || {};

// ─── Data Store ───
RecoolApp.data = {};

// ─── Get page name from pathname ───
RecoolApp.getPage = function() {
  var path = location.pathname.replace(/\/+$/, '');
  var parts = path.split('/');
  var page = 'home';
  for (var i = 0; i < parts.length; i++) {
    if (this.partials[parts[i]]) {
      page = parts.slice(i).join('/');
      break;
    }
  }
  return page;
};

// ─── Get WhatsApp base URL from site data ───
RecoolApp.getWhatsAppBase = function() {
  var social = this.data.site && this.data.site.social;
  if (!social) return 'https://wa.me';
  for (var i = 0; i < social.length; i++) {
    if (social[i].icon === 'whatsapp') return social[i].url;
  }
  return 'https://wa.me';
};

// ─── Find product by slug ───
RecoolApp.getProductBySlug = function(slug) {
  var products = this.data.products;
  if (!products) return null;
  for (var i = 0; i < products.length; i++) {
    if (products[i].slug === slug) return products[i];
  }
  return null;
};

// ─── SPA navigation ───
RecoolApp.navigate = function(path) {
  var fullPath = path.indexOf('/') === 0 ? path : this.basePath + path;
  history.pushState(null, '', fullPath);
  this.router();
};

// ─── Init: load JSON data + partials, then start ───
RecoolApp.init = function() {
  var self = this;
  var p = location.pathname.split('/');
  self.basePath = p[1] ? '/' + p[1] + '/' : '/';
  var files = ['site','home','products','about','contact','faq','shipping','returns','size-guide'];
  var promises = files.map(function(name) {
    return fetch('datas/' + name + '.json').then(function(r) { return r.json(); }).then(function(d) { self.data[name] = d; });
  });
  // Load header + footer partials
  promises.push(fetch('pages/header.html').then(function(r) { return r.text(); }).then(function(h) { self.headerHTML = h; }));
  promises.push(fetch('pages/footer.html').then(function(r) { return r.text(); }).then(function(h) { self.footerHTML = h; }));

  Promise.all(promises).then(function() {
    // Clean up any lingering hash from old links/bookmarks
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    self.router();
    self.bindNavClicks();
    window.addEventListener('popstate', function() { self.router(); });
  });
};

// ─── Bind UI elements (mobile nav, popup, detail) ───
RecoolApp.bindUI = function() {
  // Mobile nav
  (function() {
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('menuOverlay');
    if (!hamburger || !menu || !overlay) return;
    function openMenu() { hamburger.classList.add('open'); menu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { hamburger.classList.remove('open'); menu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }
    hamburger.addEventListener('click', function() { menu.classList.contains('open') ? closeMenu() : openMenu(); });
    overlay.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeMenu); });
    window.addEventListener('popstate', closeMenu);
  })();

  // Request popup
  (function() {
    var btn = document.getElementById('requestBtn');
    var mbtn = document.getElementById('menuRequest');
    var overlay = document.getElementById('popupOverlay');
    var panel = document.getElementById('popupPanel');
    var close = document.getElementById('closePopup');
    if (!btn || !overlay || !panel || !close) return;
    function open() { overlay.classList.add('open'); panel.classList.add('open'); }
    function closeFn() { overlay.classList.remove('open'); panel.classList.remove('open'); }
    btn.addEventListener('click', open);
    if (mbtn) mbtn.addEventListener('click', function() {
      var mm = document.getElementById('mobileMenu');
      var mo = document.getElementById('menuOverlay');
      if (mm) mm.classList.remove('open'); if (mo) mo.classList.remove('open'); document.body.style.overflow = '';
      open();
    });
    close.addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeFn(); });
  })();

  // Detail overlay
  (function() {
    if (RecoolApp._detailBound) return;
    RecoolApp._detailBound = true;
    var dc = document.getElementById('detailClose');
    var do2 = document.getElementById('detailOverlay');
    if (dc) dc.addEventListener('click', function() { RecoolApp.closeDetail(); });
    if (do2) do2.addEventListener('click', function(e) { if (e.target === this) RecoolApp.closeDetail(); });
    var cl = document.getElementById('copyLink');
    if (cl) cl.addEventListener('click', function() { RecoolApp.copyCurrentLink(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') RecoolApp.closeDetail(); });
  })();
};

// ─── Page partials map ───
RecoolApp.partials = {
  'home': 'pages/home.html',
  'collections': 'pages/collections.html',
  'about': 'pages/about.html',
  'contact': 'pages/contact.html',
  'faq': 'pages/faq.html',
  'shipping': 'pages/shipping.html',
  'returns': 'pages/returns.html',
  'size-guide': 'pages/size-guide.html',
  'compare': 'pages/compare.html'
};

// ─── Page populator map ───
RecoolApp.populators = {
  'home': 'populateHome',
  'collections': 'populateCollections',
  'about': 'populateAbout',
  'contact': 'populateContact',
  'faq': 'populateFaq',
  'shipping': 'populateShipping',
  'returns': 'populateReturns',
  'size-guide': 'populateSizeGuide',
  'compare': 'populateCompare'
};

// ─── Loader ───
RecoolApp.showLoader = function() {
  var loader = document.getElementById('loader');
  if (loader) loader.classList.remove('hidden');
};

RecoolApp.hideLoader = function() {
  var loader = document.getElementById('loader');
  if (loader) {
    // Minimum 1.2s display
    var elapsed = Date.now() - (this._loaderStart || Date.now());
    var remaining = Math.max(0, 1200 - elapsed);
    var self = this;
    setTimeout(function() { loader.classList.add('hidden'); self._loaderStart = null; }, remaining);
  }
};

// ─── Router ───
RecoolApp.router = function() {
  var self = this;
  var pageName = self.getPage();

  // Product detail route: collections/product-slug
  if (pageName.indexOf('collections/') === 0) {
    var slug = pageName.replace('collections/', '');
    self.renderProductDetail(slug);
    return;
  }

  var page = self.partials[pageName];
  if (!page) { self.navigate('home'); return; }

  self._loaderStart = Date.now();
  self.showLoader();

  // Fetch page partial
  fetch(page).then(function(r) { return r.text(); }).then(function(html) {
    var content = document.getElementById('pageContent');
    var header = document.getElementById('header');
    var footer = document.getElementById('footer');

    // Inject header + footer
    if (header) header.innerHTML = self.headerHTML;
    if (footer) footer.innerHTML = self.footerHTML;

    // Inject page content
    if (content) content.innerHTML = html;

    // Bind UI after DOM injection
    self.bindUI();

    // Populate shell (nav, footer links, social)
    self.populateShell();

    // Populate page content from data
    var fn = self.populators[pageName];
    if (fn) self[fn]();

    // Set meta tags
    self.setMeta(pageName);

    // Update nav active
    document.querySelectorAll('#headerNav a, #mobileNavLinks a').forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === pageName || (pageName === 'collections' && a.getAttribute('href') === 'collections'));
    });

    // Scroll + hide loader
    window.scrollTo(0, 0);
    self.hideLoader();
  });
};

// ─── Render product detail page ───
RecoolApp.renderProductDetail = function(slug) {
  var self = this;
  var product = self.getProductBySlug(slug);
  if (!product) { self.navigate('collections'); return; }

  self._loaderStart = Date.now();
  self.showLoader();

  var header = document.getElementById('header');
  var footer = document.getElementById('footer');
  var content = document.getElementById('pageContent');
  if (header) header.innerHTML = self.headerHTML;
  if (footer) footer.innerHTML = self.footerHTML;
  self.bindUI();
  self.populateShell();

  var waBase = self.getWhatsAppBase();
  var waUrl = waBase + product.shareOnWhatsApp;
  var fullUrl = location.origin + self.basePath.replace(/\/$/, '') + product.url;
  var shareText = encodeURIComponent(product.name + ' \u2014 ' + fullUrl);

  var featHtml = '';
  product.features.forEach(function(f) { featHtml += '<li>' + f + '</li>'; });

  var waSvg = RecoolApp.SVGS['whatsapp'];
  var linkSvg = RecoolApp.SVGS['link'];
  var fbSvg = RecoolApp.SVGS['facebook'];
  var twSvg = RecoolApp.SVGS['twitter'];

  var html =
    '<div class="page-wrap product-detail">' +
      '<div class="detail-layout" style="max-width:1200px;margin:0 auto;padding:40px 44px;">' +
        '<div class="detail-img"><img src="' + product.imageUrl + '" alt="' + product.name + '" style="width:100%;border-radius:16px;display:block;" /></div>' +
        '<div class="detail-info">' +
          '<div class="detail-brand">' + product.name.split(' ')[0] + '</div>' +
          '<h1>' + product.name + '</h1>' +
          '<div class="detail-sub">' + (product.subtitle || '') + '</div>' +
          '<p>' + product.description + '</p>' +
          '<ul>' + featHtml + '</ul>' +
          '<div class="detail-actions" style="margin-top:24px;">' +
            '<a class="icon-btn" href="' + waUrl + '" target="_blank" title="Share on WhatsApp">' + waSvg + '</a>' +
            '<button class="icon-btn" onclick="RecoolApp.copyProductLink(' + product.id + ')" title="Copy Link">' + linkSvg + '</button>' +
            '<a class="icon-btn" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fullUrl) + '" target="_blank" title="Share on Facebook">' + fbSvg + '</a>' +
            '<a class="icon-btn" href="https://twitter.com/intent/tweet?text=' + shareText + '" target="_blank" title="Share on Twitter">' + twSvg + '</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  if (content) content.innerHTML = html;

  // Add related products (exclude current product)
  var relHtml = self.renderRelatedPartial();
  if (content) content.insertAdjacentHTML('beforeend', relHtml);
  self.initRelated(slug);

  self.setMeta(product.slug, product);

  // Update nav active (collections highlighted on product pages)
  document.querySelectorAll('#headerNav a, #mobileNavLinks a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === 'collections');
  });

  window.scrollTo(0, 0);
  self.hideLoader();
};

// ─── Intercept internal link clicks for SPA ───
RecoolApp.bindNavClicks = function() {
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('://') !== -1 || href.indexOf('mailto:') === 0 || a.hasAttribute('target')) return;
    if (href === '') return;
    // Handle old hash links gracefully (backward compat)
    if (href.indexOf('#') === 0) {
      var clean = href.replace('#', '');
      if (clean === '' || clean === '/') clean = 'home';
      if (RecoolApp.partials[clean]) {
        e.preventDefault();
        RecoolApp.navigate(clean);
      }
      return;
    }
    if (href === '/') {
      e.preventDefault();
      RecoolApp.navigate('home');
      return;
    }
    if (RecoolApp.partials[href] || href.indexOf('collections/') === 0) {
      e.preventDefault();
      RecoolApp.navigate(href);
    }
  });
};

// ─── Start ───
RecoolApp.init();