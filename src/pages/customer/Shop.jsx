// Shop.jsx — Product browsing and shopping catalog for gym members
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { shopProducts } from '../../data/staticData';
import useCartStore from '../../store/cartStore';

const defaultShopProducts = [
  {
    id: 'prod-1',
    name: 'Whey Protein Isolate 1kg',
    category: 'Supplements',
    price: 49.99,
    description: 'Ultra-pure microfiltered whey protein isolate for fast muscle recovery.',
    icon: '🥛'
  },
  {
    id: 'prod-2',
    name: 'Creatine Monohydrate 300g',
    category: 'Supplements',
    price: 24.99,
    description: 'Micronized creatine powder to enhance strength and explosive power.',
    icon: '⚡'
  },
  {
    id: 'prod-3',
    name: 'Pre-Workout Energy Booster',
    category: 'Supplements',
    price: 34.99,
    description: 'High-energy pre-workout blend with beta-alanine, caffeine & citrulline.',
    icon: '🔥'
  },
  {
    id: 'prod-4',
    name: 'Adjustable Dumbbell Set (20kg)',
    category: 'Equipment',
    price: 119.99,
    description: 'Space-saving compact dumbbells with quick-change weight selector.',
    icon: '🏋️'
  },
  {
    id: 'prod-5',
    name: 'Heavy-Duty Resistance Bands',
    category: 'Equipment',
    price: 19.99,
    description: 'Set of 5 color-coded natural latex resistance loop bands with bag.',
    icon: '➰'
  },
  {
    id: 'prod-6',
    name: 'Foam Roller for Muscle Relief',
    category: 'Equipment',
    price: 22.99,
    description: 'High-density deep tissue foam roller for recovery and physical therapy.',
    icon: '🪵'
  },
  {
    id: 'prod-7',
    name: 'FitZone Pro Shaker Bottle (700ml)',
    category: 'Accessories',
    price: 12.99,
    description: 'BPA-free leakproof protein shaker bottle with stainless mixing whisk.',
    icon: '🥤'
  },
  {
    id: 'prod-8',
    name: 'Padded Gym Lifting Straps',
    category: 'Accessories',
    price: 14.99,
    description: 'Heavy-duty cotton wrist straps with neoprene padding for heavy deadlifts.',
    icon: '🥊'
  },
  {
    id: 'prod-9',
    name: 'Microfiber Gym Towel (2-Pack)',
    category: 'Accessories',
    price: 15.99,
    description: 'Fast-drying, super-absorbent antibacterial gym workout towels.',
    icon: '🧴'
  }
];

const categories = ['All', 'Supplements', 'Equipment', 'Accessories'];

export default function Shop() {
  const { showToast } = useNotification();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items) || [];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize product list from staticData or default array
  const allProducts = useMemo(() => {
    if (Array.isArray(shopProducts) && shopProducts.length > 0) {
      return shopProducts;
    }
    return defaultShopProducts;
  }, []);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchCategory =
        activeCategory === 'All' ||
        product.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [allProducts, activeCategory, searchTerm]);

  const handleAddToCart = (product) => {
    if (addItem) {
      addItem(product);
    }
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const formatPrice = (price) => {
    const num = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  return (
    <div>
      {/* Header and Cart Quick-Link */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h2>FitZone Pro Shop</h2>
          <p>Premium gym supplements, high-performance equipment, and workout gear.</p>
        </div>

        <Link to="/app/shop/cart" className="btn btn-primary" style={{ position: 'relative' }}>
          🛒 Cart {totalCartCount > 0 && `(${totalCartCount})`}
        </Link>
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-bar" style={{ width: '280px' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">🛍️</div>
          <p>No products found matching your search criteria.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveCategory('All');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className="shop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id || product.name}
              className="card shop-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div
                  className="shop-card-icon"
                  style={{
                    fontSize: '3.2rem',
                    textAlign: 'center',
                    padding: '16px 0',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '14px'
                  }}
                >
                  {product.icon || '📦'}
                </div>

                <div className="shop-card-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="shop-category badge badge-standard">
                      {product.category || 'General'}
                    </span>
                    <strong className="shop-price" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>
                      {formatPrice(product.price)}
                    </strong>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0' }}>
                    {product.name}
                  </h3>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      marginBottom: '16px'
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => handleAddToCart(product)}
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
