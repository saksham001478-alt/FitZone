// Pages.jsx — All components, hooks, and data in one file
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, NavLink, useParams, useOutletContext, Navigate, Outlet, useLocation } from 'react-router-dom';

/* ========================================================================
   CUSTOM HOOKS
   ======================================================================== */

// useLocalStorage — sync state to localStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// useSearch — filter items with useMemo
export function useSearch(items, searchTerm, keys = ['name']) {
  return useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      keys.some(key => item[key]?.toLowerCase().includes(term))
    );
  }, [items, searchTerm, keys]);
}

/* ========================================================================
   STATIC DATA
   ======================================================================== */

const dietPlans = {
  'weight-gain': {
    title: 'Weight Gain Diet', icon: '💪',
    description: 'High-calorie diet plan to help you gain healthy weight and build mass.',
    calories: '3000-3500 cal/day',
    meals: {
      breakfast: ['4 whole eggs scrambled with cheese', 'Oatmeal with banana and honey', 'Glass of whole milk', 'Handful of almonds'],
      lunch: ['Grilled chicken breast (200g)', 'Brown rice (1.5 cups)', 'Mixed vegetable salad with olive oil', 'Lentil soup'],
      snacks: ['Protein shake with peanut butter', 'Trail mix with dried fruits', 'Greek yogurt with granola'],
      dinner: ['Salmon fillet (200g)', 'Sweet potato mash', 'Steamed broccoli and carrots', 'Whole wheat bread'],
    },
  },
  'weight-loss': {
    title: 'Weight Loss Diet', icon: '🔥',
    description: 'Calorie-deficit diet plan for healthy and sustainable weight loss.',
    calories: '1500-1800 cal/day',
    meals: {
      breakfast: ['Egg white omelette with spinach', 'Whole wheat toast (1 slice)', 'Green tea', 'Half a grapefruit'],
      lunch: ['Grilled chicken salad', 'Quinoa (half cup)', 'Cucumber and tomato salad', 'Lime water'],
      snacks: ['Apple slices with almond butter', 'Carrot and celery sticks', 'Handful of walnuts'],
      dinner: ['Baked fish (150g)', 'Steamed vegetables', 'Mixed green salad', 'Herbal tea'],
    },
  },
  'muscle-gain': {
    title: 'Muscle Gain Diet', icon: '🏋️',
    description: 'Protein-rich diet plan designed for muscle building and recovery.',
    calories: '2800-3200 cal/day',
    meals: {
      breakfast: ['Protein pancakes (3 large)', '6 egg whites + 2 whole eggs', 'Banana smoothie with whey', 'Oats with berries'],
      lunch: ['Chicken breast (250g)', 'Brown rice (2 cups)', 'Broccoli and asparagus', 'Avocado half'],
      snacks: ['Whey protein shake', 'Cottage cheese with pineapple', 'Rice cakes with peanut butter'],
      dinner: ['Lean beef steak (200g)', 'Baked potato', 'Green beans and mushrooms', 'Casein protein before bed'],
    },
  },
  'maintenance': {
    title: 'Maintenance Diet', icon: '⚖️',
    description: 'Balanced diet plan to maintain your current weight and stay healthy.',
    calories: '2000-2400 cal/day',
    meals: {
      breakfast: ['2 boiled eggs', 'Whole grain cereal with milk', 'Fresh orange juice', 'Mixed fruit bowl'],
      lunch: ['Grilled turkey sandwich', 'Brown rice with dal', 'Green salad', 'Buttermilk'],
      snacks: ['Mixed nuts (30g)', 'Fruit smoothie', 'Dark chocolate (2 squares)'],
      dinner: ['Grilled paneer or tofu (150g)', 'Roti or whole wheat pasta', 'Mixed vegetable curry', 'Warm milk with turmeric'],
    },
  },
};

/* ========================================================================
   UI COMPONENTS
   ======================================================================== */

// SearchBar — controlled input with useRef
export function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input ref={inputRef} type="text" placeholder="Search members..." value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// StatCard — props: icon, label, value, color
export function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon" style={{ backgroundColor: color + '20', color }}>{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

// Modal — useRef for focus, ESC to close
export function Modal({ isOpen, onClose, title, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeRef.current) closeRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button ref={closeRef} className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ========================================================================
   LAYOUT COMPONENTS
   ======================================================================== */

const navItems = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/members', icon: '👥', label: 'Members' },
  { path: '/membership', icon: '💳', label: 'Membership' },
  { path: '/attendance', icon: '📅', label: 'Attendance' },
  { path: '/diet', icon: '🥗', label: 'Diet Plans' },
  { path: '/fitness', icon: '📊', label: 'Fitness' },
];

