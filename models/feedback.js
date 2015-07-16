var mongoose = require('mongoose');
var feedbackSchema = mongoose.Schema({
    userId: String,
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: Date
});
var Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback;