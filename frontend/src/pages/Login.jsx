import { useState } from 'react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {

      const data = await api.login({ email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--surface-base)' }}>
      <div style={{ backgroundColor: 'var(--surface-lowest)', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: '1px solid var(--outline-variant)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="avatar-circle" style={{ width: '64px', height: '64px', margin: '0 auto 16px auto', fontSize: '24px', backgroundColor: 'var(--primary-base)' }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '32px' }}>lock</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--on-surface)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: '8px' }}>Please enter your details to sign in.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--on-surface)' }}>Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@library.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-lowest)', fontSize: '15px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--on-surface)' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-lowest)', fontSize: '15px' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '8px', height: '48px', fontSize: '16px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
      </div>
    </div>
  );
}