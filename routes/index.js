const express = require('express');
const router = express.Router();


const bookRoutes = require('./book.routes');
const userRoutes = require('./user.routes');
const transactionRoutes = require('./transaction.routes');
const authRoutes = require('./auth.routes'); 

router.use('/books', bookRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/auth', authRoutes); 
module.exports = router;