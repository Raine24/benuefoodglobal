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
      name: 'Family Staple Basket (5 Products)',
      category: 'bundles',
      pack: 'Rice 5kg + Beans 5kg + Garri 2kg + Yam Flour 1kg + Palm Oil 1L',
      variants: ['Standard Household Basket (5 Packs)', 'Large Family Basket (10kg Rice + Extras)', 'Custom Bulk Carton'],
      badge: 'Direct Farm Bundle',
      highlights: 'Complete Benue kitchen essentials packed fresh',
      image: 'assets/client-food-bundle.jpg',
      tags: 'bundle basket rice beans garri yam flour palm oil'
    },
    {
      id: 'rice-5kg',
      name: 'Nigerian Local Rice',
      category: 'grains',
      pack: '100% Natural • Clean • Stone Free',
      variants: ['5kg Sealed Pouch', '10kg Family Bag', '50kg Wholesale Bag'],
      badge: '100% Stone Free',
      highlights: 'Directly sourced from trusted Benue rice mills',
      image: 'assets/product-rice-gen.png',
      tags: 'rice local stone free grain 5kg 10kg 50kg'
    },
    {
      id: 'honey-500',
      name: 'Benue Pure Honey',
      category: 'honey-oil',
      pack: '100% Original • No Dilution • No Additives',
      variants: ['500ml Hygiene Jar', '1 Litre Family Jar', '5 Litre Bulk Jerrycan'],
      badge: '100% Unadulterated',
      highlights: 'Raw hive honey rich in natural nutrients',
      image: 'assets/client-honey-flyer.jpg',
      tags: 'honey pure raw natural 500ml 1l'
    },
    {
      id: 'beans-5kg',
      name: 'Benue Honey Beans',
      category: 'grains',
      pack: 'Cleanly Sorted • Naturally Grown',
      variants: ['5kg Sealed Bag', '10kg Family Bag', '50kg / 100kg Bulk Sack'],
      badge: 'Clean & Sorted',
      highlights: 'Sweet cooking honey beans straight from Benue farms',
      image: 'assets/product-beans-gen.png',
      tags: 'beans honey oloyin brown 5kg 10kg'
    },
    {
      id: 'garri-2kg',
      name: 'Crispy Benue Garri',
      category: 'grains',
      pack: 'Hygienically Processed • Sealed Fresh',
      variants: ['2kg Sealed Pouch', '5kg Family Bag', '50kg Wholesale Sack'],
      badge: '100% Natural',
      highlights: 'Crisp, clean Benue cassava garri ready for soaking or eba',
      image: 'assets/product-garri-gen.png',
      tags: 'garri cassava golden white 2kg 5kg'
    },
    {
      id: 'yam-flour-1kg',
      name: 'Benue Yam Flour (Elubo)',
      category: 'grains',
      pack: 'Smooth Milled • Hygienically Packaged',
      variants: ['1kg Sealed Pouch', '5kg Family Pack', '25kg Bulk Sack'],
      badge: '100% Pure Yam',
      highlights: 'Made from premium Benue yams with zero fillers',
      image: 'assets/product-yam-flour-gen.png',
      tags: 'yam flour elubo amala 1kg 5kg'
    },
    {
      id: 'palm-oil-1l',
      name: 'Pure Benue Palm Oil',
      category: 'honey-oil',
      pack: 'Unadulterated Red Palm Oil • Leak-Proof',
      variants: ['1 Litre Sealed Bottle', '5 Litre Gallon', '25 Litre Wholesale Keg'],
      badge: 'No Dyes • Natural',
      highlights: 'Rich, thick red palm oil sourced straight from local mills',
      image: 'assets/product-palm-oil-gen.png',
      tags: 'palm oil red cooking 1l 5l 25l'
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
      <button type="button" class="search-result-item" data-search-add="${p.id}">
        <span><strong>${p.name}</strong> — <small>${p.variants[0]}</small></span>
        <span><strong>+ Add to Basket</strong></span>
      </button>
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
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" style="width:58px;height:58px;object-fit:cover;border-radius:10px;background:#f2f2f2;flex-shrink:0;" />
          <div style="min-width:0;">
            <div class="mini-sku__name">${p.name}</div>
            <div class="mini-sku__pack">${p.variants[0]} · ${p.badge}</div>
          </div>
        </div>
        <div class="mini-sku__top" style="align-items:center;margin-top:4px;">
          <span class="mini-sku__pack" style="font-weight:600;color:var(--color-ink-lime);">Farm-Direct Order</span>
          <button class="btn btn-dark mini-sku__btn" type="button" data-add-id="${p.id}" data-variant="${p.variants[0]}">+ Add to Basket</button>
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
        <div class="bs-card__band">
          <span class="bs-card__kicker">${p.badge}</span>
          <h2 class="bs-card__title">${p.name}</h2>
        </div>
        <div class="bs-card__media">
          <img src="${p.image}" onerror="this.onerror=null;this.src='${p.fallbackImage || 'assets/client-food-bundle.jpg'}'" alt="${p.name}" />
        </div>
        <div class="bs-card__pricing">
          <span class="pill-badge">Direct From Benue Farms</span>
          <div class="bs-card__sub" style="margin-top:4px;">${p.highlights}</div>
          <div class="bs-card__divider"></div>
          <label for="var-${p.id}" style="font-size:0.8rem;font-weight:700;">Select Pack / Size</label>
          <select class="variant-select" id="var-${p.id}">
            ${p.variants.map((v) => `<option value="${v}">${v}</option>`).join('')}
          </select>
          <div class="bs-card__shipping">✓ Benue HQ, Lagos &amp; Abuja pickup ready</div>
        </div>
        <button class="btn btn-dark btn-block bs-card__cta" type="button" data-shop-add="${p.id}">Add to Order Basket</button>
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
    const lines = ['Hello Benue Food Global, I would like to place an order / request total & payment details:', ''];
    cart.forEach((item) => {
      const p = getProduct(item.id);
      if (p) lines.push(`• ${item.qty}x ${p.name} (${item.variant || p.variants[0]})`);
    });
    if (customerInfo) {
      lines.push('', `Name: ${customerInfo.name}`);
      lines.push(`Phone: ${customerInfo.phone}`);
      lines.push(`Pickup / Delivery: ${customerInfo.hub}`);
      if (customerInfo.address) lines.push(`Address/Note: ${customerInfo.address}`);
      lines.push(`Payment Preference: ${customerInfo.method}`);
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
          <h3 style="margin-bottom:8px;">Your order basket is empty</h3>
          <p style="color:var(--color-ink-muted);margin:0 0 20px;">Add stone-free Nigerian Local Rice, Pure Honey, Beans, Garri, Yam Flour, or Palm Oil direct from Benue State.</p>
          <a class="btn btn-dark" href="shop.html">Browse Farm Products</a>
        </div>
      `;
      cartDrawerFooter.innerHTML = `
        <a class="btn btn-lime btn-block" href="https://wa.me/${WHATSAPP_ORDERS}?text=Hello%20Benue%20Food%20Global%2C%20I%20would%20like%20to%20place%20an%20order." target="_blank" rel="noopener">Order Directly via WhatsApp (08083690567)</a>
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
            <div style="font-size:0.78rem;font-weight:700;color:var(--color-ink-lime);">Direct Quote</div>
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
      <div style="font-size:0.8rem;color:var(--color-ink-muted);">Submit your order online to receive payment details &amp; dispatch confirmation, or order straight on WhatsApp.</div>
      <button class="btn btn-dark btn-block" type="button" id="proceedCheckoutBtn">Submit Online Order &amp; Payment Request</button>
      <a class="btn btn-lime btn-block" href="${buildWhatsAppOrderUrl()}" target="_blank" rel="noopener">Order This Basket on WhatsApp</a>
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
      <div style="font-weight:700;margin-bottom:6px;">Order Summary (${cart.reduce((s, i) => s + i.qty, 0)} item(s))</div>
      <div style="font-size:0.88rem;line-height:1.5;margin-bottom:8px;">${listHtml || 'No items selected yet.'}</div>
      <div style="font-size:0.84rem;color:var(--color-ink-muted);border-top:1px solid rgba(29,29,29,0.12);padding-top:6px;">
        Destination: <strong>${hub}</strong> · Final farm-direct total &amp; payment invoice sent immediately on confirmation.
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
          <div><strong>Order Request Logged — Reference: ${ref}</strong></div>
          <div style="font-weight:400;margin-top:4px;">Selected Hub: <strong>${hub}</strong> • Payment Preference: ${method}. Our Benue Food Global desk (08083690567) will confirm your invoice &amp; dispatch schedule shortly.</div>
          <div style="margin-top:10px;">
            <a class="btn btn-dark" href="${waUrl}" target="_blank" rel="noopener" style="min-height:40px;padding:8px 16px;font-size:0.84rem;">Send Order Reference to WhatsApp</a>
          </div>
        </div>
      `;

      cart = [];
      saveCart();
      renderCart();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Order & Request Payment';
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

  renderCart();
})();
