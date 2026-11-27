// MembershipPlans.jsx — Display gym membership tiers, pricing, and active subscriber stats
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { membershipPlans } from '../../data/staticData';
import { useAuth } from '../../context/AuthContext';

export function MembershipPlans() {
  const { members = [] } = useAuth();

  // Count active subscribers per tier
  const subscriberCounts = useMemo(() => {
    return members.reduce((acc, m) => {
      const planName = m.plan || 'Basic';
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {});
  }, [members]);

  return (
    <div>
      <div className="page-header">
        <h2>💳 Membership Plans</h2>
        <p>Review membership tiers, pricing structures, and active member enrollment</p>
      </div>

      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {membershipPlans.map((plan) => {
          const isPopular = Boolean(plan.popular);
          const memberCount = subscriberCounts[plan.name] || 0;

          return (
            <div
              key={plan.id || plan.name}
              className={`plan-card ${isPopular ? 'popular' : ''}`}
            >
              {isPopular && <div className="popular-badge">POPULAR</div>}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{plan.name}</h3>

              <div className="plan-price">
                {plan.price}
                <span>/month</span>
              </div>

              <div
                style={{
                  margin: '12px 0 16px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isPopular ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                👥 {memberCount} Active Member{memberCount === 1 ? '' : 's'}
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              <Link
                to="/admin/members"
                className={`btn ${isPopular ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', display: 'inline-block', textAlign: 'center', marginTop: '10px' }}
              >
                Manage {plan.name} Members
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MembershipPlans;
