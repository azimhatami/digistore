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

module.exports = {
  getMyOrdersController,
  getOneOrderByIdController
}
