const { Product, ProductDetail, ProductColor, ProductSize } = require('../product/product.model');
const { ProductTypes } = require('../../common/constant/product.const');
const { Basket } = require('./basket.model');
const createError = require('http-errors');


async function AddToBasketController(req, res, next) {
  try {
    const {id: userId = undefined} = req.user ?? {};
    const {productId, colorId, sizeId} = req.body;
    const product = await Product.findByPk(productId);
    if (!product) throw createError(404, 'Product not found');

    const basketItem = {
      productId: product.id,
      userId
    }

    let productCount = undefined;
    let colorCount = undefined;
    let sizeCount = undefined;

    if (product.type === ProductTypes.Coloring) {
      if (!colorId) throw createError(400, 'send product color detail')
      const productColor = await ProductColor.findByPk(colorId);
      if (!productColor) throw createError(404, 'color not found');
      basketItem['colorId'] = colorId;
      colorCount = productColor?.count ?? 0;
      if (colorCount === 0) throw createError(400, 'product color count not enough');

    } else if (product.type === ProductTypes.Sizing) {
      if (!sizeId) throw createError(400, 'send product size detail')
      const productSize = await ProductSize.findByPk(sizeId);
      if (!productSize) throw createError(404, 'size not found');
      basketItem['sizeId'] = sizeId;
      sizeCount = productSize?.count ?? 0;
      if (sizeCount === 0) throw createError(400, 'product size count not enough');
    } else {
      productCount = product?.count ?? 0;
      if (productCount === 0) throw createError(400, 'product count not enough');
    }

    const basket = await Basket.findOne({where: basketItem});

    if (basket) {
      if (colorCount && colorCount > basket?.count) {
        basket.count += 1;
      } else if (sizeCount && sizeCount > basket?.count) {
        basket.count += 1;
      } else if (productCount && productCount > basket?.count) {
        basket.count += 1;
      } else {
        throw createError(400, 'product count not enough');
      }
      await basket.save();
    } else {
      await Basket.create({...basketItem, count: 1});
    }

    return res.json({
      message: 'added to basket successfully',
    })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  AddToBasketController,
}
