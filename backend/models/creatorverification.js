'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CreatorVerification extends Model {
    static associate(models) {
      CreatorVerification.belongsTo(models.CreatorProfile, {
        foreignKey: 'creator_profile_id',
        as: 'creatorProfile',
      });
      CreatorVerification.belongsTo(models.User, {
        foreignKey: 'reviewer_id',
        as: 'reviewer',
      });
    }
  }
  CreatorVerification.init(
    {
      creatorProfileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'creator_profile_id',
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        field: 'reviewer_id',
      },
      status: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: 'pending',
      },
      idDocumentUrl: {
        type: DataTypes.STRING(255),
        field: 'id_document_url',
      },
      selfieUrl: {
        type: DataTypes.STRING(255),
        field: 'selfie_url',
      },
      notes: {
        type: DataTypes.TEXT,
      },
      submittedAt: {
        type: DataTypes.DATE,
        field: 'submitted_at',
      },
      reviewedAt: {
        type: DataTypes.DATE,
        field: 'reviewed_at',
      },
    },
    {
      sequelize,
      modelName: 'CreatorVerification',
      tableName: 'creator_verifications',
      underscored: true,
    }
  );
  return CreatorVerification;
};
