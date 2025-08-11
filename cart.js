// Shopping Cart System for Séquito Gin
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.products = {
            classic: {
                id: 'classic',
                name: 'Clásico',
                price: 13500,
                image: 'classic.jpg'
            },
            pea: {
                id: 'pea',
                name: 'Pea Flower',
                price: 16200,
                image: 'pea.jpg'
            },
            rubi: {
                id: 'rubi',
                name: 'Rubí',
                price: 17000,
                image: 'rubi.jpg'
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartIcon();
    }

    setupEventListeners() {
        // Buy buttons
        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productId = productCard.id;
                this.showQuantitySelector(productId);
            });
        });

        // Cart button
        document.querySelector('.nav-cart').addEventListener('click', (e) => {
            e.preventDefault();
            this.showCart();
        });
    }

    showQuantitySelector(productId) {
        // Close any existing bottom sheet first
        const existingBottomSheet = document.querySelector('.bottom-sheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        const product = this.products[productId];
        const bottomSheet = this.createBottomSheet();
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="bottom-sheet-header">
                <h3>Seleccionar Cantidad</h3>
                <button class="close-btn" onclick="this.closest('.bottom-sheet').remove()">×</button>
            </div>
            <div class="bottom-sheet-content">
                <div class="product-info">
                    <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                    <div>
                        <h4>${product.name}</h4>
                        <p class="price">$${product.price.toLocaleString()}</p>
                    </div>
                    <div class="quantity-selector">
                        <label for="quantity">Cantidad:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="this.parentElement.querySelector('input').stepDown()">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="99">
                            <button class="quantity-btn" onclick="this.parentElement.querySelector('input').stepUp()">+</button>
                        </div>
                    </div>
                </div>
                <button class="add-to-cart-btn" onclick="cart.addToCart('${productId}', parseInt(document.getElementById('quantity').value))">
                    Agregar al Carrito
                </button>
            </div>
        `;
        
        bottomSheet.appendChild(content);
        document.body.appendChild(bottomSheet);
        this.animateBottomSheet(content, 'in');
    }

    addToCart(productId, quantity) {
        const product = this.products[productId];
        
        if (this.cart[productId]) {
            this.cart[productId].quantity += quantity;
        } else {
            this.cart[productId] = {
                ...product,
                quantity: quantity
            };
        }
        
        this.saveCart();
        this.updateCartIcon();
        
        // Close quantity selector
        document.querySelector('.bottom-sheet').remove();
        
        // Show confirmation
        this.showNotification(`${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${product.name} agregada al carrito`);
    }

    showCart() {
        if (Object.keys(this.cart).length === 0) {
            this.showEmptyCart();
            return;
        }

        const bottomSheet = this.createBottomSheet();
        const cartItems = this.getCartItems();
        const total = this.getTotal();
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="bottom-sheet-header">
                <h3>Carrito de Compras</h3>
                <button class="close-btn" onclick="this.closest('.bottom-sheet').remove()">×</button>
            </div>
            <div class="bottom-sheet-content">
                <div class="cart-items">
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p class="price">$${item.price.toLocaleString()}</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn small" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn small" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">×</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    <h4>Total: $${total.toLocaleString()}</h4>
                </div>
                <button class="checkout-btn" onclick="cart.showCheckout()">
                    Proceder al Pago
                </button>
            </div>
        `;
        
        bottomSheet.appendChild(content);
        document.body.appendChild(bottomSheet);
        this.animateBottomSheet(content, 'in');
    }

    showEmptyCart() {
        // Close any existing bottom sheet first
        const existingBottomSheet = document.querySelector('.bottom-sheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        const bottomSheet = this.createBottomSheet();
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="bottom-sheet-header">
                <h3>Carrito Vacío</h3>
                <button class="close-btn" onclick="this.closest('.bottom-sheet').remove()">×</button>
            </div>
            <div class="bottom-sheet-content">
                <div class="empty-cart">
                    <p>Tu carrito está vacío</p>
                    <p>Agrega algunos productos para comenzar</p>
                </div>
            </div>
        `;
        
        bottomSheet.appendChild(content);
        document.body.appendChild(bottomSheet);
        this.animateBottomSheet(content, 'in');
    }

    showCheckout() {
        // Close any existing bottom sheet first
        const existingBottomSheet = document.querySelector('.bottom-sheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        const bottomSheet = this.createBottomSheet();
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="bottom-sheet-header">
                <h3>Información de Entrega</h3>
                <button class="close-btn" onclick="this.closest('.bottom-sheet').remove()">×</button>
            </div>
            <div class="bottom-sheet-content">
                <form id="checkout-form" class="checkout-form">
                    <div class="form-group">
                        <label for="fullName">Nombre Completo *</label>
                        <input type="text" id="fullName" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono *</label>
                        <input type="text" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Dirección *</label>
                        <input type="text" id="address" required>
                    </div>
                    <div class="form-group">
                        <label for="city">Ciudad *</label>
                        <input type="text" id="city" required>
                    </div>
                    <div class="form-group">
                        <label for="postalCode">Código Postal *</label>
                        <input type="text" id="postalCode" required>
                    </div>
                    <div class="payment-info">
                        <h4>Formas de Pago</h4>
                        <p>• Efectivo contra entrega</p>
                        <p>• Acordar pago por WhatsApp</p>
                    </div>
                    <button type="submit" class="checkout-btn">
                        Confirmar Pedido
                    </button>
                </form>
            </div>
        `;
        
        bottomSheet.appendChild(content);
        document.body.appendChild(bottomSheet);
        this.animateBottomSheet(content, 'in');
        
        // Handle form submission
        document.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });
    }

    processOrder() {
        const formData = new FormData(document.getElementById('checkout-form'));
        const orderData = {
            customer: {
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postalCode').value
            },
            items: this.cart,
            total: this.getTotal(),
            orderDate: new Date().toISOString()
        };
        
        // Show order confirmation
        this.showOrderConfirmation(orderData);
        
        // Clear cart
        this.clearCart();
    }

    showOrderConfirmation(orderData) {
        // Close any existing bottom sheet first
        const existingBottomSheet = document.querySelector('.bottom-sheet');
        if (existingBottomSheet) {
            existingBottomSheet.remove();
        }

        const bottomSheet = this.createBottomSheet();
        const content = document.createElement('div');
        
        // Generate cart summary for WhatsApp
        const cartSummary = this.generateCartSummary(orderData);
        const whatsappText = encodeURIComponent(cartSummary);
        
        content.innerHTML = `
            <div class="bottom-sheet-header">
                <h3>Excelente!</h3>
                <button class="close-btn" onclick="this.closest('.bottom-sheet').remove()">×</button>
            </div>
            <div class="bottom-sheet-content">
                <div class="order-confirmation">
                    <div class="success-icon">✓</div>
                    <h4>Gracias por tu pedido, ${orderData.customer.fullName}</h4>
                    <p>Confirmalo presionando el botón "Enviar pedido por WhatsApp"</p>
                    <div class="order-details">
                        <p><strong>Total:</strong> $${orderData.total.toLocaleString()}</p>
                        <p><strong>Fecha:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
                    </div>
                    <p>Te contactaremos pronto para coordinar la entrega y el pago.</p>
                    <a href="https://wa.me/+5493425218014?text=${whatsappText}" target="_blank" class="whatsapp-btn">
                        Enviar pedido por WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        bottomSheet.appendChild(content);
        document.body.appendChild(bottomSheet);
        this.animateBottomSheet(content, 'in');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.cart[productId].quantity = newQuantity;
            this.saveCart();
            this.updateCartIcon();
            this.refreshCartDisplay();
        }
    }

    removeFromCart(productId) {
        delete this.cart[productId];
        this.saveCart();
        this.updateCartIcon();
        this.refreshCartDisplay();
    }

    refreshCartDisplay() {
        // Find existing cart bottom sheet
        const existingBottomSheet = document.querySelector('.bottom-sheet');
        if (!existingBottomSheet) return;

        // If cart is empty, show empty cart message
        if (Object.keys(this.cart).length === 0) {
            this.showEmptyCart();
            return;
        }

        // Update the existing cart content
        const cartItems = this.getCartItems();
        const total = this.getTotal();
        
        const cartContent = existingBottomSheet.querySelector('.bottom-sheet-content');
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="cart-items">
                    ${cartItems.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p class="price">$${item.price.toLocaleString()}</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn small" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn small" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">×</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    <h4>Total: $${total.toLocaleString()}</h4>
                </div>
                <button class="checkout-btn" onclick="cart.showCheckout()">
                    Proceder al Pago
                </button>
            `;
        }
    }

    clearCart() {
        this.cart = {};
        this.saveCart();
        this.updateCartIcon();
    }

    getCartItems() {
        return Object.values(this.cart);
    }

    getTotal() {
        return Object.values(this.cart).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    updateCartIcon() {
        const cartIcon = document.querySelector('.nav-cart');
        const itemCount = Object.values(this.cart).reduce((total, item) => total + item.quantity, 0);
        
        if (itemCount > 0) {
            if (!cartIcon.querySelector('.cart-badge')) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = itemCount;
                cartIcon.appendChild(badge);
            } else {
                cartIcon.querySelector('.cart-badge').textContent = itemCount;
            }
        } else {
            const badge = cartIcon.querySelector('.cart-badge');
            if (badge) badge.remove();
        }
    }

    createBottomSheet() {
        const bottomSheet = document.createElement('div');
        bottomSheet.className = 'bottom-sheet';
        
        // Add click outside to close functionality
        bottomSheet.addEventListener('click', (e) => {
            if (e.target === bottomSheet) {
                bottomSheet.remove();
            }
        });
        
        return bottomSheet;
    }

    animateBottomSheet(bottomSheet, direction) {
        if (direction === 'in') {
            bottomSheet.style.transform = 'translateY(100%)';
            setTimeout(() => {
                bottomSheet.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Generate cart summary for WhatsApp
    generateCartSummary(orderData) {
        const customer = orderData.customer;
        const items = orderData.items;
        const total = orderData.total;
        
        let summary = `*NUEVO PEDIDO SÉQUITO GIN*\n\n`;
        summary += `*Cliente:* ${customer.fullName}\n`;
        summary += `*Teléfono:* ${customer.phone}\n`;
        summary += `*Dirección:* ${customer.address}, ${customer.city} ${customer.postalCode}\n\n`;
        summary += `*Productos:*\n`;
        
        Object.values(items).forEach(item => {
            const itemTotal = item.price * item.quantity;
            summary += `• ${item.name}: ${item.quantity} unidad${item.quantity > 1 ? 'es' : ''} x $${item.price.toLocaleString()} = $${itemTotal.toLocaleString()}\n`;
        });
        
        summary += `\n*Total del Pedido:* $${total.toLocaleString()}\n`;
        summary += `*Fecha:* ${new Date(orderData.orderDate).toLocaleDateString('es-AR')}\n\n`;
        summary += `Pedido confirmado desde la web. Por favor coordinar entrega y pago.`;
        
        return summary;
    }

    // Session persistence
    saveCart() {
        sessionStorage.setItem('sequitoCart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = sessionStorage.getItem('sequitoCart');
        return saved ? JSON.parse(saved) : {};
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});
