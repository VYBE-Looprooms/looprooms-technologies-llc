'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SocialPost extends Model {
    static associate(models) {
      SocialPost.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author',
      });
      SocialPost.belongsTo(models.Looproom, {
        foreignKey: 'looproom_id',
        as: 'looproom',
      });
      SocialPost.hasMany(models.SocialPostReaction, {
        foreignKey: 'social_post_id',
        as: 'reactions',
      });
    }
  }
  SocialPost.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      looproomId: {
        type: DataTypes.INTEGER,
        field: 'looproom_id',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      moodKey: {
        type: DataTypes.STRING(64),
        field: 'mood_key',
      },
      visibility: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'public',
      },
      status: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'published',
      },
      publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at',
      },
    },
    {
      sequelize,
      modelName: 'SocialPost',
      tableName: 'social_posts',
      underscored: true,
    }
  );
  return SocialPost;
};
