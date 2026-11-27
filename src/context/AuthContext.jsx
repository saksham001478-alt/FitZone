// AuthContext.jsx — Authentication context providing user state, roles, and member management
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = {
  email: 'admin@fitzone.com',
  password: 'admin123',
};

const initialDefaultMembers = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@fitzone.com',
    password: 'password123',
    phone: '+91 98765 43210',
    plan: 'Premium',
    joinDate: '2025-01-15',
    role: 'customer',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@fitzone.com',
    password: 'password123',
    phone: '+91 98765 43211',
    plan: 'Standard',
    joinDate: '2025-02-01',
    role: 'customer',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@fitzone.com',
    password: 'password123',
    phone: '+91 98765 43212',
    plan: 'Basic',
    joinDate: '2025-02-20',
    role: 'customer',
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha@fitzone.com',
    password: 'password123',
    phone: '+91 98765 43213',
    plan: 'Premium',
    joinDate: '2025-03-05',
    role: 'customer',
  },
];

export function AuthProvider({ children }) {
  // Store user in localStorage key 'fitzone_user'
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fitzone_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error('Error loading user from localStorage:', err);
      return null;
    }
  });

  // Store all members in localStorage key 'members'
  const [members, setMembersState] = useState(() => {
    try {
      const savedMembers = localStorage.getItem('members');
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem('members', JSON.stringify(initialDefaultMembers));
      return initialDefaultMembers;
    } catch (err) {
      console.error('Error loading members from localStorage:', err);
      return initialDefaultMembers;
    }
  });

  // Wrapped setMembers that keeps localStorage updated
  const setMembers = useCallback((updater) => {
    setMembersState((prev) => {
      const nextMembers = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('members', JSON.stringify(nextMembers));
      } catch (err) {
        console.error('Error persisting members to localStorage:', err);
      }
      return nextMembers;
    });
  }, []);

  /**
   * Login async with 800ms simulation
   * Validates admin or customer credentials
   */
  const login = useCallback(
    async (email, password, isAdmin = false) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // Check Admin credentials
      if (isAdmin || cleanEmail === ADMIN_CREDENTIALS.email) {
        if (
          cleanEmail === ADMIN_CREDENTIALS.email &&
          cleanPassword === ADMIN_CREDENTIALS.password
        ) {
          const adminUser = {
            id: 'admin',
            name: 'Admin',
            email: ADMIN_CREDENTIALS.email,
            role: 'admin',
          };
          setUser(adminUser);
          try {
            localStorage.setItem('fitzone_user', JSON.stringify(adminUser));
          } catch (err) {
            console.error('Error saving admin to localStorage:', err);
          }
          return { success: true, user: adminUser };
        }
        return { success: false, error: 'Invalid admin credentials' };
      }

      // Customer authentication against members array
      const member = members.find(
        (m) =>
          m.email?.toLowerCase().trim() === cleanEmail &&
          (m.password === cleanPassword || (!m.password && cleanPassword === 'password123'))
      );

      if (!member) {
        return { success: false, error: 'Invalid email or password' };
      }

      const customerUser = {
        ...member,
        role: 'customer',
      };

      setUser(customerUser);
      try {
        localStorage.setItem('fitzone_user', JSON.stringify(customerUser));
      } catch (err) {
        console.error('Error saving user to localStorage:', err);
      }
      return { success: true, user: customerUser };
    },
    [members]
  );

  /**
   * Register a new member async with 800ms simulation
   * Checks for duplicate email, creates member with id=Date.now().toString(),
   * sets as logged-in customer user.
   */
  const register = useCallback(
    async (userData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const cleanEmail = (userData.email || '').trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: 'Email address is required' };
      }
      //What it does: Pauses code execution for 800 milliseconds (0.8 seconds).
      //Why did we put this?
      //FitZone does not have a real backend server (like Node.js or Python).
      //We added this intentional delay to simulate realistic network latency (like an API call to a real server).
      //This allows the button to show a spinner / loading state for a split second so the app feels real!

      // Check if email already registered
      const emailExists = members.some(
        (m) => m.email?.toLowerCase().trim() === cleanEmail
      );
      if (emailExists || cleanEmail === ADMIN_CREDENTIALS.email) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newMember = {
        id: Date.now().toString(),
        name: userData.name?.trim() || 'New Member',
        email: cleanEmail,
        password: userData.password || 'password123',
        phone: userData.phone || '',
        plan: userData.plan || 'Basic',
        joinDate: new Date().toISOString().split('T')[0],
        role: 'customer',
        ...userData,
      };

      // Update members array & localStorage
      setMembers((prev) => [...prev, newMember]);

      // Set logged-in customer user
      setUser(newMember);
      try {
        localStorage.setItem('fitzone_user', JSON.stringify(newMember));
      } catch (err) {
        console.error('Error saving new user to localStorage:', err);
      }

      return { success: true, user: newMember };
    },
    [members, setMembers]
  );

  /**
   * Logout user and clear from localStorage
   */
  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('fitzone_user');
    } catch (err) {
      console.error('Error removing user from localStorage:', err);
    }
  }, []);

  /**
   * Update profile information for active user and members array
   */
  const updateProfile = useCallback(
    (updates) => {
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      try {
        localStorage.setItem('fitzone_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Error updating user in localStorage:', err);
      }

      // If user is a customer member, update in members list as well
      if (user.role === 'customer') {
        setMembers((prevMembers) =>
          prevMembers.map((m) =>
            m.id === user.id ? { ...m, ...updates } : m
          )
        );
      }
    },
    [user, setMembers]
  );

  const role = user?.role || null;
  const isAuthenticated = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated,
      members,
      setMembers,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, role, isAuthenticated, members, setMembers, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
