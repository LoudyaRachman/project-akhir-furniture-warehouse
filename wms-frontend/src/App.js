import React, { useState } from 'react';
import './App.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import LocationManagement from './components/LocationManagement';
import TransactionManagement from './components/TransactionManagement';
import StaffInventory from './components/StaffInventory';
import StaffTransaction from './components/StaffTransaction';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

   if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  const isManager = user.role === 'manager';

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div>
          <h2>LAL Furniture</h2>
          <p className="username">{user.username} ({user.role})</p>
          <nav>
            <button
              className={page === 'dashboard' ? 'active' : ''}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>

            {isManager ? (
              <>
                <button
                  className={page === 'user-management' ? 'active' : ''}
                  onClick={() => setPage('user-management')}
                >
                  Manajemen User
                </button>
                <button
                  className={page === 'location-management' ? 'active' : ''}
                  onClick={() => setPage('location-management')}
                >
                  Manajemen Lokasi
                </button>
                <button
                  className={page === 'transaction-management' ? 'active' : ''}
                  onClick={() => setPage('transaction-management')}
                >
                  Manajemen Transaksi
                </button>
              </>
            ) : (
              <>
                <button
                  className={page === 'staff-inventory' ? 'active' : ''}
                  onClick={() => setPage('staff-inventory')}
                >
                  Inventory (Staf)
                </button>
                <button
                  className={page === 'staff-transaction' ? 'active' : ''}
                  onClick={() => setPage('staff-transaction')}
                >
                  Transaksi (Staf)
                </button>
              </>
            )}
          </nav>
        </div>

        <button className="logout-btn" onClick={() => setUser(null)}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {page === 'dashboard' && <Dashboard user={user} />}
        {page === 'user-management' && isManager && <UserManagement />}
        {page === 'location-management' && isManager && <LocationManagement />}
        {page === 'transaction-management' && isManager && <TransactionManagement user={user} />}
        {page === 'staff-inventory' && !isManager && <StaffInventory />}
        {page === 'staff-transaction' && !isManager && <StaffTransaction user={user} />}
      </main>
    </div>
  );
}
