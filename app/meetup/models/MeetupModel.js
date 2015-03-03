var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var MeetupSchema = new Schema({
    name: String,
    toTime: String,
    fromTime: String,
    date : Date,
    venue: String
});

module.exports = mongoose.model('Meetup', MeetupSchema);