function initCartPage() {
  const itemsRoot = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  function enrich(item) {
    const p = getProducts().find(x => x.id === item.productId);
    return { ...item, product: p };
  }

  function draw() {
    const cart = getCart().map(enrich);
    if (!cart.length) {
      itemsRoot.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop now</a></p>';
      subtotalEl.textContent = '₹0';
      totalEl.textContent = '₹0';
      updateCartBadge();
      return;
    }

    itemsRoot.innerHTML = cart.map(it => `
      <div class="cart-item" data-key="${it.key}">
        <img src="${it.product?.image}" alt="${it.product?.name}">
        <div>
          <div style="font-weight:600;">${it.product?.name} · <span class="muted">Size ${it.size}</span></div>
          <div class="muted">${it.product?.brand}</div>
          <div style="margin-top:6px;">${formatINR(it.product?.price || 0)}</div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="qty">
            <button data-act="dec">-</button>
            <span>${it.qty}</span>
            <button data-act="inc">+</button>
          </div>
          <button data-act="remove" class="btn btn-outline">Remove</button>
        </div>
      </div>
    `).join('');

    // listeners
    itemsRoot.querySelectorAll('.cart-item').forEach(row => {
      const key = row.getAttribute('data-key');
      row.querySelector('[data-act="inc"]').addEventListener('click', () => modify(key, +1));
      row.querySelector('[data-act="dec"]').addEventListener('click', () => modify(key, -1));
      row.querySelector('[data-act="remove"]').addEventListener('click', () => removeItem(key));
    });

    const subtotal = cart.reduce((sum, it) => sum + (it.product?.price || 0) * it.qty, 0);
    subtotalEl.textContent = formatINR(subtotal);
    totalEl.textContent = formatINR(subtotal);
    updateCartBadge();
  }

  function modify(key, delta) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      const idx = cart.findIndex(i => i.key === key);
      cart.splice(idx, 1);
    }
    saveCart(cart);
    draw();
  }

  function removeItem(key) {
    const cart = getCart().filter(i => i.key !== key);
    saveCart(cart);
    draw();
  }

  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Checkout flow is a placeholder.');
  });

  draw();
}

window.initCartPage = initCartPage;
