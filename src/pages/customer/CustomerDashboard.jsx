// CustomerDashboard.jsx — Personalized customer dashboard overview
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { StatCard } from '../../components/StatCard';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [attendance] = useLocalStorage('attendance', {});
  const [fitnessData] = useLocalStorage('fitnessData', {});

  // Calculate consecutive attendance streak
  const streak = useMemo(() => {
    if (!attendance || !user?.id) return 0;

    const today = new Date();
    const formatDate = (d) => d.toISOString().slice(0, 10);

    const isPresent = (dateStr) => {
      const dayList = attendance[dateStr];
      return Array.isArray(dayList) && dayList.includes(user.id);
    };

    let count = 0;
    const checkDate = new Date(today);

    // If today is not marked present yet, start checking from yesterday
    const todayStr = formatDate(checkDate);
    if (!isPresent(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days backward
    while (true) {
      const dateStr = formatDate(checkDate);
      if (isPresent(dateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  }, [attendance, user?.id]);

  // Retrieve user's fitness records and latest BMI
  const userFitnessRecords = useMemo(() => {
    if (!fitnessData || !user?.id) return [];
    const list = fitnessData[user.id];
    if (!Array.isArray(list)) return [];
    // Sort newest first
    return [...list].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [fitnessData, user?.id]);

  const latestBmi = useMemo(() => {
    if (userFitnessRecords.length === 0) return 'N/A';
    const latest = userFitnessRecords[0];
    if (latest.bmi) return Number(latest.bmi).toFixed(1);
    if (latest.weight && latest.height) {
      const hInMeters = Number(latest.height) / 100;
      return (Number(latest.weight) / (hInMeters * hInMeters)).toFixed(1);
    }
    return 'N/A';
  }, [userFitnessRecords]);

  const recentRecords = userFitnessRecords.slice(0, 3);

  const getBmiBadgeClass = (bmiVal) => {
    const val = parseFloat(bmiVal);
    if (isNaN(val)) return 'badge';
    if (val < 18.5) return 'badge badge-basic';
    if (val <= 24.9) return 'badge badge-standard';
    return 'badge badge-premium';
  };

  return (
    <div className="customer-dashboard">
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name || 'Member'}! 💪</h1>
        <p>
          Track your fitness progress, view diet guidelines, check attendance, and shop gym essentials.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon="💳"
          title="My Plan"
          value={user?.plan || 'Basic'}
          subtitle="Active Membership"
        />
        <StatCard
          icon="🔥"
          title="Attendance Streak"
          value={`${streak} ${streak === 1 ? 'Day' : 'Days'}`}
          subtitle="Consecutive gym days"
        />
        <StatCard
          icon="⚖️"
          title="My BMI"
          value={latestBmi}
          subtitle={latestBmi !== 'N/A' ? 'Latest assessment' : 'No records yet'}
        />
        <StatCard
          icon="📅"
          title="Member Since"
          value={user?.joinDate || 'Recently'}
          subtitle={user?.goal ? user.goal.replace('-', ' ') : 'General Fitness'}
        />
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '28px' }}>
        <div className="section-title">
          <h2>Quick Actions</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          <Link
            to="/app/diet"
            className="card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: '3px solid var(--accent)'
            }}
          >
            <div style={{ fontSize: '2rem' }}>🥗</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Diet & Nutrition Plans</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Explore curated meals for weight loss, muscle gain, and maintenance.
            </p>
            <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
              View Plans →
            </span>
          </Link>

          <Link
            to="/app/fitness"
            className="card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: '3px solid var(--gold)'
            }}
          >
            <div style={{ fontSize: '2rem' }}>📈</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Fitness & BMI Tracker</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Log weight & height, monitor BMI trends, and track your health goals.
            </p>
            <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
              Track Progress →
            </span>
          </Link>

          <Link
            to="/app/shop"
            className="card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: '3px solid var(--purple)'
            }}
          >
            <div style={{ fontSize: '2rem' }}>🛍️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>FitZone Pro Shop</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Discover supplements, workout accessories, and gym apparel.
            </p>
            <span style={{ color: 'var(--purple)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
              Browse Shop →
            </span>
          </Link>
        </div>
      </div>

      {/* My Recent Fitness */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <div className="section-title" style={{ margin: 0 }}>
            <h2>My Recent Fitness Records</h2>
          </div>
          <Link to="/app/fitness" className="btn btn-secondary btn-sm">
            + New Log
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>You haven't logged any fitness records yet.</p>
            <Link to="/app/fitness" className="btn btn-primary btn-sm">
              Log Your First Entry
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentRecords.map((record) => {
              const bmiNum = record.bmi
                ? Number(record.bmi).toFixed(1)
                : record.weight && record.height
                ? (Number(record.weight) / ((Number(record.height) / 100) ** 2)).toFixed(1)
                : 'N/A';

              return (
                <div
                  key={record.id || `${record.date}-${record.weight}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>
                      {record.date || 'Undated'}
                    </strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Weight: {record.weight} kg • Height: {record.height} cm
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      BMI: {bmiNum}
                    </span>
                    <span className={getBmiBadgeClass(bmiNum)}>
                      {record.category || (bmiNum < 18.5 ? 'Underweight' : bmiNum <= 24.9 ? 'Normal' : 'Overweight')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
