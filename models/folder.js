var mongoose = require('mongoose');
var folderSchema = mongoose.Schema({
    userId: String,
    name: String,
    fromLang: String,
    toLang: String,
    created: Date
});
var Folder = mongoose.model('Folder',folderSchema);
module.exports = Folder;