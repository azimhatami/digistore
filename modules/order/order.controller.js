const { OrderStatus } = require('../../common/constant/order.const');
const createError = require('http-errors');
const { Order, OrderItems } = require('./order.model');
const { Product, ProductColor, ProductSize } = require('../product/product.model');


async function getMyOrdersController(req, res, next) {
  try {
    const {id: userId} = req.user;
    const {status} = req.query;
    if (!status || !Object.values(OrderStatus).includes(status)) {
      throw createError(400, 'send valid status');
    }
    const orders = await Order.findAll({
      where: {status, userId},
    });

    return res.json({
      orders,
    });
  } catch (error) {
    next(error);
  }
}

async function getOneOrderByIdController(req, res, next) {
  try {
    const {id: userId} = req.user;
    const {id} = req.params;

    const order = await Order.findOne({
      where: {
        id,
        userId
      },
      include: [
        {model: OrderItems, as: 'items', include: [
          {model: Product, as: 'product'},
          {model: ProductColor, as: 'color'},
          {model: ProductSize, as: 'size'},
        ]}
      ],
    });

    if (!order) throw createError(404, 'not found order');

    return res.json({
      order,
    });
  } catch (error) {
    next(error);
  }
}

async function setPacketedStatusToOrder(req, res, next) {
  const {id} = req.params;
  const order = await findByPk(id);
  if (!order) throw createError(404, 'not found order');
  if (order.status !== OrderStatus.InProcess) throw createError(400, 'order status should be in-process');
  order.status = OrderStatus.Packeted;
  await order.save();
  return res.json({
    message: 'set order to packeted line',
  });
}

async function setInTransitStatusToOrder(req, res, next) {
  const {id} = req.params;
  const order = await findByPk(id);
  if (!order) throw createError(404, 'not found order');
  if (order.status !== OrderStatus.Packeted) throw createError(400, 'order status should be packeted');
  order.status = OrderStatus.InTransit;
  await order.save();
  return res.json({
    message: 'set order to in-transit line',
  });
}

async function setCanceledStatusToOrder(req, res, next) {
  const {id} = req.params;
  const { reason } = req.body;
  const order = await findByPk(id);
  if (!order) throw createError(404, 'not found order');
  if ([OrderStatus.Pending, OrderStatus.Delivery, OrderStatus.Canceled].includes(order.status)) 
    throw createError(400, 'select correct order to cancel');
  order.status = OrderStatus.Canceled;
  order.reason = reason;
  await order.save();
  return res.json({
    message: 'canceled order successfully',
  });
}

async function setDeliveryStatusToOrder(req, res, next) {
  const {id} = req.params;
  const order = await findByPk(id);
  if (!order) throw createError(404, 'not found order');
  if (order.status !== OrderStatus.InTransit) throw createError(400, 'order status should be in-transit');
  order.status = OrderStatus.Delivery;
  await order.save();
  return res.json({
    message: 'order delivery to customer successfully',
  });
}


module.exports = {
  getMyOrdersController,
  getOneOrderByIdController,
  setPacketedStatusToOrder,
  setInTransitStatusToOrder,
  setCanceledStatusToOrder,
  setDeliveryStatusToOrder,
}
