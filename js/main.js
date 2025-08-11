// ModernShop - Advanced JavaScript Application
// Optimized for performance, accessibility, and cross-browser compatibility

class ModernShop {
    constructor() {
        this.products = [];
        this.cart = this.loadCart();
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.isLoading = false;
        
        // Initialize the application
        this.init();
    }

    async init() {
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Load products and setup event listeners
        await this.loadProducts();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupThemeToggle();
        this.hideLoadingScreen();
        
        // Update cart UI
        this.updateCartUI();
        
        // Initialize focus management for accessibility
        this.setupFocusManagement();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            });
        }

        // Setup error reporting
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', event.error);
            this.showToast('An error occurred. Please refresh the page.', 'error');
        });

        // Setup unhandled promise rejection handling
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showToast('An error occurred. Please try again.', 'error');
        });
    }

    async loadProducts() {
        try {
            // Simulate API call with mock data for demo
            this.products = await this.getMockProducts();
            this.filteredProducts = [...this.products];
            
            // Render featured products
            this.renderFeaturedProducts();
            
            // Render all products
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Failed to load products. Please try again.', 'error');
        }
    }

    async getMockProducts() {
        // Simulate API delay
        await this.delay(500);
        
        return [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 8299,
                category: "electronics",
                image: "images/headphones.jpg",
                rating: 4.5,
                reviews: 128,
                description: "Premium wireless headphones with noise cancellation and 30-hour battery life."
            },
            {
                id: 2,
                name: "Smart Watch",
                price: 16599,
                category: "electronics",
                image: "images/smartwatch.jpg",
                rating: 4.2,
                reviews: 89,
                description: "Advanced fitness tracking with heart rate monitor and GPS."
            },
            {
                id: 3,
                name: "Designer Jacket",
                price: 12499,
                category: "fashion",
                image: "images/jacket.jpg",
                rating: 4.7,
                reviews: 156,
                description: "Premium designer jacket made with sustainable materials."
            },
            {
                id: 4,
                name: "Running Shoes",
                price: 10799,
                category: "sports",
                image: "images/running-shoes.jpg",
                rating: 4.3,
                reviews: 203,
                description: "Lightweight running shoes with advanced cushioning technology."
            },
            {
                id: 5,
                name: "Coffee Maker",
                price: 7499,
                category: "home",
                image: "images/coffee-maker.jpg",
                rating: 4.1,
                reviews: 97,
                description: "Programmable coffee maker with built-in grinder and timer."
            },
            {
                id: 6,
                name: "Laptop Stand",
                price: 4199,
                category: "electronics",
                image: "images/laptop-stand.jpg",
                rating: 4.6,
                reviews: 74,
                description: "Ergonomic laptop stand with adjustable height and angle."
            },
            {
                id: 7,
                name: "Summer Dress",
                price: 6699,
                category: "fashion",
                image: "images/summer-dress.jpg",
                rating: 4.4,
                reviews: 112,
                description: "Light and breathable summer dress perfect for any occasion."
            },
            {
                id: 8,
                name: "Yoga Mat",
                price: 3299,
                category: "sports",
                image: "images/yoga-mat.jpg",
                rating: 4.8,
                reviews: 187,
                description: "Premium non-slip yoga mat with excellent grip and cushioning."
            }
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 300);
            }, 1000);
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Search functionality
        this.setupSearch();
        
        // Cart functionality
        this.setupCart();
        
        // Product filters
        this.setupFilters();
        
        // Forms
        this.setupForms();
        
        // Modal functionality
        this.setupModal();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Mobile menu
        this.setupMobileMenu();
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });

        // Hero button
        const heroBtn = document.querySelector('.hero-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                document.querySelector('#products').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    setupSearch() {
        const searchBtn = document.getElementById('search-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');

        if (searchBtn && searchOverlay && searchClose && searchInput) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                searchInput.focus();
            });

            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            });

            // Close search on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                }
            });

            // Search functionality
            searchInput.addEventListener('input', this.debounce((e) => {
                const query = e.target.value.toLowerCase().trim();
                this.searchProducts(query);
            }, 300));
        }
    }

    searchProducts(query) {
        if (!query) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }
        this.renderProducts();
    }

    setupCart() {
        const cartBtn = document.getElementById('cart-btn');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartClose = document.getElementById('cart-close');
        const cartOverlay = document.getElementById('cart-overlay');

        if (cartBtn && cartSidebar && cartClose && cartOverlay) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            cartClose.addEventListener('click', () => {
                this.closeCart();
            });

            cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });

            // Close cart on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
                    this.closeCart();
                }
            });
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const sortFilter = document.getElementById('sort-filter');

        let filtered = [...this.products];

        // Apply category filter
        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }

        // Apply price filter (values in Indian Rupees)
        if (priceFilter && priceFilter.value) {
            const priceRange = priceFilter.value;
            filtered = filtered.filter(product => {
                if (priceRange === '0-5000') return product.price <= 5000;
                if (priceRange === '5000-10000') return product.price > 5000 && product.price <= 10000;
                if (priceRange === '10000-15000') return product.price > 10000 && product.price <= 15000;
                if (priceRange === '15000+') return product.price > 15000;
                return true;
            });
        }

        // Apply sorting
        if (sortFilter && sortFilter.value) {
            const sortBy = sortFilter.value;
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'price-low':
                        return a.price - b.price;
                    case 'price-high':
                        return b.price - a.price;
                    case 'rating':
                        return b.rating - a.rating;
                    case 'name':
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
        }

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    setupForms() {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(newsletterForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            this.showToast('Please fill in all fields.', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        setTimeout(() => {
            this.showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
        }, 1000);
    }

    handleNewsletterForm(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || form.querySelector('input[type="email"]').value;

        if (!email) {
            this.showToast('Please enter your email address.', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        setTimeout(() => {
            this.showToast('Successfully subscribed to newsletter!', 'success');
            form.reset();
        }, 1000);
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    setupModal() {
        const modal = document.getElementById('product-modal');
        const modalClose = document.getElementById('modal-close');

        if (modal && modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupScrollEffects() {
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset;
            
            // Add scrolled class to header
            if (header) {
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            // Update active navigation link
            this.updateActiveNavLink();
        }, 100));
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollTop = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + scrollTop - headerHeight - 100;
            if (scrollTop >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on nav links
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupIntersectionObserver() {
        // Lazy loading for images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Animate elements on scroll
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe elements for animation
        document.querySelectorAll('.product-card, .category-card, .feature').forEach(el => {
            animationObserver.observe(el);
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
                
                this.showToast(`Switched to ${newTheme} theme`, 'info');
            });
        }
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    setupFocusManagement() {
        // Focus management for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard support for interactive elements
        document.addEventListener('keydown', (e) => {
            // Enter key support for buttons without proper button elements
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.classList.contains('product-card') || 
                    target.classList.contains('category-card')) {
                    e.preventDefault();
                    target.click();
                }
            }
        });
    }

    renderFeaturedProducts() {
        const container = document.getElementById('featured-products');
        if (!container || this.products.length === 0) return;

        // Get top rated products for featured section
        const featured = [...this.products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);

        container.innerHTML = featured.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners
        this.addProductEventListeners(container);
    }

    renderProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        } else {
            container.insertAdjacentHTML('beforeend', 
                productsToShow.map(product => this.createProductCard(product)).join('')
            );
        }

        // Add event listeners to new products
        this.addProductEventListeners(container);

        // Update load more button
        this.updateLoadMoreButton();
    }

    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        
        return `
            <div class="product-card" data-product-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                    <div class="product-rating" aria-label="Rating: ${product.rating} out of 5 stars">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '★'.repeat(fullStars) + 
               (halfStar ? '½' : '') + 
               '☆'.repeat(emptyStars);
    }

    addProductEventListeners(container) {
        // Product card click events
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-cart')) {
                    const productId = parseInt(card.dataset.productId);
                    this.showProductModal(productId);
                }
            });
        });

        // Add to cart button events
        container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                this.addToCart(productId);
            });
        });
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.onclick = () => {
                this.currentPage++;
                this.renderProducts();
            };
        }
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalBody) return;

        const stars = this.generateStars(product.rating);

        modalBody.innerHTML = `
            <div class="product-modal-content">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-modal-info">
                    <h2>${product.name}</h2>
                    <div class="product-price" style="font-size: 1.5rem; margin: 1rem 0;">₹${product.price.toLocaleString('en-IN')}</div>
                    <div class="product-rating" style="margin-bottom: 1rem;">
                        <span class="stars" style="color: #ffc107;">${stars}</span>
                        <span class="rating-text" style="margin-left: 0.5rem;">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <p style="margin-bottom: 1.5rem;">${product.description}</p>
                    <button class="btn btn-primary" onclick="app.addToCart(${product.id}); document.getElementById('product-modal').classList.remove('active');">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showToast('Item removed from cart', 'info');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
    }

    createCartItem(item) {
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
                        <button class="quantity-btn" onclick="app.removeFromCart(${item.id})" style="margin-left: 1rem; background: #dc3545; color: white;" aria-label="Remove item">×</button>
                    </div>
                </div>
            </div>
        `;
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('modernshop-cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('modernshop-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        toast.innerHTML = `
            <div class="toast-header">
                <h4 class="toast-title">${this.getToastTitle(type)}</h4>
                <button class="toast-close" onclick="app.closeToast('${toastId}')" aria-label="Close notification">×</button>
            </div>
            <div class="toast-body">${message}</div>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.closeToast(toastId);
        }, 5000);
    }

    getToastTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        return titles[type] || 'Notification';
    }

    closeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Global app instance
    window.app = new ModernShop();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    app.showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    app.showToast('No internet connection', 'warning');
});

// Performance optimization: Prefetch important resources
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Prefetch critical resources during idle time
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = '/images/hero-image.jpg';
        document.head.appendChild(link);
    });
}
