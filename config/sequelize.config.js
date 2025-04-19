const { Sequelize } = require('sequelize');
const { config } = require('dotenv');
config();


const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch ((error) => {
  console.log('Unable to connect to the database: ', error);
}) 


module.exports = sequelize;
