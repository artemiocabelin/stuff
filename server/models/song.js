let mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
    songId: {
        type: Number,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [2, 'Title must have at least 2 characters']
    },
    artist: {
        type: String,
        required: [true, 'Artist is required'],
        minlength: [2, 'Artist must have at least 2 characters']
    },
    numOfVotes: {
        type: Number,
    },
}, {timestamps: true});

var Song = mongoose.model('Song', SongSchema);