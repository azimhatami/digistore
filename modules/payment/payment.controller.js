const { getUserBasketById } = require('../basket/basket.controller');
const { Payment } = require('./payment.model');
const { Order, OrderItems } = require('../order/order.model');
const { OrderStatus } = require('../../common/constant/order.const');


async function paymentBasketController(req, res, next) {
  try {
    const {id: userId} = req.user;
    const {basket, totalAmount, finalAmount, totalDiscount} = await getUserBasketById(userId);
    const payment = await Payment.create({
      userId,
      amount: finalAmount,
      status: false,
    });

    const order = await Order.create({
      userId,
      paymentId: payment.id,
      total_amount: totalAmount,
      final_amount: finalAmount,
      discount_amount: totalDiscount,
      status: OrderStatus.Pending,
      address: 'Neyshabur - rasuli - pasandideh street, 10',
    });
    payment.orderId = order.id;
    await payment.save();
    let orderList = [];

    for (const item of basket) {
      let items = [];
      if (item?.sizes?.length > 0) {
        items = item?.sizes.map(size => {
          return {
            orderId: order.id,
            productId: item?.id,
            sizeId: size?.id,
            count: size?.count
          };
        });
      } else if (item?.colors?.length > 0) {
        items = item?.colors.map(color => {
          return {
            orderId: order.id,
            productId: item?.id,
            colorId: colro?.id,
            count: color?.count
          };
        });
      } else {
        items = [
          {
            orderId: order.id,
            productId: item?.id,
            count: item.count,
          }
        ];
      };
      orderList.push(...items)
    }

    await OrderItems.bulkCreate(orderList);

    return res.json({
      paymentUrl: 'https://zarinpal.com/payment',
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
 paymentBasketController
};
