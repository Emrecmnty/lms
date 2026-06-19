const transactionService = require('../services/transaction.service');

const getActiveTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getActiveTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { userId, bookId, dueDate } = req.body;
    const transaction = await transactionService.borrowBook(userId, bookId, dueDate);
    res.status(201).json(transaction);
  } catch (error) {
    console.error("\n🚨 KİRALAMA HATASI YAKALANDI:", error); 
    
    res.status(400).json({ error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    // POST işlemi olduğu için transactionId'yi body'den bekliyoruz
    const { transactionId } = req.body; 
    const transaction = await transactionService.returnBook(transactionId);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getActiveTransactions,
  borrowBook,
  returnBook
};