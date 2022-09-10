const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.API_PORT,
    User = require('./models/user'),
    mongoUrl = process.env.MONGO_URL,
    helmet = require('helmet'),
    http = require('http'),
    jwt = require('jsonwebtoken'),
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

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use((req, res, next)  =>{

    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

        jwt.verify(req.headers.authorization.split(' ')[1]   , process.env.JWT_SECRET_CODE, function(err, decode) {
            if (err) req.user = undefined;
            else req.user = decode;
            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});

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
