const { Router } = require('express');
const { createProductValidation } = require('./product.validation');
const { createProductController, getProductsController, getProductByIdController} = require('./product.controller');


const router = Router();

router.post('/', createProductValidation, createProductController)
router.get('/', getProductsController)
router.get('/:id', getProductByIdController)

module.exports = {
  productRoutes: router,
};
