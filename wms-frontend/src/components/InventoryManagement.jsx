import React, { useEffect, useState } from 'react';
import './styles/Management.css';

export default function InventoryManagement({ user }) {
  const [inventories, setInventories] = useState([]);
  const [form, setForm] = useState({
    nama_produk: '',
    kategori: '',
    satuan: '',
    tanggal_expired: '',
    lokasi: '',
    stok: '',
    status: 'active'
  });

  const fetchInventories = async () => {
    const res = await fetch('http://localhost:5001/api/inventory');
    const data = await res.json();
    setInventories(data);
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:5001/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({
      nama_produk: '',
      kategori: '',
      satuan: '',
      tanggal_expired: '',
      lokasi: '',
      stok: '',
      status: 'active'
    });
    fetchInventories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin hapus produk ini?')) {
      await fetch(`http://localhost:5001/api/inventory/${id}`, {
        method: 'DELETE',
      });
      fetchInventories();
    }
  };

  return (
    <div className="management-container">
      <h3>Manajemen Inventory</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={form.nama_produk}
          onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Satuan"
          value={form.satuan}
          onChange={(e) => setForm({ ...form, satuan: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.tanggal_expired}
          onChange={(e) => setForm({ ...form, tanggal_expired: e.target.value })}
        />
        <input
          type="text"
          placeholder="Lokasi"
          value={form.lokasi}
          onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stok"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value })}
          required
        />
        {user.role === 'manager' && (
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        )}
        <button type="submit">Simpan</button>
      </form>

      <h4>Daftar Produk</h4>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Stok</th>
            <th>Lokasi</th>
            <th>Satuan</th>
            <th>Status</th>
            <th>Kedaluwarsa</th>
            {user.role === 'manager' && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {inventories.map((inv) => (
            <tr key={inv._id}>
              <td>{inv.nama_produk}</td>
              <td>{inv.kategori}</td>
              <td>{inv.stok}</td>
              <td>{inv.lokasi}</td>
              <td>{inv.satuan}</td>
              <td>{inv.status}</td>
              <td>{inv.tanggal_expired?.slice(0, 10)}</td>
              {user.role === 'manager' && (
                <td>
                  <button onClick={() => handleDelete(inv._id)}>Hapus</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
