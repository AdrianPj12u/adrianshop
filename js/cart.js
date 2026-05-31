// ==================== CART (shopping cart) ====================
// FUTURE: Wishlist, saved items, cart expiry

const Cart = {
  _key: 'as_cart',

  get items() {
    const d = localStorage.getItem(this._key);
    return d ? JSON.parse(d) : [];
  },
  set items(v) { localStorage.setItem(this._key, JSON.stringify(v)); },

  get count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  get total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },

  add(product) {
    const items = this.items;
    const e = items.find(i => i.id === product.id);
    if (e) e.qty++;
    else items.push({ ...product, qty: 1 });
    this.items = items;
    Store.notify('Añadido al carrito');
    App.render();
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    App.render();
  },

  updateQty(id, delta) {
    const items = this.items;
    const i = items.find(x => x.id === id);
    if (!i) return;
    i.qty += delta;
    if (i.qty < 1) this.remove(id);
    else { this.items = items; App.render(); }
  },

  clear() {
    this.items = [];
    App.render();
  },
};

window.Cart = Cart;