// Navbar — search + dark mode toggle
export function Navbar({ darkMode, onToggleTheme, searchTerm, onSearchChange, onToggleSidebar }) {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>☰</button>
        <span className="brand">💪 FitZone</span>
      </div>
      <SearchBar value={searchTerm} onChange={onSearchChange} />
      <div className="nav-actions">
        <button className="theme-toggle" onClick={onToggleTheme}>{darkMode ? '☀️' : '🌙'}</button>
      </div>
    </header>
  );
}

// Sidebar — NavLink navigation
export function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo">💪 FitZone</div>
      <nav>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

// Layout — wraps all pages with Navbar + Sidebar + Outlet
export function Layout({ darkMode, onToggleTheme, searchTerm, onSearchChange, members, setMembers }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Navbar darkMode={darkMode} onToggleTheme={onToggleTheme} searchTerm={searchTerm} onSearchChange={onSearchChange} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="main-content">
        <Outlet context={{ members, setMembers, searchTerm }} />
      </main>
    </div>
  );
}

/* ========================================================================
   MEMBER COMPONENTS
   ======================================================================== */

// MemberForm — controlled components, event handling
function MemberForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    name: '', email: '', phone: '', plan: 'Basic',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Enter full name" required />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone number" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="plan">Membership Plan</label>
          <select id="plan" name="plan" value={formData.plan} onChange={handleChange}>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="joinDate">Join Date</label>
          <input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
        <button type="submit" className="btn btn-primary">{initialData ? 'Update Member' : 'Add Member'}</button>
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

// MemberCard — display individual member
function MemberCard({ member, onDelete }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="member-card card">
      <div className="member-header">
        <div className="member-avatar">{initials}</div>
        <div>
          <div className="member-name">{member.name}</div>
          <div className="member-email">{member.email}</div>
        </div>
      </div>
      <div className="member-details">
        <div className="detail-row"><span className="detail-label">Plan</span><span className={`badge badge-${member.plan.toLowerCase()}`}>{member.plan}</span></div>
        <div className="detail-row"><span className="detail-label">Phone</span><span>{member.phone || 'N/A'}</span></div>
        <div className="detail-row"><span className="detail-label">Joined</span><span>{member.joinDate}</span></div>
      </div>
      <div className="member-actions">
        <Link to={`/members/${member.id}`} className="btn btn-secondary btn-sm">View</Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(member.id)}>Delete</button>
      </div>
    </div>
  );
}

/* ========================================================================
   PAGE COMPONENTS
   ======================================================================== */

