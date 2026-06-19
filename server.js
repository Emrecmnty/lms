const express = require('express');
const cors = require('cors'); // 1. YENİ: CORS paketini içeri alıyoruz
const config = require('./config'); 
const { sequelize } = require('./models'); 
const routes = require('./routes');

const app = express();

app.use(cors()); 

app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Kütüphane Yönetim Sistemi Backend API Çalışıyor!');
});

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
  