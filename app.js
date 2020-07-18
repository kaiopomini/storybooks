const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

// To Put Keys From Heroku Environment and Hide on Github
require('dotenv').config()

// Passport Config
require('./config/passport')(passport)

// Load Routes
const auth = require('./routes/auth')

const app = express()

app.get('/', (req, res) => {
  res.send('It Works')
})

// use Routes
app.use('/auth', auth)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})