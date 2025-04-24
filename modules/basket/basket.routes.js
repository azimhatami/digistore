const { Router } = require('express');
const AuthGuard = require('../auth/auth.guard');
const { AddToBasketController } = require('./basket.controller');


const router = Router();

router.post('/add', AuthGuard, AddToBasketController);


module.exports = {
  basketRoutes: router,
}
