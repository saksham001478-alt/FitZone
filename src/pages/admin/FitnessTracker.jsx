// FitnessTracker.jsx — Admin BMI calculation, weight/height metric logger, and nested progress route
import React, { useState, useCallback, useMemo } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function FitnessTracker() {
  const { members = [] } = useAuth();
  const { showToast } = useNotification();
  const location = useLocation();

  const [fitnessData, setFitnessData] = useLocalStorage('fitnessData', {});
  const [selectedMember, setSelectedMember] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  // Update weight & height directly upon member selection
  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    setSelectedMember(memberId);
    if (memberId && fitnessData[memberId]) {
      const records = fitnessData[memberId];
      const latest = records[records.length - 1];
      if (latest) {
        setWeight(latest.weight || '');
        setHeight(latest.height || '');
      } else {
        setWeight('');
        setHeight('');
      }
    } else {
      setWeight('');
      setHeight('');
    }
    setBmiResult(null);
  };

  // Calculate Body Mass Index and category
  const calculateBMI = useCallback(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || h <= 0) {
      showToast('Please enter valid numeric weight and height values', 'error');
      return null;
    }

    const bmi = (w / (h * h)).toFixed(1);
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const result = { value: bmi, category };
    setBmiResult(result);
    return result;
  }, [weight, height, showToast]);

  // Save new measurement record
  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (!selectedMember) {
        showToast('Please select a member first', 'warning');
        return;
      }

      const calculated = calculateBMI();
      if (!calculated) return;

      const memberObj = members.find((m) => String(m.id) === String(selectedMember));
      const memberName = memberObj ? memberObj.name : 'Member';

      const newRecord = {
        date: new Date().toISOString().split('T')[0],
        weight: String(weight),
        height: String(height),
        bmi: calculated.value,
      };

      setFitnessData((prev) => ({
        ...prev,
        [selectedMember]: [...(prev[selectedMember] || []), newRecord],
      }));

      showToast(`Fitness record saved for ${memberName}!`, 'success');
    },
    [selectedMember, weight, height, calculateBMI, members, setFitnessData, showToast]
  );

  const memberHistory = useMemo(() => {
    return selectedMember ? fitnessData[selectedMember] || [] : [];
  }, [selectedMember, fitnessData]);

  const isProgressPage = location.pathname.includes('/progress');

  if (members.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>📊 Fitness Tracker</h2>
          <p>Track member physical stats, compute BMI, and monitor progress</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No members found in system. Please register members first.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>📊 Fitness Tracker</h2>
        <p>Record weight & height, analyze BMI metrics, and inspect historical progression</p>
      </div>

      {/* Fitness Sub-navigation Tabs */}
      <div className="fitness-tabs">
        <NavLink
          to="/admin/fitness"
          end
          className={({ isActive }) => `fitness-tab ${isActive ? 'active' : ''}`}
        >
          🏋️ Track & BMI
        </NavLink>
        <NavLink
          to="/admin/fitness/progress"
          className={({ isActive }) => `fitness-tab ${isActive ? 'active' : ''}`}
        >
          📈 Progress Charts
        </NavLink>
      </div>

      {isProgressPage ? (
        /* Nested Route: ProgressChart */
        <Outlet context={{ members, fitnessData }} />
      ) : (
        /* Track & BMI Form */
        <>
          <div className="fitness-form card">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="member-select">
                  Select Member <span className="required-star">*</span>
                </label>
                <select
                  id="member-select"
                  value={selectedMember}
                  onChange={handleMemberChange}
                  required
                >
                  <option value="">-- Choose a member to track --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plan} Plan)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">
                    Weight (kg) <span className="required-star">*</span>
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 72.5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">
                    Height (cm) <span className="required-star">*</span>
                  </label>
                  <input
                    id="height"
                    type="number"
                    step="0.1"
                    min="50"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={calculateBMI}
                >
                  Calculate BMI
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedMember}
                >
                  Save Record
                </button>
              </div>
            </form>

            {/* BMI Result Display */}
            {bmiResult && (
              <div className="bmi-result" style={{ marginTop: '20px' }}>
                <div className={`bmi-value bmi-${bmiResult.category.toLowerCase()}`}>
                  {bmiResult.value}
                </div>
                <div className={`bmi-category bmi-${bmiResult.category.toLowerCase()}`}>
                  {bmiResult.category}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.88rem' }}>
                  Body Mass Index (BMI)
                </p>
              </div>
            )}
          </div>

          {/* Member's Measurement History */}
          {memberHistory.length > 0 && (
            <div className="card" style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '14px' }}>📋 Logged Measurements History</h3>
              {memberHistory
                .slice()
                .reverse()
                .slice(0, 5)
                .map((r, i) => (
                  <div
                    key={i}
                    className="detail-row"
                    style={{
                      padding: '10px 0',
                      borderBottom:
                        i !== Math.min(memberHistory.length, 5) - 1
                          ? '1px solid var(--border)'
                          : 'none',
                    }}
                  >
                    <span>📅 {r.date}</span>
                    <span>
                      Weight: <strong>{r.weight}kg</strong> · Height: <strong>{r.height}cm</strong> · BMI:{' '}
                      <strong>{r.bmi}</strong>
                    </span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FitnessTracker;
