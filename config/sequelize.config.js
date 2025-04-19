const { Sequelize } = require('sequelize');
const { config } = require('dotenv');
config();


async function connect_db() {
  try {
    const sequelize = new Sequelize({
      dialect: 'mariadb',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false
    });

    await sequelize.authenticate()
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.log('Unable to connect to the database: ', error);
  }

}


module.exports = {
  connect_db,
}
