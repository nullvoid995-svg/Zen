/**
 * ZENN Luxury Fashion House - Core Application Architecture
 * @version 2.1.0 (2026 Production Edit)
 * @pattern Modern Functional OOP & State Machine
 */

class ZennApp {
    constructor() {
        // --- 🔒 INITIAL STATE MANAGEMENT ---
        this.state = {
            cart: [],
            currency: '$',
            promoApplied: false,
            discountRate: 0.15 // 15% VIP Discount
        };

        // --- 📌 ELEMENT SELECTORS MAP ---
        this.dom = {
            searchBtn: document.getElementById('searchBtn'),
            closeSearch: document.getElementById('closeSearch'),
            searchOverlay: document.getElementById('searchOverlay'),
            
            cartBtn: document.getElementById('cartBtn'),
            closeCartBtn: document.getElementById('closeCartBtn'),
            cartDrawer: document.getElementById('cartDrawer'),
            cartDrawerOverlay: document.getElementById('cartDrawerOverlay'),
            
            cartCount: document.getElementById('cartCount'),
            cartHeaderCount: document.getElementById('cartHeaderCount'),
            cartItemsContainer: document.getElementById('cartItemsContainer'),
            cartTotalAmount: document.getElementById('cartTotalAmount'),
            
            copyPromoBtn: document.getElementById('copyPromoBtn'),
            promoCodeText: document.getElementById('promoCodeText'),
            sizeButtons: document.querySelectorAll('.size-opt'),
            addToCartButtons: document.querySelectorAll('.add-to-cart-btn')
        };

        // Run Engine Initialization
        this.init();
    }

    /**
     * Core Initialization Engine
     */
    init() {
        this.registerOverlayEvents();
        this.registerProductEvents();
        this.registerUtilityEvents();
        console.log('💎 ZENN Engine Core v2.1.0 Initialized Successfully.');
    }

    // -------------------------------------------------------------------------
    //  1. INTERACTIVE UI CONTROLLER (OVERLAYS)
    // -------------------------------------------------------------------------
    registerOverlayEvents() {
        const { searchBtn, searchOverlay, closeSearch, cartBtn, closeCartBtn, cartDrawer, cartDrawerOverlay } = this.dom;

        // --- Search Drawer Operations ---
        if (searchBtn && searchOverlay && closeSearch) {
            searchBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
            closeSearch.addEventListener('click', () => searchOverlay.classList.remove('active'));
        }

        // --- Premium Cart Drawer Operations ---
        if (cartBtn && closeCartBtn && cartDrawerOverlay) {
            cartBtn.addEventListener('click', () => this.toggleCart(true));
            closeCartBtn.addEventListener('click', () => this.toggleCart(false));
            cartDrawerOverlay.addEventListener('click', () => this.toggleCart(false));
        }
    }

    toggleCart(isOpen) {
        const { cartDrawer, cartDrawerOverlay } = this.dom;
        if (!cartDrawer || !cartDrawerOverlay) return;

        if (isOpen) {
            cartDrawer.classList.add('active');
            cartDrawerOverlay.classList.add('active');
        } else {
            cartDrawer.classList.remove('active');
            cartDrawerOverlay.classList.remove('active');
        }
    }

    // -------------------------------------------------------------------------
    //  2. PRODUCT LOGIC & STATE INTERACTION
    // -------------------------------------------------------------------------
    registerProductEvents() {
        // --- Dynamic Size Selection Matrix ---
        this.dom.sizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                parent.querySelectorAll('.size-opt').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // --- Add To Cart Lifecycle ---
        this.dom.addToCartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAddToCart(e));
        });
    }

    handleAddToCart(e) {
        const productCard = e.target.closest('.premium-card');
        if (!productCard) return;

        // Data Hydration from Attributes
        const id = productCard.getAttribute('data-id');
        const name = productCard.getAttribute('data-name');
        const price = parseFloat(productCard.getAttribute('data-price'));
        const imgUrl = productCard.querySelector('.card-media img')?.getAttribute('src') || '';
        
        // Dynamic Size Capture
        const activeSizeEl = productCard.querySelector('.size-opt.active');
        const size = activeSizeEl ? activeSizeEl.innerText : 'OS';
        const variantId = `${id}-${size}`;

        // Find or Mutate Cart State
        const existingItem = this.state.cart.find(item => item.variantId === variantId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ variantId, id, name, price, imgUrl, size, quantity: 1 });
        }

        this.commitCartChanges();
        this.toggleCart(true); // Micro-interaction: Auto open cart drawer
    }

    // -------------------------------------------------------------------------
    //  3. CORE CART SYNC ENGINE & UI SYNC
    // -------------------------------------------------------------------------
    commitCartChanges() {
        this.renderCart();
        this.syncTotals();
    }

    renderCart() {
        const { cartItemsContainer } = this.dom;
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (this.state.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your shopping bag is empty.</div>`;
            return;
        }

        // Generate Ultra Minimalist Dynamic DOM Template
        this.state.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.imgUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div>
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-meta">Size: ${item.size} | Qty: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">${this.state.currency}${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item-btn" data-variant-id="${item.variantId}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Event Delegation for Removal Loops
        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRemoveItem(e));
        });
    }

    handleRemoveItem(e) {
        const variantId = e.target.getAttribute('data-variant-id');
        this.state.cart = this.state.cart.filter(item => item.variantId !== variantId);
        this.commitCartChanges();
    }

    syncTotals() {
        const { cartCount, cartHeaderCount, cartTotalAmount } = this.dom;
        
        const totalItems = this.state.cart.reduce((acc, item) => acc + item.quantity, 0);
        const grossAmount = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Mutate Interface Data
        if (cartCount) cartCount.innerText = totalItems;
        if (cartHeaderCount) cartHeaderCount.innerText = totalItems;
        if (cartTotalAmount) cartTotalAmount.innerText = `${this.state.currency}${grossAmount.toFixed(2)}`;
    }

    // -------------------------------------------------------------------------
    //  4. UTILITY OPERATIONS (HIGH PERFORMANCE COPY ENGINE)
    // -------------------------------------------------------------------------
    registerUtilityEvents() {
        const { copyPromoBtn, promoCodeText } = this.dom;
        if (!copyPromoBtn || !promoCodeText) return;

        copyPromoBtn.addEventListener('click', async () => {
            try {
                // High Perf Web API Clipboard
                await navigator.clipboard.writeText(promoCodeText.innerText);
                
                // UX Feedback Pipeline
                const fallbackHTML = copyPromoBtn.innerHTML;
                copyPromoBtn.innerHTML = `<i class="fa-solid fa-check"></i> COPIED`;
                copyPromoBtn.style.color = '#2b8a3e'; // Success feedback color
                
                setTimeout(() => {
                    copyPromoBtn.innerHTML = fallbackHTML;
                    copyPromoBtn.style.color = '';
                }, 2000);
                
            } catch (err) {
                console.error('📋 System Clipboard write failure:', err);
            }
        });
    }
}

// --- 🌐 GLOBAL DISPATCHER ON COMPONENT LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    window.ZennLuxuryApp = new ZennApp();
});

