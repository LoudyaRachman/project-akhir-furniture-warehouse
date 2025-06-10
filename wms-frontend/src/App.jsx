import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InventoryManagement from './components/InventoryManagement';
import UserManagement from './components/UserManagement';
import LocationManagement from './components/LocationManagement';
import TransactionManagement from './components/TransactionManagement';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/'); // Redirect ke dashboard setelah login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  const isManager = user.role === 'manager';

  return (
    <div className="container">
      <header className="header">
        <h2>WMS Furniture</h2>
        <div>
          <strong>{user.username}</strong> ({user.role})
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Inventory
        </NavLink>
        {isManager && (
          <>
            <NavLink
              to="/users"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Manajemen User
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Manajemen Lokasi
            </NavLink>
          </>
        )}
        <NavLink
          to="/transactions"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Transaksi
        </NavLink>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route
            path="/users"
            element={isManager ? <UserManagement /> : <Navigate to="/" />}
          />
          <Route
            path="/locations"
            element={isManager ? <LocationManagement /> : <Navigate to="/" />}
          />
          <Route
            path="/transactions"
            element={<TransactionManagement user={user} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

// Bungkus App dengan Router supaya bisa pakai useNavigate
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
