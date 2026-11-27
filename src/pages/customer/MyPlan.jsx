// MyPlan.jsx — Customer membership plan details and upgrade options
import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { membershipPlans } from '../../data/staticData';

const defaultPlans = [
  {
    name: 'Basic',
    price: '$15/mo',
    description: 'Essential gym access for fitness starters.',
    features: [
      'Access to standard gym equipment',
      'Locker room & shower access',
      '1 group class per week',
      'Free mobile app tracker'
    ]
  },
  {
    name: 'Standard',
    price: '$30/mo',
    description: 'The most popular choice for committed gym-goers.',
    features: [
      'All Basic plan features',
      'Unlimited group fitness classes',
      'Steam & sauna access',
      'Quarterly fitness assessment',
      'Guest passes (1 per month)'
    ],
    popular: true
  },
  {
    name: 'Premium',
    price: '$55/mo',
    description: 'All-inclusive premium tier with personal training.',
    features: [
      'All Standard plan features',
      '1 Personal training session / mo',
      'Customized diet consultation',
      'Towel service & VIP lounge access',
      'Priority booking for classes'
    ]
  }
];

export default function MyPlan() {
  const { user } = useAuth();
  const { showToast } = useNotification();

  // Normalize plans from staticData or use defaults
  const plans = useMemo(() => {
    if (Array.isArray(membershipPlans) && membershipPlans.length > 0) {
      return membershipPlans;
    }
    return defaultPlans;
  }, []);

  const currentPlanName = (user?.plan || 'Basic').toLowerCase();

  const getPlanTierIndex = (name) => {
    const n = (name || '').toLowerCase();
    if (n.includes('basic')) return 0;
    if (n.includes('standard')) return 1;
    if (n.includes('premium')) return 2;
    return 0;
  };

  const currentTierIndex = getPlanTierIndex(currentPlanName);

  const handlePlanAction = () => {
    showToast('Contact admin to change plan', 'info');
  };

  return (
    <div>
      <div className="page-header">
        <h2>My Membership Plan</h2>
        <p>Review your active subscription benefits or explore upgrade tiers.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {plans.map((plan) => {
          const planName = plan.name || plan.title || 'Plan';
          const isCurrent = planName.toLowerCase() === currentPlanName;
          const planTierIndex = getPlanTierIndex(planName);
          const isUpgrade = planTierIndex > currentTierIndex;
          const featuresList = plan.features || plan.perks || [];

          return (
            <div
              key={planName}
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: isCurrent ? '2px solid var(--accent)' : undefined,
                boxShadow: isCurrent ? 'var(--shadow-lg)' : undefined
              }}
            >
              {plan.popular && <span className="popular-badge">POPULAR</span>}

              {isCurrent && (
                <div style={{ marginBottom: '10px' }}>
                  <span
                    className="badge badge-standard"
                    style={{ fontSize: '0.85rem', padding: '4px 12px' }}
                  >
                    ★ Your Plan
                  </span>
                </div>
              )}

              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0' }}>
                {planName}
              </h3>

              {plan.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 12px' }}>
                  {plan.description}
                </p>
              )}

              <div className="plan-price">
                {plan.price}
              </div>

              <ul className="plan-features" style={{ flex: 1 }}>
                {featuresList.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                {isCurrent ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled
                    style={{ width: '100%', opacity: 0.8, cursor: 'default' }}
                  >
                    ✓ Active Membership
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn ${isUpgrade ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%' }}
                    onClick={handlePlanAction}
                  >
                    {isUpgrade ? 'Upgrade to ' + planName : 'Downgrade to ' + planName}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
