'use strict';
const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = mongoose.model('User');


exports.register = (req, res) => {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((error, user) => {
        if (error)
            return res.status(400).send({message: error});

        user.password = undefined;
        return res.status(201).send(user);
    })
};

exports.login = (req, res) => {

    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user || !user.comparePassword(req.body.password))
            return res.status(401).send({message: 'authentication failed. Invalid username or password'});
        user.password = undefined;
        return res.json({
            token: jwt.sign({username: user.username, _id: user._id}, process.env.JWT_SECRET_CODE),
            user
        });
    }).catch(error => {
        throw error;
    })
}
