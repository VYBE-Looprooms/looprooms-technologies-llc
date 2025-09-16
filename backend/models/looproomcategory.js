'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LooproomCategory extends Model {
    static associate(models) {
      LooproomCategory.hasMany(models.Looproom, {
        foreignKey: 'category_id',
        as: 'looprooms',
      });
    }
  }
  LooproomCategory.init(
    {
      key: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      themeColor: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'theme_color',
        defaultValue: '#FFFFFF',
      },
      icon: {
        type: DataTypes.STRING(191),
      },
    },
    {
      sequelize,
      modelName: 'LooproomCategory',
      tableName: 'looproom_categories',
      underscored: true,
    }
  );
  return LooproomCategory;
};
