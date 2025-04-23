const sequelize = require('./sequelize.config');
const { 
  Product, 
  ProductDetail, 
  ProductColor, 
  ProductSize 
} = require('../modules/product/product.model');
const { User, Otp } = require('../modules/user/user.model');
const { RefreshToken } = require('../modules/user/refreshToken.model');
const { Basket } = require('../modules/basket/basket.model');


async function initDatabase() {
  Product.hasMany(ProductDetail, {foreignKey: 'productId', sourceKey: 'id', as: 'details'})
  ProductDetail.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductColor, {foreignKey: 'productId', sourceKey: 'id', as: 'colors'})
  ProductColor.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductSize, {foreignKey: 'productId', sourceKey: 'id', as: 'sizes'})
  ProductSize.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  User.hasOne(Otp, {foreignKey: 'userId', as: 'otp', sourceKey: 'id'})
  Otp.hasOne(User, {foreignKey: 'otpId', as: 'user', sourceKey: 'id'})
  Otp.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'})

  Product.hasMany(Basket, {foreignKey: 'productId', as: 'basket', sourceKey: 'id'})
  ProductColor.hasMany(Basket, {foreignKey: 'colorId', as: 'basket', sourceKey: 'id'})
  ProductSize.hasMany(Basket, {foreignKey: 'sizeId', as: 'basket', sourceKey: 'id'})
  User.hasMany(Basket, {foreignKey: 'userId', as: 'basket', sourceKey: 'id'})

  Basket.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id', as: 'product' })
  Basket.belongsTo(ProductColor, {foreignKey: 'colorId', targetKey: 'id', as: 'color' })
  Basket.belongsTo(ProductSize, {foreignKey: 'sizeId', targetKey: 'id', as: 'size' })
  Basket.belongsTo(User, {foreignKey: 'userId', targetKey: 'id', as: 'user' })

  // RefreshToken.sync()

  // await sequelize.sync({force: true})
  await sequelize.sync({alter: true})
}


module.exports = initDatabase;
