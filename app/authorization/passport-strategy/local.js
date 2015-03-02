var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var jwt        = require("jsonwebtoken");
var config = require('../../../config/config');
exports.signupStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
	    User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err){
		              return done(err);
		        }
                if (user) {
                    return done(null, {type : false,data: 'Email is already taken.'});
                } else {
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err,user) {
                        if (err){
                            return done(null,{
                                type:false,
                                data: 'error occured '+ err
                            });
                        }
                        var token = jwt.sign({email: user.local.email, role : user.role, token: user.token}, 'helloprivate', { algorithm: 'RS256'});
                        user.token = token;
                        user.save(function(err,user1){
                            if(err){
                                return done(null, { type : false,data: 'Error occured '+ err});
                            }
                            return done(null, {type : true,data: {email: user1.local.email, role : user1.role}, token : user1.token});
                        }); 
                    });   
               }
            });    
        });
    }                                      
);

exports.loginStrategy = new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            var mUser = new User();
            User.findOne({'local.email': email}, function(err, user) {
                if (err){
                    return done(null,{type:false,data: 'error occured '+ err});
                }
                if (!user) {
                     return done(null, {type: false, 'data': "Account doesn't exists with the email provided."});
                } 
                if(!user.validPassword(password)){
                    return done(null, {type: false, 'data': 'Password is wrong.'}); 
				}
                return done(null, {type : true,data: {email: user.local.email, role : user.role} ,token : user.token});
            });    
        });
    }                                      
);


