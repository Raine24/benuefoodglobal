/* ==========================================================================
   Benue Food Global — Multi-Page E-Commerce Storefront Logic
   Price-Free Quote & Direct Order Flow | Tibico-Matched Transitions & Drawers
   ========================================================================== */

(() => {
  'use strict';

  const WHATSAPP_ORDERS = '2348083690567';
  const WHATSAPP_CEO = '2348133527937';
  const STORAGE_KEY = 'bfg_order_basket_v2';

  const PRODUCTS = [
    {
      id: 'basket-family',
      url: 'family-basket.html',
      name: 'BFG Staple Food Bundle',
      category: 'bundles',
      pack: 'Mixed BFG Food Products • Subject to Availability',
      variants: ['Retail Household Bundle (Request Quote)', 'Bulk / Institutional Supply (Request Quote)'],
      badge: 'Request a Quote',
      highlights: 'Curated mix of available BFG staples sourced from Benue State',
      description: 'A combined selection of BENUE FOOD GLOBAL agricultural products sourced from Benue State, subject to current stock availability. Contact our order desk for available pack combinations and current pricing.',
      features: [
        'Sourced from farmers and trusted agricultural suppliers in Benue State',
        'Condition-checked, sorted, and packed to match order requirements',
        'Suitable for households, retailers, food vendors, and institutional buyers',
        'Current pricing and delivery arrangements confirmed upon enquiry'
      ],
      image: 'assets/client-food-bundle.jpg',
      tags: 'bundle basket rice garri yam palm oil honey'
    },
    {
      id: 'rice-5kg',
      url: 'local-rice.html',
      name: 'Rice',
      category: 'grains',
      pack: '25kg & 50kg Packs • Subject to Availability',
      variants: ['25kg Pack (Subject to availability)', '50kg Pack (Subject to availability)'],
      badge: '25kg & 50kg',
      highlights: 'Nigerian rice sourced and packaged in 25kg & 50kg sacks',
      description: 'BENUE FOOD GLOBAL supplies Nigerian rice sourced from trusted producers and mills in Benue State, checked for product condition and packaged in 25kg and 50kg sizes subject to actual availability.',
      features: [
        'Pack sizes: 25kg and 50kg, subject to actual availability',
        'Inspected against agreed product condition requirements before dispatch',
        'Available for retail enquiries and bulk supply quotations',
        'Request a quote for today’s stock status and current pricing'
      ],
      image: 'assets/product-rice-gen.png',
      tags: 'rice 25kg 50kg grains local nigerian'
    },
    {
      id: 'garri-2kg',
      url: 'benue-garri.html',
      name: 'Garri',
      category: 'grains',
      pack: 'Multiple Pack Sizes • Subject to Availability',
      variants: ['Retail Pack (Request availability)', 'Bulk Sack (Request Quote)'],
      badge: 'Request a Quote',
      highlights: 'Sourced, inspected, and packaged for households & bulk buyers',
      description: 'Cleanly sourced Nigerian garri aggregated from trusted producers and markets, checked for suitability and prepared in packaging sizes based on product availability and buyer demand.',
      features: [
        'Sourced from trusted producers and agricultural suppliers',
        'Checked for condition and suitability prior to packaging',
        'Available for household, retail, and wholesale enquiries',
        'Contact us for current varieties, pack sizes, and pricing'
      ],
      image: 'assets/product-garri-gen.png',
      tags: 'garri cassava grains'
    },
    {
      id: 'yam-flour-1kg',
      url: 'yam-flour.html',
      name: 'Yam',
      category: 'grains',
      pack: 'Yam & Yam Flour • Subject to Availability',
      variants: ['Whole Yam / Unit Supply (Request Quote)', 'Packaged Yam Flour (Request availability)'],
      badge: 'Request a Quote',
      highlights: 'Benue yam supply quoted by type, size, and availability',
      description: 'BENUE FOOD GLOBAL coordinates sourcing and aggregation of Benue yam and yam-based supply directly with agricultural producers, checked and prepared according to agreed buyer specifications and seasonal availability.',
      features: [
        'Sourced from Benue State’s agricultural producing communities',
        'Quoted by type, size, and unit quantity upon enquiry',
        'Condition-checked and prepared for transport to served markets',
        'Suitable for households, food vendors, retailers, and bulk buyers'
      ],
      image: 'assets/product-yam-flour-gen.png',
      tags: 'yam elubo flour tubers benue'
    },
    {
      id: 'palm-oil-1l',
      url: 'palm-oil.html',
      name: 'Palm Oil',
      category: 'honey-oil',
      pack: 'Bottles & Bulk Containers • Subject to Availability',
      variants: ['Retail Container (Request availability)', 'Bulk Jerrycan (Request Quote)'],
      badge: 'Request a Quote',
      highlights: 'Packaged Nigerian palm oil for retail and bulk buyers',
      description: 'Nigerian palm oil sourced from trusted agricultural suppliers, inspected for quality and condition, and prepared in sealed containers sized to buyer requirements and current stock availability.',
      features: [
        'Sourced from trusted agricultural oil suppliers',
        'Checked for condition and sealed in appropriate containers',
        'Available for household orders and food-vendor bulk supply',
        'Contact our order desk for current container sizes and pricing'
      ],
      image: 'assets/product-palm-oil-gen.png',
      tags: 'palm oil cooking oil red'
    },
    {
      id: 'honey-500',
      url: 'pure-honey.html',
      name: 'Honey',
      category: 'honey-oil',
      pack: 'Listed When Available • Container Sizes Vary',
      variants: ['Check Current Availability (Request Quote)', 'Bulk Supply Enquiry'],
      badge: 'When Available',
      highlights: 'Listed when available — enquire for current container sizes',
      description: 'Natural honey sourced through trusted suppliers and listed when in stock. Contact Benue Food Global to confirm current container sizes, availability status, and pricing before placing an order.',
      features: [
        'Listed strictly when genuine stock is available',
        'Inspected and packaged in sealed containers',
        'Available for retail or bulk enquiries subject to seasonal harvest',
        'Message 08083690567 on WhatsApp to check current availability'
      ],
      image: 'assets/client-honey-flyer.jpg',
      tags: 'honey pure natural seasonal'
    }
  ];

  let cart = loadCart();
  let currentSlide = 0;
  let slideTimer = null;
  let lastFocusedEl = null;

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage failure
    }
  }

  function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function showToast(message) {
    const toast = document.getElementById('toastBanner');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  /* ========================================================================
     0. Active Page Nav Highlight
     ======================================================================== */
  const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.desktop-nav .nav-link[href]').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('#')[0].toLowerCase();
    const isHome = (currentFile === '' || currentFile === 'index.html') && (href === 'index.html' || href === '');
    const isMatch = href && href === currentFile;
    link.classList.toggle('is-active', Boolean(isHome || isMatch));
  });

  /* ========================================================================
     1. Scroll Progress Bar, Sticky Header Shadow, Back-to-Top, AOS Observer
     ======================================================================== */
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
    if (siteHeader) siteHeader.classList.toggle('is-scrolled', scrollTop > 20);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 520);
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const aosEls = document.querySelectorAll('[data-aos="fade-up"]');
  const handUnderline = document.getElementById('handUnderline');

  function revealVisibleAos() {
    const vh = window.innerHeight || 900;
    aosEls.forEach((el) => {
      if (el.classList.contains('aos-animate')) return;
      if (el.getBoundingClientRect().top < vh + 120) {
        el.classList.add('aos-animate');
      }
    });
    if (handUnderline && !handUnderline.classList.contains('in-view')) {
      if (handUnderline.getBoundingClientRect().top < vh + 120) {
        handUnderline.classList.add('in-view');
      }
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          if (entry.target.contains(handUnderline) || entry.target === handUnderline) {
            handUnderline?.classList.add('in-view');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '120px 0px' });

    aosEls.forEach((el, idx) => {
      el.style.transitionDelay = `${(idx % 4) * 75}ms`;
      observer.observe(el);
    });
    if (handUnderline) observer.observe(handUnderline);
    window.addEventListener('scroll', revealVisibleAos, { passive: true });
    requestAnimationFrame(() => revealVisibleAos());
  } else {
    aosEls.forEach((el) => el.classList.add('aos-animate'));
    handUnderline?.classList.add('in-view');
  }

  /* ========================================================================
     2. Mega-Menus & Search Overlay
     ======================================================================== */
  const megaTriggers = document.querySelectorAll('[data-mega]');
  const megaPanels = document.querySelectorAll('.mega-menu');
  const pageBackdrop = document.getElementById('pageBackdrop');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  function closeAllMenus() {
    megaTriggers.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    megaPanels.forEach((panel) => panel.classList.remove('is-open'));
    searchOverlay?.classList.remove('is-open');
    searchToggleBtn?.setAttribute('aria-expanded', 'false');
    pageBackdrop?.classList.remove('is-visible');
  }

  megaTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = `mega-${btn.dataset.mega}`;
      const panel = document.getElementById(targetId);
      const isAlreadyOpen = panel?.classList.contains('is-open');
      closeAllMenus();
      if (!isAlreadyOpen && panel) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        pageBackdrop?.classList.add('is-visible');
      }
    });
  });

  searchToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = searchOverlay?.classList.contains('is-open');
    closeAllMenus();
    if (!wasOpen && searchOverlay) {
      searchOverlay.classList.add('is-open');
      searchToggleBtn.setAttribute('aria-expanded', 'true');
      pageBackdrop?.classList.add('is-visible');
      searchInput?.focus();
      renderSearch('');
    }
  });

  closeSearchBtn?.addEventListener('click', closeAllMenus);
  pageBackdrop?.addEventListener('click', closeAllMenus);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#siteHeader')) closeAllMenus();
  });

  function renderSearch(query) {
    if (!searchResults) return;
    const q = query.trim().toLowerCase();
    const matches = PRODUCTS.filter(
      (p) => !q || p.name.toLowerCase().includes(q) || p.pack.toLowerCase().includes(q) || p.tags.includes(q)
    ).slice(0, 5);

    if (matches.length === 0) {
      searchResults.innerHTML = `<div style="padding:10px 14px;color:var(--color-ink-muted);">No matching products found. Try "Rice", "Honey", "Beans", "Garri", "Yam", or "Palm Oil".</div>`;
      return;
    }

    searchResults.innerHTML = matches.map((p) => `
      <div class="search-result-item" style="cursor:default;">
        <a href="${p.url}" style="text-decoration:none;flex:1;">
          <strong>${p.name}</strong> — <small>${p.variants[0]}</small>
        </a>
        <div style="display:flex;gap:8px;align-items:center;">
          <a href="${p.url}" style="font-size:0.84rem;font-weight:600;text-decoration:underline;">View</a>
          <button type="button" class="btn btn-dark" data-search-add="${p.id}" style="min-height:36px;padding:6px 12px;font-size:0.8rem;">+ Add</button>
        </div>
      </div>
    `).join('');

    searchResults.querySelectorAll('[data-search-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prod = getProduct(btn.dataset.searchAdd);
        addToCart(prod.id, prod.variants[0], 1);
        closeAllMenus();
      });
    });
  }

  searchInput?.addEventListener('input', (e) => renderSearch(e.target.value));
  document.getElementById('searchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    renderSearch(searchInput?.value || '');
  });

  /* ========================================================================
     3. Hero Slider (Autoplay 10s, Arrows, Dots, Touch Swipe)
     ======================================================================== */
  const heroTrack = document.getElementById('heroTrack');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');

  function goToSlide(index) {
    if (!heroTrack || heroSlides.length === 0) return;
    currentSlide = (index + heroSlides.length) % heroSlides.length;
    heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    heroSlides.forEach((s, i) => {
      const active = i === currentSlide;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', String(!active));
    });
    heroDots.forEach((d, i) => {
      const active = i === currentSlide;
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', String(active));
    });
  }

  function startSlideTimer() {
    clearInterval(slideTimer);
    if (heroSlides.length > 1) {
      slideTimer = setInterval(() => goToSlide(currentSlide + 1), 10000);
    }
  }

  heroPrev?.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    startSlideTimer();
  });
  heroNext?.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    startSlideTimer();
  });
  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(Number(dot.dataset.slide));
      startSlideTimer();
    });
  });

  let dragStartX = null;
  heroTrack?.addEventListener('pointerdown', (e) => { dragStartX = e.clientX; });
  heroTrack?.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 45) {
      goToSlide(diff < 0 ? currentSlide + 1 : currentSlide - 1);
      startSlideTimer();
    }
    dragStartX = null;
  });

  startSlideTimer();

  /* ========================================================================
     4. Home Catalogue Bar + Dedicated Shop Page Grid & Filters
     ======================================================================== */
  const catalogueGrid = document.getElementById('catalogueGrid');
  if (catalogueGrid) {
    catalogueGrid.innerHTML = PRODUCTS.filter((p) => p.id !== 'basket-family').map((p) => `
      <div class="mini-sku">
        <a href="${p.url}" style="display:flex;gap:12px;align-items:center;text-decoration:none;">
          <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" style="width:58px;height:58px;object-fit:cover;border-radius:10px;background:#f2f2f2;flex-shrink:0;" />
          <div style="min-width:0;">
            <div class="mini-sku__name" style="text-decoration:underline;text-underline-offset:3px;">${p.name}</div>
            <div class="mini-sku__pack">${p.variants[0]} · ${p.badge}</div>
          </div>
        </a>
        <div class="mini-sku__top" style="align-items:center;margin-top:4px;">
          <a href="${p.url}" class="mini-sku__pack" style="font-weight:700;color:var(--color-ink-lime);text-decoration:none;">View Product →</a>
          <button class="btn btn-dark mini-sku__btn" type="button" data-add-id="${p.id}" data-variant="${p.variants[0]}">+ Quote Basket</button>
        </div>
      </div>
    `).join('');
  }

  // Dedicated Shop Page Grid
  const shopGrid = document.getElementById('shopGrid');
  let activeShopFilter = new URLSearchParams(window.location.search).get('cat') || 'all';

  function renderShopGrid() {
    if (!shopGrid) return;
    const filtered = activeShopFilter === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeShopFilter);

    shopGrid.innerHTML = filtered.map((p) => `
      <article class="bs-card ${p.id === 'basket-family' ? 'is-featured' : ''}">
        <a href="${p.url}" class="bs-card__band" style="text-decoration:none;">
          <span class="bs-card__kicker">${p.badge}</span>
          <h2 class="bs-card__title">${p.name}</h2>
        </a>
        <a href="${p.url}" class="bs-card__media" aria-label="View ${p.name} details">
          <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" />
        </a>
        <div class="bs-card__pricing">
          <span class="pill-badge">Request a Quote</span>
          <div class="bs-card__sub" style="margin-top:4px;">${p.highlights}</div>
          <div class="bs-card__divider"></div>
          <label for="var-${p.id}" style="font-size:0.8rem;font-weight:700;">Select Pack / Size</label>
          <select class="variant-select" id="var-${p.id}">
            ${p.variants.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
          <div class="bs-card__shipping">✓ Subject to stock availability · Focus markets: Benue, Abuja &amp; Lagos</div>
        </div>
        <div style="display:grid;gap:8px;margin-top:12px;">
          <button class="btn btn-dark btn-block" type="button" data-shop-add="${p.id}">Add to Quote Basket</button>
          <a class="btn btn-light btn-block" href="${p.url}">View Product Page</a>
        </div>
      </article>
    `).join('');

    shopGrid.querySelectorAll('[data-shop-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.shopAdd;
        const sel = document.getElementById(`var-${id}`);
        addToCart(id, sel ? sel.value : getProduct(id).variants[0], 1);
      });
    });
  }

  if (shopGrid) {
    const shopFilterBtns = document.querySelectorAll('[data-shop-filter]');
    shopFilterBtns.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.shopFilter === activeShopFilter);
      btn.addEventListener('click', () => {
        activeShopFilter = btn.dataset.shopFilter;
        shopFilterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        renderShopGrid();
      });
    });
    renderShopGrid();
  }

  // Dedicated FAQs Page Category Filter
  const faqFilterBtns = document.querySelectorAll('[data-faq-filter]');
  if (faqFilterBtns.length > 0) {
    faqFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.faqFilter;
        faqFilterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        document.querySelectorAll('.faq-item[data-faq-cat]').forEach((item) => {
          item.style.display = (cat === 'all' || item.dataset.faqCat === cat) ? '' : 'none';
        });
      });
    });
  }

  // Bind quick-add buttons anywhere
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-id], [data-quick-add]');
    if (addBtn) {
      e.preventDefault();
      const id = addBtn.dataset.addId || addBtn.dataset.quickAdd;
      const prod = getProduct(id);
      if (prod) {
        addToCart(id, addBtn.dataset.variant || prod.variants[0], 1);
        closeAllMenus();
      }
    }
  });

  /* ========================================================================
     5. Build-a-Basket Modal (Zero Prices — Pack Selection)
     ======================================================================== */
  const basketModalList = document.getElementById('basketModalList');
  const basketModalCount = document.getElementById('basketModalCount');
  const basketQtyMap = {};

  function renderBasketModal() {
    if (!basketModalList) return;
    basketModalList.innerHTML = PRODUCTS.map((p) => {
      const qty = basketQtyMap[p.id] || 0;
      return `
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid var(--color-border-subtle);border-radius:14px;background:var(--color-bg-raised);">
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" style="width:52px;height:52px;object-fit:cover;border-radius:10px;" />
            <div>
              <div style="font-weight:700;font-size:0.95rem;">${p.name}</div>
              <div style="font-size:0.8rem;color:var(--color-ink-muted);">${p.variants[0]} · ${p.badge}</div>
            </div>
          </div>
          <div class="qty-control" style="margin:0;">
            <button type="button" data-b-dec="${p.id}" aria-label="Decrease ${p.name}">−</button>
            <span>${qty}</span>
            <button type="button" data-b-inc="${p.id}" aria-label="Increase ${p.name}">+</button>
          </div>
        </div>
      `;
    }).join('');

    const totalPacks = Object.values(basketQtyMap).reduce((s, n) => s + n, 0);
    if (basketModalCount) basketModalCount.textContent = `${totalPacks} pack(s)`;
  }

  basketModalList?.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-b-inc]');
    const dec = e.target.closest('[data-b-dec]');
    if (inc) {
      const id = inc.dataset.bInc;
      basketQtyMap[id] = (basketQtyMap[id] || 0) + 1;
      renderBasketModal();
    } else if (dec) {
      const id = dec.dataset.bDec;
      basketQtyMap[id] = Math.max(0, (basketQtyMap[id] || 0) - 1);
      renderBasketModal();
    }
  });

  document.getElementById('addSelectedBasketBtn')?.addEventListener('click', () => {
    let added = 0;
    Object.entries(basketQtyMap).forEach(([id, qty]) => {
      if (qty > 0) {
        const prod = getProduct(id);
        addToCart(id, prod.variants[0], qty, false);
        basketQtyMap[id] = 0;
        added += qty;
      }
    });
    if (added === 0) {
      showToast('Select at least 1 product quantity first.');
      return;
    }
    renderBasketModal();
    closeAllModals();
    openCartDrawer();
    showToast(`Added ${added} item(s) to your BFG order basket.`);
  });

  /* ========================================================================
     6. Cart Drawer + Price-Free Checkout / Order Request & WhatsApp Flow
     ======================================================================== */
  const drawerOverlay = document.getElementById('drawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartDrawerFooter = document.getElementById('cartDrawerFooter');
  const headerCartCount = document.getElementById('headerCartCount');

  function cartKey(id, variant) {
    return `${id}__${variant}`;
  }

  function addToCart(id, variant, qty = 1, openDrawer = true) {
    const prod = getProduct(id);
    if (!prod) return;
    const chosenVariant = variant || prod.variants[0];
    const key = cartKey(id, chosenVariant);
    const existing = cart.find((item) => item.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key, id, variant: chosenVariant, qty });
    }
    saveCart();
    renderCart();
    if (openDrawer) {
      if (headerCartCount) {
        headerCartCount.classList.remove('is-bumping');
        void headerCartCount.offsetWidth;
        headerCartCount.classList.add('is-bumping');
      }
      openCartDrawer();
      showToast(`${prod.name} (${chosenVariant}) added to basket.`);
    }
  }

  function updateCartQty(key, delta) {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.key !== key);
    }
    saveCart();
    renderCart();
  }

  function buildWhatsAppOrderUrl(customerInfo = null) {
    const lines = ['Hello Benue Food Global, I would like to request a quote / enquire about availability:', ''];
    cart.forEach((item) => {
      const p = getProduct(item.id);
      if (p) lines.push(`• ${item.qty}x ${p.name} (${item.variant || p.variants[0]})`);
    });
    if (customerInfo) {
      lines.push('', `Name: ${customerInfo.name}`);
      lines.push(`Phone: ${customerInfo.phone}`);
      lines.push(`Market / Hub: ${customerInfo.hub}`);
      if (customerInfo.address) lines.push(`Delivery / Note: ${customerInfo.address}`);
      lines.push(`Enquiry Preference: ${customerInfo.method}`);
    }
    return `https://wa.me/${WHATSAPP_ORDERS}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function renderCart() {
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    if (headerCartCount) {
      headerCartCount.textContent = String(totalCount);
      headerCartCount.dataset.count = String(totalCount);
    }

    if (!cartDrawerBody || !cartDrawerFooter) return;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `
        <div class="cart-empty">
          <h3 style="margin-bottom:8px;">Your quote basket is empty</h3>
          <p style="color:var(--color-ink-muted);margin:0 0 20px;">Add Benue Food Global Rice, Garri, Yam, Palm Oil, Honey (when available), or our Staple Food Bundle to request current pricing and availability.</p>
          <a class="btn btn-dark" href="shop.html">Browse Products</a>
        </div>
      `;
      cartDrawerFooter.innerHTML = `
        <a class="btn btn-lime btn-block" href="https://wa.me/${WHATSAPP_ORDERS}?text=Hello%20Benue%20Food%20Global%2C%20I%20would%20like%20to%20request%20a%20quote%20and%20check%20product%20availability." target="_blank" rel="noopener">Enquire via WhatsApp (08083690567)</a>
      `;
      return;
    }

    cartDrawerBody.innerHTML = cart.map((item) => {
      const p = getProduct(item.id);
      if (!p) return '';
      const key = item.key || cartKey(item.id, item.variant || p.variants[0]);
      return `
        <div class="cart-item">
          <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" />
          <div>
            <div style="font-weight:700;font-size:0.95rem;line-height:1.25;">${p.name}</div>
            <div style="font-size:0.8rem;color:var(--color-ink-muted);">${item.variant || p.variants[0]}</div>
            <div class="qty-control">
              <button type="button" data-cart-dec="${key}" aria-label="Decrease quantity of ${p.name}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-inc="${key}" aria-label="Increase quantity of ${p.name}">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.78rem;font-weight:700;color:var(--color-ink-lime);">Request a Quote</div>
            <button type="button" data-cart-rem="${key}" style="border:0;background:transparent;font-size:0.78rem;color:var(--color-ink-muted);text-decoration:underline;cursor:pointer;margin-top:6px;">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    cartDrawerFooter.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:600;">Total Items Selected</span>
        <strong style="font-size:1.1rem;">${totalCount} pack(s)</strong>
      </div>
      <div style="font-size:0.8rem;color:var(--color-ink-muted);">Orders, pricing, and delivery are confirmed by our order desk based on current stock availability.</div>
      <button class="btn btn-dark btn-block" type="button" id="proceedCheckoutBtn">Submit Quote &amp; Order Enquiry</button>
      <a class="btn btn-lime btn-block" href="${buildWhatsAppOrderUrl()}" target="_blank" rel="noopener">Send Quote Request on WhatsApp</a>
    `;

    document.getElementById('proceedCheckoutBtn')?.addEventListener('click', () => {
      closeDrawers();
      openModal('checkoutModal');
      renderCheckoutSummary();
    });
  }

  cartDrawerBody?.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-cart-inc]');
    const dec = e.target.closest('[data-cart-dec]');
    const rem = e.target.closest('[data-cart-rem]');
    if (inc) updateCartQty(inc.dataset.cartInc, 1);
    else if (dec) updateCartQty(dec.dataset.cartDec, -1);
    else if (rem) {
      cart = cart.filter((i) => (i.key || cartKey(i.id, i.variant)) !== rem.dataset.cartRem);
      saveCart();
      renderCart();
    }
  });

  function syncOverlayBodyClass() {
    const anyDrawer = cartDrawer?.classList.contains('is-open') || mobileDrawer?.classList.contains('is-open');
    const anyModal = document.querySelector('.modal-backdrop.is-open');
    document.body.classList.toggle('overlay-open', Boolean(anyDrawer || anyModal));
  }

  function openCartDrawer() {
    lastFocusedEl = document.activeElement;
    drawerOverlay?.classList.add('is-open');
    cartDrawer?.classList.add('is-open');
    cartDrawer?.setAttribute('aria-hidden', 'false');
    syncOverlayBodyClass();
    document.getElementById('closeCartBtn')?.focus();
  }

  function openMobileDrawer() {
    lastFocusedEl = document.activeElement;
    drawerOverlay?.classList.add('is-open');
    mobileDrawer?.classList.add('is-open');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    document.getElementById('mobileMenuBtn')?.setAttribute('aria-expanded', 'true');
    syncOverlayBodyClass();
    document.getElementById('closeMobileBtn')?.focus();
  }

  function closeDrawers() {
    drawerOverlay?.classList.remove('is-open');
    cartDrawer?.classList.remove('is-open');
    cartDrawer?.setAttribute('aria-hidden', 'true');
    mobileDrawer?.classList.remove('is-open');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    document.getElementById('mobileMenuBtn')?.setAttribute('aria-expanded', 'false');
    syncOverlayBodyClass();
    lastFocusedEl?.focus?.();
  }

  document.getElementById('openCartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeDrawers);
  document.getElementById('mobileMenuBtn')?.addEventListener('click', openMobileDrawer);
  document.getElementById('closeMobileBtn')?.addEventListener('click', closeDrawers);
  drawerOverlay?.addEventListener('click', closeDrawers);
  document.querySelectorAll('.mobile-nav-link').forEach((link) => link.addEventListener('click', closeDrawers));

  /* ========================================================================
     7. Checkout / Order Request Modal (Zero Prices)
     ======================================================================== */
  function renderCheckoutSummary() {
    const box = document.getElementById('checkoutSummaryBox');
    const hub = document.getElementById('coHub')?.value || '';
    if (!box) return;
    const listHtml = cart.map((item) => {
      const p = getProduct(item.id);
      return p ? `<div>• <strong>${item.qty}×</strong> ${p.name} (${item.variant || p.variants[0]})</div>` : '';
    }).join('');

    box.innerHTML = `
      <div style="font-weight:700;margin-bottom:6px;">Quote &amp; Order Summary (${cart.reduce((s, i) => s + i.qty, 0)} item(s))</div>
      <div style="font-size:0.88rem;line-height:1.5;margin-bottom:8px;">${listHtml || 'No items selected yet.'}</div>
      <div style="font-size:0.84rem;color:var(--color-ink-muted);border-top:1px solid rgba(29,29,29,0.12);padding-top:6px;">
        Market / Hub: <strong>${hub}</strong> · Focus markets: Benue State, Abuja &amp; Lagos. Current availability &amp; pricing confirmed by BFG desk.
      </div>
    `;
  }

  document.getElementById('coHub')?.addEventListener('change', renderCheckoutSummary);

  document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('coName');
    const phoneEl = document.getElementById('coPhone');
    const errName = document.getElementById('errCoName');
    const errPhone = document.getElementById('errCoPhone');
    const resultEl = document.getElementById('checkoutResult');

    errName.textContent = '';
    errPhone.textContent = '';
    nameEl.removeAttribute('aria-invalid');
    phoneEl.removeAttribute('aria-invalid');

    let valid = true;
    if (!nameEl.value.trim()) {
      errName.textContent = 'Please enter your full name.';
      nameEl.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!phoneEl.value.trim() || phoneEl.value.trim().length < 7) {
      errPhone.textContent = 'Please enter a valid phone or WhatsApp number.';
      phoneEl.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!valid) return;

    if (cart.length === 0) {
      resultEl.innerHTML = `<div class="form-status form-status--error" style="margin-bottom:12px;">Your basket is empty. Add at least one item before submitting.</div>`;
      return;
    }

    const submitBtn = document.getElementById('checkoutSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting Order...';

    setTimeout(() => {
      const ref = 'BFG-' + Math.floor(100000 + Math.random() * 900000);
      const hub = document.getElementById('coHub').value;
      const method = document.getElementById('coMethod').value;
      const waUrl = buildWhatsAppOrderUrl({
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        hub,
        address: document.getElementById('coAddress').value.trim(),
        method
      });

      resultEl.innerHTML = `
        <div class="form-status form-status--success" style="margin-bottom:14px;">
          <div><strong>Quote &amp; Order Enquiry Logged — Reference: ${ref}</strong></div>
          <div style="font-weight:400;margin-top:4px;">Market / Hub: <strong>${hub}</strong> • Enquiry Type: ${method}. Contact BFG Order Desk on 08083690567 or click below to confirm current availability, pricing, and delivery options.</div>
          <div style="margin-top:10px;">
            <a class="btn btn-dark" href="${waUrl}" target="_blank" rel="noopener" style="min-height:40px;padding:8px 16px;font-size:0.84rem;">Send Enquiry Reference on WhatsApp</a>
          </div>
        </div>
      `;

      cart = [];
      saveCart();
      renderCart();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Quote & Order Enquiry';
    }, 450);
  });

  document.getElementById('checkoutWhatsappBtn')?.addEventListener('click', () => {
    const url = buildWhatsAppOrderUrl({
      name: document.getElementById('coName')?.value.trim() || 'Online Buyer',
      phone: document.getElementById('coPhone')?.value.trim() || 'Not specified',
      hub: document.getElementById('coHub')?.value || '',
      address: document.getElementById('coAddress')?.value.trim() || '',
      method: document.getElementById('coMethod')?.value || ''
    });
    window.open(url, '_blank', 'noopener');
  });

  /* ========================================================================
     8. FAQ Accordion (Smooth CSS Grid Transition) & Modals & Page Forms
     ======================================================================== */
  document.querySelectorAll('.faq-trigger').forEach((btn) => {
    const item = btn.closest('.faq-item');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel && !panel.firstElementChild?.matches('div')) {
      const inner = document.createElement('div');
      while (panel.firstChild) inner.appendChild(panel.firstChild);
      panel.appendChild(inner);
    }
    if (btn.getAttribute('aria-expanded') === 'true') {
      item?.classList.add('is-open');
      panel?.removeAttribute('hidden');
    }
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      item?.classList.toggle('is-open', !expanded);
      if (panel) {
        if (expanded) {
          panel.setAttribute('aria-hidden', 'true');
        } else {
          panel.removeAttribute('hidden');
          panel.setAttribute('aria-hidden', 'false');
        }
      }
    });
  });

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    syncOverlayBodyClass();
    if (id === 'basketModal') renderBasketModal();
    if (id === 'checkoutModal') renderCheckoutSummary();
    modal.querySelector('button, input, select')?.focus();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach((m) => {
      m.classList.remove('is-open');
      m.setAttribute('aria-hidden', 'true');
    });
    syncOverlayBodyClass();
    lastFocusedEl?.focus?.();
  }

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      closeAllMenus();
      closeDrawers();
      openModal(trigger.dataset.openModal);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeAllModals();
    });
  });

  // Partner / Contact Forms (both modal & dedicated contact/wholesale pages)
  function bindEnquiryForm(formId, typeId, nameId, phoneId, detailsId, statusId) {
    document.getElementById(formId)?.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById(typeId)?.value || 'General Enquiry';
      const name = document.getElementById(nameId)?.value.trim() || '';
      const phone = document.getElementById(phoneId)?.value.trim() || '';
      const details = document.getElementById(detailsId)?.value.trim() || '';
      const status = document.getElementById(statusId);
      if (!status) return;

      if (!name || !phone || !details) {
        status.innerHTML = `<div class="form-status form-status--error">Please fill in your name, phone number, and enquiry details.</div>`;
        return;
      }

      const isCeo = type.includes('Strategic') || type.includes('Distribution') || type.includes('Farmer');
      const targetNum = isCeo ? WHATSAPP_CEO : WHATSAPP_ORDERS;
      const msg = encodeURIComponent(`BFG Enquiry (${type})\nName: ${name}\nPhone: ${phone}\nDetails: ${details}`);
      status.innerHTML = `
        <div class="form-status form-status--success">
          Enquiry prepared for ${isCeo ? 'CEO Victor Eje Agama (08133527937)' : 'BFG Order Desk (08083690567)'}.
          <div style="margin-top:8px;">
            <a class="btn btn-dark" href="https://wa.me/${targetNum}?text=${msg}" target="_blank" rel="noopener" style="min-height:40px;padding:8px 16px;font-size:0.84rem;">Send Immediately via WhatsApp</a>
          </div>
        </div>
      `;
    });
  }

  bindEnquiryForm('partnerForm', 'enqType', 'enqName', 'enqPhone', 'enqDetails', 'partnerStatus');
  bindEnquiryForm('pageEnquiryForm', 'pEnqType', 'pEnqName', 'pEnqPhone', 'pEnqDetails', 'pEnquiryStatus');

  // Section 10: Supplier Registration Form (suppliers.html)
  document.getElementById('supplierForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('supName')?.value.trim();
    const phone = document.getElementById('supPhone')?.value.trim();
    const email = document.getElementById('supEmail')?.value.trim();
    const location = document.getElementById('supLocation')?.value.trim();
    const products = document.getElementById('supProducts')?.value.trim();
    const qty = document.getElementById('supQty')?.value.trim();
    const condition = document.getElementById('supCondition')?.value.trim();
    const quote = document.getElementById('supPrice')?.value.trim();
    const date = document.getElementById('supDate')?.value.trim();
    const status = document.getElementById('supplierStatus');
    if (!status) return;
    if (!name || !phone || !location || !products) {
      status.innerHTML = `<div class="form-status form-status--error">Please fill in your name, phone/WhatsApp, State/LGA, and products available.</div>`;
      return;
    }
    const msg = encodeURIComponent(
      `BFG Supplier Registration\nName/Business: ${name}\nPhone/WhatsApp: ${phone}\nEmail: ${email || 'N/A'}\nState & LGA: ${location}\nProducts: ${products}\nQuantity & Frequency: ${qty || 'N/A'}\nCondition/Grade: ${condition || 'N/A'}\nExpected Quote: ${quote || 'N/A'}\nAvailability Date: ${date || 'N/A'}`
    );
    status.innerHTML = `<div class="form-status form-status--success">Supplier submission ready. <div style="margin-top:8px;"><a class="btn btn-dark" href="https://wa.me/${WHATSAPP_ORDERS}?text=${msg}" target="_blank" rel="noopener">Send Supplier Application on WhatsApp</a></div></div>`;
  });

  // Section 10: Partnership Application Form (wholesale.html)
  document.getElementById('partnershipAppForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('partName')?.value.trim();
    const phone = document.getElementById('partPhone')?.value.trim();
    const email = document.getElementById('partEmail')?.value.trim();
    const area = document.getElementById('partArea')?.value.trim();
    const ptype = document.getElementById('partType')?.value;
    const bg = document.getElementById('partBg')?.value.trim();
    const facilities = document.getElementById('partFacilities')?.value.trim();
    const proposal = document.getElementById('partProposal')?.value.trim();
    const status = document.getElementById('partnershipAppStatus');
    if (!status) return;
    if (!name || !phone || !area || !proposal) {
      status.innerHTML = `<div class="form-status form-status--error">Please complete name, phone, operating area, and short proposal.</div>`;
      return;
    }
    const msg = encodeURIComponent(
      `BFG Partnership Application (${ptype})\nApplicant: ${name}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nOperating Area: ${area}\nBackground: ${bg || 'N/A'}\nResources/Facilities: ${facilities || 'N/A'}\nProposal: ${proposal}`
    );
    status.innerHTML = `<div class="form-status form-status--success">Partnership application prepared for CEO review. <div style="margin-top:8px;"><a class="btn btn-dark" href="https://wa.me/${WHATSAPP_CEO}?text=${msg}" target="_blank" rel="noopener">Send Partnership Application to CEO (08133527937)</a></div></div>`;
  });

  // Section 11: Investment Enquiry Form (investment.html)
  document.getElementById('investmentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('invName')?.value.trim();
    const org = document.getElementById('invOrg')?.value.trim();
    const phone = document.getElementById('invPhone')?.value.trim();
    const email = document.getElementById('invEmail')?.value.trim();
    const focus = document.getElementById('invFocus')?.value;
    const notes = document.getElementById('invNotes')?.value.trim();
    const status = document.getElementById('investmentStatus');
    if (!status) return;
    if (!name || !phone || !notes) {
      status.innerHTML = `<div class="form-status form-status--error">Please provide your name, contact number, and enquiry details.</div>`;
      return;
    }
    const msg = encodeURIComponent(
      `BFG Investment / Business Development Enquiry\nName: ${name}\nOrganisation: ${org || 'Individual'}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nFocus Area: ${focus}\nNotes: ${notes}`
    );
    status.innerHTML = `<div class="form-status form-status--success">Introductory discussion request prepared. <div style="margin-top:8px;"><a class="btn btn-dark" href="https://wa.me/${WHATSAPP_CEO}?text=${msg}" target="_blank" rel="noopener">Connect with CEO Office (08133527937)</a></div></div>`;
  });

  document.getElementById('footerNewsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('footerEmail').value.trim();
    const msg = document.getElementById('footerNewsletterMsg');
    if (!email || !email.includes('@')) {
      msg.innerHTML = `<span class="field-error">Please enter a valid email address.</span>`;
      return;
    }
    msg.innerHTML = `<span style="color:var(--color-success);font-weight:600;">Subscribed! Farm harvest updates will be sent to ${email}.</span>`;
    e.target.reset();
  });

  document.getElementById('promoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('promoEmail').value.trim();
    const msg = document.getElementById('promoMsg');
    if (!email || !email.includes('@')) {
      msg.innerHTML = `<span class="field-error">Please enter a valid email address.</span>`;
      return;
    }
    msg.innerHTML = `<span style="color:var(--color-success);font-weight:700;">Welcome! Browse our products or message 08083690567 on WhatsApp to order.</span>`;
  });

  if (currentFile === '' || currentFile === 'index.html') {
    let promoShown = sessionStorage.getItem('bfg_promo_seen') === '1';
    window.addEventListener('scroll', () => {
      if (!promoShown && window.scrollY > 2400) {
        promoShown = true;
        sessionStorage.setItem('bfg_promo_seen', '1');
        openModal('promoModal');
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      closeDrawers();
      closeAllModals();
    }
  });

  /* ========================================================================
     9. Individual Product Detail Page Controller
     ======================================================================== */
  const pdpMain = document.querySelector('[data-product-id]');
  if (pdpMain) {
    const prod = getProduct(pdpMain.dataset.productId);
    if (prod) {
      let selectedVariant = prod.variants[0];
      let pdpQty = 1;
      const qtySpan = document.getElementById('pdpQtyVal');
      const waBtn = document.getElementById('pdpWaBtn');

      const syncPdpWa = () => {
        if (!waBtn) return;
        const msg = `Hello Benue Food Global, I would like to order:\n• ${pdpQty}x ${prod.name} (${selectedVariant})\nPlease share current farm-direct invoice and pickup/delivery options.`;
        waBtn.href = `https://wa.me/${WHATSAPP_ORDERS}?text=${encodeURIComponent(msg)}`;
      };

      document.querySelectorAll('.pdp-variant-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.pdp-variant-btn').forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          selectedVariant = btn.dataset.variant;
          syncPdpWa();
        });
      });

      document.getElementById('pdpQtyDec')?.addEventListener('click', () => {
        pdpQty = Math.max(1, pdpQty - 1);
        if (qtySpan) qtySpan.textContent = String(pdpQty);
        syncPdpWa();
      });

      document.getElementById('pdpQtyInc')?.addEventListener('click', () => {
        pdpQty += 1;
        if (qtySpan) qtySpan.textContent = String(pdpQty);
        syncPdpWa();
      });

      document.getElementById('pdpAddBtn')?.addEventListener('click', () => {
        addToCart(prod.id, selectedVariant, pdpQty, true);
      });

      const relGrid = document.getElementById('pdpRelatedGrid');
      if (relGrid) {
        const others = PRODUCTS.filter((p) => p.id !== prod.id).slice(0, 3);
        relGrid.innerHTML = others.map((p) => `
          <article class="bs-card">
            <a href="${p.url}" class="bs-card__band" style="text-decoration:none;">
              <span class="bs-card__kicker">${p.badge}</span>
              <h3 class="bs-card__title">${p.name}</h3>
            </a>
            <a href="${p.url}" class="bs-card__media">
              <img src="${p.image}" alt="${p.name}" />
            </a>
            <div class="bs-card__pricing">
              <span class="pill-badge">${p.variants[0]}</span>
              <div class="bs-card__sub" style="margin-top:6px;">${p.highlights}</div>
            </div>
            <a class="btn btn-dark btn-block bs-card__cta" href="${p.url}">View Product</a>
          </article>
        `).join('');
      }

      syncPdpWa();
    }
  }

  renderCart();
})();
