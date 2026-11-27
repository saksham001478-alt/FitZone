// ProgressChart.jsx — Nested route component rendering visual BMI & weight progression bars for members
import React, { useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProgressChart() {
  const outletCtx = useOutletContext() || {};
  const { members: authMembers = [] } = useAuth();

  // Support context passed down from FitnessTracker outlet or fallback to AuthContext
  const members = outletCtx.members || authMembers;

  const fitnessData = useMemo(() => {
    if (outletCtx.fitnessData) return outletCtx.fitnessData;
    try {
      return JSON.parse(localStorage.getItem('fitnessData') || '{}');
    } catch (e) {
      console.error('Error reading fitnessData in ProgressChart:', e);
      return {};
    }
  }, [outletCtx.fitnessData]);

  const progressList = useMemo(() => {
    return members
      .filter((m) => fitnessData[m.id] && fitnessData[m.id].length > 0)
      .map((m) => {
        const records = fitnessData[m.id];
        const latest = records[records.length - 1];
        const first = records[0];
        const weightDiff = (parseFloat(latest.weight || 0) - parseFloat(first.weight || 0)).toFixed(1);

        return {
          id: m.id,
          name: m.name,
          plan: m.plan || 'Basic',
          latestBmi: latest.bmi,
          latestWeight: latest.weight,
          latestHeight: latest.height,
          weightChange: weightDiff,
          totalRecords: records.length,
          lastLoggedDate: latest.date,
        };
      });
  }, [members, fitnessData]);

  if (progressList.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📈</div>
        <p>No fitness measurements recorded yet. Track some members in the Track & BMI tab!</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>📈 All Members Fitness Progress ({progressList.length})</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          BMI Progress Meter (Scale: 0 - 40)
        </span>
      </div>

      <div className="progress-bars">
        {progressList.map((m) => {
          const bmiNum = parseFloat(m.latestBmi) || 0;
          const pct = Math.min(Math.max((bmiNum / 40) * 100, 5), 100);
          const sign = parseFloat(m.weightChange) > 0 ? '+' : '';
          const planClass = m.plan.toLowerCase();

          return (
            <div key={m.id} className="card" style={{ marginBottom: '16px' }}>
              <div className="progress-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link
                    to={`/admin/members/${m.id}`}
                    style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}
                  >
                    {m.name}
                  </Link>
                  <span className={`badge badge-${planClass}`}>{m.plan}</span>
                </span>
                <span style={{ fontSize: '0.9rem' }}>
                  BMI: <strong>{m.latestBmi}</strong> · {m.latestWeight} kg ({sign}{m.weightChange} kg)
                </span>
              </div>

              <div className="progress-item" style={{ margin: '10px 0 6px' }}>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        bmiNum < 18.5
                          ? '#f59e0b'
                          : bmiNum < 25
                          ? 'var(--accent)'
                          : bmiNum < 30
                          ? '#f97316'
                          : 'var(--coral)',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>
                  {m.totalRecords} measurement{m.totalRecords > 1 ? 's' : ''} recorded
                </span>
                <span>Last updated: {m.lastLoggedDate || 'N/A'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressChart;
