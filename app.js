const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./config/sequelize.config');
const initDatabase = require('./config/models.initial');
const { productRoutes } = require('./modules/product/product.route');
const { authRoutes } = require('./modules/auth/auth.routes');

async function main () {
  const app = express();
  const port = process.env.PORT ?? 5000;

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // DB Conection
  await initDatabase()

  // Routes
  app.use('/auth', authRoutes)
  app.use('/product', productRoutes)

  // Error Handling
  app.use((req, res, next) => {
    return res.status(404).json({
      message: "page not found",
    });
  })

  app.use((error, req, res, next) => {
    const status = error?.status ?? error?.statusCode ?? 500;
    let message = error?.message ?? "Internal server error";
    
    if (error?.name === 'ValidationError') {
      const { details } = error;
      message = details?.body?.[0].message ?? "Internal server error";
    }

    return res.status(status).json({
      message: message,
      statusCode: status
    });
  })

  app.listen(port, () => {
    console.log(`Server running on port ${port}: http://localhost:${port}`);
  })
  
}

main()
