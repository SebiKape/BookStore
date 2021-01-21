const express = require('express')
const router = express.Router()
var con_suc = require('../server')

// All author route
router.get('/', (req, res) => {
  res.render('index', con_suc)
})

// New author route
// router.get('/new', (req, res => {

// }))

module.exports = router