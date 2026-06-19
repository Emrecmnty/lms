export default function Topbar({ onLogout }) {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { fullName: 'Admin' };
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A';

  return (
    <div style={{
      height: '72px',
      backgroundColor: 'var(--surface-lowest)',
      borderBottom: '1px solid var(--outline-variant)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // Sadece sağ taraf kaldığı için elemanları sağa yaslıyoruz
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      
      {/* Sağ Taraf: Profil ve Çıkış Butonu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* Kullanıcı Profili */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--on-surface)', margin: 0 }}>{user.fullName}</p>
            <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: 0 }}>Admin</p>
          </div>
          <div className="avatar-circle" style={{ width: '40px', height: '40px', fontSize: '16px', backgroundColor: 'var(--primary-base)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
            {initial}
          </div>
        </div>

        {/* Çıkış Yap Butonu */}
        <button 
          onClick={onLogout} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            backgroundColor: '#fee2e2', 
            color: '#991b1b', 
            border: 'none', 
            cursor: 'pointer', 
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          Logout
        </button>
      </div>
    </div>
  );
}