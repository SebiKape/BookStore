
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

//show Book Route
router.get('/:id', async (req, res) => {
     try {
         const book = await Book.findById(req.params.id).populate('author').exec()
         res.render('books/show', {
             book
         })
     } catch (error) {
         res.redirect('/')
     }
})

// Edit route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)   
    } catch (error) {
        res.redirect('/')
    }
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
        const newBook = await book.save()
        res.redirect(`/books/${newBook.id}`)
    } catch (error) {
        renderNewPage(res, book, true)
    }
})

//Edit Book Route
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover != '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (error) {
        if (book == null){
            res.redirect('/')
        } else{
            renderEditPage(res, book, true)
        }
        console.log(error)
    }
})

router.delete('/:id', async (req, res) => {
    let book
    try {
      book = await Book.findById(req.params.id)
      await book.remove()
      res.redirect('/books')
    } catch (error) {
      if (book == null){
        res.redirect('/')
      }else{
        res.render(`/books/show`, {
            book,
            errorMessage: "Could not delete user"
        })
      }
    }
})

async function renderNewPage(res, book, hasError = false){
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false){
    try {
        const authors = await Author.find({})
        params = {
            authors,
            book
        }
        if (hasError) params.errorMessage = "Error Creating/Updating Book"
        res.render(`books/${form}`, params)
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