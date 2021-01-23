const express = require('express')
const Book = require('../models/book')
const Author = require('../models/author')
const router = express.Router()
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const multer = require('multer') 
const { nextTick } = require('process')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All books route
router.get('/', async (req, res) => {
  res.render('books')
})

// New book route
router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({})
        const book = new Book()
        res.render('books/new', {
            authors,
            book
        })
    } catch (error) {
        res.redirect('/books')
    }
})

// Create new book route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName : fileName,
        description: req.body.description
    })

    try {
        const authors = await Author.find({})
        const newBook = await book.save()
        res.redirect('books')
    } catch (error) {
        res.render('index', {errorMessage: error})
    }
})

module.exports = router