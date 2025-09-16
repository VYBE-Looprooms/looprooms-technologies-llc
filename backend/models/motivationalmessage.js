'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MotivationalMessage extends Model {
    static associate(models) {
      MotivationalMessage.belongsTo(models.Looproom, {
        foreignKey: 'looproom_id',
        as: 'looproom',
      });
    }
  }
  MotivationalMessage.init(
    {
      looproomId: {
        type: DataTypes.INTEGER,
        field: 'looproom_id',
      },
      reactionType: {
        type: DataTypes.STRING(24),
        allowNull: false,
        field: 'reaction_type',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      displayWeight: {
        type: DataTypes.INTEGER,
        field: 'display_weight',
        defaultValue: 1,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      modelName: 'MotivationalMessage',
      tableName: 'motivational_messages',
      underscored: true,
    }
  );
  return MotivationalMessage;
};
