import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, activeBorrows: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tüm verileri aynı anda çekiyoruz
      const [books, users, transactions] = await Promise.all([
        api.getBooks().catch(() => []),
        api.getUsers().catch(() => []),
        api.getActiveTransactions().catch(() => [])
      ]);

      // İstatistikleri hesapla
      setStats({
        totalBooks: books.length,
        totalUsers: users.length,
        activeBorrows: transactions.length
      });

      // Sadece en son yapılan 5 işlemi göster (Geçmişten günümüze sıralıysa tersine çevirip alıyoruz)
      setRecentTransactions(transactions.slice(0, 5));

    } catch (err) {
      console.error('Dashboard verileri yüklenemedi:', err);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '24px', color: '#111827' }}>Dashboard yükleniyor...</div>;
  
  if (error) return (
    <div style={{ padding: '24px', color: '#ef4444' }}>
      <h3>Hata!</h3>
      <p>{error}</p>
    </div>
  );

  return (
    <div style={{ padding: '24px', color: '#111827' }}>
      <h1 style={{ fontSize: '28px', margin: '0 0 24px 0', color: '#111827', fontWeight: 'bold' }}>Kütüphane Özeti</h1>

      {/* İSTATİSTİK KARTLARI (WIDGETS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Kart 1: Toplam Kitap */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '12px', color: '#2563eb', display: 'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>library_books</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Sistemdeki Kitaplar</p>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', color: '#111827', fontWeight: 'bold' }}>{stats.totalBooks}</h2>
          </div>
        </div>

        {/* Kart 2: Toplam Kullanıcı */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px', color: '#16a34a', display: 'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>group</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Kayıtlı Üyeler</p>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', color: '#111827', fontWeight: 'bold' }}>{stats.totalUsers}</h2>
          </div>
        </div>

        {/* Kart 3: Kirada Olanlar */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '12px', color: '#ea580c', display: 'flex' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>swap_horiz</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>Kirada Olan Kitaplar</p>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '28px', color: '#111827', fontWeight: 'bold' }}>{stats.activeBorrows}</h2>
          </div>
        </div>

      </div>

      {/* SON HAREKETLER (MİNİ TABLO) */}
      <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#111827', fontWeight: 'bold' }}>Son Kiralama İşlemleri</h2>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>KULLANICI</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>KİTAP</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>TARİH</th>
              <th style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '600' }}>DURUM</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Henüz bir kiralama işlemi yapılmamış.</td>
              </tr>
            ) : (
              recentTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontWeight: '500', color: '#111827' }}>{tx.User?.fullName}</td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>{tx.Book?.title}</td>
                  <td style={{ padding: '16px', color: '#4b5563' }}>{new Date(tx.borrowDate).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', backgroundColor: '#fff7ed', color: '#ea580c', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                      Okuyucuda
                    </span>
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