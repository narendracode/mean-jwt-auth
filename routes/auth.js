var express = require('express');
var router = express.Router();
var passport = require('passport');
var authController = require('../app/authorization/controllers/AuthController.js');

var passportConfig = require('../app/authorization/passport.js');
var authUtil = require('../app/authorization/util/AuthUtil.js');
router.post('/signup',authController.localSignup);
router.post('/login',authController.localLogin);
router.post('/logout',authController.logout);
router.get('/userinfo',authController.getCurentUserInfo);
//router.get('/loggedinuserinfo',authUtil.ensureAuthorized,authController.getLoggedInUserInfoByToken);
router.get('/loggedinuserinfo',authController.getLoggedInUserInfoByToken);
router.get('/isAuthenticated',authController.isUserAuthenticated);
router.get('/facebook',authController.facebookLogin);
router.get('/facebook/callback',authController.facebookLoginCallback);
module.exports = router;
