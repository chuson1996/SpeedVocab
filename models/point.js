var mongoose = require("mongoose");
var casesEnum = ['facebook-share','twitter-share'];
var pointSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    casesDone:{
        type: [String],
        enum: casesEnum,
        default: []
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

});
var Point = mongoose.model('Point', pointSchema);
pointSchema.pre('update', function() {
    this.update({},{ $set: { updatedAt: new Date() } });
});
module.exports = Point;