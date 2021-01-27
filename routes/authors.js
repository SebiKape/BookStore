const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')
const router = express.Router()

// All author route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== ""){
    // searchOptions.name = new RegExp(req.query.name, 'i')
    searchOptions.name = {$regex: req.query.name, $options: 'i'}
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
  author = new Author
  res.render('authors/new', author)
})

// Create new author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch (error) {
    res.render('authors/new', {errorMessage: "Error creating Author"})
  }
  
})

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author,
      booksByAuthor: books
    })
  } catch (error) {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', {
      author
    })
  } catch (error) {
    res.redirect('/authors', {
      errorMessage: "Error loading edit author page"
    })
  }
})

router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch (error) {
    if (author == null){
      res.redirect('/')
    }else{
      res.render(`authors/${author.id}/edit`, {errorMessage: "Error updating Author"})
    }
  }
})

router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch (error) {
    if (author == null){
      res.redirect('/')
    }else{
      res.redirect(`/authors/${author.id}`)
    }
  }
})

module.exports = router