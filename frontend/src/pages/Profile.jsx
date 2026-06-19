import { useState } from 'react';

export default function Profile() {
  // Giriş yapan kullanıcının bilgilerini alıyoruz
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { fullName: 'Admin', email: 'admin@library.com' };
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A';

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Yeni şifreler birbiriyle eşleşmiyor!' });
      return;
    }
    setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi (Simülasyon).' });
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', margin: '0 0 24px 0', color: '#111827', fontWeight: 'bold' }}>Profil Ayarları</h1>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
   
        <div style={{ flex: '1 1 300px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', color: '#111827', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Hesap Detayları</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '50%', color: 'white', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {initial}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>{user.fullName}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Sistem Yöneticisi</p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>E-Posta Adresi</label>
            <div style={{ padding: '10px 12px', backgroundColor: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '6px', color: '#4b5563', fontSize: '14px' }}>
              {user.email}
            </div>
          </div>
        </div>
        <div style={{ flex: '2 1 400px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', color: '#111827', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>Güvenlik / Şifre Değiştir</h2>
          
          {message.text && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#991b1b' : '#166534', border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}` }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Mevcut Şifre</label>
              <input type="password" name="current" value={passwords.current} onChange={handleInputChange} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Yeni Şifre</label>
              <input type="password" name="new" value={passwords.new} onChange={handleInputChange} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Yeni Şifre (Tekrar)</label>
              <input type="password" name="confirm" value={passwords.confirm} onChange={handleInputChange} required placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }} />
            </div>
            
            <button type="submit" style={{ marginTop: '8px', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start' }}>
              Şifreyi Güncelle
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}