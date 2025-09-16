'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CreatorProfile extends Model {
    static associate(models) {
      CreatorProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      CreatorProfile.hasMany(models.Looproom, {
        foreignKey: 'creator_id',
        as: 'looprooms',
      });
      CreatorProfile.hasOne(models.CreatorVerification, {
        foreignKey: 'creator_profile_id',
        as: 'verification',
      });
    }
  }
  CreatorProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'user_id',
      },
      displayName: {
        type: DataTypes.STRING(160),
        allowNull: false,
        field: 'display_name',
      },
      bio: {
        type: DataTypes.TEXT,
      },
      expertise: {
        type: DataTypes.STRING(120),
      },
      website: {
        type: DataTypes.STRING(255),
      },
      instagram: {
        type: DataTypes.STRING(255),
      },
      youtube: {
        type: DataTypes.STRING(255),
      },
      featuredVideoUrl: {
        type: DataTypes.STRING(255),
        field: 'featured_video_url',
      },
      status: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'CreatorProfile',
      tableName: 'creator_profiles',
      underscored: true,
    }
  );
  return CreatorProfile;
};
