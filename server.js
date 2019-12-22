const express = require('express');
const serveStatic = require("serve-static");
var compression = require('compression');


var app = express();

// compress all responses
app.use(compression());

const path = require('path');
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 80;
app.listen(port);