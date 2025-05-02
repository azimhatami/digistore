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
const { Discount } = require('../modules/discount/discount.model');
const { Order, OrderItems } = require('../modules/order/order.model');
const { Payment } = require('../modules/payment/payment.model');
const { 
  Role,
  Permission,
  RolePermission,
} = require('../modules/RBAC/rbac.model');


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
  Discount.hasMany(Basket, {foreignKey: 'discountId', as: 'basket', sourceKey: 'id'})

  Basket.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id', as: 'product' })
  Basket.belongsTo(ProductColor, {foreignKey: 'colorId', targetKey: 'id', as: 'color' })
  Basket.belongsTo(ProductSize, {foreignKey: 'sizeId', targetKey: 'id', as: 'size' })
  Basket.belongsTo(User, {foreignKey: 'userId', targetKey: 'id', as: 'user' })
  Basket.belongsTo(Discount, {foreignKey: 'discountId', targetKey: 'id', as: 'discount' })

  Order.hasMany(OrderItems, {foreignKey: 'orderId', as: 'items', sourceKey: 'id'})
  User.hasMany(Order, {foreignKey: 'userId', as: 'orders', sourceKey: 'id'})
  User.hasMany(Payment, {foreignKey: 'userId', as: 'payments', sourceKey: 'id'})
  Order.hasOne(Payment, {foreignKey: 'orderId', as: 'payment', sourceKey: 'id', onDelete: 'CASCADE'})
  Payment.hasOne(Order, {foreignKey: 'paymentId', as: 'order', sourceKey: 'id', onDelete: 'CASCADE'})

  OrderItems.belongsTo(Order, {foreignKey: 'orderId', targetKey: 'id'})
  OrderItems.belongsTo(Product, {foreignKey: 'productId', targetKey: 'id', as: 'product' })
  OrderItems.belongsTo(ProductColor, {foreignKey: 'colorId', targetKey: 'id', as: 'color' })
  OrderItems.belongsTo(ProductSize, {foreignKey: 'sizeId', targetKey: 'id', as: 'size' })

  Role.hasMany(RolePermission, {foreignKey: 'roleId', sourceKey: 'id', as: 'permissions'})
  Permission.hasMany(RolePermission, {foreignKey: 'permissionId', sourceKey: 'id', as: 'roles'})
  RolePermission.belongsTo(Role, {foreignKey: 'roleId', targetKey: 'id'})
  RolePermission.belongsTo(Permission, {foreignKey: 'permissionId', targetKey: 'id'})

  // RefreshToken.sync()
  // await sequelize.sync({force: true})
  // await sequelize.sync({alter: true})
  // await Discount.sync();
  // await Basket.sync();
}


module.exports = initDatabase;
