// ==================== APP (main application controller) ====================

const App = {
  currentPage: 'home',

  init() {
    this.render();
  },

  go(page, param) {
    this.currentPage = page;
    if (param) Pages.detailId = param;
    this.render();
  },

  render() {
    const el = document.getElementById('app');
    if (!el) return;

    // Render layout
    el.innerHTML = Components.navbar() +
      '<main style="min-height:calc(100vh - 140px)" id="page-content"></main>' +
      Components.footer();

    // Render current page
    const pageEl = document.getElementById('page-content');
    if (!pageEl) return;

    switch (this.currentPage) {
      case 'home': pageEl.innerHTML = Pages.home(); break;
      case 'products': pageEl.innerHTML = Pages.products(); break;
      case 'detail': pageEl.innerHTML = Pages.detail(); break;
      case 'cart': pageEl.innerHTML = Pages.cart(); break;
      case 'checkout': pageEl.innerHTML = Pages.checkout(); break;
      case 'login': pageEl.innerHTML = Pages.login(); break;
      case 'register': pageEl.innerHTML = Pages.register(); break;
      case 'verify': pageEl.innerHTML = Pages.verify(); break;
      case 'account': pageEl.innerHTML = Pages.account(); break;
      case 'admin': pageEl.innerHTML = Pages.admin(); break;
      default: pageEl.innerHTML = Pages.home();
    }
  },

  closeModal() {
    Admin.modal = null;
    this.render();
  },
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => App.init());

// Also handle OTP functions via Pages
App.otpInput = (i, v, prefix) => Pages.otpInput(i, v, prefix);
App.otpKey = (i, e, prefix) => Pages.otpKey(i, e, prefix);

window.App = App;