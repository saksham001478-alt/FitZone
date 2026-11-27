// ManageShop.jsx — Admin product catalogue management and customer order overview
import React, { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { shopProducts as defaultShopProducts } from '../../data/staticData';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FormInput } from '../../components/FormInput';
import { Modal } from '../../components/Modal';

export function ManageShop() {
  const location = useLocation();
  const { members = [] } = useAuth();
  const { showToast } = useNotification();

  // Tab switching between products catalogue and orders
  const [activeTab, setActiveTab] = useState(() =>
    location.pathname.includes('/orders') ? 'orders' : 'products'
  );

  // Custom products created by admin stored in localStorage
  const [customProducts, setCustomProducts] = useLocalStorage('customProducts', []);
  const [orders] = useLocalStorage('orders', []);

  // Modal state for adding a product
  const [showAddModal, setShowAddModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Supplements',
    price: '',
    icon: '📦',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Merge static catalogue and custom admin additions
  const allProducts = useMemo(() => {
    return [
      ...defaultShopProducts.map((p) => ({ ...p, isCustom: false })),
      ...customProducts.map((p) => ({ ...p, isCustom: true })),
    ];
  }, [customProducts]);

  // Handle form change for add product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Add new custom product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const errors = {};
    if (!productForm.name.trim()) errors.name = 'Product name is required';
    if (!productForm.price || Number(productForm.price) <= 0) {
      errors.price = 'Please enter a valid price in ₹';
    }
    if (!productForm.description.trim()) {
      errors.description = 'Description is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newProduct = {
      id: `custom-${Date.now()}`,
      name: productForm.name.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      icon: productForm.icon.trim() || '🛍️',
      description: productForm.description.trim(),
      isCustom: true,
    };

    setCustomProducts((prev) => [...prev, newProduct]);
    showToast(`Product "${newProduct.name}" added to shop!`, 'success');

    // Reset & close
    setProductForm({
      name: '',
      category: 'Supplements',
      price: '',
      icon: '📦',
      description: '',
    });
    setFormErrors({});
    setShowAddModal(false);
  };

  // Delete custom product
  const handleDeleteProduct = useCallback(
    (id, name) => {
      if (window.confirm(`Are you sure you want to delete "${name}" from the shop?`)) {
        setCustomProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`Product "${name}" deleted.`, 'info');
      }
    },
    [setCustomProducts, showToast]
  );

  // Helper to resolve customer name from order
  const getCustomerName = (order) => {
    if (order.customerName) return order.customerName;
    if (order.userName) return order.userName;
    if (order.userId) {
      const found = members.find((m) => String(m.id) === String(order.userId));
      if (found) return found.name;
    }
    return 'Customer';
  };

  return (
    <div>
      <div className="page-header">
        <h2>🛍️ Shop & Orders Management</h2>
        <p>Manage store merchandise catalogue and view customer purchase transactions</p>
      </div>

      {/* Tabs for switching between Products and Orders */}
      <div className="fitness-tabs" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`fitness-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Store Products ({allProducts.length})
        </button>
        <button
          type="button"
          className={`fitness-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Customer Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        /* Products Catalogue Tab */
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <h3>Merchandise Catalogue</h3>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add Product
            </button>
          </div>

          <div className="shop-grid">
            {allProducts.map((product) => (
              <div key={product.id} className="shop-card card">
                <span className="badge badge-standard shop-category">
                  {product.category}
                </span>
                <div className="shop-card-icon">{product.icon || '🛍️'}</div>
                <h3>{product.name}</h3>
                <p className="shop-description">{product.description}</p>
                <div className="shop-price">₹{Number(product.price).toLocaleString()}</div>

                {product.isCustom ? (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ marginTop: 'auto' }}
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                  >
                    🗑️ Delete Custom Item
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginTop: 'auto',
                    }}
                  >
                    Standard Inventory
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Orders List Tab */
        <div>
          <h3 style={{ marginBottom: '16px' }}>Order Records ({orders.length})</h3>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No customer orders placed yet. Orders will appear here once customers checkout.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders
                .slice()
                .reverse()
                .map((order) => {
                  const customer = getCustomerName(order);
                  const orderDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : order.date || 'Recent';

                  return (
                    <div key={order.orderId || order.id} className="order-item">
                      <div className="order-header">
                        <div>
                          <span className="order-id">{order.orderId || order.id}</span>
                          <div className="order-date">
                            📅 {orderDate} • Customer: <strong>{customer}</strong>
                          </div>
                        </div>
                        <span className="order-status">{order.status || 'Confirmed'}</span>
                      </div>

                      {/* Items Purchased */}
                      <div style={{ margin: '10px 0', fontSize: '0.9rem' }}>
                        <strong>Items:</strong>{' '}
                        {order.items && order.items.length > 0
                          ? order.items
                              .map(
                                (item) =>
                                  `${item.product?.name || item.name} (x${
                                    item.quantity || 1
                                  })`
                              )
                              .join(', ')
                          : 'Items not specified'}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border)',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          Total Amount Paid
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: 'var(--accent)',
                            fontSize: '1.15rem',
                          }}
                        >
                          ₹{Number(order.total || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Add New Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Shop Product"
      >
        <form onSubmit={handleAddProduct}>
          <FormInput
            label="Product Name"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            error={formErrors.name}
            placeholder="e.g. Whey Isolate 1kg"
            required
          />

          <div className="form-row">
            <FormInput
              label="Category"
              name="category"
              type="select"
              value={productForm.category}
              onChange={handleInputChange}
              options={[
                { value: 'Supplements', label: 'Supplements' },
                { value: 'Accessories', label: 'Accessories' },
                { value: 'Equipment', label: 'Equipment' },
                { value: 'Apparel', label: 'Apparel' },
              ]}
              required
            />
            <FormInput
              label="Price (₹)"
              name="price"
              type="number"
              min="1"
              value={productForm.price}
              onChange={handleInputChange}
              error={formErrors.price}
              placeholder="e.g. 1999"
              required
            />
          </div>

          <FormInput
            label="Icon / Emoji"
            name="icon"
            type="text"
            value={productForm.icon}
            onChange={handleInputChange}
            placeholder="e.g. 🥛, ⚡, 🧤, 🏋️, 🧘"
          />

          <FormInput
            label="Description"
            name="description"
            type="textarea"
            rows={3}
            value={productForm.description}
            onChange={handleInputChange}
            error={formErrors.description}
            placeholder="Brief description of the product benefits and specifications"
            required
          />

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManageShop;
