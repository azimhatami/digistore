const { getUserBasketById } = require('../basket/basket.controller');
const { Payment } = require('./payment.model');
const { Basket } = require('../basket/basket.model');
const { Order, OrderItems } = require('../order/order.model');
const { OrderStatus } = require('../../common/constant/order.const');
const { zarinpalRequest, zarinpalVerify } = require('../services/zarinpal.service');
const createError = require('http-errors')


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

    const result = await zarinpalRequest(payment?.amount, req?.user);

    payment.authority = result?.authority
    await payment.save();

    return res.json(result);

  } catch (error) {
    next(error);
  }
}

async function paymentVerifyController(req, res, next) {
  try {
    const {Authority, Status} = req?.query;
    if (Status === 'OK' && Authority) {
      const payment = await Payment.findOne({where: {authority: Authority}});
      if (!payment) throw createError(404, 'payment not found');
      const result = await zarinpalVerify(payment?.amount, payment?.authority);

      if (result) {
        payment.status = true;
        payment.refId = result?.ref_id ?? '21453';
        const order = await Order.findByPk(payment.orderId);
        if (!order) throw createError(404, 'not found order');
        order.status = OrderStatus.InProcess;
        await order.save();
        await payment.save();
        await Basket.destroy({where: {userId: order.userId}});
        return res.redirect('http://frontenddomain.com/payment?status=success');
      } else {
        await Payment.destroy({where: {id: payment.id}});
        await Order.destroy({where: {id: payment.orderId}});
      }
    }
    return res.redirect('http://frontenddomain.com/payment?status=failure');
  } catch (error) {
    // next(error);
    res.redirect('http://frontenddomain.com/payment?status=failure');
  }
}

module.exports = {
  paymentBasketController,
  paymentVerifyController
};
