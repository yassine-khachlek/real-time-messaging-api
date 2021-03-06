var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('./middlewares/logger')
const cors = require('./middlewares/cors.js')
require('./modules/database.js')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var messagesRouter = require('./routes/messages')
var filesRouter = require('./routes/files')
var authRouter = require('./routes/auth')
var docsRouter = require('./routes/docs')

var app = express()

app.use(cors)

app.set('view engine', 'ejs')

if (process.env.NODE_ENV !== 'test') {
  app.use(logger(process.env.LOG_FORMAT))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/messages', messagesRouter)
app.use('/files', filesRouter)
app.use('/auth', authRouter)
app.use('/docs', docsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500).json({
    errors: [
      {
        status: err.status || 500,
        title: err.message
      }
    ]
  })
})

module.exports = app
