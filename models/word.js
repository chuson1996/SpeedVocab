var mongoose = require('mongoose');
var wordSchema = mongoose.Schema({
    userId: String,
    folderId: String,
    word: String,
    meaning: String,
    example: String,
    image: String,
    NoCorrectAns: Number,
    NoWrongAns: Number,
    createdAt: Date
});
var Word = mongoose.model('Word',wordSchema);
module.exports = Word;