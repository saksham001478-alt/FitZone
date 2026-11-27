// MyFitness.jsx — Customer personal fitness and BMI tracker
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FormInput } from '../../components/FormInput';
import { StatCard } from '../../components/StatCard';

export default function MyFitness() {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [fitnessData, setFitnessData] = useLocalStorage('fitnessData', {});

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [formError, setFormError] = useState('');

  // Retrieve user's records, sorted newest first
  const myRecords = useMemo(() => {
    if (!fitnessData || !user?.id) return [];
    const records = fitnessData[user.id];
    if (!Array.isArray(records)) return [];
    return [...records].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [fitnessData, user?.id]);

  const latestRecord = myRecords[0] || null;

  // Live BMI calculation
  const getBmiDetails = (w, h) => {
    const numW = parseFloat(w);
    const numH = parseFloat(h);
    if (!numW || !numH || numW <= 0 || numH <= 0) return null;
    const hMeters = numH / 100;
    const val = (numW / (hMeters * hMeters)).toFixed(1);
    const numVal = parseFloat(val);

    let category = 'Normal';
    let className = 'bmi-normal';

    if (numVal < 18.5) {
      category = 'Underweight';
      className = 'bmi-underweight';
    } else if (numVal <= 24.9) {
      category = 'Normal';
      className = 'bmi-normal';
    } else if (numVal <= 29.9) {
      category = 'Overweight';
      className = 'bmi-overweight';
    } else {
      category = 'Obese';
      className = 'bmi-obese';
    }

    return { value: val, category, className };
  };

  const liveBmi = useMemo(() => getBmiDetails(weight, height), [weight, height]);

  // Active displayed BMI (either live calculation from form or latest recorded)
  const displayBmi = liveBmi || (latestRecord ? getBmiDetails(latestRecord.weight, latestRecord.height) : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const numW = parseFloat(weight);
    const numH = parseFloat(height);

    if (!numW || numW < 20 || numW > 300) {
      setFormError('Please enter a realistic weight (20 - 300 kg)');
      return;
    }
    if (!numH || numH < 50 || numH > 250) {
      setFormError('Please enter a realistic height (50 - 250 cm)');
      return;
    }

    const calculated = getBmiDetails(numW, numH);
    const newEntry = {
      id: Date.now().toString(),
      date,
      weight: numW,
      height: numH,
      bmi: parseFloat(calculated.value),
      category: calculated.category
    };

    setFitnessData((prev) => {
      const current = prev && Array.isArray(prev[user.id]) ? prev[user.id] : [];
      return {
        ...prev,
        [user.id]: [newEntry, ...current]
      };
    });

    showToast('Fitness record saved successfully!', 'success');
    setWeight('');
    // keep height for ease of repeated logs
  };

  const handleDeleteRecord = (recordId) => {
    setFitnessData((prev) => {
      const current = prev && Array.isArray(prev[user.id]) ? prev[user.id] : [];
      return {
        ...prev,
        [user.id]: current.filter((r) => r.id !== recordId)
      };
    });
    showToast('Record deleted', 'info');
  };

  // Progress percentage calculation (range 15 to 35 for visualization)
  const bmiProgressPercent = useMemo(() => {
    if (!displayBmi) return 0;
    const bmiVal = parseFloat(displayBmi.value);
    const min = 15;
    const max = 35;
    const clamped = Math.min(Math.max(bmiVal, min), max);
    return Math.round(((clamped - min) / (max - min)) * 100);
  }, [displayBmi]);

  return (
    <div>
      <div className="page-header">
        <h2>Fitness Tracker</h2>
        <p>Log your daily body measurements and track your Body Mass Index (BMI) progress.</p>
      </div>

      {/* Summary StatCards */}
      <div className="stats-grid">
        <StatCard
          icon="⚖️"
          title="Current Weight"
          value={latestRecord ? `${latestRecord.weight} kg` : '—'}
          subtitle={latestRecord ? `Logged on ${latestRecord.date}` : 'No logs yet'}
        />
        <StatCard
          icon="📏"
          title="Height"
          value={latestRecord ? `${latestRecord.height} cm` : '—'}
          subtitle="Body height"
        />
        <StatCard
          icon="📊"
          title="Latest BMI"
          value={displayBmi ? displayBmi.value : '—'}
          subtitle={displayBmi ? displayBmi.category : 'Awaiting input'}
        />
        <StatCard
          icon="🎯"
          title="Goal Target"
          value={user?.goal ? user.goal.replace('-', ' ') : 'Maintenance'}
          subtitle="Fitness objective"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Input Form */}
        <div className="card">
          <div className="section-title">
            <h2>Log New Measurement</h2>
          </div>

          {formError && (
            <div
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                color: 'var(--coral)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '14px'
              }}
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="fitness-form" noValidate>
            <FormInput
              label="Measurement Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="form-row">
              <FormInput
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.1"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 72.5"
                required
              />

              <FormInput
                label="Height (cm)"
                name="height"
                type="number"
                step="0.5"
                min="50"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              Save Measurement
            </button>
          </form>

          {/* Live BMI result display */}
          {liveBmi && (
            <div className="bmi-result">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                CALCULATED BMI
              </div>
              <div className={`bmi-value ${liveBmi.className}`}>{liveBmi.value}</div>
              <div className={`bmi-category ${liveBmi.className}`}>{liveBmi.category}</div>
            </div>
          )}
        </div>

        {/* BMI Progress & Health Ranges */}
        <div className="card">
          <div className="section-title">
            <h2>BMI Health Spectrum</h2>
          </div>

          {displayBmi ? (
            <div className="progress-bars" style={{ marginTop: '10px' }}>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Current BMI Index: <strong>{displayBmi.value}</strong></span>
                  <span className={displayBmi.className}><strong>{displayBmi.category}</strong></span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${bmiProgressPercent}%` }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Underweight</span>
                  <span>&lt; 18.5</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Normal Weight (Healthy)</span>
                  <span>18.5 – 24.9</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: '#f97316', fontWeight: 600 }}>Overweight</span>
                  <span>25.0 – 29.9</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--coral)', fontWeight: 600 }}>Obese</span>
                  <span>&ge; 30.0</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📏</div>
              <p>Enter your weight and height on the left to calculate your BMI spectrum.</p>
            </div>
          )}
        </div>
      </div>

      {/* Fitness History Table */}
      <div className="card">
        <div className="section-title">
          <h2>Measurement History (Last 10 Records)</h2>
        </div>

        {myRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No measurements logged yet. Use the form above to add your first record.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Weight</th>
                  <th style={{ padding: '10px 12px' }}>Height</th>
                  <th style={{ padding: '10px 12px' }}>BMI</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {myRecords.slice(0, 10).map((record) => {
                  const bmiInfo = getBmiDetails(record.weight, record.height);
                  return (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px' }}>{record.date}</td>
                      <td style={{ padding: '12px' }}>{record.weight} kg</td>
                      <td style={{ padding: '12px' }}>{record.height} cm</td>
                      <td style={{ padding: '12px', fontWeight: 700 }}>
                        {record.bmi || bmiInfo?.value || '—'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${bmiInfo?.className || 'badge-standard'}`}>
                          {record.category || bmiInfo?.category || 'Normal'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          title="Delete record"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
