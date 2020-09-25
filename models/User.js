const Sequelize = require('sequelize');
const db = require('../config/DBConfig');

/*
Creates a user(s) table in MySQL Database
Note that Sequelize automatically pleuralies the entity name as the table name
*/

const User = db.define('user', { // SQL statement; CREATE TABLE IF NOT EXISTS `users`
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    password: {
        type: Sequelize.STRING
    },
    weight: {
        type: Sequelize.FLOAT
    },
    height: {
        type: Sequelize.FLOAT
    },
    bmi: {
        type: Sequelize.FLOAT
    },
});

module.exports = User;