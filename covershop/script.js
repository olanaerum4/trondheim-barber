// CoverShop - Shopping Cart Functionality

let cart = [];

// Load cart from localStorage
if (localStorage.getItem('covershop_cart')) {
    cart = JSON.parse(localStorage.getItem('covershop_cart'));
    updateCartUI();
}

function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    toggleCart(true);
    
    // Show feedback
    showNotification(`${name} lagt i handlekurven!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('covershop_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <p>Handlekurven er tom</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Legg til produkter for å komme i gang</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">kr ${item.price}</p>
                    <div class="cart-item-actions">
                        <button onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <span class="remove-item" onclick="removeFromCart(${item.id})">Fjern</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        cartFooter.style.display = 'block';
        
        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.total-price').textContent = `kr ${total}`;
        
        // Update free shipping message
        const remaining = 299 - total;
        const freeShippingMsg = document.querySelector('.free-shipping');
        if (remaining > 0) {
            freeShippingMsg.textContent = `Kjøp for kr ${remaining} til for gratis frakt`;
        } else {
            freeShippingMsg.textContent = '✓ Du har gratis frakt!';
            freeShippingMsg.style.color = 'var(--success)';
        }
    }
}

function toggleCart(forceOpen = false) {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (forceOpen || !cartSidebar.classList.contains('active')) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Handlekurven er tom!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Takk for din bestilling!\n\nTotalt: kr ${total}\n\nDette er en demo-butikk. I en ekte nettbutikk ville du blitt sendt til betaling nå.`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

console.log('CoverShop loaded 🛒');
