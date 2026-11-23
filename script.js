const CART_STORAGE_KEY = 'understory-cart';

const state = {
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'featured',
  cart: loadCart(),
  wishlist: loadWishlist(),
  orders: [],
  user: null
};

const filterGroup = document.getElementById('filterGroup');
const productGrid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCountBadge = document.getElementById('cartCountBadge');
const subtotalValue = document.getElementById('subtotalValue');
const cartSummaryCount = document.getElementById('cartSummaryCount');
const toast = document.getElementById('toast');
const modal = document.getElementById('productModal');
const modalMedia = document.getElementById('modalMedia');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalCare = document.getElementById('modalCare');
const modalBlurb = document.getElementById('modalBlurb');
const ordersDrawer = document.getElementById('ordersDrawer');
const ordersList = document.getElementById('ordersList');
const ordersToggle = document.getElementById('ordersToggle');
const accountLink = document.getElementById('accountLink');
const logoutButton = document.getElementById('logoutBtn');

const categories = ['All', ...new Set(PRODUCTS.map((product) => product.category))];
let activeProductId = null;

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
}

function loadWishlist() {
  try {
    const stored = JSON.parse(localStorage.getItem('understory-wishlist') || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveWishlist() {
  localStorage.setItem('understory-wishlist', JSON.stringify(state.wishlist));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function leafSvg(color) {
  return `
    <svg class="leaf-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="leafGradient-${color.replace('#', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.96"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <g>
        <path d="M110 20C150 42 190 87 190 132C190 176 154 200 110 200C68 200 28 176 28 132C28 94 60 46 110 20Z" fill="url(#leafGradient-${color.replace('#', '')})"/>
        <path d="M110 52C119 90 124 122 122 169" stroke="rgba(255,255,255,0.7)" stroke-width="8" stroke-linecap="round"/>
        <path d="M82 108C98 112 116 116 138 106" stroke="rgba(255,255,255,0.5)" stroke-width="7" stroke-linecap="round"/>
      </g>
    </svg>
  `;
}

function renderFilters() {
  filterGroup.innerHTML = categories
    .map(
      (category) => `
        <button
          type="button"
          class="filter-chip ${state.selectedCategory === category ? 'active' : ''}"
          data-filter="${category}"
          aria-pressed="${state.selectedCategory === category}"
        >
          ${category}
        </button>
      `
    )
    .join('');
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function getVisibleProducts() {
  let visibleProducts = PRODUCTS;

  if (state.selectedCategory !== 'All') {
    visibleProducts = visibleProducts.filter((product) => product.category === state.selectedCategory);
  }

  if (state.searchQuery.trim()) {
    const query = state.searchQuery.trim().toLowerCase();
    visibleProducts = visibleProducts.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.blurb.toLowerCase().includes(query)
    );
  }

  if (state.sortBy === 'low-to-high') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'high-to-low') {
    visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'az') {
    visibleProducts = [...visibleProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return visibleProducts;
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
}

async function openOrders() {
  closeCart();

  try {
    if (!state.user) {
      const account = await UnderstoryAPI.request('/api/auth/me');
      state.user = account.user;
      updateAccountControls();
    }

    if (!state.user) {
      window.location.assign('login.html');
      return;
    }

    const result = await UnderstoryAPI.request('/api/orders');
    state.orders = result.orders;
    renderOrders();
  } catch (error) {
    showToast(error.message);
  }

  ordersDrawer.classList.add('open');
  ordersDrawer.setAttribute('aria-hidden', 'false');
  ordersToggle.setAttribute('aria-expanded', 'true');
}

function updateAccountControls() {
  accountLink.textContent = state.user ? 'Account' : 'Sign in';
  logoutButton.hidden = !state.user;
}

function closeOrders() {
  ordersDrawer.classList.remove('open');
  ordersDrawer.setAttribute('aria-hidden', 'true');
  ordersToggle.setAttribute('aria-expanded', 'false');
}

function openModal(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  activeProductId = productId;
  modalMedia.innerHTML = `
    <img
      class="modal-product-image"
      src="${product.image}"
      alt="${product.name}"
    />
  `;
  modalCategory.textContent = product.category;
  modalTitle.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalCare.textContent = product.care;
  modalBlurb.textContent = product.blurb;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  activeProductId = null;
}

function addToCart(productId, quantity = 1) {
  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cart.push({ id: productId, quantity });
  }

  saveCart();
  renderCart();
  showToast('Added to cart');
}

function updateQuantity(productId, change) {
  const item = state.cart.find((entry) => entry.id === productId);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
}

function renderCart() {
  const cartEntries = state.cart
    .map((entry) => {
      const product = PRODUCTS.find((item) => item.id === entry.id);
      return product ? { ...product, quantity: entry.quantity } : null;
    })
    .filter(Boolean);

  const totalItems = cartEntries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCountBadge.textContent = String(totalItems);
  subtotalValue.textContent = formatPrice(subtotal);
  cartSummaryCount.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;

  if (!cartEntries.length) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty — add a few plants to get started.</div>';
    return;
  }

  cartItems.innerHTML = cartEntries
    .map(
      (item) => `
        <article class="cart-item" data-cart-id="${item.id}">
          <div class="cart-item-thumb" style="background:${item.color}1A;">
            <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-meta">
              <span>${formatPrice(item.price)}</span>
              <span>×</span>
              <span>${item.quantity}</span>
            </span>
          </div>
          <div class="qty-control">
            <button type="button" data-qty-change="decrease" data-product-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty-change="increase" data-product-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </article>
      `
    )
    .join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function renderOrders() {
  if (!state.orders.length) {
    ordersList.innerHTML = state.user
      ? `
          <div class="order-empty">
            <p>No orders yet.</p>
            <button class="ghost-btn" id="ordersBrowseBtn" type="button">Browse plants</button>
          </div>
        `
      : `
          <div class="order-empty">
            <p>Sign in to view your order history.</p>
            <a class="ghost-btn" href="login.html">Sign in</a>
          </div>
        `;
    return;
  }

  ordersList.innerHTML = state.orders
    .map((order) => {
      const orderDate = new Date(order.createdAt);
      const dateLabel = Number.isNaN(orderDate.getTime()) ? 'Date unavailable' : orderDate.toLocaleDateString();
      const items = Array.isArray(order.items) ? order.items : [];

      return `
        <article class="order-card">
          <div class="order-heading">
            <div>
              <strong>Order #${escapeHtml(order.id)}</strong>
              <time datetime="${escapeHtml(order.createdAt)}">${escapeHtml(dateLabel)}</time>
            </div>
            <span class="order-status">Order recorded</span>
          </div>
          <ul class="order-product-list">
            ${items.map((item) => `
              <li>
                <span>${escapeHtml(item.name)} × ${escapeHtml(item.quantity)}</span>
                <strong>${formatPrice(Number(item.price) * Number(item.quantity))}</strong>
              </li>
            `).join('')}
          </ul>
          <div class="order-total"><span>Total</span><strong>${formatPrice(Number(order.total) || 0)}</strong></div>
        </article>
      `;
    })
    .join('');
}

async function placeOrder() {
  if (!state.cart.length) {
    showToast('Add a plant before placing an order');
    return;
  }

  const checkoutButton = document.getElementById('checkoutBtn');
  checkoutButton.disabled = true;

  const finalizeOrder = async (order, payment) => {
    state.orders.unshift(order);
    state.cart = [];
    saveCart();
    renderCart();
    renderOrders();
    closeCart();
    await openOrders();
    showToast(`Payment approved • ${formatPrice(payment.amount)}`);
  };

  try {
    const checkoutOrder = await UnderstoryAPI.request('/api/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify({
        items: state.cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
      })
    });

    if (checkoutOrder.demo) {
      const { order, payment } = await UnderstoryAPI.request('/api/checkout/verify', {
        method: 'POST',
        body: JSON.stringify({
          demo: true,
          orderId: checkoutOrder.orderId,
          items: state.cart.map((item) => ({ productId: item.id, quantity: item.quantity }))
        })
      });

      await finalizeOrder(order, payment);
      checkoutButton.disabled = false;
      return;
    }

    if (!window.Razorpay) {
      showToast('Payment gateway is unavailable right now.');
      checkoutButton.disabled = false;
      return;
    }

    const checkout = new window.Razorpay({
      key: checkoutOrder.keyId,
      amount: checkoutOrder.amount,
      currency: checkoutOrder.currency,
      name: 'Understory',
      description: 'Plant shop order',
      order_id: checkoutOrder.orderId,
      prefill: { email: state.user?.email || '' },
      theme: { color: '#315c47' },
      modal: { ondismiss: () => { checkoutButton.disabled = false; } },
      handler: async (paymentResult) => {
        try {
          const { order, payment } = await UnderstoryAPI.request('/api/checkout/verify', {
            method: 'POST',
            body: JSON.stringify(paymentResult)
          });

          await finalizeOrder(order, payment);
        } catch (error) {
          showToast(error.message);
        } finally {
          checkoutButton.disabled = false;
        }
      }
    });

    checkout.on('payment.failed', (event) => {
      showToast(event.error?.description || 'Payment failed. Please try again.');
      checkoutButton.disabled = false;
    });
    checkout.open();
  } catch (error) {
    if (error.status === 401) {
      showToast('Sign in to place an order');
      window.location.assign('login.html?next=checkout');
    } else {
      showToast(error.message);
    }
    checkoutButton.disabled = false;
  }
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="cart-empty">No items in this category yet.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => {
        const isWishlisted = state.wishlist.includes(product.id);

        return `
          <article class="product-card" data-product-id="${product.id}" tabindex="0" aria-label="View details for ${product.name}">
            <button
              type="button"
              class="wishlist-toggle ${isWishlisted ? 'active' : ''}"
              data-wishlist-id="${product.id}"
              aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
              aria-pressed="${isWishlisted}"
            >
              ${isWishlisted ? '♥' : '♡'}
            </button>
            <div class="product-thumb" style="background: linear-gradient(180deg, ${product.color}1A, rgba(255,255,255,0.8));">
              <img class="product-image" src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-body">
              <div class="product-meta">
                <span class="product-category">${product.category}</span>
                <span class="product-badge">Popular</span>
              </div>
              <h4>${product.name}</h4>
              <p>${product.blurb}</p>
              <div class="product-footer">
                <span class="product-price">${formatPrice(product.price)}</span>
                <button type="button" class="mini-btn" data-add-id="${product.id}">Add</button>
              </div>
            </div>
          </article>
        `;
      }
    )
    .join('');
}

