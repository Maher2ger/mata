const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
    },
    content: {
        type: String
    },
    imgPath: {
        type: String,
        required: true
    }
});

const post = mongoose.model('Post', postSchema);

module.exports = post;
