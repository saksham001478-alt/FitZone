// MyAttendance.jsx — Customer attendance history and streak statistics
import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { StatCard } from '../../components/StatCard';

export default function MyAttendance() {
  const { user } = useAuth();
  const [attendance] = useLocalStorage('attendance', {});

  // Extract all tracked dates sorted newest first
  const sortedDates = useMemo(() => {
    if (!attendance || typeof attendance !== 'object') return [];
    return Object.keys(attendance).sort().reverse();
  }, [attendance]);

  // Determine user presence per date
  const attendanceRecords = useMemo(() => {
    if (!user?.id) return [];
    return sortedDates.map((dateStr) => {
      const attendees = attendance[dateStr];
      const isPresent = Array.isArray(attendees) && attendees.includes(user.id);
      return {
        date: dateStr,
        status: isPresent ? 'Present' : 'Absent',
        isPresent
      };
    });
  }, [sortedDates, attendance, user?.id]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter((r) => r.isPresent).length;
    const totalAbsent = totalDays - totalPresent;
    const rate = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    // Calculate consecutive present streak
    let streakCount = 0;
    const today = new Date();
    const formatDate = (d) => d.toISOString().slice(0, 10);

    const checkIsPresent = (dStr) => {
      const list = attendance[dStr];
      return Array.isArray(list) && list.includes(user?.id);
    };

    const checkDate = new Date(today);
    const todayStr = formatDate(checkDate);

    // If today is not marked, start checking from yesterday
    if (!checkIsPresent(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dStr = formatDate(checkDate);
      if (checkIsPresent(dStr)) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalDays,
      totalPresent,
      totalAbsent,
      rate,
      streak: streakCount
    };
  }, [attendanceRecords, attendance, user?.id]);

  const recent30Records = attendanceRecords.slice(0, 30);

  return (
    <div>
      <div className="page-header">
        <h2>My Attendance</h2>
        <p>View your gym check-in records, attendance consistency, and current streak.</p>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatCard
          icon="✅"
          title="Total Present"
          value={`${stats.totalPresent} Days`}
          subtitle="Total sessions attended"
        />
        <StatCard
          icon="❌"
          title="Total Absent"
          value={`${stats.totalAbsent} Days`}
          subtitle="Missed gym days"
        />
        <StatCard
          icon="📊"
          title="Attendance Rate"
          value={`${stats.rate}%`}
          subtitle="Overall consistency"
        />
        <StatCard
          icon="🔥"
          title="Current Streak"
          value={`${stats.streak} ${stats.streak === 1 ? 'Day' : 'Days'}`}
          subtitle="Consecutive present days"
        />
      </div>

      {/* Attendance History List */}
      <div className="card">
        <div className="section-title">
          <h2>Recent Check-ins (Last 30 recorded days)</h2>
        </div>

        {recent30Records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <p>No attendance data recorded yet.</p>
          </div>
        ) : (
          <div className="attendance-list">
            {recent30Records.map((record) => (
              <div key={record.date} className="attendance-item">
                <div className="member-info">
                  <div
                    className="avatar"
                    style={{
                      backgroundColor: record.isPresent ? '#10b981' : 'var(--coral)'
                    }}
                  >
                    {record.isPresent ? '✓' : '✕'}
                  </div>
                  <div>
                    <strong>{record.date}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Status: {record.status}
                    </span>
                  </div>
                </div>

                <div className="attendance-actions">
                  <span
                    className={record.isPresent ? 'btn-present active' : 'btn-absent active'}
                    style={{ cursor: 'default' }}
                  >
                    {record.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
