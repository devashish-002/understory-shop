:root {
  --bg: #f4f1ea;
  --panel: #f9f7f3;
  --card: #ffffff;
  --card-strong: rgba(33, 38, 26, 0.04);
  --text: #1b1d1a;
  --muted: #5a625d;
  --line: rgba(26, 30, 21, 0.12);
  --primary: #1c5f3d;
  --primary-soft: rgba(28, 95, 61, 0.1);
  --accent: #d9ead7;
  --shadow: 0 18px 45px rgba(26, 30, 21, 0.12);
  --radius-lg: 24px;
  --radius-md: 18px;
  --radius-sm: 12px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #f3efe9 0%, #f8f6f2 100%);
  color: var(--text);
}

button {
  font: inherit;
  border: none;
  cursor: pointer;
}

img,
svg {
  display: block;
  max-width: 100%;
}

.page-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 64px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 0 30px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), #2f8d57);
  color: #fff;
  font-weight: 800;
  box-shadow: var(--shadow);
}

.brand h1,
.catalog-header h3,
.hero-copy h2,
.modal-body h4,
.drawer-header h3 {
  margin: 0;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 0.72rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--muted);
}

.eyebrow.accent {
  color: var(--primary);
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.cart-trigger,
.filter-chip,
.mini-btn,
.checkout-btn {
  border-radius: 999px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.primary-btn,
.checkout-btn {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 12px 24px rgba(28, 95, 61, 0.16);
}

.primary-btn:hover,
.secondary-btn:hover,
.ghost-btn:hover,
.cart-trigger:hover,
.filter-chip:hover,
.mini-btn:hover,
.checkout-btn:hover {
  transform: translateY(-1px);
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.cart-trigger,
.checkout-btn {
  padding: 0.82rem 1.2rem;
  font-weight: 600;
}

.secondary-btn,
.ghost-btn,
.cart-trigger {
  background: rgba(255, 255, 255, 0.72);
  color: var(--text);
  border: 1px solid var(--line);
}

.ghost-btn {
  background: transparent;
  color: var(--primary);
}

.cart-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.cart-badge {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: center;
  padding: 24px 0 18px;
}

.hero-copy {
  padding: 22px 10px 22px 0;
}

.hero-copy h2 {
  font-size: clamp(2.6rem, 5vw, 4.3rem);
  line-height: 0.94;
  letter-spacing: -0.06em;
  margin-bottom: 18px;
}

.hero-copy p:not(.eyebrow) {
  max-width: 560px;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-visual {
  position: relative;
  min-height: 420px;
  border-radius: 38px;
  background: linear-gradient(145deg, #e5f1df, #dfe9d7);
  border: 1px solid rgba(30, 61, 40, 0.06);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.hero-visual::before {
  content: '';
  position: absolute;
  inset: 18px;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.08));
}

.display-card {
  position: absolute;
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(35, 82, 52, 0.18), rgba(92, 150, 78, 0.24));
  box-shadow: inset 0 0 0 1px rgba(33, 56, 38, 0.08);
}

.low-water-image {
  position: absolute;
  right: 58px;
  top: 62px;
  width: 240px;
  height: 270px;
  object-fit: cover;
  border-radius: 32px;
  box-shadow: 0 28px 44px rgba(27, 35, 28, 0.18);
  transform: rotate(9deg);
  z-index: 1;
}

.card-one {
  width: 240px;
  height: 240px;
  bottom: 40px;
  left: 54px;
  transform: rotate(-12deg);
}

.card-two {
  width: 210px;
  height: 210px;
  top: 80px;
  right: 52px;
  transform: rotate(16deg);
}

.feature-badge {
  position: absolute;
  right: 36px;
  bottom: 36px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(20, 34, 26, 0.08);
  border-radius: 18px;
  padding: 12px 16px;
  display: grid;
  gap: 4px;
  box-shadow: var(--shadow);
}

.feature-badge span {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.feature-badge strong {
  font-size: 0.96rem;
}

.catalog {
  margin-top: 30px;
  padding-top: 14px;
}

.catalog-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.catalog-header h3 {
  font-size: clamp(1.6rem, 2vw, 2.2rem);
  letter-spacing: -0.05em;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.filter-chip {
  padding: 0.58rem 0.95rem;
  background: rgba(255, 255, 255, 0.72);
  color: var(--muted);
  border: 1px solid rgba(30, 35, 30, 0.08);
  font-weight: 600;
}

.filter-chip.active {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: transparent;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(30, 35, 30, 0.08);
  box-shadow: 0 10px 26px rgba(37, 46, 36, 0.06);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 32px rgba(20, 20, 20, 0.08);
}

.product-thumb {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(246, 248, 245, 0.8));
  padding: 0;
  overflow: hidden;
}

.product-image,
.modal-product-image,
.cart-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-image {
  transition: transform 0.25s ease;
}

.product-card:hover .product-image {
  transform: scale(1.04);
}

.product-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 18px 18px 16px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.product-category {
  padding: 0.38rem 0.6rem;
  border-radius: 999px;
  background: rgba(28, 95, 61, 0.08);
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
}

.product-body h4 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: -0.04em;
}

.product-body p {
  margin: 10px 0 18px;
  color: var(--muted);
  line-height: 1.6;
  min-height: 52px;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.mini-btn {
  background: var(--primary-soft);
  color: var(--primary);
  padding: 0.7rem 0.95rem;
  font-weight: 700;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 100%);
  height: 100vh;
  background: rgba(249, 247, 243, 0.98);
  backdrop-filter: blur(12px);
  border-left: 1px solid var(--line);
  box-shadow: -18px 0 36px rgba(19, 21, 19, 0.14);
  transform: translateX(102%);
  transition: transform 0.28s ease;
  z-index: 40;
  display: flex;
  flex-direction: column;
}

.cart-drawer.open {
  transform: translateX(0);
}

.drawer-header,
.drawer-footer {
  padding: 22px 22px 18px;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
}

.close-btn {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  color: var(--text);
  font-size: 1.5rem;
}

.cart-list {
  flex: 1;
  overflow: auto;
  padding: 18px 22px;
  display: grid;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(30, 35, 30, 0.06);
}

.cart-item-thumb {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(38, 82, 62, 0.08);
  overflow: hidden;
}

.cart-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-weight: 700;
}

.cart-item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 0.86rem;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 7px;
  border-radius: 999px;
  background: rgba(28, 95, 61, 0.08);
  color: var(--primary);
  font-weight: 700;
}

.qty-control button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  color: var(--primary);
  font-size: 1.1rem;
}

