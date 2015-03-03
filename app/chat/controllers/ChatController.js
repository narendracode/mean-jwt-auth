var mongoose = require('mongoose');
var Meetup = require('../models/ChatModel');

var ObjectId = mongoose.Types.ObjectId;

exports.send = function(req,res){
    var chatData = req.body;
    
    var meetup = new Meetup(req.body);
    meetup.save(function(err,result){
        if(err){
            res.send(err);
        }
        res.json(result);
    });
};