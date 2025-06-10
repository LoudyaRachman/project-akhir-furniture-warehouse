import React, { useState, useEffect } from 'react';
import './styles/Management.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'staf' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch users dari backend
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input form
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form tambah / edit user
  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.username || !form.password || !form.role) {
      setMessage('Semua field harus diisi');
      return;
    }

    try {
      if (editingId) {
        // Update user
        const res = await fetch(`http://localhost:5001/api/users/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setMessage(data.message || 'User berhasil diupdate');
      } else {
        // Tambah user baru
        const res = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setMessage(data.message || 'User berhasil dibuat');
      }

      setForm({ username: '', password: '', role: 'staf' });
      setEditingId(null);
      fetchUsers();

    } catch (error) {
      setMessage('Terjadi kesalahan saat menyimpan data user');
      console.error(error);
    }
  };

  // Edit user (isi form dengan data user)
  const handleEdit = user => {
    setForm({ username: user.username, password: user.password || '', role: user.role });
    setEditingId(user._id);
    setMessage('');
  };

  // Hapus user
  const handleDelete = async id => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setMessage(data.message || 'User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      setMessage('Gagal menghapus user');
      console.error(error);
    }
  };

  return (
    <div className="management-container">
      <h2>Manajemen User</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required={!editingId}
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="staf">Staf</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">{editingId ? 'Update User' : 'Tambah User'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ username: '', password: '', role: 'staf' });
              setEditingId(null);
              setMessage('');
            }}
            style={{ marginLeft: 10 }}
          >
            Batal
          </button>
        )}
      </form>

      <h3>Daftar User</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                Tidak ada data user
              </td>
            </tr>
          )}
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>{' '}
                <button onClick={() => handleDelete(user._id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
