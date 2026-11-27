// AdminDashboard.jsx — Admin overview dashboard with key metrics, revenue estimate, and activity
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/StatCard';
import { membershipPlans } from '../../data/staticData';

export function AdminDashboard() {
  const { members = [], user } = useAuth();

  // Compute key gym stats
  const stats = useMemo(() => {
    const total = members.length;
    const planCounts = members.reduce((acc, m) => {
      const plan = m.plan || 'Basic';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    // Present today from localStorage attendance
    const today = new Date().toISOString().split('T')[0];
    let presentToday = 0;
    try {
      const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
      const todayRecords = attendance[today] || {};
      presentToday = Object.values(todayRecords).filter((v) => v === 'present').length;
    } catch (e) {
      console.error('Error reading attendance for dashboard:', e);
    }

    // Total shop orders from localStorage
    let totalOrders = 0;
    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      totalOrders = Array.isArray(orders) ? orders.length : 0;
    } catch (e) {
      console.error('Error reading orders for dashboard:', e);
    }

    // Revenue estimate: total members * average plan price
    const avgPlanPrice =
      membershipPlans && membershipPlans.length > 0
        ? membershipPlans.reduce((sum, p) => sum + (p.numericPrice || 1999), 0) /
          membershipPlans.length
        : 1999;
    const estimatedRevenue = Math.round(total * avgPlanPrice);

    return {
      total,
      planCounts,
      presentToday,
      totalOrders,
      estimatedRevenue,
    };
  }, [members]);

  // 5 most recent members sorted by joinDate descending
  const recentMembers = useMemo(() => {
    return [...members]
      .sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0))
      .slice(0, 5);
  }, [members]);

  return (
    <div className="dashboard">
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name || 'Admin'} 💪</h1>
        <p>
          Manage your gym efficiently. Track members, attendance, plans, fitness progress, and store orders in one central hub.
        </p>
      </div>

      {/* Primary Key Metrics */}
      <div className="stats-grid">
        <StatCard
          icon="👥"
          label="Total Members"
          value={stats.total}
          color="#0d9488"
        />
        <StatCard
          icon="💳"
          label="Active Plans"
          value={Object.keys(stats.planCounts).length}
          color="#8b5cf6"
        />
        <StatCard
          icon="✅"
          label="Present Today"
          value={stats.presentToday}
          color="#10b981"
        />
        <StatCard
          icon="🔥"
          label="Premium Members"
          value={stats.planCounts['Premium'] || 0}
          color="#f43f5e"
        />
        <StatCard
          icon="📦"
          label="Shop Orders"
          value={stats.totalOrders}
          color="#f59e0b"
        />
        <StatCard
          icon="💰"
          label="Est. Monthly Revenue"
          value={`₹${stats.estimatedRevenue.toLocaleString()}`}
          color="#3b82f6"
        />
      </div>

      {/* Membership Breakdown */}
      <div className="section-title">
        <h2>📋 Membership Summary</h2>
      </div>
      <div className="stats-grid">
        {['Basic', 'Standard', 'Premium'].map((plan) => {
          const color =
            plan === 'Basic'
              ? '#f59e0b'
              : plan === 'Standard'
              ? '#0d9488'
              : '#8b5cf6';
          return (
            <div key={plan} className="card" style={{ textAlign: 'center' }}>
              <h4>{plan} Tier</h4>
              <p
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color,
                  margin: '8px 0 4px',
                }}
              >
                {stats.planCounts[plan] || 0}
              </p>
              <small style={{ color: 'var(--text-secondary)' }}>Active Subscribers</small>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Navigation */}
      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🕒 Recent Activity</h2>
        <Link to="/admin/members" className="btn btn-secondary btn-sm">
          View All Members →
        </Link>
      </div>
      <div className="card">
        {recentMembers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No members registered yet. Add your first member to get started!</p>
          </div>
        ) : (
          recentMembers.map((m) => (
            <div key={m.id} className="activity-item">
              <div className="activity-dot"></div>
              <div style={{ flex: 1 }}>
                <strong>{m.name}</strong> joined with{' '}
                <span className={`badge badge-${(m.plan || 'basic').toLowerCase()}`}>
                  {m.plan || 'Basic'}
                </span>{' '}
                plan
                <br />
                <small style={{ color: 'var(--text-secondary)' }}>
                  Joined on: {m.joinDate || 'N/A'} • {m.email}
                </small>
              </div>
              <Link to={`/admin/members/${m.id}`} className="btn btn-secondary btn-sm">
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
