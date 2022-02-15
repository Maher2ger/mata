const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String
    }
});

const post = mongoose.model('Post', postSchema);

module.exports = post;
