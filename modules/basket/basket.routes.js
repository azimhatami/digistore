const { Router } = require('express');
const AuthGuard = require('../auth/auth.guard');
const { AddToBasketController, getUserBasketController } = require('./basket.controller');


const router = Router();

router.post('/add', AuthGuard, AddToBasketController);
router.get('/', AuthGuard, getUserBasketController);


module.exports = {
  basketRoutes: router,
}
