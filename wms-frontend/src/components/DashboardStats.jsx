import React, { useEffect, useState } from 'react';
import './styles/Dashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function DashboardStats() {
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [utilisasi, setUtilisasi] = useState({ persen: 0, total: 0, aktif: 0 });

  useEffect(() => {
    //Fetch Top Products
    fetch('http://localhost:5001/api/dashboard/top-products')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          name: item._id,
          total: item.total
        }));
        setTopProducts(formatted);
      });

    //Fetch Monthly Stats
    fetch('http://localhost:5001/api/dashboard/monthly-stats')
      .then(res => res.json())
      .then(data => {
        const stats = {};
        data.forEach(item => {
          const bulan = item._id.bulan;
          const tipe = item._id.tipe;
          if (!stats[bulan]) stats[bulan] = { bulan, masuk: 0, keluar: 0 };
          if (tipe === 'masuk') stats[bulan].masuk = item.total;
          else if (tipe === 'keluar') stats[bulan].keluar = item.total;
        });
        const arr = Object.values(stats).sort((a, b) => a.bulan - b.bulan);
        setMonthlyStats(arr);
      });

    //Fetch Low Stock
    fetch('http://localhost:5001/api/dashboard/low-stock')
      .then(res => res.json())
      .then(setLowStock);

    //Fetch Utilisasi
    fetch('http://localhost:5001/api/dashboard/utilisasi')
      .then(res => res.json())
      .then(setUtilisasi);
  }, []);

  return (
    <section className="stats-section">
      <h2>Dashboard Statistik</h2>

      {/* Top 5 Produk Aktif */}
      <h3>Top 5 Produk Aktif</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={topProducts}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Grafik Barang Masuk & Keluar */}
      <h3>Barang Masuk & Keluar per Bulan</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyStats}>
          <XAxis dataKey="bulan" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="masuk" fill="#82ca9d" />
          <Bar dataKey="keluar" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Utilisasi Gudang */}
      <h3>Utilisasi Gudang</h3>
      <PieChart width={200} height={200}>
        <Pie
          data={[
            { name: 'Aktif', value: utilisasi.aktif },
            { name: 'Tidak Aktif', value: utilisasi.total - utilisasi.aktif }
          ]}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          <Cell key="aktif" fill="#0088FE" />
          <Cell key="tidakaktif" fill="#FF8042" />
        </Pie>
      </PieChart>
      <p>{utilisasi.persen}% Gudang Terpakai</p>

      {/* Peringatan Stok Menipis */}
      <h3>Stok Menipis (Kurang dari 10)</h3>
      {lowStock.length === 0 && <p>Tidak ada stok menipis</p>}
      <ul>
        {lowStock.map(item => (
          <li key={item._id}>
            {item.nama_produk} - Stok: {item.stok}
          </li>
        ))}
      </ul>
    </section>
  );
}
