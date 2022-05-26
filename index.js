const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');

// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/giorgi');
mongoose.Promise = global.Promise;

// middleware to read and save files as JS
app.use(express.static('public'));

app.use(bodyParser.json());

// initialize routes
app.use('/api', require('./routes/api'));

// error handling middleware
app.use((err,req,res,next)=> {
    //console.log(err)
    res.status(422).send({error:err.message})
})

// listen for requests
app.listen(process.env.port || 3000, () => {
    console.log('now listening for requests');
});