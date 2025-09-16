'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LoopchainStep extends Model {
    static associate(models) {
      LoopchainStep.belongsTo(models.Looproom, {
        foreignKey: 'looproom_id',
        as: 'looproom',
      });
      LoopchainStep.belongsTo(models.Looproom, {
        foreignKey: 'next_looproom_id',
        as: 'nextLooproom',
      });
    }
  }
  LoopchainStep.init(
    {
      looproomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'looproom_id',
      },
      nextLooproomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'next_looproom_id',
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'LoopchainStep',
      tableName: 'loopchain_steps',
      underscored: true,
    }
  );
  return LoopchainStep;
};
