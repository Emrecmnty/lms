const { User } = require('../models');
const bcrypt = require('bcryptjs'); // YENİ: Bu satırı buraya ekliyoruz

// Tüm kullanıcıları getir
const getAllUsers = async () => {
  return await User.findAll();
};

// ID'ye göre tek bir kullanıcı getir
const getUserById = async (id) => {
  return await User.findByPk(id);
};

// Yeni kullanıcı oluştur
const createUser = async (userData) => {
  // Eğer frontend'den şifre geldiyse onu şifrele, gelmediyse varsayılan bir şifre (örn: 123456) ata ve şifrele
  const plainPassword = userData.password || '123456'; 
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  // Şifrelenmiş haliyle veritabanına kaydet
  const userToSave = { ...userData, password: hashedPassword };
  return await User.create(userToSave);
};

// Kullanıcı bilgilerini güncelle
const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Kullanıcı bulunamadı.');
  
  return await user.update(updateData);
};

// Kullanıcıyı sil
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('Kullanıcı bulunamadı.');
  
  await user.destroy();
  return { message: 'Kullanıcı başarıyla silindi.' };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};