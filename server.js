const express = require('express');
const cors = require('cors'); // 1. YENİ: CORS paketini içeri alıyoruz
const config = require('./config'); 
const { sequelize } = require('./models'); 
const routes = require('./routes');

const app = express();

// 2. YENİ: Gelen isteklere (React'ten gelenlere) kapıyı açıyoruz
app.use(cors()); 

app.use(express.json());

// API rotalarını dahil etme
app.use('/api', routes);

// Test rotası
app.get('/', (req, res) => {
  res.send('Kütüphane Yönetim Sistemi Backend API Çalışıyor!');
});

// ... Dosyanın alt kısmındaki sequelize.sync(...) bloğu aynı kalacak
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('PostgreSQL veritabanı başarıyla senkronize edildi.');
    
    app.listen(config.app.port, () => {
      console.log(`Sunucu ${config.app.port} portunda çalışıyor. Ortam: ${config.app.env}`);
    });
  })
  .catch((err) => {
    console.error('Veritabanına bağlanırken hata oluştu:', err);
  });
  