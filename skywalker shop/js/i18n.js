/* i18n.js – SKYWALKER Home & Office – EN / FR */
const Lang = (() => {
  const STORAGE_KEY = 'skywalker_lang';
  const translations = {
    en: {
      siteName:'SKYWALKER Home & Office',cartBtn:'Cart',adminLink:'Admin Panel',langToggle:'FR',
      heroTag:'New arrivals every week',heroTitle:"Modern Furniture & Premium Equipment for Home and Office",
      heroSub:'Superior Quality • Fast Delivery • Easy Ordering via WhatsApp.',heroCta:'Shop Now',
      filterLabel:'Shop by category',filterAll:'All Products',
      searchPlaceholder:'Search products by name or description…',
      resultsAll:'{n} products available',resultsCat:'{n} products in {cat}',resultsSearch:'"{q}" – {n} result',resultsSearchPlural:'"{q}" – {n} results',
      addToCart:'Add to Cart',addedToCart:'Added ✓',noProducts:'No products found',noProductsSub:'Try a different category or search term.',
      cartTitle:'Your Cart',cartItems:'{n} item',cartItemsPlural:'{n} items',
      cartEmptyTitle:'Your cart is empty',cartEmptySub:'Add products to get started.',
      cartTotal:'Order Total',checkoutBtn:'Order via WhatsApp',removeItem:'Remove',
      waHeader:'🛒 *New Order – SKYWALKER Home & Office*',waOrderId:'Order ID: {id}',
      waGreeting:'Hello! I would like to place the following order:',
      waItem:'  • {qty}× {name} — {price}',waTotal:'💰 *TOTAL: {total}*',waClosing:'Thank you! 🙏',
      toastAdded:'{name} added to cart',toastRedirect:'Redirecting to WhatsApp…',toastOrderSaved:'Order {id} recorded!',
      footerText:'© 2025 SKYWALKER Home & Office · All orders processed via WhatsApp',
      loginTitle:'Admin Panel',loginSub:'Sign in to manage your store',loginUser:'Username',loginPass:'Password',loginBtn:'Sign In',
      loginError:'Invalid username or password.',loginEmpty:'Please enter your username and password.',backToStore:'← Back to Store',
      navProducts:'Products',navCategories:'Categories',navOrders:'Orders',navSettings:'Settings',navLogout:'Log Out',
      panelProducts:'Products',addProduct:'+ Add Product',searchProducts:'Search products…',allCategories:'All Categories',
      colImage:'Image',colName:'Name',colCategory:'Category',colPrice:'Price',colDescription:'Description',colActions:'Actions',
      colOrderId:'Order ID',colDate:'Date & Time',colItems:'Items',colTotal:'Total',colStatus:'Status',
      noProductsAdmin:'No products match your search.',editTip:'Edit',deleteTip:'Delete',
      addProductTitle:'Add New Product',editProductTitle:'Edit Product',
      fieldName:'Product Name',fieldNamePh:'e.g. Sofa Set',fieldPrice:'Price (FCFA)',fieldPricePh:'e.g. 250000',
      fieldCategory:'Category',fieldDesc:'Description',fieldDescPh:'Short description…',
      fieldImage:'Product Image',imageUploadHint:'Click to upload (JPG, PNG, WEBP)',imageChange:'Change Image',imageRemove:'Remove',
      saveProduct:'Save Product',cancelBtn:'Cancel',
      validationFill:'Please fill in all required fields.',validationPrice:'Price must be greater than 0.',savedProduct:'Product saved!',deletedProduct:'Product deleted.',
      panelCategories:'Categories',addCategory:'+ Add Category',addCategoryTitle:'Add New Category',editCategoryTitle:'Edit Category',
      catName:'Category Name',catNamePh:'e.g. Living Room',catImage:'Category Image',
      catProducts:'{n} product',catProductsPlural:'{n} products',
      saveCategory:'Save Category',savedCategory:'Category saved!',deletedCategory:'Category and its products deleted.',noCats:'No categories yet. Add your first one!',
      orderDetail:'Order Detail',orderDetailEmpty:'No orders yet. Orders will appear here after customers place them via WhatsApp.',
      trackOrderPh:'Track by Order ID… e.g. SKY-20250402-A3K7P',
      trackNotFound:'No order found with that ID.',trackFound:'Order found:',
      clearOrders:'Clear All',clearOrdersConfirm:'Delete all order records? This cannot be undone.',
      statusPending:'Pending',statusConfirmed:'Confirmed',statusDelivered:'Delivered',statusCancelled:'Cancelled',
      saveStatus:'Update Status',statusUpdated:'Status updated!',
      panelSettings:'Settings',settingsWA:'WhatsApp Configuration',settingsWASub:'All customer orders will be sent to this number.',
      waNumber:'WhatsApp Number',waNumberPh:'e.g. 237612345678',waNumberHint:'Include country code without + sign. Cameroon: 237xxxxxxxxx',
      saveSettings:'Save Settings',settingsSaved:'Settings saved!',
      dangerZone:'Danger Zone',dangerSub:'Reset all data to the default sample products and categories.',
      resetData:'Reset to Sample Data',resetConfirm:'This will delete all your products and categories. Are you sure?',
      confirmTitle:'Confirm Delete',confirmProduct:'Delete "{name}"? This cannot be undone.',
      confirmCategory:'Delete "{name}"? All products in this category will also be deleted.',confirmDelete:'Delete',
      adminBadge:'Admin',itemCount:'{n} item',itemCountPlural:'{n} items',noCategory:'Uncategorized',
    },
    fr: {
      siteName:'SKYWALKER Home & Office',cartBtn:'Panier',adminLink:'Administration',langToggle:'EN',
      heroTag:'Nouveautés chaque semaine',heroTitle:'Mobilier moderne & équipements premium pour maison et bureau',
      heroSub:' Qualité supérieure • Livraison rapide • Commande facile via WhatsApp',heroCta:'Voir les produits',
      filterLabel:'Parcourir par catégorie',filterAll:'Tous les produits',
      searchPlaceholder:'Rechercher par nom ou description…',
      resultsAll:'{n} produits disponibles',resultsCat:'{n} produits dans {cat}',resultsSearch:'"{q}" – {n} résultat',resultsSearchPlural:'"{q}" – {n} résultats',
      addToCart:'Ajouter au panier',addedToCart:'Ajouté ✓',noProducts:'Aucun produit trouvé',noProductsSub:'Essayez une autre catégorie ou un autre terme.',
      cartTitle:'Votre Panier',cartItems:'{n} article',cartItemsPlural:'{n} articles',
      cartEmptyTitle:'Votre panier est vide',cartEmptySub:'Ajoutez des produits pour commencer.',
      cartTotal:'Total de la commande',checkoutBtn:'Commander via WhatsApp',removeItem:'Supprimer',
      waHeader:'🛒 *Nouvelle Commande – SKYWALKER Home & Office*',waOrderId:'N° Commande : {id}',
      waGreeting:'Bonjour ! Je souhaite passer la commande suivante :',
      waItem:'  • {qty}× {name} — {price}',waTotal:'💰 *TOTAL : {total}*',waClosing:'Merci ! 🙏',
      toastAdded:'{name} ajouté au panier',toastRedirect:'Redirection vers WhatsApp…',toastOrderSaved:'Commande {id} enregistrée !',
      footerText:'© 2025 SKYWALKER Home & Office · Commandes via WhatsApp',
      loginTitle:'Administration',loginSub:'Connectez-vous pour gérer votre boutique',loginUser:"Nom d'utilisateur",loginPass:'Mot de passe',loginBtn:'Se connecter',
      loginError:"Nom d'utilisateur ou mot de passe invalide.",loginEmpty:'Veuillez saisir vos identifiants.',backToStore:'← Retour à la boutique',
      navProducts:'Produits',navCategories:'Catégories',navOrders:'Commandes',navSettings:'Paramètres',navLogout:'Se déconnecter',
      panelProducts:'Produits',addProduct:'+ Ajouter un produit',searchProducts:'Rechercher…',allCategories:'Toutes les catégories',
      colImage:'Image',colName:'Nom',colCategory:'Catégorie',colPrice:'Prix',colDescription:'Description',colActions:'Actions',
      colOrderId:'N° Commande',colDate:'Date & Heure',colItems:'Articles',colTotal:'Total',colStatus:'Statut',
      noProductsAdmin:'Aucun produit ne correspond.',editTip:'Modifier',deleteTip:'Supprimer',
      addProductTitle:'Ajouter un produit',editProductTitle:'Modifier le produit',
      fieldName:'Nom du produit',fieldNamePh:'ex. Canapé 3 places',fieldPrice:'Prix (FCFA)',fieldPricePh:'ex. 250000',
      fieldCategory:'Catégorie',fieldDesc:'Description',fieldDescPh:'Courte description…',
      fieldImage:'Image du produit',imageUploadHint:'Cliquer pour ajouter (JPG, PNG, WEBP)',imageChange:"Changer l'image",imageRemove:'Supprimer',
      saveProduct:'Enregistrer',cancelBtn:'Annuler',
      validationFill:'Veuillez remplir tous les champs obligatoires.',validationPrice:'Le prix doit être supérieur à 0.',savedProduct:'Produit enregistré !',deletedProduct:'Produit supprimé.',
      panelCategories:'Catégories',addCategory:'+ Ajouter une catégorie',addCategoryTitle:'Ajouter une catégorie',editCategoryTitle:'Modifier la catégorie',
      catName:'Nom de la catégorie',catNamePh:'ex. Salon',catImage:'Image de la catégorie',
      catProducts:'{n} produit',catProductsPlural:'{n} produits',
      saveCategory:'Enregistrer',savedCategory:'Catégorie enregistrée !',deletedCategory:'Catégorie et ses produits supprimés.',noCats:'Aucune catégorie. Ajoutez-en une !',
      orderDetail:'Détail de la commande',orderDetailEmpty:"Aucune commande pour l'instant. Les commandes apparaîtront ici après que les clients commandent via WhatsApp.",
      trackOrderPh:'Rechercher par N° commande… ex. SKY-20250402-A3K7P',
      trackNotFound:'Aucune commande trouvée avec cet identifiant.',trackFound:'Commande trouvée :',
      clearOrders:'Tout effacer',clearOrdersConfirm:'Supprimer tous les enregistrements de commandes ? Irréversible.',
      statusPending:'En attente',statusConfirmed:'Confirmée',statusDelivered:'Livrée',statusCancelled:'Annulée',
      saveStatus:'Mettre à jour',statusUpdated:'Statut mis à jour !',
      panelSettings:'Paramètres',settingsWA:'Configuration WhatsApp',settingsWASub:'Toutes les commandes seront envoyées à ce numéro.',
      waNumber:'Numéro WhatsApp',waNumberPh:'ex. 237612345678',waNumberHint:"Indicatif pays sans le +. Cameroun : 237xxxxxxxxx",
      saveSettings:'Enregistrer',settingsSaved:'Paramètres sauvegardés !',
      dangerZone:'Zone Dangereuse',dangerSub:'Réinitialiser toutes les données avec les produits exemples.',
      resetData:'Réinitialiser les données',resetConfirm:'Cela supprimera tous vos produits et catégories. Êtes-vous sûr ?',
      confirmTitle:'Confirmer la suppression',confirmProduct:'Supprimer "{name}" ? Irréversible.',
      confirmCategory:'Supprimer "{name}" ? Tous les produits de cette catégorie seront aussi supprimés.',confirmDelete:'Supprimer',
      adminBadge:'Admin',itemCount:'{n} élément',itemCountPlural:'{n} éléments',noCategory:'Sans catégorie',
    },
  };

  let current = localStorage.getItem(STORAGE_KEY) || 'en';

  function t(key, vars) {
    const str = translations[current][key] || translations['en'][key] || key;
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_,k) => vars[k] !== undefined ? vars[k] : `{${k}}`);
  }

  function tp(singularKey, pluralKey, n, vars={}) {
    return t(n===1 ? singularKey : pluralKey, {...vars, n});
  }

  function set(lang) {
    if (!translations[lang]) return;
    current = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    apply();
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder = t(key);
      else el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.dataset.i18nHtml).replace(/\n/g,'<br>');
    });
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = t('langToggle');
    document.documentElement.lang = current;
  }

  function toggle() {
    set(current==='en' ? 'fr' : 'en');
    window.dispatchEvent(new CustomEvent('langchange', {detail:{lang:current}}));
  }

  return { t, tp, set, toggle, apply, get current(){ return current; } };
})();
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
