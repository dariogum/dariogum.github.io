# Séquito Gin - Shopping Cart System

This is a complete shopping cart implementation for the Séquito Gin website, built with pure HTML, CSS, and JavaScript.

## Features

### 🛒 Shopping Cart
- **Session Persistence**: Cart contents are saved in the browser's session storage
- **Quantity Selection**: Users can select quantities when adding products to cart
- **Cart Management**: Edit quantities, remove items, and view total cost
- **Real-time Updates**: Cart badge shows current item count

### 🛍️ Product Management
- **Three Products**: Classic, Pea Flower, and Rubí gins
- **Dynamic Pricing**: Prices are displayed in Argentine pesos
- **Product Images**: High-quality product images with hover effects

### 💳 Checkout Process
- **Customer Information**: Collects full name, phone, address, city, and postal code
- **Payment Options**: Cash on delivery or WhatsApp payment arrangement
- **Order Confirmation**: Shows order details and confirmation message
- **WhatsApp Integration**: Direct link to contact via WhatsApp

### 🎨 User Interface
- **Bottom Sheets**: Modern mobile-first design using bottom sheets instead of modals
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Existing Styling**: Uses the website's existing color scheme and typography
- **Smooth Animations**: Smooth transitions and hover effects

## Technical Implementation

### File Structure
```
sequito/
├── index.html          # Main HTML file with product listings
├── cart.js            # Shopping cart JavaScript functionality
├── styles.css         # CSS styles including cart components
└── assets/            # Product images and other assets
```

### Key Components

#### ShoppingCart Class
- Manages cart state and persistence
- Handles product addition, removal, and quantity updates
- Manages checkout flow and form validation
- Provides session storage for cart persistence

#### Bottom Sheet System
- Custom implementation using CSS transforms and transitions
- Click outside to close functionality
- Responsive design for mobile and desktop
- Proper z-index management

#### Event Handling
- Buy button clicks trigger quantity selection
- Cart icon shows cart contents
- Form submission processes orders
- Real-time cart updates

## Usage

### Adding Products
1. Click the "Comprar" (Buy) button on any product
2. Select desired quantity using +/- buttons
3. Click "Agregar al Carrito" (Add to Cart)

### Managing Cart
1. Click the cart icon in the navigation
2. View all items, quantities, and total cost
3. Adjust quantities or remove items as needed
4. Click "Proceder al Pago" (Proceed to Payment)

### Checkout Process
1. Fill in required customer information
2. Review payment options (cash on delivery or WhatsApp)
3. Click "Confirmar Pedido" (Confirm Order)
4. Receive order confirmation with WhatsApp contact link

## Browser Compatibility

- Modern browsers with ES6+ support
- Session storage support required
- Responsive design works on all screen sizes
- Touch-friendly interface for mobile devices

## Customization

### Adding New Products
To add new products, update the `products` object in `cart.js`:

```javascript
this.products = {
    newProduct: {
        id: 'newProduct',
        name: 'Product Name',
        price: 15000,
        image: 'assets/new-product.jpg'
    },
    // ... existing products
};
```

### Styling Changes
All cart-related styles are in the "Shopping Cart Styles" section of `styles.css` and use CSS custom properties for consistency with the existing design.

### Payment Methods
Payment options can be modified in the `showCheckout()` method of the ShoppingCart class.

## Session Management

The cart automatically:
- Saves items to session storage when added/modified
- Loads cart contents when the page is refreshed
- Clears the cart after successful order completion
- Persists during the user's browsing session

## Performance Features

- Efficient DOM manipulation using event delegation
- Minimal re-renders with targeted updates
- Smooth animations using CSS transitions
- Responsive design with mobile-first approach
