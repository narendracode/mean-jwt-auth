var mongoose = require('mongoose');
var Meetup = require('../models/MeetupModel');

var ObjectId = mongoose.Types.ObjectId;

exports.create = function(req,res){
    var meetup = new Meetup(req.body);
    meetup.save(function(err,result){
        if(err){
                res.send(err);
        }
        res.json(result);
    });
};

exports.getAll = function(req,res){
    Meetup.find({},function(err,results){
        if(err){
            res.send(err);
        }
        res.json(results);
    });
};

exports.get = function(req,res){
     var id = req.params.id;
    try{
        id = new ObjectId(id);
        Meetup.findById(id,function(err,meetup){
            if(err){
                res.send(err);
            }
            res.json(meetup);
        })
    }catch(e){
        res.send(404);
    }
};

exports.update = function(req,res){
    var id = req.params.id;
    try{
        id = new ObjectId(id);
        Meetup.findById(id,function(err,meetup){
            if(err){
                res.send(err);
            }
            meetup.name = req.body.name;
            meetup.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: "Meetup Updated successfully."});
            });
        });
    }catch(e){
        res.send(404);
    }
};

exports.delete = function(req,res){
    var id = req.params.id;
    try{
         id = new ObjectId(id);
        Meetup.remove({_id : id},function(err,result){
            if(err){
                res.send(err);
            }
            res.json(result);
        });
    }catch(e){
        res.send(404);
    }
};

