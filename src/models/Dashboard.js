const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');



const Dashboard = sequelize.define(
  'Dashboard',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    stats: {
      type: DataTypes.JSON,
      defaultValue: {
        currentStreakDays: 0,
        timeLearnedHours: 0,
        coursesCompleted: 0
      }
    },
    liveClasses: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    continueLearning: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    recommended: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    moduleExplorer: {
      type: DataTypes.JSON,
      defaultValue: {
        title: 'Module Explorer',
        navigation: [],
        resourceDownloadUrl: '/api/dashboard/download-resources'
      }
    }
  },
  {
    timestamps: true,
    tableName: 'dashboards'
  }
);

module.exports = Dashboard;
