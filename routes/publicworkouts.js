const express = require('express');
const router = express.Router();
const PublicWorkout = require('../models/publicworkout');

// Getting all Public Workouts
router.get('/', async (req, res) => {
    try {
        const publicworkout = await PublicWorkout.find();
        res.json(publicworkout)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Getting One Public Workout
router.get('/:id', getPublicWorkout, (req, res) => {
    res.json(res.publicworkout)
});

// Creating one MeanApp
router.post('/', async (req, res) => {
    const publicWorkout = new PublicWorkout({
        country_code: req.body.country_code,
        distance: req.body.distance,
        distance_unit: req.body.distance_unit,
        duration: req.body.duration,
        speed: req.body.speed,
        speed_unit: req.body.speed_unit,
        created_date: req.body.created_date
    });
    try {
        const newPublicWorkout = await publicWorkout.save();
        res.status(201).json(newPublicWorkout)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Updating One Public Workout
router.patch('/:id', getPublicWorkout, async (req, res) => {
    if (req.body.country_code) {
        res.publicworkout.country_code = req.body.country_code
    }
    if (req.body.distance) {
        res.publicworkout.distance = req.body.distance
    }
    if (req.body.distance_unit) {
        res.publicworkout.distance_unit = req.body.distance_unit
    }
    if (req.body.duration) {
        res.publicworkout.duration = req.body.duration
    }
    if (req.body.speed) {
        res.publicworkout.speed = req.body.speed
    }
    if (req.body.speed_unit) {
        res.publicworkout.speed_unit = req.body.speed_unit
    }
    if (req.body.created_date) {
        res.publicworkout.created_date = req.body.created_date
    }
    try {
        const updatedPublicWorkout = await res.publicworkout.save();
        res.json(updatedPublicWorkout)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Deleting One Public Workout
router.delete('/:id', getPublicWorkout, async (req, res) => {
    try {
        await res.publicworkout.remove();
        res.json({message: 'Deleted workout'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

async function getPublicWorkout(req, res, next) {
    let publicworkout;
    try {
        publicworkout = await PublicWorkout.findById(req.params.id);

        if (publicworkout == null) {
            return res.status(404).json({message: 'Cannot find workout'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.publicworkout = publicworkout;
    next()
}

module.exports = router;