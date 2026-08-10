const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define(
  'Course',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General'
    },
    level: {
      type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
      defaultValue: 'Beginner'
    },
    instructor: {
      type: DataTypes.STRING,
      defaultValue: 'Eduflow Instructor'
    },
    thumbnail: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    totalLessons: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.8
    },
    studentsCount: {
      type: DataTypes.STRING,
      defaultValue: '1k students'
    }
  },
  {
    timestamps: true
  }
);

module.exports = Course;
