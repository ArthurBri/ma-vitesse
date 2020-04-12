const mongoose = require('mongoose');

const publicWorkoutSchema = new mongoose.Schema({
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