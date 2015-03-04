var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
    messages: [{
        message : String,
        imageUrl : {type: String, default: null},
        is_active: { type: Boolean, default: true },
        sentBy : String,
        sent_at : { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    created_by : {type: String, default: null},
    is_active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Chat', chatSchema);