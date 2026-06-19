const { Transaction, Book, User } = require('../models');

// 1. Kitap Kirala
const borrowBook = async (userId, bookId, dueDate) => {
  const book = await Book.findByPk(bookId);
  if (!book) throw new Error('Kitap bulunamadı.');
  if (book.status === 'Borrowed') throw new Error('Bu kitap zaten başka birine kiralanmış.');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('Kullanıcı bulunamadı.');

  const transaction = await Transaction.create({
    userId,
    bookId,
    borrowDate: new Date(),
    dueDate: dueDate || null,
    status: 'Borrowed'
  });

  await book.update({ status: 'Borrowed' });
  return transaction;
};

// 2. Kitap İade Al
const returnBook = async (transactionId) => {
  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) throw new Error('Kiralama işlemi bulunamadı.');
  if (transaction.status === 'Returned') throw new Error('Bu kitap zaten iade edilmiş.');

  await transaction.update({
    returnDate: new Date(),
    status: 'Returned'
  });

  const book = await Book.findByPk(transaction.bookId);
  if (book) {
    await book.update({ status: 'Available' });
  }

  return transaction;
};

// 3. YENİ: Sadece Aktif (Kirada Olan) İşlemleri Getir
const getActiveTransactions = async () => {
  return await Transaction.findAll({
    where: { status: 'Borrowed' }, // Sadece iade edilmemiş olanları getir
    include: [
      { model: User, attributes: ['id', 'fullName', 'email'] },
      { model: Book, attributes: ['id', 'title', 'author', 'shelf'] }
    ],
    order: [['borrowDate', 'DESC']]
  });
};

module.exports = {
  borrowBook,
  returnBook,
  getActiveTransactions
};