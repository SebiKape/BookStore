
const express = require('express')
const Book = require('../models/book')
const Author = require('../models/author')
const router = express.Router()
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All books route
router.get('/', async (req, res) => {
    // let query = Book.find()
    // query = query.regex()
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== ""){
    //   searchOptions.title = new RegExp(req.query.title, 'i')
        searchOptions.title = {$regex: req.query.title, $options: 'i'}
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== ""){
        searchOptions.publishDate = {$gte: req.query.publishedAfter}
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== ""){
        searchOptions.publishDate = {$lte: req.query.publishedBefore}
    }
    // searchOptions.publishDate = 
    try {
      const books = await Book.find(searchOptions)
      res.render('books/index', { 
        books,
        searchOptions: req.query
      })
    } catch (error) {
      res.redirect('/')
    }
})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, {
        Book: new Book(),
    })
})

// Create new book route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        // const authors = await Author.find({})
        await book.save()
        res.redirect('books')
    } catch (error) {
        renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        params = {
            authors,
            book
        }
        if (hasError) params.errorMessage = "Error Creating Book"
        res.render('books/new', params)
    } catch (error) {
        res.render('index', {errorMessage: error})
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    }
}

module.exports = router