const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// GET /api/transactions/active - Aktif (iade edilmemiş) işlemleri getir
router.get('/active', transactionController.getActiveTransactions);

// POST /api/transactions/borrow - Kitap ödünç ver
router.post('/borrow', transactionController.borrowBook);

// POST /api/transactions/return - Kitap iade al
router.post('/return', transactionController.returnBook);

module.exports = router;