const express = require('express');
const morgan = require('morgan');
//const mongoose = require('mongoose');//uncom
//const blogRoutes = require('./routes/blogRoutes');
const blogRoutes = require('../controllers/blogRoutes1');
//imported routes, does not match though

// express app
const app = express();
console.log("express app started, supposed catch routes")
// connect to mongodb & listen for requests
// const dbURI = "mongodb+srv://netninja:test1234@net-ninja-tuts-del96.mongodb.net/node-tuts";

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(result => app.listen(1337))//
//   .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
//app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
console.log("morgan")

app.use((req, res, next) => {
  console.log("supposed catch routes")
  res.locals.path = req.path;
  next();
});
console.log("after localspath use")
// routes
app.get('/', (req, res) => {
  console.log("/supposed catch routes")
  res.redirect('/blogs');
});
console.log("didnt match? supposed catch routes")

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});