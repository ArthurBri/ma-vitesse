const express = require('express');
const router = express.Router();
const FeatureSuggest = require('../models/featuresuggest');

// Getting all FeatureSuggest
router.get('/', async (req, res) => {
    try {
        const featureSuggests = await FeatureSuggest.find();
        res.json(featureSuggests)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Getting One FeatureSuggest
router.get('/:id', getFeatureSuggest, (req, res) => {
    res.json(res.featureSuggest)
});

// Creating one FeatureSuggest
router.post('/', async (req, res) => {
    const suggest = new FeatureSuggest({
        description: req.body.description,
        contributor_email: req.body.contributor_email
    });
    try {
        const newMeanApp = await suggest.save();
        res.status(201).json(newMeanApp);
        console.log("succès !")
    } catch (err) {
        console.log(err.message);
        res.status(400).json({message: err.message})
    }
    console.log(res.status)
});

// Updating One
router.patch('/:id', getFeatureSuggest, async (req, res) => {
    if (req.body.description != null) {
        res.featureSuggest.description = req.body.description
    }
    if (req.body.contributor_email != null) {
        res.featureSuggest.contributor_email = req.body.contributor_email
    }
    try {
        const updatedFeatureSuggest = await res.featureSuggest.save();
        res.json(updatedFeatureSuggest)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Deleting One
router.delete('/:id', getFeatureSuggest, async (req, res) => {
    try {
        await res.featureSuggest.remove();
        res.json({message: 'Deleted Feature Suggest'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

async function getFeatureSuggest(req, res, next) {
    let featureSuggest;
    try {
        featureSuggest = await FeatureSuggest.findById(req.params.id);

        if (featureSuggest == null) {
            return res.status(404).json({message: 'Cannot find feature suggest'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.featureSuggest = featureSuggest;
    next()
}

module.exports = router;