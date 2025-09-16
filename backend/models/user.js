'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Session, { foreignKey: 'user_id', as: 'sessions' });
      User.hasMany(models.OAuthProfile, { foreignKey: 'user_id', as: 'oauthProfiles' });
      User.hasOne(models.CreatorProfile, { foreignKey: 'user_id', as: 'creatorProfile' });
      User.hasMany(models.MoodEntry, { foreignKey: 'user_id', as: 'moodEntries' });
      User.hasMany(models.SocialPost, { foreignKey: 'user_id', as: 'socialPosts' });
      User.hasMany(models.RoomMessage, { foreignKey: 'user_id', as: 'roomMessages' });
      User.hasMany(models.RoomReaction, { foreignKey: 'user_id', as: 'roomReactions' });
      User.hasMany(models.SocialPostReaction, { foreignKey: 'user_id', as: 'postReactions' });
    }

    toSafeJSON() {
      const values = { ...this.get() };
      delete values.passwordHash;
      return values;
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        field: 'password_hash',
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'active',
      },
      avatarUrl: {
        type: DataTypes.STRING(255),
        field: 'avatar_url',
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        field: 'last_login_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withSensitive: { attributes: { include: ['passwordHash'] } },
      },
    }
  );
  return User;
};
