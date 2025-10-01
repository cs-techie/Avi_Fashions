# Avighna Fashions

A minimalist, mobile‑responsive e-commerce front-end inspired by Myntra's layout. Focused on women's clothing only.

## Features
- **Shopping Experience**: Browse products, filter by size/price/brand/color, search, add to cart
- **User Authentication**: Login and signup with form validation
- **Admin Dashboard**: Manage products, track orders, view analytics
- **Mobile Responsive**: Optimized for all screen sizes
- **Local Storage**: Persistent cart, user sessions, and data management

## Pages
- **Home**: `index.html` - Hero banner and featured products
- **Products**: `products.html` - Grid with filters, sorting, and search
- **Product Detail**: `product.html?id=...` - Size picker, Buy Now, Add to Cart
- **Cart**: `cart.html` - Quantity controls, totals, checkout
- **Login**: `login.html` - User authentication
- **Signup**: `signup.html` - New user registration
- **Admin Dashboard**: `admin.html` - Product management, order tracking, analytics

## Admin Access
- **Email**: admin@avighna.com
- **Password**: admin123

## Tech Stack
- Pure HTML/CSS/JS (no framework)
- LocalStorage for data persistence
- Google Fonts: Inter
- Responsive CSS Grid & Flexbox

## Run
- **Option 1**: Open `index.html` directly in your browser
- **Option 2** (recommended): Serve via HTTP server
  - Python 3: `python -m http.server 8080` then visit `http://localhost:8080/`
  - Node: `npx http-server -p 8080`

## Structure
```
AviFashions/
  index.html          # Homepage
  products.html       # Product listing
  product.html        # Product detail
  cart.html           # Shopping cart
  login.html          # Login page
  signup.html         # Signup page
  admin.html          # Admin dashboard
  css/
    styles.css        # All styles
  js/
    data.js           # Sample product data
    store.js          # localStorage helpers (cart, users, products, orders)
    app.js            # Shared layout & page logic
    cart.js           # Cart page logic
    auth.js           # Authentication logic
    admin.js          # Admin dashboard logic
```

## Admin Dashboard Features
- **Product Management**: Add, edit, delete products with modal form
- **Order Tracking**: View all orders, filter by status, update order status
- **Analytics**: View total revenue, orders, products, and active users
- **Real-time Updates**: Changes persist in localStorage

## Customization
- Update product data in `js/data.js`
- Change theme colors in `css/styles.css` under `:root`
- Replace hero image URL in `.hero` CSS rule
- Modify sample orders in `store.js` `generateSampleOrders()`

## User Flow
1. Browse products as guest or login/signup
2. Add products to cart
3. View cart and adjust quantities
4. Admin can login to manage products and track orders

## Notes
- This is a front-end prototype. Checkout is a placeholder.
- All categories are women-specific: New Arrivals, Dresses, Tops, Jeans, Eth Wear, Sale.
- User passwords are stored in localStorage (not production-ready)
- Admin features require login with admin credentials
