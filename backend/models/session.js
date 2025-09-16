'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Session.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      userAgent: {
        type: DataTypes.STRING(255),
        field: 'user_agent',
      },
      ipAddress: {
        type: DataTypes.STRING(64),
        field: 'ip_address',
      },
    },
    {
      sequelize,
      modelName: 'Session',
      tableName: 'sessions',
      underscored: true,
    }
  );
  return Session;
};
