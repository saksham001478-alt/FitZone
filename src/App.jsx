// App.jsx — Routes with role-based layouts and protected routes
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import CustomerLayout from './components/CustomerLayout';
import { Toast } from './components/Toast';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberList from './pages/admin/MemberList';
import MemberDetail from './pages/admin/MemberDetail';
import MembershipPlans from './pages/admin/MembershipPlans';
import AttendanceTracker from './pages/admin/AttendanceTracker';
import AdminDietPlans from './pages/admin/DietPlans';
import FitnessTracker from './pages/admin/FitnessTracker';
import ProgressChart from './pages/admin/ProgressChart';
import ManageShop from './pages/admin/ManageShop';
import AdminSettings from './pages/admin/AdminSettings';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyProfile from './pages/customer/MyProfile';
import MyAttendance from './pages/customer/MyAttendance';
import MyPlan from './pages/customer/MyPlan';
import CustomerDiet from './pages/customer/CustomerDiet';
import MyFitness from './pages/customer/MyFitness';
import Shop from './pages/customer/Shop';
import Cart from './pages/customer/Cart';
import Contact from './pages/customer/Contact';
import CustomerSettings from './pages/customer/CustomerSettings';

import './App.css';

// Redirect root based on auth state
function RootRedirect() {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/app" replace />;
}

function App() {
  return (
    <>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes — Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<MemberList />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="plans" element={<MembershipPlans />} />
          <Route path="attendance" element={<AttendanceTracker />} />
          <Route path="diet" element={<AdminDietPlans />} />
          <Route path="diet/:type" element={<AdminDietPlans />} />
          <Route path="fitness" element={<FitnessTracker />}>
            <Route path="progress" element={<ProgressChart />} />
          </Route>
          <Route path="shop" element={<ManageShop />} />
          <Route path="orders" element={<ManageShop />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Customer Routes — Protected */}
        <Route
          path="/app"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="plan" element={<MyPlan />} />
          <Route path="diet" element={<CustomerDiet />} />
          <Route path="diet/:type" element={<CustomerDiet />} />
          <Route path="fitness" element={<MyFitness />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/cart" element={<Cart />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
