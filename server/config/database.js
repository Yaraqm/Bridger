const { Sequelize } = require('sequelize');

// Set up a new connection to MySQL database
const sequelize = new Sequelize('project', 'root', 'mysql191104!', {
  host: 'localhost', 
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;


