const { Product, ProductDetail, ProductColor, ProductSize } = require('./product.model');
const { ProductTypes } = require('../../common/constant/product.const');
const createError = require('http-errors');


async function createProductController (req, res, next) {
  try {
    const { 
      title, 
      description, 
      price = undefined, 
      discount = undefined, 
      active_discount = undefined, 
      type, 
      count = undefined,
      colors,
      sizes,
      details
    } = req.body; 

    if (!Object.values(ProductTypes).includes(type)) {
      throw createError(400, 'Invalid product type');
    }

    const product = await Product.create({
      title, 
      description, 
      price, 
      discount, 
      active_discount, 
      type,
      count
    });

    if (details && Array.isArray(details)) {
      let detailList = [];
      for (const item of details) {
        detailList.push({
          key: item.key,
          value: item.value,
          productId: product.id
        })
      }
      if (detailList.length > 0) {
        await ProductDetail.bulkCreate(detailList);
      }
    }

    if (type === ProductTypes?.Coloring) {
      if (colors && Array.isArray(colors)) {
        let colorList = [];
        for (const item of colors) {
          colorList.push({
            color_name: item.name,
            color_code: item.code,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
            productId: product.id
          })
        }
        if (colorList.length > 0) {
          await ProductColor.bulkCreate(colorList);
        }
      }
    }
    if (type === ProductTypes?.Sizing) {
      if (sizes && Array.isArray(sizes)) {
        let sizeList = [];
        for (const item of sizes) {
          sizeList.push({
            size: item.size,
            price: item.price,
            discount: item.discount,
            active_discount: item.active_discount,
            count: item.count,
            productId: product.id
          })
        }
        if (sizeList.length > 0) {
          await ProductSize.bulkCreate(sizeList);
        }
      }
    }

    return res.json({
      message: 'Product created successfully',
    });

  } catch (error) {
    next(error);
  }
}

async function getProductsController (req, res, next) {
  try {
    const products = await Product.findAll({});
    return res.json({ products });
  } catch (error) {
    next(error);
  }
}

async function getProductByIdController (req, res, next) {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id },
      include: [
        {model: ProductDetail, as: 'details'},
        {model: ProductColor, as: 'colors'},
        {model: ProductSize, as: 'sizes'},
      ]
    });

    if (!product) {
      throw createError(404, 'Product not found')
    }
    return res.json({ product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProductController,
  getProductsController,
  getProductByIdController,
}
