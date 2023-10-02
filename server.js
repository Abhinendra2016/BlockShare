const express = require('express');
const { process_params } = require('express/lib/router');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const serveStatic = require("serve-static");
app.use(serveStatic(path.join(__dirname, '/public')));
app.use(express.json());

const connectDB = require('./config/db');
connectDB();

//template engine 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//routes
app.use('/api/files',require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));




app.listen(PORT, console.log(`Listening on port ${PORT}.`));