function handleFilterSelection(event) {
  const filterButton = event.target.closest('[data-filter]');

  if (!filterButton) return;

  state.selectedCategory = filterButton.dataset.filter;
  renderFilters();
  renderProducts();
}

function toggleWishlist(productId) {
  const isWishlisted = state.wishlist.includes(productId);

  state.wishlist = isWishlisted
    ? state.wishlist.filter((id) => id !== productId)
    : [...state.wishlist, productId];

  saveWishlist();
  renderProducts();
}

function handleProductGridClick(event) {
  const wishlistButton = event.target.closest('[data-wishlist-id]');
  if (wishlistButton) {
    toggleWishlist(Number(wishlistButton.dataset.wishlistId));
    return;
  }

  const addButton = event.target.closest('[data-add-id]');
  if (addButton) {
    addToCart(Number(addButton.dataset.addId));
    openCart();
    return;
  }

  const productCard = event.target.closest('[data-product-id]');
  if (productCard) {
    openModal(Number(productCard.dataset.productId));
  }
}

function handleKeyboardProduct(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  const card = event.target.closest('[data-product-id]');
  if (!card) return;

  event.preventDefault();
  openModal(Number(card.dataset.productId));
}

function handleCartControls(event) {
  const qtyButton = event.target.closest('[data-qty-change]');
  if (!qtyButton) return;

  const productId = Number(qtyButton.dataset.productId);
  const change = qtyButton.dataset.qtyChange === 'increase' ? 1 : -1;
  updateQuantity(productId, change);
}

