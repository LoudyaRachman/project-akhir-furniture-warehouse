import React, { useEffect, useState } from 'react';

export default function Transaction({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    product: '',
    quantity: 1,
    type: 'masuk',
  });
  const [message, setMessage] = useState('');

  // Load transaksi dari backend
  const fetchTransactions = async () => {
    const res = await fetch('http://localhost:5001/api/transaction');
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle tambah transaksi
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kirim data + user_input (username dari user yang login)
    const res = await fetch('http://localhost:5001/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_input: user.username }),
    });

    if (res.ok) {
      setMessage('Transaksi berhasil ditambahkan, menunggu approval manager.');
      setForm({ product: '', quantity: 1, type: 'masuk' });
      fetchTransactions();
    } else {
      setMessage('Gagal menambahkan transaksi.');
    }
  };

  // Handle approve (hanya untuk manager)
  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:5001/api/transaction/${id}/approve`, {
      method: 'PUT',
    });
    if (res.ok) {
      setMessage('Transaksi berhasil diapprove.');
      fetchTransactions();
    } else {
      setMessage('Gagal approve transaksi.');
    }
  };

  return (
    <div>
      <h3>Transaksi</h3>

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
        {transactions.map((t) => (
          <li key={t._id}>
            {t.product} - {t.quantity} - {t.type} - {t.status} - input oleh {t.user_input}
            {user.role === 'manager' && t.status === 'pending' && (
              <button onClick={() => handleApprove(t._id)}>Approve</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
