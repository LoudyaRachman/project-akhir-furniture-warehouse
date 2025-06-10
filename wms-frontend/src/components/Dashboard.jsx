import React from 'react';
import './styles/Dashboard.css';
import DashboardStats from './DashboardStats';

export default function Dashboard({ user }) {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Selamat datang di LAL Furniture Warehouse, {user.username}!</p>
      <p>Role kamu: {user.role}</p>

      {user.role === 'manager' && <DashboardStats />}
      {/* Kalau staf, tampilkan lain nanti */}
    </div>
  );
}

