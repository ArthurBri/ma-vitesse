const mongoose = require('mongoose');

const featureSuggestSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    contributor_email: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('FeatureSuggest', featureSuggestSchema, 'featuresuggests');