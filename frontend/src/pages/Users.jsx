import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', status: 'Active' });

  const fetchUsers = () => {
    setLoading(true);
    api.getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Veri yükleme hatası:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setFormData({ 
      fullName: user.fullName, 
      email: user.email, 
      phone: user.phone || '', 
      status: user.status || 'Active' 
    });
    setEditingUserId(user.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setEditingUserId(null);
      setFormData({ fullName: '', email: '', phone: '', status: 'Active' });
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await api.updateUser(editingUserId, formData);
      } else {
        await api.createUser(formData);
      }
      
      setFormData({ fullName: '', email: '', phone: '', status: 'Active' });
      setEditingUserId(null);
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      alert("İşlem sırasında hata oluştu: " + error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(lowerCaseSearch) ||
      user.email.toLowerCase().includes(lowerCaseSearch) ||
      (user.phone && user.phone.includes(searchTerm))
    );
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p>Manage library patrons and administrative staff.</p>
        </div>
        <button className="btn-primary" onClick={handleToggleForm}>
          <span className="material-symbols-outlined">
            {showForm ? 'close' : 'person_add'}
          </span>
          {showForm ? 'Cancel' : 'Register User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface-lowest)', padding: '24px', borderRadius: '12px', border: '1px solid var(--outline-variant)', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
            {editingUserId ? 'Edit Member' : 'Add New Member'}
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              style={{ flex: 1, minWidth: '200px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ flex: 1, minWidth: '200px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ flex: 1, minWidth: '150px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{ flex: 1, minWidth: '150px', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-lowest)' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginLeft: 'auto', display: 'block' }}>
            {editingUserId ? 'Update Member' : 'Save Member'}
          </button>
        </form>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-card-title">Total Members</p>
          <p className="stat-card-value">{users.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-title">Active Today</p>
          <p className="stat-card-value">{users.filter(u => u.status !== 'Inactive').length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card-title">New Registrations</p>
          <p className="stat-card-value">28</p>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Member List</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', color: 'var(--on-surface-variant)', fontSize: '20px' }}>search</span>
            <input 
              type="text" 
              placeholder="Search name, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid var(--outline-variant)', backgroundColor: 'var(--surface-lowest)', color: 'var(--on-surface)', width: '250px' }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading records...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--on-surface-variant)' }}>No members found matching your search.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-circle">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="user-name-title">{user.fullName}</p>
                        <p className="user-meta-sub">Member</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--on-surface-variant)' }}>{user.email}</td>
                  <td style={{ color: 'var(--on-surface-variant)' }}>{user.phone || '-'}</td>

                  <td>
                    <span 
                      style={{
                        backgroundColor: (user.status || 'Active') === 'Active' ? '#dcfce7' : '#f3f4f6',
                        color: (user.status || 'Active') === 'Active' ? '#166534' : '#4b5563',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEditClick(user)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}