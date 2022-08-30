'use strict';
const mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = mongoose.model('User');


exports.register = (req, res) => {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password,10);
    newUser.save((error,user) =>{
        if(error)
            return res.status(400).send({message:error});

        user.password = undefined;
        return res.status(201).send(user);
    })
};
