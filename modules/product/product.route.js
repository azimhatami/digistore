const { Router } = require('express');
const { createProductValidation } = require('./product.validation');
const { createProductController } = require('./product.controller');


const router = Router();

router.post('/', createProductValidation, createProductController)

module.exports = {
  productRoutes: router,
};
