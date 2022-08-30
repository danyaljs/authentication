const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1/authenticationDB',
    helmet = require('helmet'),
    http = require('http'),
    cors = require('cors');

const mongoose = require('mongoose');
const mongooseOptions = {
    socketTimeoutMS: 30000,
    keepAlive: true
};
mongoose.connect(mongoUrl, mongooseOptions).then(() => {
    console.log('successfully connect to DB');
}).catch(error => {
    console.log(error)
});

app.use(helmet);
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routes = require('./routes/user');
routes(app);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log(`server is running on port : ${port}`)
});
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen error with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error("API: Port '%s' requires elevated privileges", port);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error("API: Port '%s' is already in use", port);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
