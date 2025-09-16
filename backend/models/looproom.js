'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Looproom extends Model {
    static associate(models) {
      Looproom.belongsTo(models.LooproomCategory, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Looproom.belongsTo(models.CreatorProfile, {
        foreignKey: 'creator_id',
        as: 'creatorProfile',
      });
      Looproom.hasMany(models.LoopchainStep, {
        foreignKey: 'looproom_id',
        as: 'loopchainSteps',
      });
      Looproom.hasMany(models.LoopchainStep, {
        foreignKey: 'next_looproom_id',
        as: 'incomingLoopchainSteps',
      });
      Looproom.hasMany(models.RoomMessage, {
        foreignKey: 'looproom_id',
        as: 'messages',
      });
      Looproom.hasMany(models.RoomReaction, {
        foreignKey: 'looproom_id',
        as: 'reactions',
      });
      Looproom.hasMany(models.SocialPost, {
        foreignKey: 'looproom_id',
        as: 'socialPosts',
      });
      Looproom.hasMany(models.MotivationalMessage, {
        foreignKey: 'looproom_id',
        as: 'motivationalMessages',
      });
    }
  }
  Looproom.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category_id',
      },
      creatorId: {
        type: DataTypes.INTEGER,
        field: 'creator_id',
      },
      title: {
        type: DataTypes.STRING(180),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      summary: {
        type: DataTypes.STRING(280),
      },
      description: {
        type: DataTypes.TEXT,
      },
      videoUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'video_url',
      },
      playlistUrl: {
        type: DataTypes.STRING(255),
        field: 'playlist_url',
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_live',
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'active',
      },
      startAt: {
        type: DataTypes.DATE,
        field: 'start_at',
      },
      endAt: {
        type: DataTypes.DATE,
        field: 'end_at',
      },
      thumbnailUrl: {
        type: DataTypes.STRING(255),
        field: 'thumbnail_url',
      },
    },
    {
      sequelize,
      modelName: 'Looproom',
      tableName: 'looprooms',
      underscored: true,
    }
  );
  return Looproom;
};
