const express = require ('express');
const router = express.Router();
const George = require('./models/schema')

// get a list of messages from db
router.get('/message', (req, res, next) =>{
    George.find({}).then(function(george){
        res.send(george);
    }).catch(next);;
    });

// add a new message to db
router.post('/message', (req, res, next) =>{
    // !!! it is going to create new instance of object locally and save it to database and return to the client
    // 1) we shall receive post request when someone attaches json data
    // 2) json data is gonna represent new george with properties from Schema
    // 3) .create(mongoose methode) will create new instance of George, save it to the db
    // 4) .then is gonna wait 'till action is complete and return function
    // 5) .send is gonna send response (send json back to client)
    George.create(req.body).then((george) => {
        res.send(george);
    }).catch(next);
});

// update a message in the db
router.put('/message/:id', (req, res, next) =>{
    George.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
        George.findOne({_id:req.params.id}).then(function(george){
            res.send(george);
        });
    }); 
});

// delete a message from the db
router.delete('/message/:id', (req, res, next) =>{
    George.findByIdAndRemove({_id:req.params.id}).then(function(George) {
        res.send(george);
    });
});

module.exports = router;