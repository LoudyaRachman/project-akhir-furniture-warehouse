import React, { useEffect, useState } from 'react';
import './styles/Management.css';

export default function TransactionManagement({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    product: '',
    quantity: 1,
    type: 'masuk',
  });
  const [message, setMessage] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/transaction');
      if (!res.ok) throw new Error('Gagal mengambil data transaksi');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_input: user.username }),
      });
      if (!res.ok) throw new Error('Gagal menambahkan transaksi');
      
      setMessage('Transaksi berhasil ditambahkan, menunggu approval manager.');
      setForm({ product: '', quantity: 1, type: 'masuk' });
      fetchTransactions();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/transaction/${id}/approve`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Gagal approve transaksi');
      
      setMessage('Transaksi berhasil diapprove.');
      fetchTransactions();
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="management-container">
      <h3>Manajemen Transaksi</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
          required
        />
        <input
          type="number"
          min="1"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="masuk">Masuk</option>
          <option value="keluar">Keluar</option>
        </select>
        <button type="submit">Tambah Transaksi</button>
      </form>

      {message && <p>{message}</p>}

      <h4>Daftar Transaksi</h4>
      <ul>
        {transactions.length === 0 && <li>Belum ada transaksi</li>}
        {transactions.map((t) => (
          <li key={t._id} style={{ marginBottom: 8 }}>
            <strong>{t.product}</strong> - Qty: {t.quantity} - Tipe: {t.type} - Status: {t.status} - Input oleh: {t.user_input}
            {user.role === 'manager' && t.status === 'pending' && (
              <button
                onClick={() => handleApprove(t._id)}
                style={{ marginLeft: 10 }}
              >
                Approve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
