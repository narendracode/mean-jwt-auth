var mongoose = require('mongoose');
var Meetup = require('../models/ChatModel');
var ObjectId = mongoose.Types.ObjectId;

exports.send = function(req,res){
    var chatData = req.body;
    // save to DB
    console.log(" ## send message : "+JSON.stringify(chatData));
    res.json(chatData);
};