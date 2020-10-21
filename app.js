const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const _handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// Load user model
require('./models/User')


// To Put Keys From Heroku Environment and Hide on Github 
require('dotenv').config()

// Passport Config
require('./config/passport')(passport)

// Load Routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')


//Map global promises
mongoose.Promise = global.Promise
// Mongoose connect
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))


const app = express()

// Handlebars middleware 
app.engine('handlebars', exphbs({
  handlebars: allowInsecurePrototypeAccess(_handlebars),
  defaultLayout:'main'
}))
app.set('view engine', 'handlebars')

// **need to be above of routes**
app.use(cookieParser())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next()
})

// set static folder
app.use(express.static(path.join(__dirname,'public')))

// use Routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)


const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})