import { NavLink, Link } from 'react-router-dom'; // YENİ: Link modülünü içeri aldık

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Books', path: '/books', icon: 'book' },
    { name: 'Users', path: '/users', icon: 'group' },
    { name: 'Transactions', path: '/transactions', icon: 'receipt_long' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Library Admin</h1>
        <p>System Controller</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link to="/profile" style={{ textDecoration: 'none', display: 'block' }}>
          <div 
            className="user-profile-card" 
            style={{ 
              transition: 'background-color 0.2s', 
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="avatar-circle" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>U</div>
            <div>
              <p className="user-name-title" style={{ color: 'white', fontSize: '14px', margin: 0 }}>Admin User</p>
              <p className="user-meta-sub" style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Profili Yönet</p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}