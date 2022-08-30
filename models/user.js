'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        default: Math.round(Date.now() / 1000)
    }
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

mongoose.model('User', UserSchema);


