'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReactionPreset extends Model {
    static associate(models) {
      // Associations can be added when reaction usage tables are introduced
    }
  }
  ReactionPreset.init(
    {
      key: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
      },
      label: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      emoji: {
        type: DataTypes.STRING(16),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      themeColor: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: '#22d3ee',
        field: 'theme_color',
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'display_order',
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
      modelName: 'ReactionPreset',
      tableName: 'reaction_presets',
      underscored: true,
    }
  );
  return ReactionPreset;
};
