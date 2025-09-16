'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RoomMessage extends Model {
    static associate(models) {
      RoomMessage.belongsTo(models.Looproom, {
        foreignKey: 'looproom_id',
        as: 'looproom',
      });
      RoomMessage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  RoomMessage.init(
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
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      messageType: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'chat',
        field: 'message_type',
      },
      sentAt: {
        type: DataTypes.DATE,
        field: 'sent_at',
      },
    },
    {
      sequelize,
      modelName: 'RoomMessage',
      tableName: 'room_messages',
      underscored: true,
    }
  );
  return RoomMessage;
};
