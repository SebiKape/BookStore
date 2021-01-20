const express = require('express')
const router = express.Router()
var con_suc = require('../server')

router.get('/', (req, res) => {
  res.render('index', con_suc)
})

module.exports = router