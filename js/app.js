// Shared layout and page logic

// Inject header and footer
function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  
  const user = getCurrentUser();
  const userSection = user 
    ? `
      <div class="user-menu">
        <span class="user-name">👤 ${user.name}</span>
        ${user.role === 'admin' ? '<a href="admin.html" class="admin-link">⚙️ Admin</a>' : ''}
        <button id="logout-btn" class="btn-link">Logout</button>
      </div>
    `
    : `<a href="login.html" class="nav-auth-link">Login / Sign Up</a>`;

  header.innerHTML = `
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="index.html" class="brand">
        <img src="./assets/logo.png" alt="Avighna Fashions" class="logo" />
      </a>
      <div class="nav-links">
        <a href="products.html?category=New%20Arrivals">New Arrivals</a>
        <a href="products.html?category=Dresses">Dresses</a>
        <a href="products.html?category=Tops">Tops</a>
        <a href="products.html?category=Jeans">Jeans</a>
        <a href="products.html?category=Ethnic%20Wear">Ethnic Wear</a>
        <a href="products.html?category=Sale">Sale</a>
      </div>
      <div class="search">
        <input id="search-input" type="text" placeholder="Search products..." />
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <a class="cart-link" href="cart.html" aria-label="Cart">
        <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span id="cart-count" class="cart-count">0</span>
      </a>
      ${userSection}
    </div>
  </nav>`;

  const search = document.getElementById('search-input');
  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = encodeURIComponent(search.value.trim());
        window.location.href = `products.html?q=${q}`;
      }
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      alert('Logged out successfully');
      window.location.href = 'index.html';
    });
  }
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
  <div class="container footer-inner">
    <div>
      <h4>Avighna Fashions</h4>
      <p>Minimalist, modern women\'s fashion.</p>
    </div>
    <div>
      <h4>Company</h4>
      <a href="#">About Us</a><br/>
      <a href="#">Contact</a><br/>
      <a href="#">Careers</a>
    </div>
    <div>
      <h4>Support</h4>
      <a href="#">FAQ</a><br/>
      <a href="#">Returns</a><br/>
      <a href="#">Shipping</a>
    </div>
    <div>
      <h4>Follow</h4>
      <a href="#" aria-label="Instagram">📸 Instagram</a><br/>
      <a href="#" aria-label="Facebook">📘 Facebook</a><br/>
      <a href="#" aria-label="Twitter">🐦 X</a>
    </div>
  </div>
  <div class="container footer-bottom">© ${new Date().getFullYear()} Avighna Fashions. All rights reserved.</div>`;
}

function updateCartBadge() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = String(cartCount());
}

// Product rendering
function productCardHTML(p) {
  return `
  <div class="card">
    <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
    <div class="card-body">
      <div class="card-title">${p.name}</div>
      <div class="muted">${p.brand}</div>
      <div class="card-price">${formatINR(p.price)}</div>
      <div class="card-actions">
        <a class="btn btn-outline" href="product.html?id=${p.id}">View</a>
        <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  </div>`;
}

function renderProducts(container, items) {
  if (!container) return;
  container.innerHTML = items.map(productCardHTML).join('');
  container.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-add');
      const prod = getProducts().find(p => p.id === id);
      if (!prod) return;
      addToCart(prod.id, prod.sizes[0] || 'M', 1);
    });
  });
}

// Cart ops
function addToCart(productId, size, qty) {
  const cart = getCart();
  const key = `${productId}__${size}`;
  const found = cart.find(i => i.key === key);
  if (found) found.qty += qty; else cart.push({ key, productId, size, qty });
  saveCart(cart);
  updateCartBadge();
}

// Listing page
function initProductListing() {
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || '').toLowerCase();
  const cat = params.get('category');
  const titleEl = document.getElementById('listing-title');
  if (cat) titleEl.textContent = cat; else if (q) titleEl.textContent = `Search: ${params.get('q')}`; else titleEl.textContent = 'All Products';

  const maxPriceInput = document.getElementById('filter-price');
  const priceLabel = document.getElementById('price-value');
  const brandInput = document.getElementById('filter-brand');
  const sizeWrap = document.getElementById('filter-size');
  const colorWrap = document.getElementById('filter-color');
  const sortSelect = document.getElementById('sort-select');
  const grid = document.getElementById('product-grid');

  function activeChips(wrapper) {
    return Array.from(wrapper.querySelectorAll('button.active')).map(b => b.dataset.value);
  }
  function toggleChip(e) {
    e.target.classList.toggle('active');
    apply();
  }

  sizeWrap.querySelectorAll('button').forEach(b => b.addEventListener('click', toggleChip));
  colorWrap.querySelectorAll('button').forEach(b => b.addEventListener('click', toggleChip));
  maxPriceInput.addEventListener('input', () => { priceLabel.textContent = maxPriceInput.value; apply(); });
  brandInput.addEventListener('input', apply);
  sortSelect.addEventListener('change', apply);
  document.getElementById('clear-filters').addEventListener('click', () => {
    sizeWrap.querySelectorAll('button.active').forEach(b => b.classList.remove('active'));
    colorWrap.querySelectorAll('button.active').forEach(b => b.classList.remove('active'));
    maxPriceInput.value = 5000; priceLabel.textContent = '5000';
    brandInput.value = '';
    sortSelect.value = 'relevance';
    apply();
  });

  function apply() {
    const sizes = activeChips(sizeWrap);
    const colors = activeChips(colorWrap);
    const maxPrice = Number(maxPriceInput.value || 5000);
    const brand = brandInput.value.toLowerCase();
    let items = getProducts().slice();

    if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    if (cat) items = items.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    if (sizes.length) items = items.filter(p => sizes.some(s => p.sizes.includes(s)));
    if (colors.length) items = items.filter(p => colors.includes(p.color));
    if (brand) items = items.filter(p => p.brand.toLowerCase().includes(brand));
    items = items.filter(p => p.price <= maxPrice);

    switch (sortSelect.value) {
      case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': items.sort((a,b)=>b.price-a.price); break;
      case 'newest': items = items.reverse(); break;
      default: break; // relevance = no-op for now
    }

    renderProducts(grid, items);
  }

  apply();
}

// Product detail page
function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const p = getProducts().find(x => x.id === id);
  const root = document.getElementById('product-detail');
  if (!p) { root.innerHTML = '<p>Product not found.</p>'; return; }
  root.innerHTML = `
    <div class="media"><img src="${p.image}" alt="${p.name}"></div>
    <div class="info">
      <h1>${p.name}</h1>
      <div class="muted">${p.brand} · ${p.category}</div>
      <div class="card-price" style="margin:10px 0;">${formatINR(p.price)}</div>
      <p>${p.description}</p>
      <div class="muted">Color: ${p.color}</div>
      <div class="size-picker" id="size-picker">${p.sizes.map(s=>`<button data-size="${s}">${s}</button>`).join('')}</div>
      <div style="display:flex; gap:8px; margin-top:12px;">
        <button id="buy-now" class="btn btn-primary">Buy Now</button>
        <button id="add-cart" class="btn btn-outline">Add to Cart</button>
      </div>
    </div>`;

  let selected = p.sizes[0];
  const sizeWrap = document.getElementById('size-picker');
  function setActive(size) {
    selected = size;
    sizeWrap.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.size===size));
  }
  setActive(selected);
  sizeWrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setActive(b.dataset.size)));

  document.getElementById('add-cart').addEventListener('click', () => { addToCart(p.id, selected, 1); alert('Added to cart'); });
  document.getElementById('buy-now').addEventListener('click', () => { addToCart(p.id, selected, 1); window.location.href = 'cart.html'; });
}

// On load
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  updateCartBadge();
});

// Expose helpers to other scripts
window.renderProducts = renderProducts;
window.initProductListing = initProductListing;
window.initProductDetail = initProductDetail;
