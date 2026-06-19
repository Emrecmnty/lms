const { Sequelize } = require('sequelize');
const config = require('../config'); // Yapılandırma dosyamızı içeri alıyoruz

// Config dosyasından gelen ayarlarla PostgreSQL bağlantısını başlatıyoruz
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging,
  }
);

// Modelleri yükleme
const User = require('./User')(sequelize);
const Book = require('./Book')(sequelize);
const Transaction = require('./Transaction')(sequelize);

// --- İLİŞKİLERİN TANIMLANMASI ---

// 1. Kullanıcı - İşlem İlişkisi (1:N)
User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'RESTRICT' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// 2. Kitap - İşlem İlişkisi (1:N)
Book.hasMany(Transaction, { foreignKey: 'bookId', onDelete: 'RESTRICT' });
Transaction.belongsTo(Book, { foreignKey: 'bookId' });

// 3. Kullanıcı - Kitap Çoka Çok İlişkisi (N:M)
// YENİ: unique: false ekleyerek "aynı kitabı sadece bir kez alabilir" kuralını yıktık!
User.belongsToMany(Book, { through: Transaction, foreignKey: 'userId', unique: false });
Book.belongsToMany(User, { through: Transaction, foreignKey: 'bookId', unique: false });

// Veritabanı nesnesini ve modelleri dışa aktarıyoruz
module.exports = {
  sequelize,
  User,
  Book,
  Transaction
};