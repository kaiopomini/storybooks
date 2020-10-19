const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

// Load user model
require('./models/User')


// To Put Keys From Heroku Environment and Hide on Github 
require('dotenv').config()

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')


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

app.get('/', (req, res) => {
  res.send('It Works')
})

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
  res.locals.user = req.user || null
  next()
})

// use Routes
app.use('/auth', auth)




const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})