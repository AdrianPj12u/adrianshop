// ==================== PAGES (all page HTML generators) ====================

const Pages = {
  catFilter: 'all',
  detailId: null,
  _otpEmail: '',
  _otpCode: ['', '', '', '', '', ''],

  home() {
    const featured = Store.products.slice(0, 4);
    return Components.hero(
      'Bienvenido a <span>AdrianSHOP</span>',
      'La tienda nº1 para cuentas de juegos, monedas virtuales, skins, boosting y cuentas de streaming.',
      '<button class="btn btn-primary btn-lg" onclick="App.go(\'products\')">Ver productos</button>' +
      '<button class="btn btn-lg" onclick="App.go(\'register\')">Crear cuenta</button>'
    ) +
    '<section class="section"><div class="container"><h2 class="section-title">Categorías</h2><div class="cat-grid">' +
    Store.categories.map(c => Components.categoryCard(c, `Pages.catFilter='${c.id}';App.go('products')`)).join('') +
    '</div></div></section>' +
    '<section class="section" style="background:var(--surface)"><div class="container"><h2 class="section-title">Productos destacados</h2><div class="grid">' +
    featured.map(p => Components.productCard(p)).join('') +
    '</div><div style="text-align:center;margin-top:2rem"><button class="btn btn-primary" onclick="App.go(\'products\')">Ver todos</button></div></div></section>';
  },

  products() {
    const f = Store.productsByCat(this.catFilter);
    const tabs = [
      { value: 'all', label: 'Todos' },
      ...Store.categories.map(c => ({ value: c.id, label: c.icon + ' ' + c.name })),
    ];
    return '<div class="container page"><h1>Productos</h1>' +
      Components.tabs(tabs, this.catFilter, "Pages.catFilter=") +
      (f.length === 0 ? Components.empty('🔍', 'No hay productos') : '<div class="grid">' + f.map(p => Components.productCard(p)).join('') + '</div>') +
      '</div>';
  },

  detail() {
    const p = Store.product(this.detailId);
    if (!p) return Components.empty('404', 'Producto no encontrado', 'Volver', "App.go('products')");
    ProductReviews.render(this.detailId); // Load reviews area
    return '<div class="container page"><button class="btn btn-sm" onclick="App.go(\'products\')">← Volver</button>' +
      '<div class="detail-grid" style="margin-top:1.5rem">' +
      '<img src="' + p.img + '" alt="' + p.name + '" style="width:100%;border:1px solid var(--border)">' +
      '<div>' +
      '<span class="badge">' + Store.catIcon(p.cat) + ' ' + Store.catName(p.cat) + '</span>' +
      '<h1 style="font-size:1.8rem;font-weight:800;margin-top:.5rem">' + p.name + '</h1>' +
      '<div class="price-big">' + p.price + '€</div>' +
      '<p style="color:var(--muted);margin-bottom:1.5rem;line-height:1.7">' + p.desc + '</p>' +
      '<button class="btn btn-primary btn-lg" onclick="Cart.add(Store.product(\'' + p.id + '\'))">🛒 Añadir al carrito</button>' +
      '</div></div>' +
      '<div id="reviews-section" style="margin-top:3rem"></div>' +
      '</div>';
  },

  cart() {
    const items = Cart.items;
    if (items.length === 0) return Components.empty('🛒', 'Tu carrito está vacío', 'Ver productos', "App.go('products')");
    return '<div class="container page">' +
      '<div style="display:flex;justify-content:space-between;align-items:center"><h1>Carrito (' + items.length + ')</h1><button class="btn btn-sm" onclick="Cart.clear()">Vaciar</button></div>' +
      items.map(i => Components.cartItem(i)).join('') +
      '<div style="text-align:right;padding:1rem 0;font-size:1.3rem;font-weight:800">Total: <span style="color:var(--accent)">' + Cart.total + '€</span></div>' +
      '<div style="display:flex;gap:1rem;justify-content:flex-end">' +
      '<button class="btn" onclick="App.go(\'products\')">← Seguir comprando</button>' +
      (Auth.isLoggedIn() ? '<button class="btn btn-primary btn-lg" onclick="App.go(\'checkout\')">Proceder al pago</button>' : '<button class="btn btn-primary btn-lg" onclick="App.go(\'login\')">Inicia sesión</button>') +
      '</div></div>';
  },

  checkout() {
    if (!Auth.isLoggedIn()) return Components.empty('🔒', 'Debes iniciar sesión', 'Entrar', "App.go('login')");
    if (Cart.items.length === 0) return Components.empty('🛒', 'Carrito vacío', 'Ver productos', "App.go('products')");
    return '<div class="container page" style="max-width:600px"><h1>Checkout</h1>' +
      '<div class="card"><h3 style="margin-bottom:.5rem">Resumen del pedido</h3>' +
      Cart.items.map(i => '<div style="display:flex;justify-content:space-between;padding:.3rem 0;font-size:.9rem"><span>' + i.name + ' x' + i.qty + '</span><span style="font-weight:600">' + i.price * i.qty + '€</span></div>').join('') +
      '<div style="border-top:1px solid var(--border);margin-top:.5rem;padding-top:.5rem;display:flex;justify-content:space-between;font-weight:800;font-size:1.1rem"><span>Total</span><span style="color:var(--accent)">' + Cart.total + '€</span></div></div>' +
      '<div class="card"><h3 style="margin-bottom:1rem">Datos de entrega</h3><p style="font-size:.85rem;color:var(--muted);margin-bottom:1rem">Pago en persona. Elige lugar, fecha y hora.</p>' +
      '<div class="form-group"><label class="label">Lugar *</label><select class="input" id="ch-location"><option value="">Selecciona...</option>' + Store.locations.map(l => '<option value="' + l + '">' + l + '</option>').join('') + '</select></div>' +
      '<div class="form-group"><label class="label">Fecha *</label><input type="date" class="input" id="ch-date"></div>' +
      '<div class="form-group"><label class="label">Hora *</label><input type="time" class="input" id="ch-time"></div>' +
      '<div class="form-group"><label class="label">Teléfono *</label><input type="tel" class="input" id="ch-phone" placeholder="+34 600 00 00 00"></div>' +
      '<div class="form-group"><label class="label">Notas</label><textarea class="input" rows="3" id="ch-notes" placeholder="Opcional..."></textarea></div>' +
      '<button class="btn btn-primary btn-lg" style="width:100%" onclick="Pages.submitOrder()">Confirmar pedido (' + Cart.total + '€)</button></div></div>';
  },

  submitOrder() {
    const loc = document.getElementById('ch-location'), date = document.getElementById('ch-date'),
          time = document.getElementById('ch-time'), phone = document.getElementById('ch-phone'),
          notes = document.getElementById('ch-notes');
    if (!loc.value || !date.value || !time.value || !phone.value) { Store.alert('Completa todos los campos obligatorios'); return; }
    Orders.create({ location: loc.value, date: date.value, time: time.value, phone: phone.value, notes: notes.value });
    App.go('account');
  },

  login() {
    return '<div class="auth-box"><h1>Iniciar sesión</h1>' +
      '<div class="form-group"><label class="label">Email</label><input class="input" id="log-email" type="email" placeholder="tu@email.com"></div>' +
      '<div class="form-group"><label class="label">Contraseña</label><input class="input" id="log-pass" type="password" placeholder="••••••••"></div>' +
      '<button class="btn btn-primary" onclick="Pages.submitLogin()">Entrar</button>' +
      '<div class="auth-footer">¿No tienes cuenta? <a href="#" onclick="App.go(\'register\')">Regístrate</a></div></div>';
  },

  submitLogin() {
    const email = document.getElementById('log-email').value, pass = document.getElementById('log-pass').value;
    if (Auth.login(email, pass)) App.go('home');
  },

  register() {
    return '<div class="auth-box"><h1>Crear cuenta</h1>' +
      '<div class="form-group"><label class="label">Nombre</label><input class="input" id="reg-name" placeholder="Tu nombre"></div>' +
      '<div class="form-group"><label class="label">Email</label><input class="input" id="reg-email" type="email" placeholder="tu@email.com"></div>' +
      '<div class="form-group"><label class="label">Contraseña</label><input class="input" id="reg-pass" type="password" placeholder="Mínimo 6 caracteres"></div>' +
      '<button class="btn btn-primary" onclick="Pages.submitRegister()">Crear cuenta</button>' +
      '<div class="auth-footer">¿Ya tienes cuenta? <a href="#" onclick="App.go(\'login\')">Inicia sesión</a></div></div>';
  },

  submitRegister() {
    const n = document.getElementById('reg-name'), e = document.getElementById('reg-email'), p = document.getElementById('reg-pass');
    if (!n.value || !e.value || !p.value) { Store.alert('Completa todos los campos'); return; }
    if (p.value.length < 6) { Store.alert('Mínimo 6 caracteres'); return; }
    if (Auth.register(n.value, e.value, p.value)) { this._otpEmail = e.value; this._otpCode = ['', '', '', '', '', '']; App.go('verify'); }
  },

  verify() {
    return '<div class="auth-box"><h1>Verificar cuenta</h1>' +
      '<p style="text-align:center;color:var(--muted);font-size:.9rem">Código enviado a:</p>' +
      '<p style="text-align:center;font-weight:600;margin-bottom:1rem">' + this._otpEmail + '</p>' +
      Components.otpInputs(this._otpCode, 'otp') +
      '<button class="btn btn-primary" onclick="Pages.submitVerify()">Verificar</button></div>';
  },

  submitVerify() {
    const c = this._otpCode.join('');
    if (c.length !== 6) { Store.alert('Introduce el código completo'); return; }
    if (Auth.verifyOTP(this._otpEmail, c)) App.go('login');
  },

  // OTP input handlers
  otpInput(i, v, prefix) {
    if (v.length > 1) return;
    this._otpCode[i] = v;
    document.getElementById(prefix + '-' + i).value = v;
    if (v && i < 5) document.getElementById(prefix + '-' + (i + 1)).focus();
  },

  otpKey(i, e, prefix) {
    if (e.key === 'Backspace' && !this._otpCode[i] && i > 0)
      document.getElementById(prefix + '-' + (i - 1)).focus();
  },

  account() {
    if (!Auth.isLoggedIn()) return Components.empty('👤', 'Inicia sesión para ver tu cuenta', 'Entrar', "App.go('login')");
    const orders = Orders.getByUser(Auth.session.id);
    const statusColors = { pendiente: 'var(--accent)', completado: 'var(--success)', cancelado: 'var(--danger)' };
    return '<div class="container page"><h1>Mi cuenta</h1>' +
      '<div class="card"><h3>' + Auth.session.name + '</h3><p style="color:var(--muted)">' + Auth.session.email + '</p>' +
      (Auth.isAdmin() ? '<p style="color:var(--accent);margin-top:.3rem">👑 Administrador</p>' : '') + '</div>' +
      '<h2 style="font-size:1.2rem;margin-bottom:1rem">📦 Mis pedidos</h2>' +
      (orders.length === 0
        ? Components.empty('📦', 'No tienes pedidos aún', 'Ver productos', "App.go('products')")
        : Components.table(['Pedido', 'Productos', 'Total', 'Fecha', 'Estado'],
            orders.map(o => '<tr><td style="font-weight:600;font-size:.75rem">' + o.id + '</td>' +
              '<td style="font-size:.8rem">' + o.items.map(i => i.name + ' x' + i.qty).join(', ') + '</td>' +
              '<td style="color:var(--accent);font-weight:700">' + o.total + '€</td>' +
              '<td style="font-size:.8rem">' + new Date(o.createdAt).toLocaleDateString() + '</td>' +
              '<td><span style="color:' + (statusColors[o.status] || 'var(--text)') + ';font-weight:600">' + o.status + '</span></td></tr>').join('')
          )
      ) + '</div>';
  },

  admin() { return Admin.render(); },
};

// FUTURE: Reviews system
const ProductReviews = {
  render(productId) {
    // Placeholder for future review system
    const el = document.getElementById('reviews-section');
    if (!el) return;
    el.innerHTML = '<div class="card"><h3 style="margin-bottom:1rem">⭐ Reseñas</h3>' +
      '<p style="color:var(--muted);font-size:.9rem">Las reseñas estarán disponibles próximamente.</p></div>';
  },
};

window.Pages = Pages;
window.ProductReviews = ProductReviews;