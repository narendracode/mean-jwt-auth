var index = require('../routes/index');
var auth = require('../routes/auth')
var meetup = require('../routes/meetup');
module.exports = function (app){
      app.use('/', index);
      app.use('/meetup',meetup);
      app.use('/auth',auth);
}
