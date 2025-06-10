import React, { useState, useEffect } from 'react';
import './styles/StaffManagement.css';

export default function StaffTransaction({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    produk: '',
    jumlah: '',
    tipe: 'masuk',
    tanggal: '',
  });

  useEffect(() => {
    setTransactions([
      {
        id: 1,
        produk: 'Kursi Kayu',
        jumlah: 5,
        tipe: 'keluar',
        tanggal: '2025-06-01',
        status: 'pending',
      },
      {
        id: 2,
        produk: 'Meja Makan',
        jumlah: 2,
        tipe: 'masuk',
        tanggal: '2025-06-02',
        status: 'approved',
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Date.now(),
      ...form,
      status: 'pending',
      user_input: user.username,
    };

    setTransactions(prev => [...prev, newTransaction]);

    setForm({
      produk: '',
      jumlah: '',
      tipe: 'masuk',
      tanggal: '',
    });
  };

  return (
    <div className="staff-container">
      <h3>Permintaan Transaksi Barang (Staf)</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="produk"
          placeholder="Nama Produk"
          value={form.produk}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="jumlah"
          placeholder="Jumlah"
          value={form.jumlah}
          onChange={handleInputChange}
          required
          min={1}
        />
        <select name="tipe" value={form.tipe} onChange={handleInputChange}>
          <option value="masuk">Masuk</option>
          <option value="keluar">Keluar</option>
        </select>
        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Ajukan Transaksi</button>
      </form>

      <h4>Daftar Transaksi</h4>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            {tx.tanggal} - {tx.produk} - {tx.jumlah} pcs - {tx.tipe} - Status: {tx.status}
            {tx.status === 'pending' && (
              <span> (Menunggu persetujuan manager)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
