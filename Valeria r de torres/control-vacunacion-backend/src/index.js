const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const URL_CONNECT = process.env.URL_CONNECT;
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/uploads', express.static('public/uploads'));
mongoose.connect(URL_CONNECT)
const db = mongoose.connection;

db.on('error', (error) => {
    console.error('error on connect to database: ', error)
})

db.once('open', () => {
    console.log('connection successfully'); 
    app.use(cors());
    app.use('/api', require('./router/index.js'));
    app.listen(PORT, () => {
        console.log(`server mounted on port: ${PORT}`);
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('server error :(');
});

module.exports = app;