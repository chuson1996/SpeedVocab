var mongoose = require('mongoose');
var wordSchema = mongoose.Schema({
    userId: String,
    folderId: String,
    word: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    meaning: {
        type: String,
        required: true,
        trim: true
    },
    example: {
        type: String,
        required: true
    },
    image: String,
    NoCorrectAns: Number,
    NoWrongAns: Number,
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});
var Word = mongoose.model('Word',wordSchema);
module.exports = Word;