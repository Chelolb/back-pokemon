const { DataTypes } = require('sequelize');
// Export a function that defines the models
// then inject the connection to sequelize.
module.exports = (sequelize) => {
  // defines the models
  sequelize.define('type', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};