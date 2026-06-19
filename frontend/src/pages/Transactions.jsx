import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ userId: '', bookId: '', dueDate: '' });
  
  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const txData = await api.getActiveTransactions().catch(() => { throw new Error("Aktif işlemler API'den çekilemedi."); });
      const usersData = await api.getUsers().catch(() => { throw new Error("Kullanıcılar API'den çekilemedi."); });
      const booksData = await api.getBooks().catch(() => { throw new Error("Kitaplar API'den çekilemedi."); });
      
      setTransactions(txData);
      setUsers(usersData || []);
      setBooks((booksData || []).filter(b => b.status === 'Available'));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.bookId) {
      alert('Lütfen hem kullanıcıyı hem de kitabı seçin.');
      return;
    }
    
    const dataToSend = {
      userId: formData.userId,
      bookId: formData.bookId,
      dueDate: formData.dueDate === '' ? null : formData.dueDate
    };

    try {
      await api.borrowBook(dataToSend);
      
      setIsModalOpen(false);
      setFormData({ userId: '', bookId: '', dueDate: '' });
      setUserSearch(''); 
      setBookSearch('');
      loadAllData();
    } catch (err) {
      alert('Kiralama işlemi başarısız oldu.');
    }
  };

  const handleReturn = async (transactionId, bookTitle) => {
    if (window.confirm(`"${bookTitle}" adlı kitabı iade almak istediğinize emin misiniz?`)) {
      try {
        await api.returnBook(transactionId);
        loadAllData();
      } catch (err) {
        alert('İade işlemi başarısız oldu.');
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) || 
    b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
    (b.shelf && b.shelf.toLowerCase().includes(bookSearch.toLowerCase()))
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTransactions = transactions.filter(tx => tx.dueDate && new Date(tx.dueDate) < today);
  const activeTransactions = transactions.filter(tx => !tx.dueDate || new Date(tx.dueDate) >= today);

  if (loading) return <div style={{ padding: '24px', color: '#111827' }}>Veriler yükleniyor...</div>;

  if (error) return (
    <div style={{ padding: '24px', color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', margin: '24px' }}>
      <h3 style={{ marginTop: 0 }}>Bağlantı Hatası!</h3>
      <p>{error}</p>
      <button onClick={loadAllData} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Tekrar Dene</button>
    </div>
  );

  return (
    <div style={{ padding: '24px', color: '#111827' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Kiralama İşlemleri</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>swap_horiz</span>
          Kitap Ödünç Ver
        </button>
      </div>

      {overdueTransactions.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="material-symbols-outlined">warning</span>
            İadesi Geciken Kitaplar
          </h2>
          <div style={{ backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fca5a5', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#fee2e2', borderBottom: '1px solid #fca5a5' }}>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#991b1b', fontWeight: '600' }}>KULLANICI</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#991b1b', fontWeight: '600' }}>KİTAP (RAF)</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#991b1b', fontWeight: '600' }}>SON İADE TARİHİ</th>
                  <th style={{ padding: '16px', fontSize: '14px', color: '#991b1b', fontWeight: '600', textAlign: 'right' }}>İŞLEM</th>
                </tr>
              </thead>
              <tbody>
                {overdueTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #fca5a5' }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#7f1d1d' }}>
                      {tx.User?.fullName} <br/> <span style={{ fontSize: '12px', fontWeight: 'normal' }}>{tx.User?.email}</span>
                    </td>
                    <td style={{ padding: '16px', color: '#7f1d1d' }}>
                      {tx.Book?.title} <br/> <span style={{ fontSize: '12px' }}>Raf: {tx.Book?.shelf || 'Belirtilmedi'}</span>
                    </td>
                    <td style={{ padding: '16px', color: '#dc2626', fontWeight: 'bold' }}>
                      {new Date(tx.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleReturn(tx.id, tx.Book?.title)}
                        style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        İade Al
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '18px', color: '#111827', marginBottom: '12px' }}>Aktif Kiralamalar</h2>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>KULLANICI</th>
                <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>KİTAP (RAF)</th>
                <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>VERİLİŞ TARİHİ</th>
                <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>SON İADE</th>
                <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600', textAlign: 'right' }}>İŞLEM</th>
              </tr>
            </thead>
            <tbody>
              {activeTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Şu an süresi devam eden kiralama bulunmuyor.</td>
                </tr>
              ) : (
                activeTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>
                      {tx.User?.fullName} <br/> <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>{tx.User?.email}</span>
                    </td>
                    <td style={{ padding: '16px', color: '#111827' }}>
                      {tx.Book?.title} <br/> <span style={{ fontSize: '12px', color: '#6b7280' }}>Raf: {tx.Book?.shelf || 'Belirtilmedi'}</span>
                    </td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>
                      {new Date(tx.borrowDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td style={{ padding: '16px', color: '#4b5563' }}>
                      {tx.dueDate ? new Date(tx.dueDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleReturn(tx.id, tx.Book?.title)}
                        style={{ padding: '6px 12px', backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                      >
                        İade Al
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#111827', fontSize: '20px', fontWeight: 'bold' }}>Kitap Ödünç Ver</h2>
            <form onSubmit={handleBorrow} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>1. Kullanıcı Ara ve Seç</label>
                <input 
                  type="text" 
                  placeholder="İsim veya e-posta ile ara..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
                <select 
                  name="userId" 
                  value={formData.userId} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#111827', fontSize: '14px' }}
                >
                  <option value="" style={{ color: '#6b7280' }}>-- Filtrelenenlerden Seç --</option>
                  {filteredUsers.map(user => (
                    <option key={user.id} value={user.id} style={{ color: '#111827' }}>{user.fullName} ({user.email})</option>
                  ))}
                </select>
                {filteredUsers.length === 0 && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>Eşleşen kullanıcı bulunamadı.</span>}
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>2. Kitap Ara ve Seç (Raftakiler)</label>
                <input 
                  type="text" 
                  placeholder="Kitap, yazar veya raf ile ara..." 
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
                />
                <select 
                  name="bookId" 
                  value={formData.bookId} 
                  onChange={handleInputChange} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#111827', fontSize: '14px' }}
                >
                  <option value="" style={{ color: '#6b7280' }}>-- Filtrelenenlerden Seç --</option>
                  {filteredBooks.map(book => (
                    <option key={book.id} value={book.id} style={{ color: '#111827' }}>{book.title} - {book.author} (Raf: {book.shelf})</option>
                  ))}
                </select>
                {filteredBooks.length === 0 && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>Eşleşen rafta kitap bulunamadı.</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>3. Son İade Tarihi (Opsiyonel)</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', color: '#111827' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setUserSearch(''); setBookSearch(''); }} 
                  style={{ padding: '10px 16px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', color: '#374151', fontWeight: '600' }}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Onayla ve Ver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}