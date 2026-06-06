// ─── Meta configuration per page ───
RecoolApp.metaConfig = {
  home: {
    title: 'Recool — Premium Footwear',
    desc: 'Premium footwear curated for style and comfort. Discover the latest drops from top brands.',
    ogTitle: 'Recool — Premium Footwear',
    ogDesc: 'Premium footwear curated for style and comfort. Discover the latest drops from top brands.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  collections: {
    title: 'Collections — Recool',
    desc: 'Browse our full collection of sneakers, boots, and lifestyle footwear from top brands.',
    ogTitle: 'Collections — Recool',
    ogDesc: 'Browse our full collection of sneakers, boots, and lifestyle footwear from top brands.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  about: {
    title: 'About — Recool',
    desc: 'Learn about Recool — our story, our team, and our commitment to premium footwear.',
    ogTitle: 'About — Recool',
    ogDesc: 'Learn about Recool — our story, our team, and our commitment to premium footwear.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  contact: {
    title: 'Contact — Recool',
    desc: 'Get in touch with Recool. We would love to hear from you.',
    ogTitle: 'Contact — Recool',
    ogDesc: 'Get in touch with Recool. We would love to hear from you.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  compare: {
    title: 'Compare — Recool',
    desc: 'Compare your favorite sneakers side by side. Find the perfect pair for your style.',
    ogTitle: 'Compare — Recool',
    ogDesc: 'Compare your favorite sneakers side by side.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  faq: {
    title: 'FAQ — Recool',
    desc: 'Frequently asked questions about Recool products, shipping, returns, and more.',
    ogTitle: 'FAQ — Recool',
    ogDesc: 'Frequently asked questions about Recool products, shipping, returns, and more.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  shipping: {
    title: 'Shipping — Recool',
    desc: 'Learn about Recool shipping policies, delivery times, and tracking information.',
    ogTitle: 'Shipping — Recool',
    ogDesc: 'Learn about Recool shipping policies, delivery times, and tracking information.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  returns: {
    title: 'Returns — Recool',
    desc: 'Recool return policy — hassle-free 30-day returns. Start your return today.',
    ogTitle: 'Returns — Recool',
    ogDesc: 'Recool return policy — hassle-free 30-day returns.',
    ogImage: 'imgs/general/favicon.jpg'
  },
  'size-guide': {
    title: 'Size Guide — Recool',
    desc: 'Find your perfect fit with Recool size guide. Detailed measurements and fitting recommendations.',
    ogTitle: 'Size Guide — Recool',
    ogDesc: 'Find your perfect fit with Recool size guide.',
    ogImage: 'imgs/general/favicon.jpg'
  }
};

RecoolApp.defaultMeta = {
  title: 'Recool — Premium Footwear',
  desc: 'Premium footwear curated for style and comfort.',
  ogTitle: 'Recool — Premium Footwear',
  ogDesc: 'Premium footwear curated for style and comfort.',
  ogImage: 'imgs/general/favicon.jpg'
};

// ─── Build absolute URL with base path ───
RecoolApp.absUrl = function(path) {
  var base = (this.basePath || '/').replace(/\/$/, '');
  return location.origin + base + '/' + path.replace(/^\//, '');
};

// ─── Apply meta tags for current page ───
RecoolApp.setMeta = function(page, product) {
  var baseUrl = location.origin + (this.basePath || '/').replace(/\/$/, '');

  if (product) {
    var desc = product.metaDescription || product.description || '';
    var ogImage = this.absUrl(product.imageUrl);
    var ogUrl = baseUrl + product.url;

    document.title = product.name + ' \u2014 Recool';
    this.setMetaTag('description', desc);
    this.setMetaTag('og:title', product.name + ' \u2014 Recool');
    this.setMetaTag('og:description', desc);
    this.setMetaTag('og:image', ogImage);
    this.setMetaTag('og:url', ogUrl);
    this.setMetaTag('og:type', 'product');
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', product.name + ' \u2014 Recool');
    this.setMetaTag('twitter:description', desc);
    this.setMetaTag('twitter:image', ogImage);
    this.setCanonical(ogUrl);
    return;
  }

  var m = this.metaConfig[page] || this.defaultMeta;
  var ogImage = this.absUrl(m.ogImage);
  var pagePath = page === 'home' ? '' : page;
  var ogUrl = baseUrl + '/' + pagePath;

  document.title = m.title;
  this.setMetaTag('description', m.desc);
  this.setMetaTag('og:title', m.ogTitle);
  this.setMetaTag('og:description', m.ogDesc);
  this.setMetaTag('og:image', ogImage);
  this.setMetaTag('og:url', ogUrl);
  this.setMetaTag('og:type', 'website');
  this.setMetaTag('og:locale', 'en_US');
  this.setMetaTag('og:site_name', 'Recool');
  this.setMetaTag('twitter:card', 'summary');
  this.setMetaTag('twitter:title', m.ogTitle);
  this.setMetaTag('twitter:description', m.ogDesc);
  this.setMetaTag('twitter:image', ogImage);
  this.setCanonical(ogUrl);
};

RecoolApp.setMetaTag = function(name, content) {
  var attr = name.indexOf('og:') === 0 ? 'property' : 'name';
  var sel = attr === 'property' ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
  var el = document.querySelector(sel);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}; 

RecoolApp.setCanonical = function(href) {
  var el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', href);
};
