const express = require('express')
const Author = require('../models/author')
const router = express.Router()

// All author route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== ""){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', { 
      authors,
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('/')
  }
  
})

// New author route
router.get('/new', (req, res) => {
  res.render('authors/new')
})

// Create new author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    newAuthor = await author.save()
    res.redirect('authors')
  } catch (error) {
    res.render('authors/new', {errorMessage: "Error creating Author"})
  }
  
})

module.exports = router