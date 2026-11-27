// AttendanceTracker.jsx — Daily gym attendance tracking with date picker and status toggles
import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function AttendanceTracker() {
  const { members = [] } = useAuth();
  const { showToast } = useNotification();

  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useLocalStorage('attendance', {});

  const todayRecord = useMemo(() => {
    return attendance[selectedDate] || {};
  }, [attendance, selectedDate]);

  // Attendance summary count
  const summary = useMemo(() => {
    return members.reduce(
      (acc, m) => {
        const s = todayRecord[m.id];
        if (s === 'present') acc.present++;
        else if (s === 'absent') acc.absent++;
        else acc.unmarked++;
        return acc;
      },
      { present: 0, absent: 0, unmarked: 0 }
    );
  }, [members, todayRecord]);

  const markAttendance = useCallback(
    (memberId, status) => {
      const member = members.find((m) => String(m.id) === String(memberId));
      const memberName = member ? member.name : 'Member';

      // Toggle off if clicking the already active status
      const currentStatus = todayRecord[memberId];
      const newStatus = currentStatus === status ? null : status;

      setAttendance((prev) => {
        const dateRecords = { ...(prev[selectedDate] || {}) };
        if (newStatus === null) {
          delete dateRecords[memberId];
        } else {
          dateRecords[memberId] = newStatus;
        }
        return {
          ...prev,
          [selectedDate]: dateRecords,
        };
      });

      if (newStatus) {
        showToast(`Marked ${memberName} as ${newStatus} for ${selectedDate}`, 'success');
      } else {
        showToast(`Cleared attendance for ${memberName}`, 'info');
      }
    },
    [members, todayRecord, selectedDate, setAttendance, showToast]
  );

  const markAllPresent = useCallback(() => {
    if (members.length === 0) return;
    const allPresent = {};
    members.forEach((m) => {
      allPresent[m.id] = 'present';
    });

    setAttendance((prev) => ({
      ...prev,
      [selectedDate]: {
        ...(prev[selectedDate] || {}),
        ...allPresent,
      },
    }));

    showToast(`Marked all ${members.length} members as Present for ${selectedDate}`, 'success');
  }, [members, selectedDate, setAttendance, showToast]);

  const clearDateAttendance = useCallback(() => {
    if (window.confirm(`Clear all attendance records for ${selectedDate}?`)) {
      setAttendance((prev) => {
        const copy = { ...prev };
        delete copy[selectedDate];
        return copy;
      });
      showToast(`Cleared attendance records for ${selectedDate}`, 'info');
    }
  }, [selectedDate, setAttendance, showToast]);

  if (members.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h2>📅 Attendance Tracker</h2>
          <p>Record and monitor daily gym visits for all registered members</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p>No members found in system. Please register members first to track attendance.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>📅 Attendance Tracker</h2>
        <p>Record and monitor daily gym visits for all registered members</p>
      </div>

      {/* Date controls and summary counters */}
      <div
        className="card"
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label htmlFor="attendance-date" style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            Select Date:
          </label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Counter badges */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.92rem' }}>
            ✅ Present: {summary.present}
          </span>
          <span style={{ color: 'var(--coral)', fontWeight: 600, fontSize: '0.92rem' }}>
            ❌ Absent: {summary.absent}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.92rem' }}>
            ⬜ Unmarked: {summary.unmarked}
          </span>
        </div>

        {/* Bulk action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={markAllPresent}
          >
            Mark All Present
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={clearDateAttendance}
            title="Clear records for this date"
          >
            Clear Date
          </button>
        </div>
      </div>

      {/* Member Attendance List */}
      <div className="attendance-list">
        {members.map((member) => {
          const status = todayRecord[member.id];
          const initials = (member.name || 'Member')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          return (
            <div key={member.id} className="attendance-item">
              <div className="member-info">
                <div className="avatar">{initials}</div>
                <div>
                  <strong>{member.name}</strong>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {member.plan || 'Basic'} Plan • {member.phone || 'No phone'}
                  </div>
                </div>
              </div>

              <div className="attendance-actions">
                <button
                  type="button"
                  className={`btn-present ${status === 'present' ? 'active' : ''}`}
                  onClick={() => markAttendance(member.id, 'present')}
                  aria-pressed={status === 'present'}
                >
                  ✓ Present
                </button>
                <button
                  type="button"
                  className={`btn-absent ${status === 'absent' ? 'active' : ''}`}
                  onClick={() => markAttendance(member.id, 'absent')}
                  aria-pressed={status === 'absent'}
                >
                  ✕ Absent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttendanceTracker;
