var mongoose = require('mongoose');
var folderSchema = mongoose.Schema({
    userId: String,
    name: String,
    fromLang: String,
    toLang: String,
    createdAt: Date
});
var Folder = mongoose.model('Folder',folderSchema);
module.exports = Folder;