/**
 * Created by chuso_000 on 9/8/2015.
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
var relativitySequenceSchema = mongoose.Schema({
    term: {
        type: Schema.Types.ObjectId,
        ref: 'Word'
    },
    note: {
        type: String,
        required: true,
        trim: true
    },
    images:[String],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('RelativitySequence', relativitySequenceSchema);