const express = require('express')
const Book = require('../models/book')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10)
    res.render('index', books)  
  } catch (error) {
    books = []
    res.render('index', {
      errorMessage: "Failed to load recently added",
      books
    })
  }

})

module.exports = router