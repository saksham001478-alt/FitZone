// Cart.jsx — Shopping cart management, quantity adjustment, and order checkout
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import useCartStore from '../../store/cartStore';

export default function Cart() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [orders, setOrders] = useLocalStorage('orders', []);

  // Retrieve cart methods from Zustand store
  const items = useCartStore((state) => state.items) || [];
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateQty = useCartStore((state) => state.updateQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const getNumericPrice = (p) => {
    if (typeof p === 'number') return p;
    const parsed = parseFloat(String(p).replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const getProduct = (item) => item?.product || item || {};

  const handleQtyChange = (item, delta) => {
    const product = getProduct(item);
    const prodId = product.id ?? item.id;
    const currentQty = item.quantity || 1;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      if (removeItem) removeItem(prodId);
      showToast(`Removed ${product.name || 'item'} from cart`, 'info');
    } else {
      if (updateQuantity) {
        updateQuantity(prodId, newQty);
      } else if (updateQty) {
        updateQty(prodId, newQty);
      }
    }
  };

  const handleRemoveItem = (item) => {
    const product = getProduct(item);
    const prodId = product.id ?? item.id;
    if (removeItem) {
      removeItem(prodId);
    }
    showToast(`Removed ${product.name || 'item'} from cart`, 'info');
  };

  const handleClearCart = () => {
    if (clearCart) {
      clearCart();
    }
    showToast('Cart cleared', 'info');
  };

  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item);
    const price = product.price ?? item.price;
    return sum + getNumericPrice(price) * (item.quantity || 1);
  }, 0);
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    if (items.length === 0) return;

    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      items: items.map((i) => {
        const product = getProduct(i);
        const price = getNumericPrice(product.price ?? i.price);
        const qty = i.quantity || 1;
        return {
          id: product.id ?? i.id,
          name: product.name ?? i.name,
          price: price,
          quantity: qty,
          lineTotal: price * qty
        };
      }),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(grandTotal.toFixed(2)),
      status: 'Completed'
    };

    setOrders((prev) => [newOrder, ...(Array.isArray(prev) ? prev : [])]);

    if (clearCart) {
      clearCart();
    }

    showToast('Order placed successfully! Thank you for your purchase.', 'success');
    navigate('/app/shop');
  };

  return (
    <div>
      <Link to="/app/shop" className="back-link">
        ← Back to Shop
      </Link>

      <div className="page-header" style={{ marginTop: '10px' }}>
        <h2>Shopping Cart</h2>
        <p>Review items, adjust quantities, and proceed to checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="card empty-state" style={{ padding: '60px 20px' }}>
          <div className="empty-icon" style={{ fontSize: '3.5rem' }}>
            🛒
          </div>
          <h3 style={{ fontSize: '1.3rem', margin: '12px 0 6px' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px' }}>
            Explore our shop to find supplements, workout accessories, and fitness equipment.
          </p>
          <Link to="/app/shop" className="btn btn-primary">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* Cart Items List */}
          <div className="card" style={{ flex: 2 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                Items in Cart ({items.reduce((acc, i) => acc + (i.quantity || 1), 0)})
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>

            <div className="cart-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map((item, idx) => {
                const product = getProduct(item);
                const priceNum = getNumericPrice(product.price ?? item.price);
                const qty = item.quantity || 1;
                const lineTotal = (priceNum * qty).toFixed(2);
                const prodId = product.id ?? item.id ?? idx;
                const prodName = product.name ?? item.name ?? 'Product';
                const prodIcon = product.icon ?? item.icon ?? '📦';

                return (
                  <div
                    key={prodId}
                    className="cart-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '180px' }}>
                      <div
                        style={{
                          fontSize: '2rem',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {prodIcon}
                      </div>
                      <div className="cart-item-info">
                        <strong style={{ display: 'block', fontSize: '0.98rem' }}>{prodName}</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          ${priceNum.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                      {/* Quantity Controls */}
                      <div
                        className="cart-qty"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'var(--bg-card)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <button
                          type="button"
                          className="btn-sm"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 700,
                            padding: '2px 8px'
                          }}
                          onClick={() => handleQtyChange(item, -1)}
                        >
                          −
                        </button>
                        <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="btn-sm"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 700,
                            padding: '2px 8px'
                          }}
                          onClick={() => handleQtyChange(item, 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <strong className="cart-total" style={{ minWidth: '70px', textAlign: 'right', fontSize: '1.05rem', color: 'var(--accent)' }}>
                        ${lineTotal}
                      </strong>

                      {/* Remove Button */}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(item)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="card cart-summary" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (18% GST)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '2px solid var(--border)',
                  fontSize: '1.15rem',
                  fontWeight: 800
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: 'var(--accent)' }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                textAlign: 'center',
                marginTop: '12px'
              }}
            >
              🔒 Fast & Secure Gym Checkout (Demo Payment)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
