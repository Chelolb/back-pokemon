const router = require("express").Router();
const Sequelize = require("sequelize");
const { Type } =require('../db');
const axios = require('axios');
const { json } = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const {  } = require('../utils/utils');

const getAllTypes = async (req, res, next) => {// obtiene todos los pokemons

    try {
        let dbResult = await Type.findAll({ attributes: ['id', 'name'] });

        res.status(200).json(dbResult);
        
    } catch (error) {
        console.log('Error en los Tipos', error);
        res.status(400).json({ msg: 'Error en lectura de los Tipos de Base de Datos' })
    }

};

module.exports = { 
    getAllTypes
};