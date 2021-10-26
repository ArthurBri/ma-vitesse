const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// Getting all Workouts
router.get('/', async (req, res) => {
    try {
        let workout = await Workout.find();
        if (req.query.type === 'public' || req.query.type === 'private') {
            workout = workout.filter(workout => workout.type === req.query.type)
        }

        if (req.query.limit) {
            workout.sort((a, b) => b.created_date - a.created_date);
            workout = workout.slice(0, req.query.limit);
        }
        res.json(workout)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

// Getting One Workout
router.get('/:id', getWorkout, (req, res) => {
    res.json(res.workout)
});

// Creating one  Workout
router.post('/', async (req, res) => {
    // Add country
    let userCountry = await getUserCountry();
    const workout = new Workout({
        country_code: userCountry,
        distance: req.body.distance,
        distance_unit: req.body.distance_unit,
        duration: req.body.duration,
        speed: req.body.speed,
        speed_unit: req.body.speed_unit,
        calculated_field: req.body.calculated_field,
        created_date: req.body.created_date,
        type: req.body.type
    });
    try {
        const newWorkout = await workout.save();
        res.status(201).json(newWorkout)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Updating One Workout
router.patch('/:id', getWorkout, async (req, res) => {
    if (req.body.country_code) {
        res.workout.country_code = req.body.country_code
    }
    if (req.body.distance) {
        res.workout.distance = req.body.distance
    }
    if (req.body.distance_unit) {
        res.workout.distance_unit = req.body.distance_unit
    }
    if (req.body.duration) {
        res.workout.duration = req.body.duration
    }
    if (req.body.speed) {
        res.workout.speed = req.body.speed
    }
    if (req.body.speed_unit) {
        res.workout.speed_unit = req.body.speed_unit
    }
    if (req.body.calculated_field) {
        res.workout.calculated_field = req.body.calculated_field
    }
    if (req.body.created_date) {
        res.workout.created_date = req.body.created_date
    }
    if (req.body.type) {
        res.workout.created_date = req.body.type
    }
    try {
        const updatedWorkout = await res.workout.save();
        res.json(updatedWorkout)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});

// Deleting One  Workout
router.delete('/:id', getWorkout, async (req, res) => {
    try {
        await res.workout.remove();
        res.json({message: 'Deleted workout'})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

async function getWorkout(req, res, next) {
    let workout;
    try {
        workout = await Workout.findById(req.params.id);

        if (workout == null) {
            return res.status(404).json({message: 'Cannot find workout'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.workout = workout;
    next()
}

async function getUserCountry() {
    const axios = require('axios');
    const ax = axios.create({
        baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:80' : process.env.BASE_URL
    });
    let API_KEY = process.env.IP_GEOLOC_API_KEY;
    let userCountry = '';
    await ax.get('https://api.ipgeolocation.io/ipgeo?apiKey=' + API_KEY)
        .then((response) => {
            userCountry = response.data.country_code2 ? response.data.country_code2.toLowerCase() : '';
        })
        .catch((error) => {
        });

    return userCountry
}

module.exports = router;