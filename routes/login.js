const express = require('express')
const User = require('../models/user')
const router = express.Router()

// Get Credentials Roujte
router.get('/', async (req, res) => {
  res.render('login/credentials')
})

router.get('/new', async (req, res) => {
  res.render('login/new')
})

//Create User Route
router.post('/', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  try {
    await user.save()
    res.render('login/user', {user: user}) 
  } catch (error) {
    res.render('login/credentials', {errorMessage: error})
  }
})

//Login User Route
router.put('/', async (req, res) => {
  try {
    let credentialError = false
    const whereString = {}
    whereString.username = req.body.username
    const user = await User.findOne(whereString)
    if (user == null || user =='') {
      credentialError = true
    } 
    else {
      if (user.password === req.body.password) {
        credentialError = false
      }
      else {
        credentialError = true;
      }
    }

    if (!credentialError) {
      console.log("User logged")
      res.cookie('Logged',"yes", { maxAge: 900000, httpOnly: true })
      res.redirect('/')
    } else {
      res.render('login/credentials', {
        errorMessage: "Incorrect username or password"
      })
    }
  } catch (error) {
    res.render('login/credentials', {
      errorMessage: "Incorrect username or password"
    })
  }
})


module.exports = router