// StatCard.jsx — Reusable metric card displaying icon, value, and label
import React from 'react';

/**
 * StatCard component displaying a key metric with an icon and custom accent color
 */
export function StatCard({ icon, label, value, color }) {
  const iconStyle = color
    ? { backgroundColor: `${color}18`, color }
    : undefined;

  return (
    <div className="stat-card card">
      <div className="stat-icon" style={iconStyle}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
