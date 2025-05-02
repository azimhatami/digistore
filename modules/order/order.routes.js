const { Router } = require('express');
const AuthGuard = require('../auth/auth.guard');
const { getMyOrderController } = require('./order.controller');


const router = Router();

router.get('/', AuthGuard, getMyOrderController);


module.exports = {
  orderRoutes: router,
};

