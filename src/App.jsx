// App.jsx — Routes and main app state
import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  useLocalStorage, Layout, Dashboard, MemberList, MemberDetail,
  MembershipPlans, AttendanceTracker, DietPlans, FitnessTracker,
  ProgressChart, NotFound,
} from './Pages';
import './App.css';

function App() {
  // dark mode — persisted via custom hook
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  // members state — lifted up, drilled down via props
  const [members, setMembers] = useLocalStorage('members', []); // members state is lifted up to App.jsx and passed down to child components via props.
  // search
  const [searchTerm, setSearchTerm] = useState(''); // custom hook for localStorage state management, useLocalStorage, is used to persist dark mode and members state across sessions. The searchTerm state is managed locally within the App component.

  // useCallback for stable references
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), [setDarkMode]); // here, useCallback is used to memoize the toggleTheme function, ensuring that it maintains a stable reference across renders, which can help prevent unnecessary re-renders of child components that depend on this function.
  const handleSearchChange = useCallback((val) => setSearchTerm(val), []); // here handlesearchchange is used to update the searchTerm state when the user types in the search input. It is also memoized with useCallback to maintain a stable reference.

  // apply theme to document
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

  return (
    <Routes>
      <Route path="/" element={<Layout darkMode={darkMode} onToggleTheme={toggleTheme} searchTerm={searchTerm} onSearchChange={handleSearchChange} members={members} setMembers={setMembers} />}>
        <Route index element={<Dashboard />} />
        <Route path="members" element={<MemberList />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="membership" element={<MembershipPlans />} />
        <Route path="attendance" element={<AttendanceTracker />} />
        <Route path="diet" element={<DietPlans />} />
        <Route path="diet/:type" element={<DietPlans />} />
        <Route path="fitness" element={<FitnessTracker />}>
          <Route path="progress" element={<ProgressChart />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
// main.jsx
  // ↓
//BrowserRouter
//   ↓
//App.jsx
//   ↓
//Global State + Routes
//   ↓
//Layout
//   ↓
//Navbar + Sidebar + Outlet
//   ↓
//Pages
//   ↓
//Components
//   ↓
//React State
//   ↓
//localStorage