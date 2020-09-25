const Sequelize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Food = db.define('food', {
    Entry: {
        type: Sequelize.STRING
    },
    DateOfEntry: {
        type: Sequelize.DATE
    },
    Cuisine: {
        type: Sequelize.STRING
    },
    DiningPlace: {
        type: Sequelize.STRING
    },
    MealType: {
        type: Sequelize.STRING
    },
    Calories: {
        type: Sequelize.FLOAT
    },
    Mood: {
        type: Sequelize.STRING
    }
});

module.exports = Food;