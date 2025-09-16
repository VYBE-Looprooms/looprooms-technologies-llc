'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SocialPostReaction extends Model {
    static associate(models) {
      SocialPostReaction.belongsTo(models.SocialPost, {
        foreignKey: 'social_post_id',
        as: 'post',
      });
      SocialPostReaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  SocialPostReaction.init(
    {
      socialPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'social_post_id',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      reactionType: {
        type: DataTypes.STRING(32),
        allowNull: false,
        field: 'reaction_type',
      },
    },
    {
      sequelize,
      modelName: 'SocialPostReaction',
      tableName: 'social_post_reactions',
      underscored: true,
    }
  );
  return SocialPostReaction;
};
