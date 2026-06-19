const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// GET /api/books - Tüm kitapları getir
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - Tekil kitap getir
router.get('/:id', bookController.getBookById);

// POST /api/books - Yeni kitap ekle
router.post('/', bookController.createBook);

// PUT /api/books/:id - Kitap güncelle
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - Kitap sil
router.delete('/:id', bookController.deleteBook);

module.exports = router;