var mongoose = require('mongoose');
var wordSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    folderId: {
        type: String,
        required: true,
    },
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
    },
    image: String,
    NoCorrectAns: Number,
    NoWrongAns: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
var Word = mongoose.model('Word',wordSchema);
module.exports = Word;