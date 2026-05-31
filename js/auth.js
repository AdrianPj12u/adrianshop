// ==================== AUTH (authentication system) ====================
// Handles: register, OTP verification, login, session, logout
// FUTURE: Google OAuth, Resend emails, password reset

const Auth = {
  _usersKey: 'as_users',
  _sessionKey: 'as_session',
  _otpKey: 'as_pending_otp',

  _defaultUsers: [
    { id: 'admin-1', name: 'Adrian', email: 'admin@adrianshop.com', pass: 'Admin2026', admin: true, verified: true },
  ],

  get users() {
    const d = localStorage.getItem(this._usersKey);
    if (d) return JSON.parse(d);
    localStorage.setItem(this._usersKey, JSON.stringify(this._defaultUsers));
    return this._defaultUsers;
  },
  set users(v) { localStorage.setItem(this._usersKey, JSON.stringify(v)); },

  get session() {
    const d = localStorage.getItem(this._sessionKey);
    if (d) return JSON.parse(d);
    return null;
  },
  set session(v) {
    if (v) localStorage.setItem(this._sessionKey, JSON.stringify(v));
    else localStorage.removeItem(this._sessionKey);
  },

  isLoggedIn() { return !!this.session; },
  isAdmin() { return this.session?.admin || false; },

  login(email, pass) {
    const u = this.users.find(x => x.email === email && x.pass === pass);
    if (!u) { Store.alert('Email o contraseña incorrectos'); return false; }
    if (!u.verified) { Store.alert('Verifica tu cuenta primero'); return false; }
    this.session = { id: u.id, name: u.name, email: u.email, admin: u.admin };
    Store.notify('Bienvenido, ' + u.name + '!');
    return true;
  },

  register(name, email, pass) {
    if (this.users.find(u => u.email === email)) { Store.alert('Ya existe una cuenta con este email'); return false; }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const newUser = { id: 'u' + Date.now(), name, email, pass, admin: false, verified: false, otp };
    this.users = [...this.users, newUser];
    localStorage.setItem(this._otpKey, JSON.stringify({ email, otp }));
    Store.notify('Tu código de verificación: ' + otp);
    return true;
  },

  verifyOTP(email, code) {
    const pending = JSON.parse(localStorage.getItem(this._otpKey) || '{}');
    if (pending.email !== email || pending.otp !== code) { Store.alert('Código incorrecto'); return false; }
    const users = this.users;
    const u = users.find(x => x.email === email);
    if (u) { u.verified = true; this.users = users; }
    localStorage.removeItem(this._otpKey);
    Store.notify('Cuenta verificada! Ya puedes iniciar sesión.');
    return true;
  },

  logout() {
    this.session = null;
    Store.notify('Sesión cerrada');
    App.go('home');
  },

  getUserById(id) {
    return this.users.find(u => u.id === id);
  },
};

window.Auth = Auth;