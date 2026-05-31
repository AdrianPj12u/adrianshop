// ==================== ORDERS (order management) ====================
// FUTURE: Order notifications, WhatsApp/Telegram alerts, invoice PDF

const Orders = {
  _key: 'as_orders',

  get all() {
    const d = localStorage.getItem(this._key);
    return d ? JSON.parse(d) : [];
  },
  set all(v) { localStorage.setItem(this._key, JSON.stringify(v)); },

  create(orderData) {
    const order = {
      id: 'ORD-' + Date.now(),
      userId: Auth.session?.id || 'guest',
      userName: Auth.session?.name || 'Invitado',
      userEmail: Auth.session?.email || '',
      items: Cart.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: Cart.total,
      ...orderData,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    this.all = [order, ...this.all];
    Cart.clear();
    Store.notify('✅ Pedido realizado! Te contactaremos para la entrega.');
    return order;
  },

  getByUser(userId) {
    return this.all.filter(o => o.userId === userId);
  },

  updateStatus(id, status) {
    this.all = this.all.map(o => o.id === id ? { ...o, status } : o);
    Store.notify('Estado actualizado');
    App.render();
  },
};

window.Orders = Orders;