'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OAuthProfile extends Model {
    static associate(models) {
      OAuthProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  OAuthProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      provider: {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
      providerId: {
        type: DataTypes.STRING(191),
        allowNull: false,
        field: 'provider_id',
      },
      accessToken: {
        type: DataTypes.STRING(255),
        field: 'access_token',
      },
      refreshToken: {
        type: DataTypes.STRING(255),
        field: 'refresh_token',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'OAuthProfile',
      tableName: 'oauth_profiles',
      underscored: true,
    }
  );
  return OAuthProfile;
};
