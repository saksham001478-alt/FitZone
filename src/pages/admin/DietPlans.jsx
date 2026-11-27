// DietPlans.jsx — Nutrition and meal plan catalogue and detailed meal breakdown
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { dietPlans } from '../../data/staticData';

const mealIcons = {
  breakfast: '🌅',
  lunch: '☀️',
  snacks: '🍎',
  dinner: '🌙',
};

export function DietPlans() {
  const { type } = useParams();

  // If a specific diet type is in the URL (/admin/diet/:type), render the detailed breakdown
  if (type) {
    const plan = dietPlans[type];
    if (!plan) {
      return <Navigate to="/admin/diet" replace />;
    }

    return (
      <div className="diet-detail">
        <Link to="/admin/diet" className="back-link">
          ← Back to Diet Plans
        </Link>

        {/* Plan Header Card */}
        <div className="card" style={{ marginBottom: '20px', textAlign: 'center', padding: '32px 24px' }}>
          <span style={{ fontSize: '3.2rem', display: 'inline-block', marginBottom: '8px' }}>
            {plan.icon}
          </span>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{plan.title}</h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              margin: '8px auto 16px',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            {plan.description}
          </p>
          <span className="badge badge-standard" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
            ⚡ Daily Target: {plan.calories}
          </span>
        </div>

        {/* Meal Breakdown Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(plan.meals || {}).map(([meal, items]) => {
            const icon = mealIcons[meal] || '🍽️';
            const label = meal.charAt(0).toUpperCase() + meal.slice(1);

            return (
              <div key={meal} className="meal-section card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span>{icon}</span> {label}
                </h3>
                <ul className="meal-list">
                  {items.map((item, index) => (
                    <li key={index}>🍽️ {item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Catalog View (/admin/diet)
  return (
    <div>
      <div className="page-header">
        <h2>🥗 Diet Plans</h2>
        <p>Curated nutrition and dietary regimens tailored for gym members' fitness goals</p>
      </div>

      <div className="diet-grid">
        {Object.entries(dietPlans).map(([key, plan]) => (
          <Link
            to={`/admin/diet/${key}`}
            key={key}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="diet-card card">
              <div className="diet-icon">{plan.icon}</div>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div style={{ marginTop: '14px' }}>
                <span className="badge badge-standard">{plan.calories}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DietPlans;
