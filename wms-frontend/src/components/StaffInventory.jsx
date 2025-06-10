import React, { useState, useEffect } from 'react';
import './styles/StaffManagement.css';

export default function StaffInventory() {
  const [inventoryList, setInventoryList] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama_produk: '',
    kategori: '',
    satuan: '',
    tanggal_expired: '',
    lokasi: '',
    stok: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Simulasi fetch inventory (nanti sambungkan ke backend)
  useEffect(() => {
    // Contoh data dummy
    setInventoryList([
      {
        id: 1,
        nama_produk: 'Kursi Kayu',
        kategori: 'Furniture',
        satuan: 'pcs',
        tanggal_expired: '',
        lokasi: 'Rak A',
        stok: 20,
        status: 'active',
      },
      {
        id: 2,
        nama_produk: 'Meja Makan',
        kategori: 'Furniture',
        satuan: 'pcs',
        tanggal_expired: '',
        lokasi: 'Rak B',
        stok: 10,
        status: 'active',
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update inventory (backend nanti)
      setInventoryList(prev =>
        prev.map(item =>
          item.id === form.id ? { ...form, status: 'active' } : item
        )
      );
    } else {
      // Tambah inventory baru
      const newItem = {
        ...form,
        id: Date.now(),
        status: 'active', // status tidak bisa diubah oleh staf
      };
      setInventoryList(prev => [...prev, newItem]);
    }

    // Reset form
    setForm({
      id: null,
      nama_produk: '',
      kategori: '',
      satuan: '',
      tanggal_expired: '',
      lokasi: '',
      stok: '',
    });
    setIsEditing(false);
  };

  const handleEdit = (item) => {
    setForm(item);
    setIsEditing(true);
  };

  return (
    <div className="staff-container">
      <h3>Manajemen Inventory (Staf)</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nama_produk"
          placeholder="Nama Produk"
          value={form.nama_produk}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="kategori"
          placeholder="Kategori"
          value={form.kategori}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="satuan"
          placeholder="Satuan (pcs, kg, dll)"
          value={form.satuan}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="tanggal_expired"
          placeholder="Tanggal Expired (optional)"
          value={form.tanggal_expired}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lokasi"
          placeholder="Lokasi"
          value={form.lokasi}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="stok"
          placeholder="Stok"
          value={form.stok}
          onChange={handleInputChange}
          required
          min={0}
        />

        <button type="submit">{isEditing ? 'Update' : 'Tambah'}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm({
                id: null,
                nama_produk: '',
                kategori: '',
                satuan: '',
                tanggal_expired: '',
                lokasi: '',
                stok: '',
              });
              setIsEditing(false);
            }}
          >
            Batal
          </button>
        )}
      </form>

      <ul>
        {inventoryList.map(item => (
          <li key={item.id}>
            <b>{item.nama_produk}</b> | Kategori: {item.kategori} | Stok: {item.stok} | Lokasi: {item.lokasi}
            <button onClick={() => handleEdit(item)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
