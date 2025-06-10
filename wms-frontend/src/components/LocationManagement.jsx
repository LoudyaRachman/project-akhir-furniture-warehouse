import React, { useState, useEffect } from 'react';
import './styles/Management.css';

export default function LocationManagement() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ nama_lokasi: '', deskripsi: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchLocations = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/locations');
      const data = await res.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetch locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.nama_lokasi) {
      setMessage('Nama lokasi wajib diisi');
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5001/api/locations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        await res.json();
        setMessage('Lokasi berhasil diperbarui');
      } else {
        const res = await fetch('http://localhost:5001/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        await res.json();
        setMessage('Lokasi berhasil ditambahkan');
      }

      setForm({ nama_lokasi: '', deskripsi: '' });
      setEditingId(null);
      fetchLocations();

    } catch (error) {
      setMessage('Terjadi kesalahan saat menyimpan lokasi');
      console.error(error);
    }
  };

  const handleEdit = loc => {
    setForm({ nama_lokasi: loc.nama_lokasi, deskripsi: loc.deskripsi || '' });
    setEditingId(loc._id);
    setMessage('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Yakin ingin menghapus lokasi ini?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/locations/${id}`, { method: 'DELETE' });
      await res.json();
      setMessage('Lokasi berhasil dihapus');
      fetchLocations();
    } catch (error) {
      setMessage('Gagal menghapus lokasi');
      console.error(error);
    }
  };

  return (
    <div className="management-container">
      <h2>Manajemen Lokasi</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="nama_lokasi"
          type="text"
          placeholder="Nama Lokasi"
          value={form.nama_lokasi}
          onChange={handleChange}
          required
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          rows={3}
          style={{ width: '100%', marginTop: 5 }}
        />
        <button type="submit">{editingId ? 'Update Lokasi' : 'Tambah Lokasi'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ nama_lokasi: '', deskripsi: '' });
              setEditingId(null);
              setMessage('');
            }}
            style={{ marginLeft: 10 }}
          >
            Batal
          </button>
        )}
      </form>

      <h3>Daftar Lokasi</h3>
      <table>
        <thead>
          <tr>
            <th>Nama Lokasi</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {locations.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>Tidak ada data lokasi</td>
            </tr>
          )}
          {locations.map(loc => (
            <tr key={loc._id}>
              <td>{loc.nama_lokasi}</td>
              <td>{loc.deskripsi}</td>
              <td>
                <button onClick={() => handleEdit(loc)}>Edit</button>{' '}
                <button onClick={() => handleDelete(loc._id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
