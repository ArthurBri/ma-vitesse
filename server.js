const express = require('express');
const serveStatic = require("serve-static");
const rateLimit = require("express-rate-limit");

let cors = require('cors');

let compression = require('compression');
let mongoose = require('mongoose');
require('dotenv').config();

let app = express();

// compress all responses
app.use(compression());

// authorize access from web app
app.use(cors());


app.use(express.json());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

const apiLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // once a day
    max: 1,
    message: "Maximum de propositions de suggestions atteint."
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

app.use('/meanapps', meanappsRoute);
app.use('/featuresuggests', apiLimiter, featuresuggestRoute);

app.listen(port);

