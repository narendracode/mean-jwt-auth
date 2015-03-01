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
                    return done(null, false, {'signupMessage': 'Email is already taken.'});
                } else {
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err,user) {
                        if (err)
                            throw err;
                        var token = jwt.sign(user, 'hello-private', { algorithm: 'RS256'});
                        user.token = token;
                        console.log("###### token created : "+ token);
                        user.save(function(err,user1){
                            console.log("#### Response after signup : "+JSON.stringify(newUser));
                            return done(null, user1);
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
            User.findOne({ 'local.email' :  email}, function(err, user) {
                if (err)
                    return done(err);
                if (!user) {
                     return done(null, false, {'loginMessage': "Username doesn't exists."});
                } 
                if(!user.validPassword(password)){
					return done(null, false, {'loginMessage': 'Password is wrong.'}); 
				}
                return done(null, user);
            });    
        });
    }                                      
);


