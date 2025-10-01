// Admin dashboard logic

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    alert('Access denied. Admin only.');
    window.location.href = 'login.html';
    return;
  }

  initAdminDashboard();
});

function initAdminDashboard() {
  // Tab switching
  const tabBtns = document.querySelectorAll('.admin-nav-btn');
  const tabs = document.querySelectorAll('.admin-tab');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${tabName}`).classList.add('active');
      
      if (tabName === 'products') renderProductTable();
      if (tabName === 'orders') renderOrdersTable();
      if (tabName === 'analytics') renderAnalytics();
    });
  });

  // Initialize products tab
  renderProductTable();
  setupProductModal();
}

// ===== PRODUCTS TAB =====
function renderProductTable() {
  const container = document.getElementById('product-table');
  const products = getProducts();

  if (!products.length) {
    container.innerHTML = '<p class="empty-state">No products yet. Add your first product!</p>';
    return;
  }

  const html = `
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Brand</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td><img src="${p.image}" alt="${p.name}" class="table-img" /></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${formatINR(p.price)}</td>
            <td>${p.brand}</td>
            <td>
              <button class="btn-icon" data-edit="${p.id}" title="Edit">✏️</button>
              <button class="btn-icon" data-delete="${p.id}" title="Delete">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;

  // Event listeners
  container.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openProductModal(btn.dataset.edit));
  });

  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.delete));
  });
}

function setupProductModal() {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const addBtn = document.getElementById('add-product-btn');
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-cancel');

  addBtn.addEventListener('click', () => openProductModal());
  closeBtn.addEventListener('click', closeProductModal);
  cancelBtn.addEventListener('click', closeProductModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProduct();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModal();
  });

  // Image upload handler
  const fileInput = document.getElementById('product-image-file');
  const fileName = document.getElementById('file-name');
  const imagePreview = document.getElementById('image-preview');
  const imageHidden = document.getElementById('product-image');
  const imageUrl = document.getElementById('product-image-url');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      fileName.textContent = file.name;
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        imageHidden.value = base64;
        imagePreview.innerHTML = `<img src="${base64}" alt="Preview" />`;
      };
      reader.readAsDataURL(file);
    }
  });

  // URL input handler
  imageUrl.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      imageHidden.value = url;
      imagePreview.innerHTML = `<img src="${url}" alt="Preview" />`;
      fileName.textContent = 'URL provided';
    }
  });
}

function openProductModal(productId = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const title = document.getElementById('modal-title');
  const imagePreview = document.getElementById('image-preview');
  const fileName = document.getElementById('file-name');

  form.reset();
  imagePreview.innerHTML = '';
  fileName.textContent = 'No file chosen';

  if (productId) {
    const product = getProducts().find(p => p.id === productId);
    if (!product) return;

    title.textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-brand').value = product.brand;
    document.getElementById('product-color').value = product.color;
    document.getElementById('product-sizes').value = product.sizes.join(',');
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    
    // Show existing image preview
    if (product.image) {
      imagePreview.innerHTML = `<img src="${product.image}" alt="Preview" />`;
      fileName.textContent = product.image.startsWith('data:') ? 'Uploaded image' : 'URL image';
    }
  } else {
    title.textContent = 'Add Product';
    document.getElementById('product-id').value = '';
  }

  modal.classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function saveProduct() {
  const id = document.getElementById('product-id').value;
  const product = {
    id: id || 'p' + Date.now(),
    name: document.getElementById('product-name').value,
    price: Number(document.getElementById('product-price').value),
    category: document.getElementById('product-category').value,
    brand: document.getElementById('product-brand').value,
    color: document.getElementById('product-color').value,
    sizes: document.getElementById('product-sizes').value.split(',').map(s => s.trim()),
    image: document.getElementById('product-image').value,
    description: document.getElementById('product-description').value
  };

  let products = getProducts();

  if (id) {
    // Update existing
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) products[index] = product;
  } else {
    // Add new
    products.push(product);
  }

  saveProducts(products);
  closeProductModal();
  renderProductTable();
  alert('Product saved successfully!');
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  let products = getProducts();
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  renderProductTable();
  alert('Product deleted successfully!');
}

// ===== ORDERS TAB =====
function renderOrdersTable() {
  const container = document.getElementById('orders-table');
  const filter = document.getElementById('order-filter');
  
  filter.addEventListener('change', renderOrdersTable);
  
  let orders = getOrders();
  const filterValue = filter.value;
  
  if (filterValue !== 'all') {
    orders = orders.filter(o => o.status === filterValue);
  }

  if (!orders.length) {
    container.innerHTML = '<p class="empty-state">No orders found.</p>';
    return;
  }

  const html = `
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>#${o.id}</td>
            <td>${o.customerName}</td>
            <td>${new Date(o.date).toLocaleDateString()}</td>
            <td>${o.items.length}</td>
            <td>${formatINR(o.total)}</td>
            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
            <td>
              <select class="status-select" data-order="${o.id}">
                <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
              </select>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;

  // Status change listeners
  container.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      updateOrderStatus(e.target.dataset.order, e.target.value);
    });
  });
}

function updateOrderStatus(orderId, newStatus) {
  let orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders(orders);
    alert('Order status updated!');
    renderOrdersTable();
  }
}

// ===== ANALYTICS TAB =====
function renderAnalytics() {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeUsers = users.length;

  document.getElementById('stat-revenue').textContent = formatINR(totalRevenue);
  document.getElementById('stat-orders').textContent = totalOrders;
  document.getElementById('stat-products').textContent = totalProducts;
  document.getElementById('stat-users').textContent = activeUsers;
}
