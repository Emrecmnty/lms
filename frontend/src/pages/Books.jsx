import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', shelf: '', status: 'Available' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Kitaplar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.shelf && book.shelf.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createBook(formData);
      setIsModalOpen(false);
      setFormData({ title: '', author: '', isbn: '', shelf: '', status: 'Available' });
      loadBooks(); // Listeyi yenile
    } catch (err) {
      alert('Kitap eklenirken hata oluştu.');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`"${title}" adlı kitabı başka bir kütüphaneye taşımak (silmek) istediğinize emin misiniz?`)) {
      try {
        await api.deleteBook(id);
        loadBooks(); // Listeyi yenile
      } catch (err) {
        alert('Kitap silinirken hata oluştu.');
      }
    }
  };

  if (loading) return <div style={{ padding: '24px', color: '#111827' }}>Kitaplar yükleniyor...</div>;
  if (error) return <div style={{ padding: '24px', color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      
      {/* ÜST BÖLÜM: Başlık, Arama ve Buton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: '#111827', fontWeight: 'bold' }}>Kitap Yönetimi</h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Arama Kutusu (Butonun yanına alındı) */}
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '20px' }}>search</span>
            <input 
              type="text" 
              placeholder="Kitap, yazar veya raf ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #d1d5db', width: '260px', backgroundColor: '#ffffff', color: '#111827', fontSize: '14px' }}
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            Yeni Kitap Ekle
          </button>
        </div>
      </div>

      {/* Kitaplar Tablosu */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>KİTAP ADI</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>YAZAR</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>RAF BİLGİSİ</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>DURUM</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600', textAlign: 'right' }}>İŞLEMLER</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Sistemde henüz kitap bulunmuyor.</td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#111827' }}>{book.title}</td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>{book.author}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', border: '1px solid #d1d5db', color: '#374151' }}>
                      {book.shelf || 'Belirtilmedi'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '16px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      backgroundColor: book.status === 'Available' ? '#dcfce7' : '#fee2e2',
                      color: book.status === 'Available' ? '#166534' : '#991b1b'
                    }}>
                      {book.status === 'Available' ? 'Rafta' : 'Kirada'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(book.id, book.title)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}
                      title="Başka Kütüphaneye Taşı"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px', color: '#111827' }}>Yeni Kitap Ekle</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Kitap Adı</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Yazar</label>
                <input type="text" name="author" value={formData.author} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>ISBN / Barkod</label>
                  <input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Raf Konumu</label>
                  <input type="text" name="shelf" value={formData.shelf} onChange={handleInputChange} placeholder="Örn: A-1" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', color: '#111827' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', color: '#374151', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>İptal</button>
                <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}