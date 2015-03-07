var mongoose = require('mongoose');
var chat = require('../models/ChatModel');
var ObjectId = mongoose.Types.ObjectId;

exports.send = function(req,res){
    var chatData = req.body;
    // save to DB  "message":"dfadsf","create_by":"narendra"
    //chat.messages.push({message:req.body.message, sentBy: req.body.create_by});
    
    
    console.log(" ## send message : "+JSON.stringify(chatData));
    res.json(chatData);
};