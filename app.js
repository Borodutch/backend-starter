const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

mongoose.connect(process.env.url, { useNewUrlParser: true,  useCreateIndex: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to mongodb'), app.listen(27017))
    .catch((err) => console.log(err))

const db = mongoose.connection

db.on('error', err => {
  console.error('connection error:', err)
})

app.use(morgan('dev'))

app.use(bodyParser.json())

const postsRoute = require('./routes/posts')

app.get('/', postsRoute)

app.get('/posts', postsRoute)

app.get('/:postId', postsRoute)

app.post('/new-post', postsRoute)

app.delete('/:postId', postsRoute)

app.patch('/:postId', postsRoute)