const API_URL = 'http://localhost:5001/api'; // Portun 5001 olduğuna emin ol

export const api = {
  // 1. Kullanıcıları Getir (GET)
  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Kullanıcı verileri alınamadı.');
    return response.json();
  },
  
  // 2. Yeni Kullanıcı Ekle (POST)
  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kullanıcı eklenemedi.');
    }
    return response.json();
  },
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Giriş başarısız oldu.');
    }
    return response.json();
  },
  
  // --- KİTAP (BOOK) İŞLEMLERİ ---
  getBooks: async () => {
    // YENİ: Tarayıcının hafızasındaki giriş biletini (token) alıyoruz
    const token = localStorage.getItem('token'); 
    
    const response = await fetch(`${API_URL}/books`, {
      // YENİ: İsteğe "Ben giriş yapmış biriyim" başlığını (header) ekliyoruz
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Kitaplar getirilemedi');
    return response.json();
  },
  // --- KİRALAMA (TRANSACTION) İŞLEMLERİ ---
  getActiveTransactions: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/active`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('İşlemler getirilemedi');
    return response.json();
  },

borrowBook: async (transactionData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/borrow`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(transactionData)
    });
    
    // YENİ: Eğer hata varsa, backend'in gönderdiği orijinal mesajı yakala!
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Bilinmeyen bir sunucu hatası');
    }
    return response.json();
  },

  returnBook: async (transactionId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/return`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ transactionId })
    });
    if (!response.ok) throw new Error('İade işlemi başarısız');
    return response.json();
  },

  // 3. YENİ: Kullanıcı Güncelle (PUT) - Hatanın sebebi bu kısmın eksik olmasıydı
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Kullanıcı güncellenemedi.');
    }
    return response.json();
  }
};