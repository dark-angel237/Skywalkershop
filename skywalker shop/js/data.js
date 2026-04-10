/* data.js – SKYWALKER Home & Office – Shared Data Store */
const ShopData = (() => {

  const DEFAULT_CATEGORIES = [
    {id:'cat-1',name:'Electronics',image:null},
    {id:'cat-2',name:'Food & Drinks',image:null},
    {id:'cat-3',name:'Clothing',image:null},
    {id:'cat-4',name:'Home & Office',image:null},
    {id:'cat-5',name:'Sports',image:null},
  ];

  const DEFAULT_PRODUCTS = [
    {id:'p-1',name:'Wireless Earbuds',image:null,price:15000,category:'cat-1',description:'High-quality sound, 24h battery life. Noise-cancelling & sweat-resistant.'},
    {id:'p-2',name:'Fast Phone Charger',image:null,price:3500,category:'cat-1',description:'65W fast charger compatible with most smartphones. USB-C with LED indicator.'},
    {id:'p-3',name:'Bluetooth Speaker',image:null,price:12000,category:'cat-1',description:'Portable waterproof speaker. Rich bass, 360° surround sound, 10h playback.'},
    {id:'p-4',name:'Fresh Tomatoes (1kg)',image:null,price:800,category:'cat-2',description:'Farm-fresh ripe tomatoes. Locally sourced, pesticide-free. Perfect for cooking.'},
    {id:'p-5',name:'Orange Juice (1L)',image:null,price:1500,category:'cat-2',description:'100% natural fresh-squeezed orange juice. No added sugar or preservatives.'},
    {id:'p-6',name:'Basmati Rice (5kg)',image:null,price:6500,category:'cat-2',description:'Premium long-grain basmati rice. Aromatic and fluffy. Ideal for all dishes.'},
    {id:'p-7',name:"Men's Polo Shirt",image:null,price:4500,category:'cat-3',description:'Premium cotton polo. Multiple colours and sizes (S–XXL).'},
    {id:'p-8',name:"Women's Sneakers",image:null,price:18000,category:'cat-3',description:'Lightweight comfortable sneakers. Modern design, anti-slip sole.'},
    {id:'p-9',name:'Office Desk (180cm)',image:null,price:95000,category:'cat-4',description:'Spacious L-shaped office desk with cable management. Assembly required.'},
    {id:'p-10',name:'Football (Size 5)',image:null,price:7500,category:'cat-5',description:'Official size 5 training football. Durable synthetic leather, hand-stitched panels.'},
  ];

  const DEFAULT_SETTINGS = {whatsappNumber:'237612345678'};

  const KEYS = {
    categories: 'skywalker_categories',
    products:   'skywalker_products',
    settings:   'skywalker_settings',
    orders:     'skywalker_orders',
  };

  /* IMAGE COMPRESSION */
  function compressImage(file, maxW=800, maxH=800, quality=0.82) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) { reject(new Error('Invalid file')); return; }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Read error'));
      reader.onload = e => {
        const img = new Image();
        img.onerror = () => reject(new Error('Load error'));
        img.onload = () => {
          let w = img.naturalWidth, h = img.naturalHeight;
          if (w > maxW) { h = Math.round(h*maxW/w); w = maxW; }
          if (h > maxH) { w = Math.round(w*maxH/h); h = maxH; }
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* INIT */
  function init() {
    if (!localStorage.getItem(KEYS.categories)) localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    if (!localStorage.getItem(KEYS.products))   localStorage.setItem(KEYS.products,   JSON.stringify(DEFAULT_PRODUCTS));
    if (!localStorage.getItem(KEYS.settings))   localStorage.setItem(KEYS.settings,   JSON.stringify(DEFAULT_SETTINGS));
    if (!localStorage.getItem(KEYS.orders))     localStorage.setItem(KEYS.orders,     JSON.stringify([]));
  }

  function reset() {
    localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(KEYS.products,   JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(KEYS.orders,     JSON.stringify([]));
  }

  function genId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  }

  /* ORDER ID generator: SKY-YYYYMMDD-XXXXX */
  function generateOrderId() {
    const d  = new Date();
    const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const rand = Math.random().toString(36).slice(2,7).toUpperCase();
    return `SKY-${date}-${rand}`;
  }

  /* CATEGORIES */
  function getCategories()    { return JSON.parse(localStorage.getItem(KEYS.categories)) || []; }
  function saveCategories(c)  { localStorage.setItem(KEYS.categories, JSON.stringify(c)); }
  function getCategoryById(id){ return getCategories().find(c=>c.id===id)||null; }
  function addCategory({name,image}){ const c=getCategories(); const n={id:genId('cat'),name:name.trim(),image:image||null}; c.push(n); saveCategories(c); return n; }
  function updateCategory(id,{name,image}){ saveCategories(getCategories().map(c=>c.id!==id?c:{...c,name:name.trim(),image:image===undefined?c.image:(image||null)})); }
  function deleteCategory(id){ saveCategories(getCategories().filter(c=>c.id!==id)); saveProducts(getProducts().filter(p=>p.category!==id)); }

  /* PRODUCTS */
  function getProducts()         { return JSON.parse(localStorage.getItem(KEYS.products)) || []; }
  function saveProducts(p)       { localStorage.setItem(KEYS.products, JSON.stringify(p)); }
  function getProductsByCategory(catId){ return catId==='all'?getProducts():getProducts().filter(p=>p.category===catId); }
  function addProduct({name,image,price,category,description}){ const p=getProducts(); const n={id:genId('p'),name:name.trim(),image:image||null,price:Number(price),category,description:description.trim()}; p.push(n); saveProducts(p); return n; }
  function updateProduct(id,{name,image,price,category,description}){ saveProducts(getProducts().map(p=>p.id!==id?p:{...p,name:name.trim(),image:image===undefined?p.image:(image||null),price:Number(price),category,description:description.trim()})); }
  function deleteProduct(id)     { saveProducts(getProducts().filter(p=>p.id!==id)); }

  /* SETTINGS */
  function getSettings()    { return JSON.parse(localStorage.getItem(KEYS.settings)) || DEFAULT_SETTINGS; }
  function saveSettings(s)  { localStorage.setItem(KEYS.settings, JSON.stringify({...getSettings(),...s})); }

  /* ORDERS */
  function getOrders()      { return JSON.parse(localStorage.getItem(KEYS.orders)) || []; }
  function saveOrders(o)    { localStorage.setItem(KEYS.orders, JSON.stringify(o)); }
  function getOrderById(id) { return getOrders().find(o=>o.id===id)||null; }

  function saveOrder({id, items, total, timestamp, status='pending'}) {
    const orders = getOrders();
    const existing = orders.findIndex(o=>o.id===id);
    if (existing>=0) orders[existing] = {id,items,total,timestamp,status};
    else orders.unshift({id,items,total,timestamp,status}); // newest first
    saveOrders(orders);
  }

  function updateOrderStatus(id, status) {
    const orders = getOrders().map(o=>o.id===id ? {...o,status} : o);
    saveOrders(orders);
  }

  function deleteOrder(id) { saveOrders(getOrders().filter(o=>o.id!==id)); }
  function clearOrders()   { saveOrders([]); }

  init();

  return {
    compressImage, generateOrderId,
    getCategories, getCategoryById, addCategory, updateCategory, deleteCategory,
    getProducts, getProductsByCategory, addProduct, updateProduct, deleteProduct,
    getSettings, saveSettings,
    getOrders, getOrderById, saveOrder, updateOrderStatus, deleteOrder, clearOrders,
    reset,
  };
})();
