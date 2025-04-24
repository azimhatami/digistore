const sequelize = require('../../config/sequelize.config');
const { DataTypes } = require('sequelize');

const Discount = sequelize.define('discount', {
  id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  productId: {type: DataTypes.INTEGER, allowNull: true},
  code: {type: DataTypes.STRING},
  type: {type: DataTypes.ENUM('product', 'basket')},
  amount: {type: DataTypes.INTEGER},
  percent: {type: DataTypes.INTEGER},
  limit: {type: DataTypes.INTEGER},
  usage: {type: DataTypes.INTEGER},
  expires_in: {type: DataTypes.DATE, allowNull: true}
}, {
  createdAt: 'created_at',
  updatedAt: false,
  modelName: 'discount'
});


module.exports = {
  Discount,
}
