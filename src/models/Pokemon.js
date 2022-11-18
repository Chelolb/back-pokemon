const { DataTypes } = require('sequelize');
// Export a function that defines the models
// then inject the connection to sequelize.
module.exports = (sequelize) => {
  // defines the models
  sequelize.define('pokemon', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    hp:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attack:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    defense:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    speed:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    weight:{
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    createdDB:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  });
};
