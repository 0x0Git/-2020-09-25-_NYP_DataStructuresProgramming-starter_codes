const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const food = require('../models/Food');

// if drop is true, all existing tables are dropped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()
        .then(() => {
            console.log('Food database connected')
        })
        .then(() => {
            /*
            Defines the relationship where a user has many videos.
            In this case the primary key from user will be foreign key
            in video.
            */
            user.hasMany(food);
            mySQLDB.sync({ // Creates table if non exists
                force: drop
            }).then(() => { 
                console.log('Create tables if none exists')
            }).catch(err => console.log(err));
        })
        .catch(err => console.log('Error: ' + err));
};

module.exports = { setUpDB };