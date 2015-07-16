var mongoose = require('mongoose');
var folderSchema = mongoose.Schema({
    userId: String,
    name: {
        type: String,
        required: true,
        trim: false
    },
    fromLang: {
        type: String,
        required: true,
        trim: true
    },
    toLang: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});
var Folder = mongoose.model('Folder',folderSchema);
module.exports = Folder;