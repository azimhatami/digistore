const { Router } = require('express');
const { paymentBasketController, paymentVerifyController } = require('./payment.controller');
const AuthGuard = require('../auth/auth.guard');


const router = Router();

router.post('/', AuthGuard, paymentBasketController);
router.get('/callback', paymentVerifyController);

module.exports = {
  paymentRoutes: router
};
