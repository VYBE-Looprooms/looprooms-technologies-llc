'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MoodEntry extends Model {
    static associate(models) {
      MoodEntry.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      MoodEntry.belongsTo(models.Looproom, {
        foreignKey: 'recommended_looproom_id',
        as: 'recommendedLooproom',
      });
    }
  }
  MoodEntry.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
      moodKey: {
        type: DataTypes.STRING(64),
        field: 'mood_key',
      },
      moodText: {
        type: DataTypes.STRING(255),
        field: 'mood_text',
      },
      recommendedLooproomId: {
        type: DataTypes.INTEGER,
        field: 'recommended_looproom_id',
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'MoodEntry',
      tableName: 'mood_entries',
      underscored: true,
    }
  );
  return MoodEntry;
};
