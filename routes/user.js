'use strict';
const userHandlers = require('../controllers/user');
module.exports = function (app) {

    app.route('/auth/register').post(userHandlers.register);

};
