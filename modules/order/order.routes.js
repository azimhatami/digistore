const { Router } = require('express');
const AuthGuard = require('../auth/auth.guard');
const { 
  getMyOrdersController, 
  getOneOrderByIdController, 
  setPacketedStatusToOrder, 
  setInTransitStatusToOrder, 
  setCanceledStatusToOrder,
  setDeliveryStatusToOrder
} = require('./order.controller');


const router = Router();

router.get('/', AuthGuard, getMyOrdersController);
router.get('/:id', AuthGuard, getOneOrderByIdController);
router.patch('/set-packeted/:id', AuthGuard, setPacketedStatusToOrder);
router.patch('/set-in-transit/:id', AuthGuard, setInTransitStatusToOrder);
router.patch('/cancel/:id', AuthGuard, setCanceledStatusToOrder);
router.patch('/set-delivery/:id', AuthGuard, setDeliveryStatusToOrder);


module.exports = {
  orderRoutes: router,
};

