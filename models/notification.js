var mongoose = require("mongoose");
var notificationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Notification', notificationSchema);