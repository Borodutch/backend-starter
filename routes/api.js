const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// get a list of messages
router.get('/messages', function(req, res, next){
    Message.find({}).then(function(messages){
        res.send(messages);
    })
});

// add new message
router.post('/messages', function(req, res, next){
    Message.create(req.body).then(function(message){
        res.send(message);
    }).catch(next);
});

// update a message
router.put('/messages/:id', function(req, res, next){
    Message.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Message.findOne({_id: req.params.id}).then(function(message){
            res.send(message);
        });
    });
});

// delete a message from the db
router.delete('/messages/:id', function(req, res, next){
    Message.findByIdAndRemove({_id: req.params.id}).then(function(message){
        res.send(message);
    });
});

module.exports = router;