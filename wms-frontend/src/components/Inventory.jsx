import React from 'react';

const dummyInventory = [
  { id: 1, name: 'Kursi Kayu', stock: 20 },
  { id: 2, name: 'Meja Makan', stock: 10 },
  { id: 3, name: 'Lemari', stock: 5 },
];

export default function Inventory() {
  return (
    <div>
      <h3>Daftar Inventory</h3>
      <ul>
        {dummyInventory.map(item => (
          <li key={item.id}>
            {item.name} - Stok: {item.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
