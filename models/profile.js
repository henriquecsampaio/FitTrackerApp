let mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    weight:{
        type: Number,
        required: true,
    },
    height:{
        type: Number,
        required: true,
    },
    goals:{
        type: [String],
        required: false,
    },
});

module.exports = mongoose.model('Profile', profileSchema);
