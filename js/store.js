// Simple localStorage store helpers
const STORE_KEYS = {
  CART: 'af_cart',
  USER: 'af_user',
  USERS: 'af_users',
  PRODUCTS: 'af_products',
  ORDERS: 'af_orders'
};

// Cart functions
function getCart() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.CART)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

// User functions
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.USER)); }
  catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(STORE_KEYS.USER, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(STORE_KEYS.USER);
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.USERS)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(users));
}

// Product functions
function getProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEYS.PRODUCTS));
    return stored && stored.length ? stored : PRODUCTS;
  }
  catch { return PRODUCTS; }
}

function saveProducts(products) {
  localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
  // Update global PRODUCTS array
  PRODUCTS.length = 0;
  PRODUCTS.push(...products);
}

// Order functions
function getOrders() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.ORDERS)) || generateSampleOrders(); }
  catch { return generateSampleOrders(); }
}

function saveOrders(orders) {
  localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
}

function generateSampleOrders() {
  return [
    {
      id: 'ORD001',
      customerName: 'Priya Sharma',
      date: '2025-09-28T10:30:00',
      items: [{ productId: 'p1', name: 'Minimalist Cotton Tee', qty: 2, price: 699 }],
      total: 1398,
      status: 'delivered'
    },
    {
      id: 'ORD002',
      customerName: 'Ananya Reddy',
      date: '2025-09-29T14:20:00',
      items: [{ productId: 'p2', name: 'Satin Slip Dress', qty: 1, price: 1799 }],
      total: 1799,
      status: 'shipped'
    },
    {
      id: 'ORD003',
      customerName: 'Kavya Patel',
      date: '2025-09-30T09:15:00',
      items: [
        { productId: 'p3', name: 'High-Rise Skinny Jeans', qty: 1, price: 1499 },
        { productId: 'p6', name: 'Ribbed Tank Top', qty: 2, price: 599 }
      ],
      total: 2697,
      status: 'processing'
    },
    {
      id: 'ORD004',
      customerName: 'Sneha Kumar',
      date: '2025-10-01T11:45:00',
      items: [{ productId: 'p4', name: 'Embroidered Kurta Set', qty: 1, price: 2499 }],
      total: 2499,
      status: 'pending'
    }
  ];
}

// Utility
function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}
