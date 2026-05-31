// ==================== ADMIN (admin panel logic) ====================

const Admin = {
  tab: 'products',
  modal: null,
  productForm: { name: '', cat: 'c1', price: '', desc: '', img: '' },
  catForm: { name: '', icon: '' },

  render() {
    if (!Auth.isAdmin()) return Components.empty('🔒', 'No tienes acceso', 'Inicio', "App.go('home')");
    let content = '';
    if (this.tab === 'products') content = this.productsPanel();
    else if (this.tab === 'categories') content = this.categoriesPanel();
    else if (this.tab === 'orders') content = this.ordersPanel();

    let html = `
      <div class="page"><h1>Panel de Administración</h1></div>
      <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <button class="btn ${this.tab === 'products' ? 'btn-primary' : ''}" onclick="Admin.tab='products';App.render()">📦 Productos</button>
        <button class="btn ${this.tab === 'categories' ? 'btn-primary' : ''}" onclick="Admin.tab='categories';App.render()">🏷️ Categorías</button>
        <button class="btn ${this.tab === 'orders' ? 'btn-primary' : ''}" onclick="Admin.tab='orders';App.render()">📋 Pedidos</button>
      </div>
      ${content}
    `;

    if (this.modal === 'product') html += this.productModal();
    else if (this.modal === 'category') html += this.categoryModal();

    return html;
  },

  // ========= Products =========
  productsPanel() {
    const prods = Store.products;
    return `<div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2 style="font-size:1.2rem">Productos (${prods.length})</h2>
        <button class="btn btn-primary btn-sm" onclick="Admin.productForm={name:'',cat:'c1',price:'',desc:'',img:''};Admin.modal='product';App.render()">+ Nuevo</button>
      </div>
      ${prods.length === 0 ? Components.empty('📦', 'No hay productos') : Components.table(
        ['Nombre', 'Categoría', 'Precio', 'Acciones'],
        prods.map(p => `<tr>
          <td>${p.name}</td><td>${Store.catName(p.cat)}</td>
          <td style="color:var(--accent);font-weight:700">${p.price}€</td>
          <td><button class="btn btn-sm" onclick="Admin.editProduct('${p.id}')">✏️</button> <button class="btn btn-sm" style="color:var(--danger)" onclick="Admin.deleteProduct('${p.id}')">🗑️</button></td>
        </tr>`).join('')
      )}
    </div>`;
  },

  editProduct(id) {
    const p = Store.product(id);
    this.productForm = { name: p.name, cat: p.cat, price: String(p.price), desc: p.desc, img: p.img, id: p.id };
    this.modal = 'product';
    App.render();
  },

  deleteProduct(id) {
    if (!confirm('Eliminar producto?')) return;
    Store.products = Store.products.filter(p => p.id !== id);
    App.render();
  },

  productModal() {
    const f = this.productForm;
    return Components.modal(f.id ? 'Editar producto' : 'Nuevo producto', `
      <div class="form-group"><label class="label">Nombre</label><input class="input" id="ap-name" value="${f.name}"></div>
      <div class="form-group"><label class="label">Categoría</label><select class="input" id="ap-cat">${Store.categories.map(c => `<option value="${c.id}" ${c.id === f.cat ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="label">Precio (€)</label><input type="number" class="input" id="ap-price" value="${f.price}"></div>
      <div class="form-group"><label class="label">Descripción</label><textarea class="input" rows="2" id="ap-desc">${f.desc}</textarea></div>
      <div class="form-group"><label class="label">URL imagen</label><input class="input" id="ap-img" value="${f.img}" placeholder="https://..."></div>
      <div style="display:flex;gap:.5rem"><button class="btn btn-primary" onclick="Admin.saveProduct()">Guardar</button><button class="btn" onclick="Admin.modal=null;App.render()">Cancelar</button></div>
    `);
  },

  saveProduct() {
    const n = document.getElementById('ap-name'), c = document.getElementById('ap-cat'), p = document.getElementById('ap-price'),
          d = document.getElementById('ap-desc'), i = document.getElementById('ap-img').value || 'https://placehold.co/400x300/1a1a1a/CCFF00?text=📦+Producto';
    if (!n.value || !p.value) { Store.alert('Nombre y precio obligatorios'); return; }
    const f = this.productForm;
    if (f.id) {
      Store.products = Store.products.map(x => x.id === f.id ? { ...x, name: n.value, cat: c.value, price: Number(p.value), desc: d.value, img: i } : x);
    } else {
      Store.products = [...Store.products, { id: 'p' + Date.now(), name: n.value, cat: c.value, price: Number(p.value), desc: d.value, img: i }];
    }
    this.modal = null;
    App.render();
  },

  // ========= Categories =========
  categoriesPanel() {
    const cats = Store.categories;
    return `<div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <h2 style="font-size:1.2rem">Categorías (${cats.length})</h2>
        <button class="btn btn-primary btn-sm" onclick="Admin.catForm={name:'',icon:''};Admin.modal='category';App.render()">+ Nueva</button>
      </div>
      ${Components.table(['Icono', 'Nombre', 'Acciones'],
        cats.map(c => `<tr><td style="font-size:1.5rem">${c.icon}</td><td>${c.name}</td>
          <td><button class="btn btn-sm" onclick="Admin.editCategory('${c.id}')">✏️</button> <button class="btn btn-sm" style="color:var(--danger)" onclick="Admin.deleteCategory('${c.id}')">🗑️</button></td></tr>`).join('')
      )}
    </div>`;
  },

  editCategory(id) {
    const c = Store.categories.find(x => x.id === id);
    this.catForm = { name: c.name, icon: c.icon, id: c.id };
    this.modal = 'category';
    App.render();
  },

  deleteCategory(id) {
    if (!confirm('Eliminar categoría?')) return;
    Store.categories = Store.categories.filter(c => c.id !== id);
    App.render();
  },

  categoryModal() {
    const f = this.catForm;
    return Components.modal(f.id ? 'Editar categoría' : 'Nueva categoría', `
      <div class="form-group"><label class="label">Nombre</label><input class="input" id="ac-name" value="${f.name}"></div>
      <div class="form-group"><label class="label">Icono (emoji)</label><input class="input" id="ac-icon" value="${f.icon}" placeholder="🎮"></div>
      <div style="display:flex;gap:.5rem"><button class="btn btn-primary" onclick="Admin.saveCategory()">Guardar</button><button class="btn" onclick="Admin.modal=null;App.render()">Cancelar</button></div>
    `);
  },

  saveCategory() {
    const n = document.getElementById('ac-name'), i = document.getElementById('ac-icon');
    if (!n.value || !i.value) { Store.alert('Nombre e icono obligatorios'); return; }
    const f = this.catForm;
    if (f.id) Store.categories = Store.categories.map(c => c.id === f.id ? { ...c, name: n.value, icon: i.value } : c);
    else Store.categories = [...Store.categories, { id: 'c' + Date.now(), name: n.value, icon: i.value }];
    this.modal = null;
    App.render();
  },

  // ========= Orders =========
  ordersPanel() {
    const orders = Orders.all;
    if (orders.length === 0) return Components.empty('📋', 'No hay pedidos');
    return `<div><h2 style="font-size:1.2rem;margin-bottom:1rem">Pedidos (${orders.length})</h2>
      ${Components.table(['Pedido', 'Cliente', 'Productos', 'Total', 'Entrega', 'Estado'],
        orders.map(o => `<tr>
          <td style="font-size:.75rem;font-weight:600">${o.id}</td>
          <td><div>${o.userName}</div><div style="font-size:.75rem;color:var(--muted)">${o.userEmail}<br>📞 ${o.phone}</div></td>
          <td style="font-size:.8rem">${o.items.map(i => i.name + ' x' + i.qty).join(', ')}</td>
          <td style="color:var(--accent);font-weight:700">${o.total}€</td>
          <td style="font-size:.8rem"><div>${o.location}</div><div>${o.date} ${o.time}</div></td>
          <td><select class="input" style="padding:.3rem;font-size:.8rem" onchange="Orders.updateStatus('${o.id}',this.value)">
            <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="completado" ${o.status === 'completado' ? 'selected' : ''}>Completado</option>
            <option value="cancelado" ${o.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
          </select></td>
        </tr>`).join('')
      )}
    </div>`;
  },
};

window.Admin = Admin;