.cart-empty {
  padding: 18px 10px;
  color: var(--muted);
  text-align: center;
  border: 1px dashed rgba(30, 35, 30, 0.14);
  border-radius: 16px;
}

.drawer-footer {
  border-top: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.5);
}

.totals {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--muted);
}

.totals strong {
  color: var(--text);
  font-size: 1.22rem;
}

.cart-summary-meta {
  margin-bottom: 14px;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.92rem;
}

.checkout-btn {
  width: 100%;
  font-size: 1rem;
}

.modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.22s ease, visibility 0.22s ease;
  z-index: 60;
}

.modal.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(19, 23, 18, 0.55);
  border: none;
  padding: 0;
}

.modal-card {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  width: min(820px, calc(100% - 32px));
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(25, 28, 23, 0.08);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 28px 70px rgba(18, 22, 18, 0.2);
}

.modal-media {
  display: grid;
  place-items: center;
  min-height: 420px;
  background: linear-gradient(135deg, rgba(226, 243, 228, 0.9), rgba(239, 245, 220, 0.7));
  overflow: hidden;
}

.modal-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 30px 30px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-body h4 {
  font-size: clamp(2rem, 2vw, 2.5rem);
  letter-spacing: -0.06em;
  margin-bottom: 16px;
}

.modal-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.modal-price-row strong {
  font-size: 1.66rem;
  letter-spacing: -0.05em;
}

.modal-price-row span {
  color: var(--muted);
  font-weight: 600;
}

.modal-body p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
  font-size: 1.02rem;
}

.modal-actions {
  margin-top: 24px;
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%) translateY(12px);
  background: rgba(20, 23, 18, 0.94);
  color: #fff;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
  z-index: 80;
  font-weight: 600;
}

.toast.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    justify-content: flex-start;
  }

  .filter-group {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .page-shell {
    width: min(100% - 18px, 1180px);
  }

  .topbar {
    flex-wrap: wrap;
  }

  .top-actions {
    width: 100%;
    justify-content: space-between;
  }

  .product-grid,
  .modal-card {
    grid-template-columns: 1fr;
  }

  .modal-media {
    min-height: 280px;
  }

  .hero-copy {
    padding-right: 0;
  }
}
