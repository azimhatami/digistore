const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./config/sequelize.config');

async function main () {
  const app = express();
  const port = process.env.PORT ?? 5000;

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // DB Conection
  require('./modules/product/product.model');
  await sequelize.sync({force: true})

  // Error Handling
  app.use((req, res, next) => {
    return res.status(404).json({
      message: "page not found",
    });
  })

  app.use((error, req, res, next) => {
    const status = error?.status ?? 500;
    const message = error?.message ?? "Internal server error";
    return res.status(status).json({
      message: message,
    });
  })

  app.listen(port, () => {
    console.log(`Server running on port ${port}: http://localhost:${port}`);
  })
  
}

main()
