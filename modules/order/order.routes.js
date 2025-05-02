const { Router } = require('express');
const AuthGuard = require('../auth/auth.guard');
const { getMyOrdersController, getOneOrderByIdController } = require('./order.controller');


const router = Router();

router.get('/', AuthGuard, getMyOrdersController);
router.get('/:id', AuthGuard, getOneOrderByIdController);


module.exports = {
  orderRoutes: router,
};

