const express = require('express');
const router = express.Router();
const MeanApp = require('../models/meanapp');

// Getting all MeanApps
router.get('/', async (req, res) => {
    try {
        const meanapps = await MeanApp.find();
        res.json(meanapps)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Getting One MeanApp
router.get('/:id', getMeanApp, (req, res) => {
    res.json(res.meanapp)
});

// Creating one MeanApp
router.post('/', async (req, res) => {
    const meanApp = new MeanApp({
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        logo: req.body.logo,
        colors: {
            primary: req.body.colors.primary,
            secondary: req.body.colors.secondary
        }
    });
    try {
        const newMeanApp = await meanApp.save();
        res.status(201).json(newMeanApp)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Updating One
router.patch('/:id', getMeanApp, async (req, res) => {
    if (req.body.name != null) {
        res.meanapp.name = req.body.name
    }
    if (req.body.description != null) {
        res.meanapp.description = req.body.description
    }
    if (req.body.url != null) {
        res.meanapp.url = req.body.url
    }
    if (req.body.logo != null) {
        res.meanapp.logo = req.body.logo
    }
    if (req.body.colors != null) {
        res.meanapp.colors.primary = req.body.colors.primary;
        res.meanapp.colors.secondary = req.body.colors.secondary
    }
    try {
        const updatedMeanApp = await res.meanapp.save();
        res.json(updatedMeanApp)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Deleting One
router.delete('/:id', getMeanApp, async (req, res) => {
    try {
        await res.meanapp.remove();
        res.json({message: 'Deleted Subscriber'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

async function getMeanApp(req, res, next) {
    let meanapp;
    try {
        meanapp = await MeanApp.findById(req.params.id);

        if (meanapp == null) {
            return res.status(404).json({message: 'Cannot find mean app'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.meanapp = meanapp;
    next()
}

module.exports = router;