const express = require('express')
const Author = require('../models/author')
const router = express.Router()

// All author route
router.get('/', (req, res) => {
  res.render('authors/index')
})

// New author route
router.get('/new', (req, res) => {
  res.render('authors/new')
})

// Create new author
router.post('/', (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  author.save( (err,newAuthor) => {
    if (err){
      
    }
  })
  res.send(req.body.name)
})

module.exports = router