var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    authId: String,
    name: String,
    email: String,
    role: String,
    avatar: String,
    createdAt: Date
});
var User = mongoose.model('User',userSchema);
module.exports = User;