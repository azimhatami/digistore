const sequelize = require('./sequelize.config');
const { 
  Product, 
  ProductDetail, 
  ProductColor, 
  ProductSize 
} = require('../modules/product/product.model');
const { User, Otp } = require('../modules/user/user.model');


async function initDatabase() {
  Product.hasMany(ProductDetail, {foreignKey: 'productId', sourceKey: 'id', as: 'details'})
  ProductDetail.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductColor, {foreignKey: 'productId', sourceKey: 'id', as: 'colors'})
  ProductColor.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductSize, {foreignKey: 'productId', sourceKey: 'id', as: 'sizes'})
  ProductSize.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  User.hasOne(Otp, {foreignKey: 'user_id', as: 'otp', sourceKey: 'id'})
  Otp.hasOne(User, {foreignKey: 'otp_id', as: 'user', sourceKey: 'id'})
  Otp.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'})

  // await sequelize.sync({force: true})
  await sequelize.sync({alter: true})
}


module.exports = initDatabase;
