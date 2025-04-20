const sequelize = require('./sequelize.config');
const { 
  Product, 
  ProductDetail, 
  ProductColor, 
  ProductSize 
} = require('../modules/product/product.model');

async function initDatabase() {
  Product.hasMany(ProductDetail, {foreignKey: 'productId', sourceKey: 'id', as: 'details'})
  ProductDetail.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductColor, {foreignKey: 'productId', sourceKey: 'id', as: 'colors'})
  ProductColor.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  Product.hasMany(ProductSize, {foreignKey: 'productId', sourceKey: 'id', as: 'sizes'})
  ProductSize.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id'})

  // await sequelize.sync({force: true})
}


module.exports = initDatabase;
