const express = require('express');
const serveStatic = require("serve-static");
const rateLimit = require("express-rate-limit");

let cors = require('cors');

let compression = require('compression');
let mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

let app = express();

app.use(compression());
app.use(cors());


app.use(express.json())

app.set('trust proxy', 1);

const apiLimiter1day = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // once a day
    max: 1,
    message: "Maximum de propositions de suggestions atteint."
});

const apiLimiter1hour = rateLimit({
    windowMs: 60 * 60 * 1000, // once a day
    max: 1,
    message: "Maximum de propositions de suggestions atteint.",
    skip(req) {
        return req.method === 'GET';
    },
});


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const path = require('path');
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 80;

// All API routes
const meanappsRoute = require('./routes/meanapps');
const featuresuggestRoute = require('./routes/featuresuggests');
const workoutsRoute = require('./routes/workouts');

app.use('/meanapps', meanappsRoute);
app.use('/featuresuggests', apiLimiter1day, featuresuggestRoute);
app.use('/workouts', apiLimiter1hour, workoutsRoute);

app.listen(port, '0.0.0.0');