function attachEvents() {
  const searchInput = document.getElementById('productSearch');
  const sortSelect = document.getElementById('sortSelect');

  filterGroup.addEventListener('click', handleFilterSelection);
  productGrid.addEventListener('click', handleProductGridClick);
  productGrid.addEventListener('keydown', handleKeyboardProduct);
  cartItems.addEventListener('click', handleCartControls);

  searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    renderProducts();
  });

  sortSelect.addEventListener('change', (event) => {
    state.sortBy = event.target.value;
    renderProducts();
  });

  document.getElementById('cartToggle').addEventListener('click', () => {
    if (cartDrawer.classList.contains('open')) {
      closeCart();
      return;
    }

    closeOrders();
    openCart();
  });

  document.getElementById('closeCartBtn').addEventListener('click', closeCart);
  logoutButton.addEventListener('click', async () => {
    logoutButton.disabled = true;
    try {
      await UnderstoryAPI.request('/api/auth/logout', { method: 'POST' });
      state.user = null;
      state.orders = [];
      updateAccountControls();
      renderOrders();
      closeOrders();
      showToast('You have signed out');
    } catch (error) {
      showToast(error.message);
    } finally {
      logoutButton.disabled = false;
    }
  });
  document.getElementById('closeOrdersBtn').addEventListener('click', closeOrders);
  ordersToggle.addEventListener('click', () => {
    ordersDrawer.classList.contains('open') ? closeOrders() : openOrders();
  });
  ordersList.addEventListener('click', (event) => {
    if (!event.target.closest('#ordersBrowseBtn')) return;

    closeOrders();
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('closeModalBackdrop').addEventListener('click', closeModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('modalAddToCart').addEventListener('click', () => {
    if (activeProductId !== null) {
      addToCart(activeProductId);
      closeModal();
      openCart();
    }
  });

  document.getElementById('checkoutBtn').addEventListener('click', placeOrder);

  document.getElementById('shopNowBtn').addEventListener('click', () => {
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('scrollToProducts').addEventListener('click', () => {
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('findGiftBtn').addEventListener('click', () => {
    state.selectedCategory = 'Planters';
    renderFilters();
    renderProducts();
    document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
      closeOrders();
      closeModal();
    }
  });

  if (searchInput) {
    searchInput.value = state.searchQuery;
  }
}

async function initialize() {
  renderFilters();
  renderProducts();
  renderCart();
  attachEvents();

  try {
    const account = await UnderstoryAPI.request('/api/auth/me');
    state.user = account.user;
    if (state.user) {
      const orderHistory = await UnderstoryAPI.request('/api/orders');
      state.orders = orderHistory.orders;
    }
  } catch (error) {
    state.user = null;
    state.orders = [];
  }

  updateAccountControls();
  renderOrders();
}

initialize();
