/* admin.js – SKYWALKER Home & Office – Admin Panel Logic */
(() => {
  'use strict';

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'skywalker2025';
  const SESSION_KEY = 'skywalker_admin_ok';

  const $ = id => document.getElementById(id);

  /* ── TOAST ── */
  let _t;
  function toast(msg, type='') {
    const el=$('toast'); el.textContent=msg; el.className=['show',type].filter(Boolean).join(' ');
    clearTimeout(_t); _t=setTimeout(()=>{el.className='';},2800);
  }

  function fmt(n) { return Number(n).toLocaleString('fr-CM')+' FCFA'; }
  function esc(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
  function fmtDate(ts) {
    const d=new Date(ts);
    return d.toLocaleDateString('fr-CM',{day:'2-digit',month:'2-digit',year:'numeric'})
      +' '+d.toLocaleTimeString('fr-CM',{hour:'2-digit',minute:'2-digit'});
  }

  /* ── STATUS BADGE ── */
  function statusBadge(status) {
    const labels = {pending:Lang.t('statusPending'),confirmed:Lang.t('statusConfirmed'),delivered:Lang.t('statusDelivered'),cancelled:Lang.t('statusCancelled')};
    return `<span class="track-status status-${status}">${labels[status]||status}</span>`;
  }

  /* ── LANGUAGE ── */
  function applyLang() {
    Lang.apply();
    ['langToggleLogin','langToggleSidebar'].forEach(id => {
      const el=$(id); if(el) el.textContent=Lang.t('langToggle');
    });
  }

  function bindLangButtons() {
    ['langToggleLogin','langToggleSidebar'].forEach(id => {
      $(id)?.addEventListener('click', () => { Lang.toggle(); applyLang(); if(isLoggedIn()) renderCurrentPanel(); });
    });
  }

  /* ── AUTH ── */
  function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY)==='1'; }

  function loginFlow() {
    const user=$('loginUser').value.trim(), pass=$('loginPass').value.trim();
    const err=$('loginError');
    if (!user||!pass){ err.textContent=Lang.t('loginEmpty'); return; }
    if (user!==ADMIN_USER||pass!==ADMIN_PASS){ err.textContent=Lang.t('loginError'); $('loginPass').value=''; return; }
    err.textContent='';
    sessionStorage.setItem(SESSION_KEY,'1');
    $('loginScreen').style.display='none';
    $('adminApp').style.display='flex';
    initDashboard();
  }

  function logoutFlow() {
    sessionStorage.removeItem(SESSION_KEY);
    $('adminApp').style.display='none';
    $('loginScreen').style.display='flex';
    $('loginUser').value=''; $('loginPass').value='';
  }

  $('loginBtn').addEventListener('click', loginFlow);
  $('loginPass').addEventListener('keydown', e=>{if(e.key==='Enter')loginFlow();});
  $('loginUser').addEventListener('keydown', e=>{if(e.key==='Enter')$('loginPass').focus();});
  $('logoutBtn').addEventListener('click', logoutFlow);

  /* ── NAVIGATION ── */
  let currentPanel = 'products';
  const PANEL_TITLES = {products:'navProducts',categories:'navCategories',orders:'navOrders',settings:'navSettings'};

  function showPanel(name) {
    currentPanel = name;
    ['products','categories','orders','settings'].forEach(id => {
      $(`panel-${id}`).style.display = id===name ? 'block' : 'none';
    });
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.panel===name));
    $('topbarTitle').textContent = Lang.t(PANEL_TITLES[name]||'navProducts');
    renderCurrentPanel();
    $('sidebar').classList.remove('open');
  }

  function renderCurrentPanel() {
    if (currentPanel==='products')   renderProductsTable();
    if (currentPanel==='categories') renderCatGrid();
    if (currentPanel==='orders')     renderOrdersTable();
    if (currentPanel==='settings')   loadSettings();
  }

  document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click',()=>showPanel(btn.dataset.panel)));
  $('menuBtn').addEventListener('click',()=>$('sidebar').classList.add('open'));
  $('sidebarClose').addEventListener('click',()=>$('sidebar').classList.remove('open'));

  /* ── IMAGE UPLOAD CONTROLLER ── */
  function createImgCtrl({areaId,fileId,previewId,placeholderId,actionsId,changeId,removeId}) {
    let b64 = null;
    const area=$(areaId),file=$(fileId),preview=$(previewId),ph=$(placeholderId),actions=$(actionsId),changeBtn=$(changeId),removeBtn=$(removeId);

    function showPreview(s) { b64=s; preview.src=s; preview.style.display='block'; ph.style.display='none'; actions.style.display='flex'; }
    function clearPreview() { b64=null; preview.src=''; preview.style.display='none'; ph.style.display='flex'; actions.style.display='none'; file.value=''; }
    function load(s)        { s?showPreview(s):clearPreview(); }

    area.addEventListener('click', e=>{ if(changeBtn.contains(e.target)||removeBtn.contains(e.target))return; file.click(); });
    changeBtn.addEventListener('click',()=>file.click());
    removeBtn.addEventListener('click', e=>{ e.stopPropagation(); clearPreview(); });

    file.addEventListener('change', async()=>{
      const f=file.files[0]; if(!f) return;
      try { showPreview(await ShopData.compressImage(f)); }
      catch(err){ toast('Image error: '+err.message,'err'); }
    });

    return { get value(){return b64;}, load, clear:clearPreview };
  }

  /* ── PRODUCTS ── */
  const productImg = createImgCtrl({
    areaId:'productImgArea',fileId:'productImgFile',previewId:'productImgPreview',
    placeholderId:'productImgPlaceholder',actionsId:'productImgActions',
    changeId:'productImgChange',removeId:'productImgRemove'
  });

  let editingProductId = null;

  function renderProductsTable() {
    const search  = ($('productSearch').value||'').toLowerCase();
    const catFilt = $('productCatFilter').value;
    let prods = ShopData.getProducts();
    if (catFilt!=='all') prods=prods.filter(p=>p.category===catFilt);
    if (search)          prods=prods.filter(p=>p.name.toLowerCase().includes(search)||p.description.toLowerCase().includes(search));
    $('productCount').textContent = Lang.tp('itemCount','itemCountPlural',prods.length,{});
    populateCatDropdown($('productCatFilter'),catFilt,true);
    const tbody=$('productsBody'); tbody.innerHTML='';
    if (!prods.length){ tbody.innerHTML=`<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted)">${Lang.t('noProductsAdmin')}</td></tr>`; return; }
    prods.forEach(p=>{
      const cat=ShopData.getCategoryById(p.category);
      const tr=document.createElement('tr');
      tr.innerHTML=`<td><div class="tbl-img">${p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:`<span class="tbl-img-ph">${esc((p.name||'?')[0])}</span>`}</div></td>
        <td class="tbl-name">${esc(p.name)}</td>
        <td>${cat?esc(cat.name):`<em style="color:var(--muted-lt)">${Lang.t('noCategory')}</em>`}</td>
        <td class="tbl-price">${fmt(p.price)}</td>
        <td class="tbl-desc">${esc(p.description.substring(0,55))}${p.description.length>55?'…':''}</td>
        <td class="tbl-actions">
          <button class="btn-icon edit" title="${Lang.t('editTip')}">✏</button>
          <button class="btn-icon del"  title="${Lang.t('deleteTip')}">🗑</button>
        </td>`;
      tr.querySelector('.btn-icon.edit').addEventListener('click',()=>openProductModal(p.id));
      tr.querySelector('.btn-icon.del').addEventListener('click',()=>confirmDelete('product',p.id,p.name));
      tbody.appendChild(tr);
    });
  }

  $('productSearch').addEventListener('input',renderProductsTable);
  $('productCatFilter').addEventListener('change',renderProductsTable);

  function openProductModal(productId=null) {
    editingProductId=productId;
    $('productModalTitle').textContent=Lang.t(productId?'editProductTitle':'addProductTitle');
    populateCatDropdown($('productCategory'),null,false);
    if (productId) {
      const p=ShopData.getProducts().find(x=>x.id===productId); if(!p) return;
      $('productName').value=p.name; $('productPrice').value=p.price;
      $('productCategory').value=p.category; $('productDesc').value=p.description;
      productImg.load(p.image||null);
    } else {
      $('productName').value=''; $('productPrice').value='';
      $('productCategory').value=ShopData.getCategories()[0]?.id||''; $('productDesc').value='';
      productImg.clear();
    }
    openModal('productModalBg');
  }

  function closeProductModal(){ closeModal('productModalBg'); editingProductId=null; }

  function saveProduct(){
    const name=$('productName').value.trim(), price=Number($('productPrice').value),
          category=$('productCategory').value, desc=$('productDesc').value.trim(), image=productImg.value;
    if(!name||!price||!category||!desc){ toast(Lang.t('validationFill'),'err'); return; }
    if(price<=0){ toast(Lang.t('validationPrice'),'err'); return; }
    if(editingProductId) ShopData.updateProduct(editingProductId,{name,image:image!==null?image:undefined,price,category,description:desc});
    else ShopData.addProduct({name,image,price,category,description:desc});
    toast(Lang.t('savedProduct'),'ok'); closeProductModal(); renderProductsTable();
  }

  $('addProductBtn').addEventListener('click',()=>openProductModal());
  $('productModalClose').addEventListener('click',closeProductModal);
  $('productModalCancel').addEventListener('click',closeProductModal);
  $('productModalSave').addEventListener('click',saveProduct);

  /* ── CATEGORIES ── */
  const catImg = createImgCtrl({
    areaId:'catImgArea',fileId:'catImgFile',previewId:'catImgPreview',
    placeholderId:'catImgPlaceholder',actionsId:'catImgActions',
    changeId:'catImgChange',removeId:'catImgRemove'
  });

  let editingCategoryId=null;

  function renderCatGrid(){
    const cats=ShopData.getCategories(), prods=ShopData.getProducts(), grid=$('catGrid');
    $('categoryCount').textContent=Lang.tp('itemCount','itemCountPlural',cats.length,{});
    grid.innerHTML='';
    if(!cats.length){ grid.innerHTML=`<p style="color:var(--muted);grid-column:1/-1;padding:40px;text-align:center">${Lang.t('noCats')}</p>`; return; }
    cats.forEach(cat=>{
      const count=prods.filter(p=>p.category===cat.id).length;
      const card=document.createElement('div'); card.className='cat-card';
      card.innerHTML=`<div class="cat-card-img">${cat.image?`<img src="${cat.image}" alt="${esc(cat.name)}">`:`<span class="cat-card-img-ph">${esc((cat.name||'?')[0])}</span>`}</div>
        <div class="cat-card-body"><div class="cat-card-name">${esc(cat.name)}</div><div class="cat-card-count">${Lang.tp('catProducts','catProductsPlural',count,{})}</div></div>
        <div class="cat-card-actions"><button class="btn-icon edit">✏</button><button class="btn-icon del">🗑</button></div>`;
      card.querySelector('.btn-icon.edit').addEventListener('click',()=>openCategoryModal(cat.id));
      card.querySelector('.btn-icon.del').addEventListener('click',()=>confirmDelete('category',cat.id,cat.name));
      grid.appendChild(card);
    });
  }

  function openCategoryModal(catId=null){
    editingCategoryId=catId;
    $('categoryModalTitle').textContent=Lang.t(catId?'editCategoryTitle':'addCategoryTitle');
    if(catId){ const c=ShopData.getCategoryById(catId); if(!c)return; $('categoryName').value=c.name; catImg.load(c.image||null); }
    else { $('categoryName').value=''; catImg.clear(); }
    openModal('categoryModalBg');
  }

  function closeCategoryModal(){ closeModal('categoryModalBg'); editingCategoryId=null; }

  function saveCategory(){
    const name=$('categoryName').value.trim(), image=catImg.value;
    if(!name){ toast(Lang.t('validationFill'),'err'); return; }
    if(editingCategoryId) ShopData.updateCategory(editingCategoryId,{name,image:image!==null?image:undefined});
    else ShopData.addCategory({name,image});
    toast(Lang.t('savedCategory'),'ok'); closeCategoryModal(); renderCatGrid();
  }

  $('addCategoryBtn').addEventListener('click',()=>openCategoryModal());
  $('categoryModalClose').addEventListener('click',closeCategoryModal);
  $('categoryModalCancel').addEventListener('click',closeCategoryModal);
  $('categoryModalSave').addEventListener('click',saveCategory);
  $('categoryName').addEventListener('keydown',e=>{if(e.key==='Enter')saveCategory();});

  /* ── ORDERS PANEL ── */
  let viewingOrderId = null;

  function renderOrdersTable(filter='') {
    let orders = ShopData.getOrders();
    const tbody = $('ordersBody');
    const trackResult = $('orderTrackResult');

    // Search / track
    if (filter) {
      const f = filter.trim().toUpperCase();
      const match = orders.find(o => o.id.toUpperCase() === f);
      if (match) {
        trackResult.style.display = 'block';
        trackResult.innerHTML = `
          <div class="track-id">${esc(match.id)}</div>
          <div class="track-meta">${fmtDate(match.timestamp)}</div>
          <div class="track-items">${match.items.map(i=>`${i.qty}× ${esc(i.name)} — ${fmt(i.subtotal)}`).join('<br>')}</div>
          <div class="track-total">${fmt(match.total)}</div>
          ${statusBadge(match.status)}`;
      } else {
        trackResult.style.display = 'block';
        trackResult.innerHTML = `<p style="color:var(--red);font-size:.9rem;">⚠ ${Lang.t('trackNotFound')}</p>`;
      }
      // Filter table to matching order
      orders = orders.filter(o => o.id.toUpperCase().includes(f));
    } else {
      trackResult.style.display = 'none';
    }

    $('orderCount').textContent = Lang.tp('itemCount','itemCountPlural', ShopData.getOrders().length, {});
    tbody.innerHTML = '';

    if (!orders.length) {
      const empty = filter ? Lang.t('trackNotFound') : Lang.t('orderDetailEmpty');
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--muted);font-size:.88rem;">${esc(empty)}</td></tr>`;
      return;
    }

    orders.forEach(order => {
      const tr = document.createElement('tr');
      const itemSummary = order.items.slice(0,2).map(i=>`${i.qty}× ${i.name}`).join(', ') + (order.items.length>2?` +${order.items.length-2}…`:'');
      tr.innerHTML = `
        <td class="order-id-cell">${esc(order.id)}</td>
        <td>${fmtDate(order.timestamp)}</td>
        <td class="order-items-cell">${esc(itemSummary)}</td>
        <td class="tbl-price">${fmt(order.total)}</td>
        <td>${statusBadge(order.status)}</td>
        <td class="tbl-actions">
          <button class="btn-icon edit" title="View / Edit">👁</button>
          <button class="btn-icon del"  title="${Lang.t('deleteTip')}">🗑</button>
        </td>`;
      tr.querySelector('.btn-icon.edit').addEventListener('click', () => openOrderDetail(order.id));
      tr.querySelector('.btn-icon.del').addEventListener('click',  () => confirmDelete('order', order.id, order.id));
      tbody.appendChild(tr);
    });
  }

  // Wire up order search
  const orderSearch = $('orderSearch');
  if (orderSearch) {
    let debounce;
    orderSearch.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderOrdersTable(orderSearch.value.trim()), 300);
    });
  }

  // Clear all orders
  $('clearOrdersBtn').addEventListener('click', () => {
    if (confirm(Lang.t('clearOrdersConfirm'))) {
      ShopData.clearOrders();
      orderSearch.value = '';
      renderOrdersTable();
      toast('Orders cleared.');
    }
  });

  // Open order detail modal
  function openOrderDetail(orderId) {
    const order = ShopData.getOrderById(orderId);
    if (!order) return;
    viewingOrderId = orderId;

    $('orderDetailTitle').textContent = Lang.t('orderDetail');
    $('orderStatusSelect').value = order.status;

    const rows = order.items.map(i => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border-soft)">
          <div style="display:flex;align-items:center;gap:10px">
            ${i.image ? `<img src="${i.image}" style="width:36px;height:36px;border-radius:6px;object-fit:cover">` : ''}
            <span>${esc(i.name)}</span>
          </div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border-soft);text-align:center">${i.qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border-soft)">${fmt(i.price)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid var(--border-soft);font-weight:700;color:var(--accent-gold)">${fmt(i.subtotal)}</td>
      </tr>`).join('');

    $('orderDetailBody').innerHTML = `
      <div class="order-detail-id">${esc(order.id)}</div>
      <div class="order-detail-date">${fmtDate(order.timestamp)}&nbsp;&nbsp;${statusBadge(order.status)}</div>
      <table class="order-detail-table">
        <thead><tr>
          <th>Product</th><th style="text-align:center">Qty</th>
          <th>Unit Price</th><th>Subtotal</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="order-detail-total">
        <span>Total</span>
        <strong>${fmt(order.total)}</strong>
      </div>`;

    openModal('orderDetailModalBg');
  }

  $('orderDetailClose').addEventListener('click', () => closeModal('orderDetailModalBg'));
  $('saveOrderStatus').addEventListener('click', () => {
    if (!viewingOrderId) return;
    const status = $('orderStatusSelect').value;
    ShopData.updateOrderStatus(viewingOrderId, status);
    toast(Lang.t('statusUpdated'), 'ok');
    closeModal('orderDetailModalBg');
    renderOrdersTable(orderSearch?.value||'');
  });

  /* ── CONFIRM DELETE ── */
  let pendingDelete = null;

  function confirmDelete(type, id, name) {
    pendingDelete = {type, id};
    const key = type==='product'?'confirmProduct':(type==='category'?'confirmCategory':'confirmTitle');
    $('confirmMessage').innerHTML = `<strong>${esc(name)}</strong><br><br>${esc(Lang.t(key,{name}))}`;
    openModal('confirmModalBg');
  }

  $('confirmModalClose').addEventListener('click',()=>closeModal('confirmModalBg'));
  $('confirmCancel').addEventListener('click',()=>closeModal('confirmModalBg'));
  $('confirmDeleteBtn').addEventListener('click',()=>{
    if(!pendingDelete) return;
    const {type,id}=pendingDelete;
    if(type==='product')  { ShopData.deleteProduct(id); toast(Lang.t('deletedProduct')); renderProductsTable(); }
    if(type==='category') { ShopData.deleteCategory(id); toast(Lang.t('deletedCategory')); renderCatGrid(); }
    if(type==='order')    { ShopData.deleteOrder(id); toast('Order deleted.'); renderOrdersTable(); }
    closeModal('confirmModalBg'); pendingDelete=null;
  });

  /* ── SETTINGS ── */
  function loadSettings() {
    $('waNumber').value = ShopData.getSettings().whatsappNumber||''; Lang.apply();
  }
  $('saveSettingsBtn').addEventListener('click',()=>{
    const num=$('waNumber').value.trim();
    if(!num||!/^\d{7,15}$/.test(num)){ toast(Lang.t('validationFill'),'err'); return; }
    ShopData.saveSettings({whatsappNumber:num}); toast(Lang.t('settingsSaved'),'ok');
  });
  $('resetDataBtn').addEventListener('click',()=>{
    if(confirm(Lang.t('resetConfirm'))){ ShopData.reset(); toast('Data reset.'); renderCurrentPanel(); }
  });

  /* ── MODAL HELPERS ── */
  function openModal(id)  { $(id).classList.add('open'); document.body.style.overflow='hidden'; }
  function closeModal(id) { $(id).classList.remove('open'); document.body.style.overflow=''; }

  ['productModalBg','categoryModalBg','confirmModalBg','orderDetailModalBg'].forEach(id=>{
    $(id).addEventListener('click', e=>{ if(e.target.id===id) closeModal(id); });
  });
  document.addEventListener('keydown', e=>{
    if(e.key!=='Escape') return;
    ['productModalBg','categoryModalBg','confirmModalBg','orderDetailModalBg'].forEach(id=>{
      if($(id).classList.contains('open')) closeModal(id);
    });
  });

  /* ── CAT DROPDOWN ── */
  function populateCatDropdown(sel, selectedId, includeAll) {
    const cats=ShopData.getCategories(), cur=sel.value||selectedId;
    sel.innerHTML='';
    if(includeAll){ const o=document.createElement('option'); o.value='all'; o.textContent=Lang.t('allCategories'); sel.appendChild(o); }
    cats.forEach(cat=>{ const o=document.createElement('option'); o.value=cat.id; o.textContent=cat.name; sel.appendChild(o); });
    sel.value=cur||(includeAll?'all':(cats[0]?.id||''));
  }

  /* ── INIT ── */
  function initDashboard() { applyLang(); showPanel('products'); }

  applyLang();
  bindLangButtons();
  if(isLoggedIn()){ $('loginScreen').style.display='none'; $('adminApp').style.display='flex'; initDashboard(); }
})();
