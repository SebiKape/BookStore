const { JSONCookies } = require('cookie-parser')
const express = require('express')
const Book = require('../models/book')
const router = express.Router()

router.get('/', async (req, res) => {
  let cookies = "";
  try {
    if (req.cookies.Logged != null) {
      cookies = JSONCookies(req.cookies.Logged)
    }
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10)
    res.render('index', { 
      books,
      cookies
    })
  } catch (error) {
    books = []
    res.render('index', {
      errorMessage: "Failed to load recently added",
      books,
      cookies
    })
  }

})

module.exports = router