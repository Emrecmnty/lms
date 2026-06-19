const express = require('express');
const router = express.Router();

// Route dosyalarını içeri alıyoruz
const bookRoutes = require('./book.routes');
const userRoutes = require('./user.routes');
const transactionRoutes = require('./transaction.routes');
const authRoutes = require('./auth.routes'); // YENİ: Auth rotasını içeri aldık

// Gelen istekleri ilgili route dosyalarına yönlendiriyoruz
router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/auth', authRoutes); // YENİ: /api/auth adresini yönlendirdik

module.exports = router;