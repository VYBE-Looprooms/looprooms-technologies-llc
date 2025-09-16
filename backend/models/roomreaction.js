'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomReaction extends Model {
    static associate(models) {
      RoomReaction.belongsTo(models.Looproom, {
        foreignKey: 'looproom_id',
        as: 'looproom',
      });
      RoomReaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  RoomReaction.init(
    {
      looproomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'looproom_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      reactionType: {
        type: DataTypes.STRING(24),
        allowNull: false,
        field: 'reaction_type',
      },
      weight: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'RoomReaction',
      tableName: 'room_reactions',
      underscored: true,
    }
  );
  return RoomReaction;
};
