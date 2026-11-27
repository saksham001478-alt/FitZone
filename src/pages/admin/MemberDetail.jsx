// MemberDetail.jsx — Member profile view with personal info, plan status, and fitness history
import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function MemberDetail() {
  const { id } = useParams();
  const { members = [] } = useAuth();

  const member = useMemo(() => {
    return members.find((m) => String(m.id) === String(id));
  }, [members, id]);

  // Read fitness records from localStorage
  const memberFitness = useMemo(() => {
    if (!member) return [];
    try {
      const fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '{}');
      return fitnessData[member.id] || [];
    } catch (e) {
      console.error('Error reading fitness data in MemberDetail:', e);
      return [];
    }
  }, [member]);

  // Read attendance summary for this member
  const attendanceStats = useMemo(() => {
    if (!member) return { totalDays: 0, presentDays: 0, absentDays: 0 };
    try {
      const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
      let presentDays = 0;
      let absentDays = 0;

      Object.values(attendance).forEach((dayRecords) => {
        if (dayRecords && dayRecords[member.id] === 'present') presentDays++;
        if (dayRecords && dayRecords[member.id] === 'absent') absentDays++;
      });

      return {
        totalDays: presentDays + absentDays,
        presentDays,
        absentDays,
      };
    } catch (e) {
      console.error('Error reading attendance in MemberDetail:', e);
      return { totalDays: 0, presentDays: 0, absentDays: 0 };
    }
  }, [member]);

  // Redirect to member list if member ID does not exist
  if (!member) {
    return <Navigate to="/admin/members" replace />;
  }

  const initials = (member.name || 'Member')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const planClass = (member.plan || 'basic').toLowerCase();

  return (
    <div className="member-detail">
      <Link to="/admin/members" className="back-link">
        ← Back to Members
      </Link>

      {/* Member Profile Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="member-header">
          <div
            className="member-avatar"
            style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}
          >
            {initials}
          </div>
          <div>
            <h2 style={{ marginBottom: '4px' }}>{member.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{member.email}</p>
          </div>
        </div>

        <div className="member-details" style={{ marginTop: '20px' }}>
          <div className="detail-row">
            <span className="detail-label">📧 Email</span>
            <span>{member.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📱 Phone</span>
            <span>{member.phone || 'Not provided'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">💳 Membership Plan</span>
            <span className={`badge badge-${planClass}`}>{member.plan || 'Basic'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📅 Member Since</span>
            <span>{member.joinDate || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📋 Attendance Rate</span>
            <span>
              {attendanceStats.totalDays > 0
                ? `${Math.round(
                    (attendanceStats.presentDays / attendanceStats.totalDays) * 100
                  )}% (${attendanceStats.presentDays}/${attendanceStats.totalDays} sessions)`
                : 'No attendance marked yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Fitness History */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>📊 Fitness & BMI History</h3>
          <Link to="/admin/fitness" className="btn btn-secondary btn-sm">
            + Record New Measurement
          </Link>
        </div>

        {memberFitness.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 0' }}>
            <div className="empty-icon">⚖️</div>
            <p>No fitness measurements recorded yet for {member.name}.</p>
          </div>
        ) : (
          <div>
            {memberFitness
              .slice()
              .reverse()
              .map((record, index) => {
                const bmiNum = parseFloat(record.bmi);
                const categoryClass =
                  bmiNum < 18.5
                    ? 'underweight'
                    : bmiNum < 25
                    ? 'normal'
                    : bmiNum < 30
                    ? 'overweight'
                    : 'obese';

                return (
                  <div
                    key={index}
                    className="detail-row"
                    style={{
                      padding: '12px 0',
                      borderBottom:
                        index !== memberFitness.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                    }}
                  >
                    <div>
                      <strong>📅 {record.date}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <span>Weight: <strong>{record.weight} kg</strong></span>
                      <span>Height: <strong>{record.height} cm</strong></span>
                      <span className={`badge badge-${categoryClass}`}>
                        BMI: {record.bmi}
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

export default MemberDetail;
