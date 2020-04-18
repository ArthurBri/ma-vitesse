const mongoose = require('mongoose');
const shortid = require('shortid');

const publicWorkoutSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    country_code: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    distance_unit: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    speed: {
        type: String,
        required: true
    },
    speed_unit: {
        type: String,
        required: true
    },
    created_date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PublicWorkout', publicWorkoutSchema, 'publicworkouts');