/* store.js – SKYWALKER Home & Office – Store Front Logic */
(() => {
  'use strict';

  let activeCategory = 'all';
  let searchQuery    = '';
  let cart = {};

  const $ = id => document.getElementById(id);

  /* ── TOAST ── */
  let _t;
  function toast(msg) { const el=$('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(_t); _t=setTimeout(()=>el.classList.remove('show'),2600); }

  /* ── HELPERS ── */
  function fmt(n)   { return Number(n).toLocaleString('fr-CM')+' FCFA'; }
  function esc(s)   { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
  function cartItems()  { return Object.values(cart); }
  function cartCount()  { return cartItems().reduce((s,{qty})=>s+qty,0); }
  function cartValue()  { return cartItems().reduce((s,{product,qty})=>s+product.price*qty,0); }

  /* ── HERO SLIDESHOW ── */
  let slideIdx = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');

  function goToSlide(n) {
    slides[slideIdx].classList.remove('active');
    dots[slideIdx].classList.remove('active');
    slideIdx = (n + slides.length) % slides.length;
    slides[slideIdx].classList.add('active');
    dots[slideIdx].classList.add('active');
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    setInterval(() => goToSlide(slideIdx + 1), 5000);
    dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.slide))));
  }

  /* ── LANGUAGE TOGGLE ── */
  $('langToggle')?.addEventListener('click', () => {
    Lang.toggle();
    renderFilters();
    renderProducts();
    renderCart();
  });
  window.addEventListener('langchange', () => { renderFilters(); renderProducts(); renderCart(); });

  /* ── SEARCH BAR ── */
  const searchInput = $('productSearch');
  const searchClear = $('searchClear');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      searchClear.style.display = searchQuery ? 'flex' : 'none';
      renderProducts();
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      searchClear.style.display = 'none';
      renderProducts();
      searchInput.focus();
    });
  }

  /* ── FILTER BUTTONS ── */
  function renderFilters() {
    const bar  = $('filterBar');
    const cats = ShopData.getCategories();
    bar.innerHTML = '';
    appendFilter('all', Lang.t('filterAll'), activeCategory === 'all');
    cats.forEach(cat => appendFilter(cat.id, cat.name, activeCategory === cat.id));
  }

  function appendFilter(id, label, isActive) {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (isActive ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => { activeCategory = id; renderFilters(); renderProducts(); });
    $('filterBar').appendChild(btn);
  }

  /* ── PRODUCTS ── */
  function renderProducts() {
    const grid  = $('productGrid');
    const empty = $('emptyState');
    const info  = $('resultsInfo');

    let products = ShopData.getProductsByCategory(activeCategory);

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    grid.innerHTML = '';

    if (!products.length) {
      empty.style.display = 'flex';
      grid.style.display  = 'none';
      info.textContent    = '';
      Lang.apply();
      return;
    }

    empty.style.display = 'none';
    grid.style.display  = 'grid';

    // Results text
    if (searchQuery) {
      info.textContent = Lang.tp('resultsSearch','resultsSearchPlural', products.length, {q:searchQuery});
    } else if (activeCategory === 'all') {
      info.textContent = Lang.t('resultsAll', {n: products.length});
    } else {
      const cat = ShopData.getCategoryById(activeCategory);
      info.textContent = Lang.t('resultsCat', {n: products.length, cat: cat?.name || ''});
    }

    products.forEach((p, idx) => {
      const cat    = ShopData.getCategoryById(p.category);
      const inCart = !!cart[p.id];
      const card   = document.createElement('article');
      card.className = 'product-card';
      card.style.animationDelay = `${Math.min(idx * 0.06, 0.48)}s`;
      card.setAttribute('role','listitem');
      card.innerHTML = `
        <div class="card-img-wrap">
          ${p.image
            ? `<img class="card-img" src="${p.image}" alt="${esc(p.name)}" loading="lazy" />`
            : `<div class="card-img-placeholder">
                <svg viewBox="0 0 48 48" fill="none" width="38" height="38"><rect x="4" y="8" width="40" height="32" rx="4" stroke="#D4CCBF" stroke-width="2"/><circle cx="16" cy="20" r="4" stroke="#D4CCBF" stroke-width="2"/><path d="M4 32l10-8 8 6 8-10 14 12" stroke="#D4CCBF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>${esc((p.name||'?')[0])}</span>
               </div>`
          }
          ${cat ? `<span class="card-cat-badge">${esc(cat.name)}</span>` : ''}
        </div>
        <div class="card-body">
          <h3 class="card-name">${esc(p.name)}</h3>
          <p class="card-desc">${esc(p.description)}</p>
          <div class="card-footer">
            <span class="card-price">${fmt(p.price)}</span>
            <button class="add-btn ${inCart?'in-cart':''}" data-id="${p.id}">
              ${inCart
                ? `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none" width="13" height="13"><polyline points="20 6 9 17 4 12"/></svg> ${esc(Lang.t('addedToCart'))}`
                : `+ ${esc(Lang.t('addToCart'))}`}
            </button>
          </div>
        </div>`;
      card.querySelector('.add-btn').addEventListener('click', () => addToCart(p.id));
      grid.appendChild(card);
    });
  }

  /* ── CART ── */
  function addToCart(productId) {
    const p = ShopData.getProducts().find(x=>x.id===productId);
    if (!p) return;
    cart[productId] ? cart[productId].qty++ : (cart[productId] = {product:p, qty:1});
    pulseBadge();
    renderProducts();
    renderCart();
    toast(Lang.t('toastAdded', {name: p.name}));
  }

  function removeFromCart(id) { delete cart[id]; renderProducts(); renderCart(); }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    const newQty = cart[id].qty + delta;
    if (newQty < 1) { removeFromCart(id); return; }
    cart[id].qty = newQty;
    renderCart();
    renderProducts();
  }

  function pulseBadge() {
    const b = $('cartBadge');
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    setTimeout(() => b.classList.remove('pop'), 380);
  }

  function renderCart() {
    const items = cartItems();
    const count = cartCount();
    const badge = $('cartBadge');
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';

    if (!items.length) {
      $('cartEmpty').style.display = 'flex';
      $('cartList').style.display  = 'none';
      $('cartFoot').style.display  = 'none';
      $('cartList').innerHTML = '';
      return;
    }

    $('cartEmpty').style.display = 'none';
    $('cartList').style.display  = 'flex';
    $('cartFoot').style.display  = 'flex';
    $('cartTotal').textContent   = fmt(cartValue());
    $('cartList').innerHTML      = '';

    items.forEach(({product, qty}) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-thumb">
          ${product.image ? `<img src="${product.image}" alt="${esc(product.name)}" />` : `<span class="cart-thumb-ph">${esc((product.name||'?')[0])}</span>`}
        </div>
        <div class="cart-info">
          <div class="cart-item-name">${esc(product.name)}</div>
          <div class="cart-item-sub">${fmt(product.price)} × ${qty} = ${fmt(product.price*qty)}</div>
        </div>
        <div class="cart-controls">
          <button class="qty-btn" data-action="dec" data-id="${product.id}">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${product.id}">+</button>
          <button class="remove-btn" data-id="${product.id}" aria-label="${Lang.t('removeItem')}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>`;
      li.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(product.id,-1));
      li.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(product.id,+1));
      li.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(product.id));
      $('cartList').appendChild(li);
    });
  }

  /* ── CART SIDEBAR ── */
  function openCart()  { $('cartSidebar').classList.add('open'); $('cartOverlay').classList.add('open'); document.body.style.overflow='hidden'; }
  function closeCart() { $('cartSidebar').classList.remove('open'); $('cartOverlay').classList.remove('open'); document.body.style.overflow=''; }

  $('cartToggle').addEventListener('click', openCart);
  $('cartClose').addEventListener('click', closeCart);
  $('cartOverlay').addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeCart(); });

  /* ── WHATSAPP + ORDER RECORDING ── */
  $('whatsappBtn').addEventListener('click', () => {
    const items = cartItems();
    if (!items.length) return;

    const orderId = ShopData.generateOrderId();
    const {whatsappNumber='237612345678'} = ShopData.getSettings();
    const total   = cartValue();
    const now     = Date.now();

    // Build WhatsApp message
    let msg = Lang.t('waHeader') + '\n';
    msg += Lang.t('waOrderId', {id: orderId}) + '\n\n';
    msg += Lang.t('waGreeting') + '\n\n';
    items.forEach(({product,qty}) => {
      msg += Lang.t('waItem', {qty, name:product.name, price:fmt(product.price*qty)}) + '\n';
    });
    msg += '\n' + Lang.t('waTotal', {total: fmt(total)}) + '\n\n';
    msg += Lang.t('waClosing');

    // Save order to localStorage
    const orderItems = items.map(({product,qty}) => ({
      id:        product.id,
      name:      product.name,
      image:     product.image,
      price:     product.price,
      qty,
      subtotal:  product.price * qty,
    }));

    ShopData.saveOrder({id:orderId, items:orderItems, total, timestamp:now, status:'pending'});
    toast(Lang.t('toastOrderSaved', {id: orderId}));

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    toast(Lang.t('toastRedirect'));
  });

  /* ── INIT ── */
  function init() {
    Lang.apply();
    renderFilters();
    renderProducts();
    renderCart();
    $('cartBadge').style.display = 'none';
  }

  window.addEventListener('storage', () => { renderFilters(); renderProducts(); });
  init();
})();