// Dashboard
export function Dashboard() {
  const { members } = useOutletContext();

  const stats = useMemo(() => {
    const total = members.length;
    const planCounts = members.reduce((acc, m) => { acc[m.plan] = (acc[m.plan] || 0) + 1; return acc; }, {});
    const today = new Date().toISOString().split('T')[0];
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const todayRecords = attendance[today] || {};
    const presentToday = Object.values(todayRecords).filter(v => v === 'present').length;
    return { total, planCounts, presentToday };
  }, [members]);

  const recentMembers = useMemo(() => {
    return [...members].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);
  }, [members]);

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <h1>Welcome to FitZone 💪</h1>
        <p>Manage your gym efficiently. Track members, attendance, and fitness goals all in one place.</p>
      </div>
      <div className="stats-grid">
        <StatCard icon="👥" label="Total Members" value={stats.total} color="#0d9488" />
        <StatCard icon="💳" label="Active Plans" value={Object.keys(stats.planCounts).length} color="#8b5cf6" />
        <StatCard icon="✅" label="Present Today" value={stats.presentToday} color="#10b981" />
        <StatCard icon="🔥" label="Premium Members" value={stats.planCounts['Premium'] || 0} color="#f43f5e" />
      </div>

      <div className="section-title"><h2>📋 Membership Summary</h2></div>
      <div className="stats-grid">
        {['Basic', 'Standard', 'Premium'].map(plan => (
          <div key={plan} className="card" style={{ textAlign: 'center' }}>
            <h4>{plan}</h4>
            <p style={{ fontSize: '1.6rem', fontWeight: 700, color: plan === 'Basic' ? '#f59e0b' : plan === 'Standard' ? '#0d9488' : '#8b5cf6' }}>{stats.planCounts[plan] || 0}</p>
          </div>
        ))}
      </div>

      <div className="section-title"><h2>🕒 Recent Activity</h2></div>
      <div className="card">
        {recentMembers.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📭</div><p>No members yet. Add your first member to get started!</p></div>
        ) : (
          recentMembers.map(m => (
            <div key={m.id} className="activity-item">
              <div className="activity-dot"></div>
              <div><strong>{m.name}</strong> joined with {m.plan} plan<br /><small style={{ color: 'var(--text-secondary)' }}>{m.joinDate}</small></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// MemberList
export function MemberList() {
  const { members, setMembers, searchTerm } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const filteredMembers = useSearch(members, searchTerm, ['name', 'email']);

  const handleAddMember = useCallback((formData) => {
    setMembers(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    setShowModal(false);
  }, [setMembers]);

  const handleUpdateMember = useCallback((formData) => {
    setMembers(prev => prev.map(m => m.id === editMember.id ? { ...m, ...formData } : m));
    setEditMember(null); setShowModal(false);
  }, [setMembers, editMember]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Remove this member?')) setMembers(prev => prev.filter(m => m.id !== id));
  }, [setMembers]);

  const closeModal = () => { setShowModal(false); setEditMember(null); };

  return (
    <div>
      <div className="members-header">
        <h2>👥 Members ({members.length})</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Member</button>
      </div>
      {filteredMembers.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">👤</div><p>{searchTerm ? 'No members match your search.' : 'No members yet. Click "Add Member" to get started!'}</p></div>
      ) : (
        <div className="members-grid">{filteredMembers.map(m => <MemberCard key={m.id} member={m} onDelete={handleDelete} />)}</div>
      )}
      <Modal isOpen={showModal} onClose={closeModal} title={editMember ? 'Edit Member' : 'Add New Member'}>
        <MemberForm onSubmit={editMember ? handleUpdateMember : handleAddMember} initialData={editMember} onCancel={closeModal} />
      </Modal>
    </div>
  );
}

// MemberDetail — useParams, protected route
export function MemberDetail() {
  const { id } = useParams();
  const { members } = useOutletContext();
  const member = useMemo(() => members.find(m => m.id === id), [members, id]);

  if (!member) return <Navigate to="/members" replace />;

  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const fitnessData = JSON.parse(localStorage.getItem('fitnessData') || '{}');
  const memberFitness = fitnessData[member.id] || [];

  return (
    <div className="member-detail">
      <Link to="/members" className="back-link">← Back to Members</Link>
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="member-header">
          <div className="member-avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>{initials}</div>
          <div><h2 style={{ marginBottom: '2px' }}>{member.name}</h2><p style={{ color: 'var(--text-secondary)' }}>{member.email}</p></div>
        </div>
        <div className="member-details" style={{ marginTop: '16px' }}>
          <div className="detail-row"><span className="detail-label">📧 Email</span><span>{member.email}</span></div>
          <div className="detail-row"><span className="detail-label">📱 Phone</span><span>{member.phone || 'Not provided'}</span></div>
          <div className="detail-row"><span className="detail-label">💳 Plan</span><span className={`badge badge-${member.plan.toLowerCase()}`}>{member.plan}</span></div>
          <div className="detail-row"><span className="detail-label">📅 Joined</span><span>{member.joinDate}</span></div>
        </div>
      </div>
      {memberFitness.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>📊 Fitness History</h3>
          {memberFitness.map((e, i) => (
            <div key={i} className="detail-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{e.date}</span><span>Weight: {e.weight}kg | Height: {e.height}cm | BMI: {e.bmi}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MembershipPlans
export function MembershipPlans() {
  const plans = [
    { name: 'Basic', price: '₹999', popular: false, features: ['Access to gym floor', 'Locker room access', 'Basic equipment usage', '1 group class per week', 'Fitness assessment'] },
    { name: 'Standard', price: '₹1,999', popular: true, features: ['Everything in Basic', 'All group classes', 'Personal trainer (2x/month)', 'Diet plan consultation', 'Sauna & steam room', 'Towel service'] },
    { name: 'Premium', price: '₹2,999', popular: false, features: ['Everything in Standard', 'Unlimited personal training', 'Custom diet & workout plans', 'Priority booking', 'Guest passes (2/month)', 'Supplement discounts', 'Monthly body analysis'] },
  ];

  return (
    <div>
      <div className="page-header"><h2>💳 Membership Plans</h2><p>Choose the perfect plan for your fitness journey</p></div>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {plans.map(plan => (
          <div key={plan.name} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">POPULAR</div>}
            <h3 style={{ fontSize: '1.2rem' }}>{plan.name}</h3>
            <div className="plan-price">{plan.price}<span>/month</span></div>
            <ul className="plan-features">{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// AttendanceTracker
export function AttendanceTracker() {
  const { members } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useLocalStorage('attendance', {});
  const todayRecord = attendance[selectedDate] || {};

  const markAttendance = useCallback((memberId, status) => {
    setAttendance(prev => ({ ...prev, [selectedDate]: { ...prev[selectedDate], [memberId]: status } }));
  }, [selectedDate, setAttendance]);

  const summary = members.reduce((acc, m) => {
    const s = todayRecord[m.id];
    if (s === 'present') acc.present++;
    else if (s === 'absent') acc.absent++;
    else acc.unmarked++;
    return acc;
  }, { present: 0, absent: 0, unmarked: 0 });

  if (members.length === 0) return <div className="empty-state"><div className="empty-icon">📅</div><p>No members found. Please add members first to track attendance.</p></div>;

  return (
    <div>
      <div className="page-header"><h2>📅 Attendance Tracker</h2></div>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.9rem' }}>
          <span style={{ color: '#10b981', fontWeight: 600 }}>✅ {summary.present}</span>
          <span style={{ color: 'var(--coral)', fontWeight: 600 }}>❌ {summary.absent}</span>
          <span style={{ color: 'var(--text-secondary)' }}>⬜ {summary.unmarked}</span>
        </div>
      </div>
      <div className="attendance-list">
        {members.map(member => {
          const status = todayRecord[member.id];
          const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          return (
            <div key={member.id} className="attendance-item">
              <div className="member-info">
                <div className="avatar">{initials}</div>
                <div><strong>{member.name}</strong><div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{member.plan} Plan</div></div>
              </div>
              <div className="attendance-actions">
                <button className={`btn-present ${status === 'present' ? 'active' : ''}`} onClick={() => markAttendance(member.id, 'present')}>Present</button>
                <button className={`btn-absent ${status === 'absent' ? 'active' : ''}`} onClick={() => markAttendance(member.id, 'absent')}>Absent</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// DietPlans — with dynamic route
export function DietPlans() {
  const { type } = useParams();
  const mealIcons = { breakfast: '🌅', lunch: '☀️', snacks: '🍎', dinner: '🌙' };

  if (type) {
    const plan = dietPlans[type];
    if (!plan) return <Navigate to="/diet" replace />;
    return (
      <div className="diet-detail">
        <Link to="/diet" className="back-link">← Back to Diet Plans</Link>
        <div className="card" style={{ marginBottom: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '2.8rem' }}>{plan.icon}</span>
          <h2 style={{ marginTop: '8px' }}>{plan.title}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0', lineHeight: 1.5 }}>{plan.description}</p>
          <span className="badge badge-standard">{plan.calories}</span>
        </div>
        {Object.entries(plan.meals).map(([meal, items]) => (
          <div key={meal} className="meal-section card">
            <h3>{mealIcons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
            <ul className="meal-list">{items.map((item, i) => <li key={i}>🍽️ {item}</li>)}</ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header"><h2>🥗 Diet Plans</h2><p>Choose a diet plan that fits your fitness goals</p></div>
      <div className="diet-grid">
        {Object.entries(dietPlans).map(([key, plan]) => (
          <Link to={`/diet/${key}`} key={key} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="diet-card card">
              <div className="diet-icon">{plan.icon}</div>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div style={{ marginTop: '10px' }}><span className="badge badge-standard">{plan.calories}</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ProgressChart — nested route component
export function ProgressChart() {
  const { members, fitnessData } = useOutletContext();

  const progressList = useMemo(() => {
    return members.filter(m => fitnessData[m.id]?.length > 0).map(m => {
      const records = fitnessData[m.id];
      const latest = records[records.length - 1], first = records[0];
      return { name: m.name, latestBmi: latest.bmi, latestWeight: latest.weight, weightChange: (parseFloat(latest.weight) - parseFloat(first.weight)).toFixed(1), totalRecords: records.length };
    });
  }, [members, fitnessData]);

  if (progressList.length === 0) return <div className="empty-state"><div className="empty-icon">📈</div><p>No fitness records yet. Track some members first!</p></div>;

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>📈 Member Progress</h3>
      <div className="progress-bars">
        {progressList.map((m, i) => {
          const pct = Math.min((parseFloat(m.latestBmi) / 40) * 100, 100);
          const sign = parseFloat(m.weightChange) >= 0 ? '+' : '';
          return (
            <div key={i} className="card">
              <div className="progress-label"><span><strong>{m.name}</strong></span><span>BMI: {m.latestBmi} · {m.latestWeight}kg ({sign}{m.weightChange}kg)</span></div>
              <div className="progress-item"><div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div></div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.totalRecords} record{m.totalRecords > 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// FitnessTracker — BMI, nested routes
export function FitnessTracker() {
  const { members } = useOutletContext();
  const location = useLocation();
  const [fitnessData, setFitnessData] = useLocalStorage('fitnessData', {});
  const [selectedMember, setSelectedMember] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  useEffect(() => {
    if (selectedMember && fitnessData[selectedMember]) {
      const records = fitnessData[selectedMember];
      const latest = records[records.length - 1];
      if (latest) { setWeight(latest.weight); setHeight(latest.height); }
    } else { setWeight(''); setHeight(''); }
    setBmiResult(null);
  }, [selectedMember, fitnessData]);

  const calculateBMI = useCallback(() => {
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    if (!w || !h) return;
    const bmi = (w / (h * h)).toFixed(1);
    let category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    setBmiResult({ value: bmi, category });
  }, [weight, height]);

  const handleSave = useCallback((e) => {
    e.preventDefault();
    if (!selectedMember || !weight || !height) return;
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    const bmi = (w / (h * h)).toFixed(1);
    calculateBMI();
    setFitnessData(prev => ({ ...prev, [selectedMember]: [...(prev[selectedMember] || []), { date: new Date().toISOString().split('T')[0], weight, height, bmi }] }));
  }, [selectedMember, weight, height, setFitnessData, calculateBMI]);

  const memberHistory = useMemo(() => selectedMember ? (fitnessData[selectedMember] || []) : [], [selectedMember, fitnessData]);
  const isProgressPage = location.pathname.includes('/progress');

  if (members.length === 0) return <div className="empty-state"><div className="empty-icon">📊</div><p>No members found. Please add members first.</p></div>;

  return (
    <div>
      <div className="page-header"><h2>📊 Fitness Tracker</h2><p>Track weight, height, and calculate BMI for members</p></div>
      <div className="fitness-tabs">
        <Link to="/fitness" className={`fitness-tab ${!isProgressPage ? 'active' : ''}`}>🏋️ Track & BMI</Link>
        <Link to="/fitness/progress" className={`fitness-tab ${isProgressPage ? 'active' : ''}`}>📈 Progress</Link>
      </div>

      {isProgressPage ? (
        <Outlet context={{ members, fitnessData }} />
      ) : (
        <>
          <div className="fitness-form card">
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="member-select">Select Member</label>
                <select id="member-select" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                  <option value="">-- Choose a member --</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label htmlFor="weight">Weight (kg)</label><input id="weight" type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" /></div>
                <div className="form-group"><label htmlFor="height">Height (cm)</label><input id="height" type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" /></div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={calculateBMI}>Calculate BMI</button>
                <button type="submit" className="btn btn-primary" disabled={!selectedMember}>Save Record</button>
              </div>
            </form>
            {bmiResult && (
              <div className="bmi-result">
                <div className={`bmi-value bmi-${bmiResult.category.toLowerCase()}`}>{bmiResult.value}</div>
                <div className={`bmi-category bmi-${bmiResult.category.toLowerCase()}`}>{bmiResult.category}</div>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.88rem' }}>Body Mass Index</p>
              </div>
            )}
          </div>
          {memberHistory.length > 0 && (
            <div className="card" style={{ marginTop: '16px' }}>
              <h3 style={{ marginBottom: '12px' }}>📋 Recent Records</h3>
              {memberHistory.slice(-5).reverse().map((r, i) => (
                <div key={i} className="detail-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{r.date}</span><span>{r.weight}kg · {r.height}cm · BMI: {r.bmi}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// NotFound — 404 page
export function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">🏠 Back to Dashboard</Link>
    </div>
  );
}
