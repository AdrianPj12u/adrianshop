// ==================== COMPONENTS (reusable UI components) ====================

const Components = {
  // Navbar
  navbar() {
    const user = Auth.session;
    return `
      <nav class="navbar">
        <div class="navbar-inner">
          <div class="logo" onclick="App.go('home')">AdrianSHOP</div>
          <div class="nav-links">
            <a href="#" onclick="App.go('products')">Productos</a>
            <a href="#" onclick="App.go('cart')">🛒${Cart.count > 0 ? ' <span class="cart-badge">' + Cart.count + '</span>' : ''}</a>
            ${user ? `
              <a href="#" onclick="App.go('account')">👤</a>
              ${user.admin ? '<a href="#" onclick="App.go(\'admin\')">⚙️</a>' : ''}
              <button onclick="Auth.logout()">Salir</button>
            ` : `
              <a href="#" onclick="App.go('login')">Entrar</a>
              <a href="#" onclick="App.go('register')" class="btn btn-primary btn-sm">Registro</a>
            `}
          </div>
        </div>
      </nav>`;
  },

  footer() {
    return '<footer class="footer"><div class="container"><p>© 2025 AdrianSHOP — Tu tienda gaming de confianza</p></div></footer>';
  },

  // Product card (used in grid)
  productCard(p) {
    return `<div class="pcard" onclick="App.go('detail','${p.id}')">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="pcard-body">
        <div class="pcard-cat">${Store.catName(p.cat)}</div>
        <div class="pcard-title">${p.name}</div>
        <div class="pcard-price">${p.price}€</div>
        <div class="pcard-desc">${p.desc}</div>
      </div>
    </div>`;
  },

  // Category card
  categoryCard(c, onClick) {
    return `<div class="cat-card" onclick="${onClick}">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-name">${c.name}</span>
    </div>`;
  },

  // Cart item row
  cartItem(i) {
    return `<div class="citem">
      <img src="${i.img}" alt="${i.name}">
      <div class="citem-info">
        <div class="citem-title">${i.name}</div>
        <div class="citem-price">${i.price}€</div>
      </div>
      <div class="cqty">
        <button onclick="Cart.updateQty('${i.id}',-1)">-</button>
        <span style="font-weight:700;width:30px;text-align:center">${i.qty}</span>
        <button onclick="Cart.updateQty('${i.id}',1)">+</button>
      </div>
      <div style="font-weight:800;min-width:70px;text-align:right">${i.price * i.qty}€</div>
      <button class="btn btn-sm" onclick="Cart.remove('${i.id}')">✕</button>
    </div>`;
  },

  // Modal wrapper
  modal(title, content) {
    return `<div class="modal-overlay" onclick="App.closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <h2>${title}</h2>
        ${content}
      </div>
    </div>`;
  },

  // Empty state
  empty(icon, text, btnText, btnAction) {
    return `<div class="empty">
      <p style="font-size:2rem;margin-bottom:1rem">${icon}</p>
      <p>${text}</p>
      ${btnText ? `<button class="btn btn-primary" onclick="${btnAction}">${btnText}</button>` : ''}
    </div>`;
  },

  // Hero section
  hero(title, subtitle, actions) {
    return `<section class="hero">
      <div class="container">
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <div class="hero-actions">${actions}</div>
      </div>
    </section>`;
  },

  // OTP inputs
  otpInputs(code, prefix) {
    return `<div class="otp-box">
      ${code.map((d, i) => `<input class="otp-inp" id="${prefix}-${i}" type="text" maxlength="1" value="${d}"
        oninput="App.otpInput(${i},this.value,'${prefix}')" onkeydown="App.otpKey(${i},event,'${prefix}')"
        ${i === 0 ? 'autofocus' : ''}>`).join('')}
    </div>`;
  },

  // Tabs (filter bar)
  tabs(options, active, action) {
    return `<div class="tabs">
      ${options.map(o => `<button class="tab ${active === o.value ? 'active' : ''}" onclick="${action}('${o.value}')">${o.label}</button>`).join('')}
    </div>`;
  },

  // Table
  table(headers, rows) {
    return `<table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  },
};

window.Components = Components;