import React, { useState } from 'react';
import './styles/Login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login gagal');
        return;
      }

      const data = await response.json();
      setMessage(`Login berhasil! Selamat datang, ${data.username} (${data.role})`);
      onLoginSuccess({ username: data.username, role: data.role });
    } catch (error) {
      setMessage('Terjadi kesalahan saat login');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>LAL FURNITURE</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p id="error-message">{message}</p>}
    </div>
  );
}
