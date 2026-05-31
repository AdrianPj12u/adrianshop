// ==================== STORE (data layer) ====================
// All data is persisted in localStorage. This makes the site
// fully self-contained with no backend needed.
// In the future, these functions can be swapped for API calls
// to a real backend (Node.js, Python, Supabase, etc.)

const Store = {
  // Default data
  _categories: [
    { id: 'c1', name: 'Cuentas de Juegos', icon: '🎮' },
    { id: 'c2', name: 'Monedas Virtuales', icon: '💰' },
    { id: 'c3', name: 'Skins y Cosméticos', icon: '🎨' },
    { id: 'c4', name: 'Boosting', icon: '⚡' },
    { id: 'c5', name: 'Streaming', icon: '📺' },
  ],

  _products: [
    { id:'p1', name:'Cuenta Fortnite (Battle Pass)', cat:'c1', price:25, desc:'Battle pass completo + 50 skins. Email incluido.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=🎮+Fortnite' },
    { id:'p2', name:'Cuenta Valorant (Radiante)', cat:'c1', price:35, desc:'Rango Radiante con skins exclusivas.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=🎮+Valorant' },
    { id:'p3', name:'Cuenta League of Legends', cat:'c1', price:20, desc:'100+ skins, todos los campeones.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=🎮+LoL' },
    { id:'p4', name:'10.000 V-Bucks', cat:'c2', price:15, desc:'Código digital directo para Fortnite.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=💰+V-Bucks' },
    { id:'p5', name:'1.000 Robux', cat:'c2', price:12, desc:'Para Roblox. Entrega inmediata.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=💰+Robux' },
    { id:'p6', name:'Paquete Skins CS:GO', cat:'c3', price:40, desc:'5 skins aleatorias de alta calidad.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=🎨+CS:GO' },
    { id:'p7', name:'Skin Legendaria LoL', cat:'c3', price:18, desc:'Skin legendaria a elegir entre 20.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=🎨+LoL+Skin' },
    { id:'p8', name:'Boosting Bronce→Oro', cat:'c4', price:30, desc:'Subida a Oro en 7 días. Duo incluido.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=⚡+Boosting' },
    { id:'p9', name:'Cuenta Netflix (1 año)', cat:'c5', price:10, desc:'4K. Perfil propio. Garantía 1 año.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=📺+Netflix' },
    { id:'p10', name:'Cuenta Spotify Premium', cat:'c5', price:8, desc:'Sin anuncios, descargas. 1 año.', img:'https://placehold.co/400x300/1a1a1a/CCFF00?text=📺+Spotify' },
  ],

  _reviews: [],   // FUTURE: { id, productId, userId, rating, text, date }
  _tickets: [],   // FUTURE: { id, userId, subject, message, status, date }
  _disputes: [],  // FUTURE: { id, orderId, userId, reason, status, date }

  locations: [
    'IES Virgen del Carmen (Jaén)',
    'IES Los Cerros (Jaén)',
    'IES Jabalcuz (Jaén)',
    'IES Fuente de la Peña (Jaén)',
    'Plaza de la Constitución (Jaén)',
    'Estación de Tren (Jaén)',
  ],

  // ============== Category CRUD ==============
  get categories() {
    const d = localStorage.getItem('as_cats');
    if (d) return JSON.parse(d);
    localStorage.setItem('as_cats', JSON.stringify(this._categories));
    return this._categories;
  },
  set categories(v) { localStorage.setItem('as_cats', JSON.stringify(v)); },

  catName(id) { return this.categories.find(c => c.id === id)?.name || ''; },
  catIcon(id) { return this.categories.find(c => c.id === id)?.icon || ''; },

  // ============== Product CRUD ==============
  get products() {
    const d = localStorage.getItem('as_prods');
    if (d) return JSON.parse(d);
    localStorage.setItem('as_prods', JSON.stringify(this._products));
    return this._products;
  },
  set products(v) { localStorage.setItem('as_prods', JSON.stringify(v)); },

  product(id) { return this.products.find(p => p.id === id); },
  productsByCat(catId) {
    if (!catId || catId === 'all') return this.products;
    return this.products.filter(p => p.cat === catId);
  },

  // ============== Reviews (FUTURE) ==============
  get reviews() {
    const d = localStorage.getItem('as_reviews');
    if (d) return JSON.parse(d);
    localStorage.setItem('as_reviews', JSON.stringify([]));
    return [];
  },
  set reviews(v) { localStorage.setItem('as_reviews', JSON.stringify(v)); },

  // ============== Tickets / Support (FUTURE) ==============
  get tickets() {
    const d = localStorage.getItem('as_tickets');
    if (d) return JSON.parse(d);
    localStorage.setItem('as_tickets', JSON.stringify([]));
    return [];
  },
  set tickets(v) { localStorage.setItem('as_tickets', JSON.stringify(v)); },

  // ============== Disputes (FUTURE) ==============
  get disputes() {
    const d = localStorage.getItem('as_disputes');
    if (d) return JSON.parse(d);
    localStorage.setItem('as_disputes', JSON.stringify([]));
    return [];
  },
  set disputes(v) { localStorage.setItem('as_disputes', JSON.stringify(v)); },

  // ============== Toast Notifications ==============
  toast(msg, type) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.style.background = type === 'success' ? '#44cc44' : type === 'error' ? '#ff4444' : 'var(--surface)';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 2500);
  },
  notify(msg) { this.toast(msg, 'success'); },
  alert(msg) { this.toast(msg, 'error'); },
};

window.Store = Store; // global access