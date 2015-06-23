var mongoose = require('mongoose');
var feedbackSchema = mongoose.Schema({
    userId: String,
    content: String,
    createdAt: Date
});
var Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback;