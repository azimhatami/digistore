const { Router } = require('express');
const { paymentBasketController } = require('./payment.controller');
const AuthGuard = require('../auth/auth.guard');


const router = Router();

router.post('/', AuthGuard, paymentBasketController);

module.exports = {
  paymentRoutes: router
};
