const { Book } = require('../models');

// Tüm kitapları getir
const getAllBooks = async () => {
  return await Book.findAll();
};

// ID'ye göre tek bir kitap getir
const getBookById = async (id) => {
  return await Book.findByPk(id);
};

// Yeni kitap oluştur (Oluşturulurken güncel stok, toplam stoka eşitlenir)
const createBook = async (bookData) => {
  const data = {
    ...bookData,
    currentStock: bookData.totalStock || 1 // Varsayılan stok 1
  };
  return await Book.create(data);
};

// Kitap bilgilerini güncelle
const updateBook = async (id, updateData) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Kitap bulunamadı.');
  
  return await book.update(updateData);
};

// Kitabı sil
const deleteBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) throw new Error('Kitap bulunamadı.');
  
  await book.destroy();
  return { message: 'Kitap başarıyla silindi.' };
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};