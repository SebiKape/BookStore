if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')
const loginRouter = require('./routes/login')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({limit: '10mb', extended: false}))
app.use(methodOverride('_method'))
app.use(cookieParser())

var con_suc = ""
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .catch( function(err)  {
        console.log(err);
    })
const db = mongoose.connection

db.on('error', function(error) {
    con_suc = error;
    module.exports.con_suc = con_suc
    console.log(con_suc)
})
db.once('open', function(){
    con_suc = "Mongodb connected";
    module.exports.con_suc = con_suc
    console.log(con_suc)
})

app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)
app.use('/login', loginRouter)

app.listen(process.env.PORT || 3000)