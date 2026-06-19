// .env dosyasındaki değişkenleri okumak için
require('dotenv').config();

const config = {
  app: {
    port: process.env.PORT || 5001,
    env: process.env.NODE_ENV || 'development',
  },
  
  database: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'kutuphane_db',
    username: process.env.DB_USER || 'umit',
    password: process.env.DB_PASSWORD || '',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'varsayilan_gizli_anahtar',
  }
};

module.exports = config;